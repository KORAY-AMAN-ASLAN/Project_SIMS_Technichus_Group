from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from googletrans import Translator


# Flask Configuration
app = Flask(__name__)
CORS(app)  # Enable CORS
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sites.db'
db = SQLAlchemy(app)

# Database Models
class Language(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(5), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)

# Function to split long text
def chunk_text(text, chunk_size=500):
    """Split text into smaller chunks to prevent translation errors due to length."""
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

# Route to handle text translation
@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.json
    text = data['text']
    target_language = data['language']

    translator = Translator()
    text_chunks = chunk_text(text)
    translations = []

    for chunk in text_chunks:
        translated_chunk = translator.translate(chunk, dest=target_language)
        translations.append(translated_chunk.text)

    translated_text = ' '.join(translations)
    return jsonify({'translated': translated_text})

# Home route
@app.route('/')
def home():
    languages = Language.query.all()  # Fetch all languages
    article = Article.query.first()   # Fetch the first article
    return render_template('index.html', languages=languages, article=article)

# Running the Flask app
if __name__ == '__main__':
    app.run(debug=True)
