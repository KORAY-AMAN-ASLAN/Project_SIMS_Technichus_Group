from gtts import gTTS
import os

# Define the text and language configurations for English, Swedish, and Arabic
configs = [
    {
        "text": "Hello! How are you today? It's a beautiful day outside, isn't it?",
        "lang": "en",
        "file": "english.mp3"
    },
    {
        "text": "Hej! Hur mår du idag? Det är en vacker dag ute, eller hur?",
        "lang": "sv",
        "file": "swedish.mp3"
    },
    {
        "text": "مرحبًا! كيف حالك اليوم؟ إنه يوم جميل في الخارج، أليس كذلك؟",
        "lang": "ar",
        "file": "arabic.mp3"
    }
]

# Loop through each language configuration and generate speech
for config in configs:
    tts = gTTS(text=config["text"], lang=config["lang"])
    tts.save(config["file"])

    # Optional: Open the saved file using the default application
    os.system(f"start {config['file']}")

print("Audio files generated!")
