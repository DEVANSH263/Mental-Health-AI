import random
import pandas as pd
from typing import Dict, List, Any
from pathlib import Path

class EmotionDataGenerator:
    def __init__(self):
        self.emotions: Dict[str, List[str]] = {
            "joy": [
                "I'm feeling so happy about {thing}.",
                "Today is a wonderful day because of {thing}.",
                "I can't stop smiling after {thing}.",
                "Life feels amazing thanks to {thing}."
            ],
            "sadness": [
                "I'm feeling really down because of {thing}.",
                "It's hard to cope with {thing}.",
                "I've been crying since {thing} happened.",
                "There's a heavy feeling in my heart due to {thing}."
            ],
            "anger": [
                "I'm furious about {thing}.",
                "I can't believe how mad I am over {thing}.",
                "{thing} makes my blood boil.",
                "I'm so frustrated because of {thing}."
            ],
            "fear": [
                "I'm scared about {thing}.",
                "Thinking about {thing} makes me anxious.",
                "I fear {thing} might happen.",
                "I'm terrified because of {thing}."
            ],
            "love": [
                "I truly care about {thing}.",
                "My heart feels full when I think about {thing}.",
                "{thing} means the world to me.",
                "I feel so connected to {thing}."
            ],
            "surprise": [
                "I wasn't expecting {thing} at all!",
                "{thing} really caught me off guard.",
                "I'm shocked about what happened with {thing}.",
                "Wow! {thing} was unexpected."
            ]
        }
        
        self.topics: List[str] = [
            "my exam results", "a surprise gift", "my pet", "my best friend",
            "the job interview", "the weather", "a message I got", "the news today",
            "my upcoming trip", "the call from my mom", "that movie", "my partner"
        ]
    
    def generate_dataset(self, samples_per_emotion: int = 1700) -> pd.DataFrame:
        """Generate synthetic emotion dataset.
        
        Args:
            samples_per_emotion: Number of samples to generate per emotion class
            
        Returns:
            DataFrame with columns 'text' and 'label'
        """
        data = []
        
        for emotion, templates in self.emotions.items():
            for _ in range(samples_per_emotion):
                template = random.choice(templates)
                topic = random.choice(self.topics)
                sentence = template.format(thing=topic)
                data.append({"text": sentence, "label": emotion})
        
        # Shuffle the data
        random.shuffle(data)
        return pd.DataFrame(data)
    
    def save_dataset(self, output_dir: str, samples_per_emotion: int = 1700) -> str:
        """Generate and save the dataset to a CSV file.
        
        Args:
            output_dir: Directory to save the CSV file
            samples_per_emotion: Number of samples per emotion class
            
        Returns:
            Path to the saved CSV file
        """
        df = self.generate_dataset(samples_per_emotion)
        
        # Create output directory if it doesn't exist
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Save to CSV
        file_path = output_path / "synthetic_emotion_dataset.csv"
        df.to_csv(file_path, index=False)
        
        print(f"Generated dataset with {len(df)} samples:")
        print(df['label'].value_counts())
        
        return str(file_path)

def main():
    """Generate a synthetic emotion dataset."""
    generator = EmotionDataGenerator()
    output_dir = "data"
    file_path = generator.save_dataset(output_dir)
    print(f"\nDataset saved to: {file_path}")

if __name__ == '__main__':
    main() 