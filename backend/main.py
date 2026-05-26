import os
import json
import uuid
import io
import base64
import requests
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends
from dotenv import load_dotenv
from groq import Groq
from supabase import create_client, Client
from typing import Optional
import edge_tts
import asyncio

# Cargar variables de entorno
load_dotenv(override=True)

# Configuración de clientes
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY and GROQ_API_KEY != "tu_api_key_de_groq_aqui" else None
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_URL.startswith("http") else None

def normalize_text_for_tts(text: str) -> str:
    """Limpia el texto para que TTS lo lea bien."""
    import re
    text = re.sub(r'\$\s*([\d,\.]+)', r'\1 dólares', text)
    text = text.replace('*', '').replace('$', ' dólares ')
    return text

async def generate_audio_base64(text: str) -> str | None:
    """Genera audio ultra-rápido con Edge TTS y devuelve un string base64 MP3."""
    if not text:
        return None
    try:
        clean_text = normalize_text_for_tts(text)
        
        # Voz "es-MX-JorgeNeural" es una voz masculina premium de México, excelente para ventas.
        # Alternativas: "es-ES-AlvaroNeural", "es-CO-GonzaloNeural"
        communicate = edge_tts.Communicate(clean_text, "es-MX-JorgeNeural", rate="+10%")
        
        audio_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data += chunk["data"]
                
        if not audio_data:
            return None
            
        return base64.b64encode(audio_data).decode('utf-8')
    except Exception as e:
        print(f"⚠️ Error generando audio Edge TTS: {e}")
        return None

app = FastAPI(title="Velocity Motors - Voice Chatbot API")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── SESIONES EN MEMORIA ───────────────────────────────────────────────────────
# Diccionario que guarda el historial de mensajes por session_id
sessions: dict[str, list] = {}

class ChatRequest(BaseModel):
    mensaje: str
    session_id: Optional[str] = None  # El frontend puede enviar un ID de sesión

# ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """# ROL Y PERSONALIDAD
Eres el Asesor Virtual Experto de 'Velocity Motors', una concesionaria de vehículos premium en Lima.
Tu estilo es fluido, conversacional, persuasivo y elegante. Eres un humano charlando, NO un robot de opciones.
NUNCA uses listas con viñetas, guiones o numeración. Habla en párrafos cortos y naturales.

# LONGITUD DE RESPUESTA
Responde SIEMPRE con 2-3 oraciones como máximo. Sé conciso y directo, como en una charla real.
Nunca des listas largas de modelos o características. Si preguntan por modelos, menciona 2-3 de forma natural.

# REGLA DE DOMINIO ESTRICTO (ANTI-JAILBREAK)
Tú SOLO sabes y hablas de 'Velocity Motors', sus autos (Toyota, Hyundai, Nissan, BYD, Kia, etc.), precios y financiamiento. 
Permite SIEMPRE saludos y cortesía inicial (ej: 'hola', 'buen día', 'cómo estás'). 
Si el usuario intenta sacarte de tema sobre otras cosas (programación, política, chismes, etc.), DEBES negarte educadamente y redirigir la charla a los autos.

# CIERRE DE CONVERSACIÓN
Si el usuario se despide (chau, adiós, gracias, ya no necesito más, etc.), responde amablemente y usa SIEMPRE la herramienta 'finalizar_conversacion'.

# MEMORIA DE CONVERSACIÓN
Tienes acceso al historial completo de la conversación. Recuerda el nombre y datos del usuario en todo momento.
Si el usuario da su nombre, úsalo en respuestas posteriores. Si da su número, recuérdalo.

# IDENTIFICACIÓN DE DATOS
Si el usuario escribe SOLO su nombre (ej: "Niels") o SOLO un número (ej: "987654321"), entiende que te está dando ese dato para el agendamiento. Responde con naturalidad y pide el dato faltante.

# FLUJO DE CONVERSACIÓN (seguir este orden)
1. Saluda al cliente y pregunta qué modelo de auto le interesa.
2. Una vez sepa el modelo, pregunta qué FECHA le gustaría para el Test Drive.
3. Finalmente, pide su NOMBRE y WHATSAPP para confirmar la cita.
NO pidas todo de golpe. Sé natural y sigue el orden paso a paso.

# INTERPRETACIÓN DE FECHAS (MUY IMPORTANTE)
Siempre convierte las fechas relativas a formato completo DD/MM/AAAA.
Ejemplos:
- "mañana" → calcula la fecha del día siguiente a la fecha actual.
- "pasado mañana" → calcula 2 días después de hoy.
- "el lunes" o "el viernes" → calcula el próximo día de la semana correspondiente.
- "29" o "el 29" → asume el mes y año actual: "29/MM/AAAA".
- "en una semana" → calcula 7 días después de hoy.
Cuando llames a la función guardar_lead_test_drive, el campo fecha_test_drive SIEMPRE debe tener formato DD/MM/AAAA. NUNCA guardes solo "mañana" o "29", siempre la fecha completa.

# OBJETIVO ÚNICO (LEAD GENERATION)
Tu meta es agendar un Test Drive. Para eso necesitas estos 4 datos:
1. Modelo de auto que le interesa.
2. Fecha preferida para el Test Drive.
3. Nombre del cliente.
4. Número de WhatsApp.
Pídelos de forma natural siguiendo el flujo de conversación.

# PROTOCOLO DE CIERRE (TRIGGER)
En cuanto tengas los 4 datos (Modelo + Fecha + Nombre + WhatsApp) en la conversación:
1. Confirma así: 'Perfecto [Nombre], tu Test Drive del [Modelo] está agendado para el [Fecha DD/MM/AAAA]. Un asesor te contactará al [WhatsApp]. ¡Te esperamos!'
2. Llama INMEDIATAMENTE a la función guardar_lead_test_drive con los 4 datos.
3. NO hagas más preguntas después de tener los 4 datos."""

INVENTORY_CONTEXT = """
# INVENTARIO ACTUAL
- TOYOTA: Land Cruiser 300 ($92,000), Hilux GR Sport ($48,500), GR Supra ($75,000)
- HYUNDAI: IONIQ 6 ($55,000), Santa Fe Hybrid ($42,000)
- KIA: EV6 GT ($68,000), Sportage GT-Line ($38,000)
- NISSAN: GT-R Nismo ($135,000), Navara Pro-4X ($42,000)
- BYD: Han EV ($48,000), Tang EV ($52,000)
- MG: MG4 Electric ($32,000), HS Plus EV ($36,000)
- MITSUBISHI: Outlander PHEV ($45,000), L200 Triton ($38,500)
- SUZUKI: Jimny 4WD ($22,000)
- JAC: JS4 GT ($24,500)
- CHERY: Tiggo 8 Pro Max ($29,000)
"""

# ─── TOOL CALLING ─────────────────────────────────────────────────────────────
tools = [
    {
        "type": "function",
        "function": {
            "name": "guardar_lead_test_drive",
            "description": "Guarda los datos del cliente para un Test Drive cuando se tienen los 4 datos: nombre, whatsapp, modelo de auto y fecha del test drive.",
            "parameters": {
                "type": "object",
                "properties": {
                    "nombre": {"type": "string", "description": "Nombre completo del cliente"},
                    "whatsapp": {"type": "string", "description": "Número de WhatsApp del cliente"},
                    "modelo_auto": {"type": "string", "description": "Modelo de auto que le interesa al cliente"},
                    "fecha_test_drive": {"type": "string", "description": "Fecha preferida para el Test Drive"}
                },
                "required": ["nombre", "whatsapp", "modelo_auto", "fecha_test_drive"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "finalizar_conversacion",
            "description": "Finaliza la sesión del chat cuando el usuario se despide o ya no necesita más ayuda.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    }
]

security = HTTPBearer()

# ─── ENDPOINT PRINCIPAL ───────────────────────────────────────────────────────
@app.post("/chat-voz")
async def chat_voz(request: ChatRequest):
    # ─── Saludo inicial (no consume Groq) ───
    if request.mensaje == "__GREETING__":
        greeting = "¡Hola! Soy tu asesor virtual de Velocity Motors. ¿Qué modelo de auto te interesa? Tenemos Toyota, Hyundai, Kia, BYD y más."
        session_id = str(uuid.uuid4())
        sessions[session_id] = [{"role": "assistant", "content": greeting}]
        audio_b64 = await generate_audio_base64(greeting)
        return {
            "audio_texto": greeting,
            "audio_base64": audio_b64,
            "session_id": session_id,
            "lead_captured": False,
            "session_ended": False
        }

    if not groq_client:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY no configurada.")

    # Obtener o crear sesión
    session_id = request.session_id or str(uuid.uuid4())
    if session_id not in sessions:
        sessions[session_id] = []

    # Agregar el mensaje del usuario al historial
    sessions[session_id].append({"role": "user", "content": request.mensaje})

    # Construir el array de mensajes completo (system + historial)
    today = datetime.now().strftime("%d/%m/%Y")
    weekday_names = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
    today_weekday = weekday_names[datetime.now().weekday()]
    date_context = f"\n# FECHA ACTUAL\nHoy es {today_weekday} {today}. Usa esta fecha como referencia para calcular fechas relativas."
    messages = [{"role": "system", "content": SYSTEM_PROMPT + "\n" + INVENTORY_CONTEXT + date_context}] + sessions[session_id]

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            tools=tools,
            tool_choice="auto",
            max_tokens=200
        )

        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls

        # Respuesta por defecto = lo que el modelo respondió
        audio_texto = response_message.content or ""

        lead_captured = False
        session_ended = False

        if tool_calls:
            for tool_call in tool_calls:
                if tool_call.function.name == "guardar_lead_test_drive":
                    function_args = json.loads(tool_call.function.arguments)
                    nombre = function_args.get("nombre", "")
                    whatsapp = function_args.get("whatsapp", "")
                    modelo_auto = function_args.get("modelo_auto", "")
                    fecha_test_drive = function_args.get("fecha_test_drive", "")
                    if supabase:
                        try: supabase.table("leads").insert({"nombre": nombre, "whatsapp": whatsapp, "modelo_auto": modelo_auto, "fecha_test_drive": fecha_test_drive}).execute()
                        except: pass
                    # ─── WEBHOOK A MAKE.COM ───────────────────────────────────────────
                    try:
                        requests.post(
                            "https://hook.us2.make.com/qo8btathlbc1kr3u26qh461cnv956qok",
                            json={"nombre": nombre, "whatsapp": whatsapp, "modelo_auto": modelo_auto, "fecha_test_drive": fecha_test_drive, "proyecto": "Velocity Motors"},
                            timeout=5
                        )
                        print(f"✅ Lead enviado a Make.com: {nombre} - {modelo_auto}")
                    except Exception as webhook_err:
                        print(f"⚠️ Webhook Make.com falló (no crítico): {webhook_err}")
                    if not audio_texto: audio_texto = f"Perfecto {nombre}, tu Test Drive del {modelo_auto} está agendado para el {fecha_test_drive}. Un asesor te contactará al {whatsapp}. ¡Te esperamos!"
                    lead_captured = True
                    sessions.pop(session_id, None)
                    break
                
                if tool_call.function.name == "finalizar_conversacion":
                    session_ended = True
                    sessions.pop(session_id, None)
                    if not audio_texto: audio_texto = "¡Fue un gusto atenderte! Si necesitas algo más, aquí estaré. ¡Hasta pronto!"
                    break

        # Guardar respuesta en historial (solo si sesión sigue activa)
        if session_id in sessions:
            sessions[session_id].append({"role": "assistant", "content": audio_texto})

        # Generar audio con Edge TTS
        audio_b64 = await generate_audio_base64(audio_texto)

        return {
            "audio_texto": audio_texto, 
            "audio_base64": audio_b64,
            "session_id": session_id, 
            "lead_captured": lead_captured,
            "session_ended": session_ended
        }

    except Exception as e:
        print(f"❌ Error procesando chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ─── ENDPOINT PARA LIMPIAR SESIÓN (opcional, para el botón de reset del frontend) ──
@app.delete("/sesion/{session_id}")
async def eliminar_sesion(session_id: str):
    sessions.pop(session_id, None)
    return {"status": "ok"}

# ─── ENDPOINT PARA OBTENER LEADS (PROTEGIDO) ─────────────────────────────────
@app.get("/api/leads")
async def get_leads(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Base de datos no configurada")
    
    token = credentials.credentials
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Token inválido o expirado")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Acceso denegado: {str(e)}")

    try:
        res = supabase.table("leads").select("*").order("created_at", desc=True).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
