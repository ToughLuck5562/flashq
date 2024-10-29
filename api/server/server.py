from flask import Flask, render_template, request, jsonify
import os
import json
from groq import Groq

os.environ["GROQ_API_KEY"] = "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"
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def MessageAI(MESSAGE):
    MANIPULATION = ('''
        "You will be creating flashcards based on the user prompt. "
        "You're not allowed to say anything but the completed flashcard. "
        "The JSON object must use the scheme: {"name": "Mitosis", "questions": [ {"Question": "What is the purpose of mitosis?", "Answers": {"A": "To produce gametes for sexual reproduction.", "B": "To repair damaged tissue.", "C": "To create genetic diversity.", "D": "To break down waste products."}, "Answer": "B"},"
        "Do not use newline characters or escape characters. "
        "The JSON must be in one single line and must be valid JSON."'''
    )
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": MANIPULATION},
            {"role": "user", "content": MESSAGE}
        ],
        max_tokens=8040,
        stream=False,
        model="gemma2-9b-it",
        response_format={"type": "json_object"},
    )
    response_content = chat_completion.choices[0].message.content
    clean_response = response_content.replace('\n', '').replace('\\', '')

    return clean_response.strip()

app = Flask(__name__, template_folder='../client/templates', static_folder='../client/static')

@app.route('/', methods=['POST', 'GET'])
def main():
    return render_template("main.html")

@app.route('/generate_flashcards/<prompt>', methods=['POST', 'GET'])
def generate_flashcards(prompt):
    if prompt:
        flashcard_template = MessageAI(prompt)
        if isinstance(flashcard_template, str):
            try:
                flashcard_template = json.loads(flashcard_template)
            except json.JSONDecodeError:
                return jsonify({'error': 'Invalid JSON format from MessageAI.'}), 400
        return jsonify(flashcard_template)
    
    return jsonify({'error': 'No prompt provided.'}), 400

if __name__ == "__main__":
    app.run(debug=True)
