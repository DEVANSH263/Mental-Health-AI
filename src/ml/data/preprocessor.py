import pandas as pd
import numpy as np
from typing import List, Dict, Any
import re
from sklearn.model_selection import train_test_split

class DataPreprocessor:
    def __init__(self):
        self.text_cleaner = TextCleaner()
    
    def load_data(self, file_path: str) -> pd.DataFrame:
        """Load data from a CSV file."""
        return pd.read_csv(file_path)
    
    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text data."""
        return self.text_cleaner.clean(text)
    
    def prepare_dataset(self, data: pd.DataFrame, text_column: str, label_column: str) -> Dict[str, Any]:
        """Prepare dataset for training."""
        # Clean text
        data[text_column] = data[text_column].apply(self.preprocess_text)
        
        # Split into train and test sets
        X_train, X_test, y_train, y_test = train_test_split(
            data[text_column],
            data[label_column],
            test_size=0.2,
            random_state=42
        )
        
        return {
            'X_train': X_train,
            'X_test': X_test,
            'y_train': y_train,
            'y_test': y_test
        }

class TextCleaner:
    def __init__(self):
        self.stop_words = set(['the', 'a', 'an', 'and', 'or', 'but', 'if', 'because', 'as', 'what',
                             'when', 'where', 'how', 'which', 'who', 'whom', 'this', 'that', 'these',
                             'those', 'then', 'just', 'so', 'than', 'such', 'both', 'through', 'about',
                             'for', 'is', 'of', 'while', 'during', 'to', 'What', 'Why', 'How', 'When',
                             'Where', 'Who', 'Whom', 'Which', 'Is', 'Are', 'Was', 'Were', 'The', 'A',
                             'An', 'And', 'Or', 'But', 'If', 'Because', 'As', 'What', 'When', 'Where',
                             'How', 'Which', 'Who', 'Whom', 'This', 'That', 'These', 'Those', 'Then',
                             'Just', 'So', 'Than', 'Such', 'Both', 'Through', 'About', 'For', 'Is',
                             'Of', 'While', 'During', 'To'])
    
    def clean(self, text: str) -> str:
        """Clean and normalize text."""
        if not isinstance(text, str):
            return ""
            
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        
        # Remove special characters and numbers
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Remove stop words
        text = ' '.join([word for word in text.split() if word not in self.stop_words])
        
        return text 