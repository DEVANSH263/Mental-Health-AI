import random

CRISIS_PATTERNS = {
    "suicidal_thoughts": [
        "I don't want to live anymore",
        "I'm thinking about ending it all",
        "Life isn't worth living"
    ],
    "self_harm": [
        "I want to hurt myself",
        "I can't stop thinking about self-harm",
        "I need to cut myself"
    ],
    "panic_attack": [
        "I'm having a panic attack",
        "I can't breathe",
        "My heart is racing and I can't calm down"
    ]
}

CRISIS_RESPONSES = {
    "suicidal_thoughts": [
        "I'm really concerned about what you're sharing. Your life is valuable. Please call 988 immediately.",
        "I want to help you stay safe. Can you call 988 right now?",
        "Your life matters. Please reach out to 988 for immediate support."
    ],
    "self_harm": [
        "I'm concerned about your safety. Let's get you connected with help right now.",
        "You don't have to go through this alone. Can we call someone together?",
        "Your safety is important. Let's get you the support you need."
    ],
    "panic_attack": [
        "Let's take some deep breaths together. Inhale for 4, hold for 4, exhale for 4.",
        "You're safe right now. Let's focus on your breathing.",
        "This will pass. Let's work through this together."
    ]
}

def check_crisis(user_message):
    for crisis_type, patterns in CRISIS_PATTERNS.items():
        for pattern in patterns:
            if pattern.lower() in user_message.lower():
                return {
                    "is_crisis": True,
                    "crisis_type": crisis_type,
                    "response": random.choice(CRISIS_RESPONSES[crisis_type])
                }
    return {
        "is_crisis": False,
        "response": None
    } 