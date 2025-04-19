import random

EMOTION_PATTERNS = {
    "anxiety": [
        "I'm feeling really anxious about my exams",
        "My anxiety about work is overwhelming",
        "I can't stop worrying about my future"
    ],
    "depression": [
        "I've been feeling really down lately",
        "Nothing seems to make me happy anymore",
        "I feel hopeless about everything"
    ],
    "stress": [
        "I'm so stressed about my job",
        "The pressure from school is too much",
        "I can't handle the stress from my family"
    ]
}

EMPATHETIC_RESPONSES = {
    "anxiety": [
        "I understand how overwhelming anxiety can be. Would you like to talk about what specific aspects are causing you the most stress?",
        "It's completely normal to feel anxious in this situation. Let's break it down together.",
        "I hear how anxious you're feeling. What's been on your mind?"
    ],
    "depression": [
        "I'm here to listen. Your feelings are valid, and it's okay to feel this way.",
        "It sounds like you're going through a really tough time. Would you like to talk more about what's been happening?",
        "I understand how difficult this must be for you. You're not alone in this."
    ],
    "stress": [
        "Stress can feel overwhelming. Let's take this one step at a time.",
        "I hear how stressed you're feeling. What specific aspects are most challenging?",
        "It's okay to feel stressed. Would you like to talk about what's causing this pressure?"
    ]
}

def get_empathy_response(user_message):
    for emotion, patterns in EMOTION_PATTERNS.items():
        for pattern in patterns:
            if pattern.lower() in user_message.lower():
                return random.choice(EMPATHETIC_RESPONSES[emotion])
    return "I'm here to listen. Could you tell me more about how you're feeling?" 