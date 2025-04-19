import pandas as pd
import numpy as np
from typing import List, Dict

class EmotionDataGenerator:
    def __init__(self):
        self.emotions = ['happy', 'sad', 'angry', 'anxious', 'neutral']
        self.templates = {
            'happy': [
                "I'm feeling great today!",
                "Everything is going well",
                "I'm so excited about"
            ],
            'sad': [
                "I'm feeling down",
                "I'm really upset about",
                "I can't stop crying"
            ],
            'angry': [
                "I'm so frustrated with",
                "This makes me really mad",
                "I can't believe"
            ],
            'anxious': [
                "I'm really worried about",
                "I can't stop thinking about",
                "I'm nervous about"
            ],
            'neutral': [
                "I'm just checking in",
                "I wanted to talk about",
                "Can we discuss"
            ]
        }
    
    def generate_dataset(self, num_samples: int = 10000) -> pd.DataFrame:
        data = []
        for _ in range(num_samples):
            emotion = np.random.choice(self.emotions)
            template = np.random.choice(self.templates[emotion])
            message = f"{template} {self._generate_context()}"
            data.append({'text': message, 'label': emotion})
        
        return pd.DataFrame(data)
    
    def _generate_context(self) -> str:
        contexts = [
            "my day", "work", "school", "my relationship", "my family",
            "my health", "my future", "my past", "my friends", "my job"
        ]
        return np.random.choice(contexts)
    
    def save_dataset(self, output_dir: str):
        df = self.generate_dataset()
        df.to_csv(f"{output_dir}/synthetic_emotion_dataset.csv", index=False) 