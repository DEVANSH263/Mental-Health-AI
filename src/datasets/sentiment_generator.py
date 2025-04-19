import pandas as pd
import numpy as np
from typing import List, Dict

class SentimentDataset:
    def __init__(self):
        self.sentiments = ['positive', 'negative', 'neutral']
        self.templates = {
            'positive': [
                "I'm really happy about",
                "I'm excited for",
                "I love"
            ],
            'negative': [
                "I'm upset about",
                "I hate",
                "I'm disappointed with"
            ],
            'neutral': [
                "I'm thinking about",
                "I need to discuss",
                "Let's talk about"
            ]
        }
    
    def generate(self, num_samples: int = 10000) -> pd.DataFrame:
        data = []
        for _ in range(num_samples):
            sentiment = np.random.choice(self.sentiments)
            template = np.random.choice(self.templates[sentiment])
            message = f"{template} {self._generate_context()}"
            data.append({'text': message, 'label': sentiment})
        
        return pd.DataFrame(data)
    
    def _generate_context(self) -> str:
        contexts = [
            "my day", "work", "school", "my relationship", "my family",
            "my health", "my future", "my past", "my friends", "my job"
        ]
        return np.random.choice(contexts)
    
    def save(self, output_dir: str):
        df = self.generate()
        df.to_csv(f"{output_dir}/synthetic_sentiment_dataset.csv", index=False) 