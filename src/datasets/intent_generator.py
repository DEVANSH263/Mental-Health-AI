import pandas as pd
import numpy as np
from typing import List, Dict

class IntentDataset:
    def __init__(self):
        self.intents = ['greeting', 'help', 'advice', 'vent', 'goodbye']
        self.templates = {
            'greeting': [
                "Hi, how are you?",
                "Hello, I need to talk",
                "Hey, can we chat?"
            ],
            'help': [
                "Can you help me with",
                "I need help with",
                "Could you assist me with"
            ],
            'advice': [
                "What should I do about",
                "I need advice on",
                "Can you give me advice about"
            ],
            'vent': [
                "I need to vent about",
                "I'm frustrated with",
                "I'm struggling with"
            ],
            'goodbye': [
                "Thanks, I need to go",
                "I have to leave now",
                "Talk to you later"
            ]
        }
    
    def generate(self, num_samples: int = 10000) -> pd.DataFrame:
        data = []
        for _ in range(num_samples):
            intent = np.random.choice(self.intents)
            template = np.random.choice(self.templates[intent])
            message = f"{template} {self._generate_context()}"
            data.append({'text': message, 'intent': intent})
        
        return pd.DataFrame(data)
    
    def _generate_context(self) -> str:
        contexts = [
            "my day", "work", "school", "my relationship", "my family",
            "my health", "my future", "my past", "my friends", "my job"
        ]
        return np.random.choice(contexts)
    
    def save(self, output_dir: str):
        df = self.generate()
        df.to_csv(f"{output_dir}/synthetic_intent_dataset.csv", index=False) 