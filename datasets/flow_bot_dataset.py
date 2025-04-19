import random

CONVERSATION_FLOWS = {
    "initial_disclosure": {
        "user": [
            "I've been feeling really anxious lately",
            "I need to talk about something that's been bothering me",
            "I'm struggling with my mental health"
        ],
        "bot": [
            "I'm here to listen. What's been going on?",
            "Thank you for sharing that. Would you like to tell me more?",
            "I understand this must be difficult. What's been on your mind?"
        ]
    },
    "exploration": {
        "user": [
            "It started when I lost my job",
            "I think it's because of my family situation",
            "I've been feeling this way since last month"
        ],
        "bot": [
            "How has this been affecting your daily life?",
            "What do you think might help in this situation?",
            "Have you tried talking to anyone else about this?"
        ]
    },
    "closure": {
        "user": [
            "I feel a bit better after talking about it",
            "Thank you for listening",
            "I think I understand better now"
        ],
        "bot": [
            "I'm glad you're feeling better. Remember, I'm here if you need to talk again.",
            "You're welcome. It takes courage to share these things.",
            "I'm here for you whenever you need to talk."
        ]
    }
}

def get_conversation_flow(user_message):
    for flow_type, patterns in CONVERSATION_FLOWS.items():
        for user_pattern in patterns["user"]:
            if user_pattern.lower() in user_message.lower():
                return {
                    "flow_type": flow_type,
                    "response": random.choice(patterns["bot"])
                }
    return {
        "flow_type": "unknown",
        "response": "I'm here to listen. Could you tell me more about how you're feeling?"
    } 