import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
import os

class MentalHealthChatbot:
    def __init__(self):
        self.conversation_history = []
        self.load_models()
    
    def load_models(self):
        # Create models directory if it doesn't exist
        os.makedirs('models', exist_ok=True)
        
        # Load all trained models
        try:
            self.empathy_model = joblib.load('models/empathy_model.joblib')
            self.crisis_detector = joblib.load('models/crisis_detector.joblib')
            self.crisis_classifier = joblib.load('models/crisis_classifier.joblib')
            self.flow_model = joblib.load('models/flow_model.joblib')
            print("All models loaded successfully!")
        except FileNotFoundError:
            print("Models not found. Please train the models first.")
            exit(1)
    
    def process_message(self, user_message):
        # First check for crisis situations
        is_crisis = self.crisis_detector.predict([user_message])[0]
        if is_crisis:
            crisis_type = self.crisis_classifier.predict([user_message])[0]
            return self.get_crisis_response(crisis_type)
        
        # Then check conversation flow
        flow_type = self.flow_model.predict([user_message])[0]
        if flow_type != "unknown":
            return self.get_flow_response(flow_type)
        
        # Finally try empathetic response
        emotion = self.empathy_model.predict([user_message])[0]
        return self.get_empathy_response(emotion)
    
    def get_crisis_response(self, crisis_type):
        crisis_responses = {
            "suicidal_thoughts": "I'm really concerned about what you're sharing. Your life is valuable. Please call 988 immediately.",
            "self_harm": "I'm concerned about your safety. Let's get you connected with help right now.",
            "panic_attack": "Let's take some deep breaths together. Inhale for 4, hold for 4, exhale for 4."
        }
        return crisis_responses.get(crisis_type, "I'm here to help. Please tell me more about what's going on.")
    
    def get_flow_response(self, flow_type):
        flow_responses = {
            "initial_disclosure": "I'm here to listen. What's been going on?",
            "exploration": "How has this been affecting your daily life?",
            "closure": "I'm glad we could talk about this. Remember, I'm here if you need to talk again."
        }
        return flow_responses.get(flow_type, "I'm here to listen. Could you tell me more?")
    
    def get_empathy_response(self, emotion):
        empathy_responses = {
            "anxiety": "I understand how overwhelming anxiety can be. Would you like to talk about what specific aspects are causing you the most stress?",
            "depression": "I'm here to listen. Your feelings are valid, and it's okay to feel this way.",
            "stress": "Stress can feel overwhelming. Let's take this one step at a time."
        }
        return empathy_responses.get(emotion, "I'm here to listen. Could you tell me more about how you're feeling?")
    
    def chat(self):
        print("Mental Health Support Chatbot")
        print("Type 'quit' to end the conversation")
        print("-----------------------------")
        
        while True:
            user_input = input("You: ").strip()
            
            if user_input.lower() == 'quit':
                print("Bot: Take care of yourself. Goodbye!")
                break
            
            response = self.process_message(user_input)
            print(f"Bot: {response}")
            
            # Store conversation
            self.conversation_history.append({
                "user": user_input,
                "bot": response
            })

if __name__ == "__main__":
    chatbot = MentalHealthChatbot()
    chatbot.chat() 