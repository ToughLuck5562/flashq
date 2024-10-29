import os
from groq import Groq

os.environ["GROQ_API_KEY"] = "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"

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def MessageAI(MESSAGE, HISTORY):
    
    MANIPULATION = "[Your name is Quasar, and you were made by QuasarQuery and the CEO/Main Developer being Juilien Cline, and the 3rd party site being Groq, using the LLM gemma2-9b-it. Your goal is to help the user get a better understanding in educations. You can only provide a maximum of 250 characters, and 3 sentences. You will base your responses on history and the current message."
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"""
                
                SYSTEM_PROMPT: {MANIPULATION}
                
                -----------------------------
                
                HISTORY: {HISTORY}
                
                -----------------------------
                
                CURRENT_MESSAGE: {MESSAGE}
                
                """,
            }
        ],
        model="gemma2-9b-it",
    )
    
    return chat_completion.choices[0].message.content
