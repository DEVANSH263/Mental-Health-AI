import tensorflow as tf
from tensorflow import keras
from keras.models import Sequential
from keras.layers import Dense, Embedding, LSTM, Dropout
from keras.preprocessing.text import Tokenizer
from keras.utils import pad_sequences
from sklearn.metrics import classification_report
import numpy as np
import pandas as pd
from typing import Dict, Any, Union, cast
import json
import os

class ModelTrainer:
    def __init__(self, max_words: int = 10000, max_len: int = 200):
        self.max_words = max_words
        self.max_len = max_len
        self.tokenizer = Tokenizer(num_words=max_words)
        self.model = self.create_model(max_words)
    
    def create_model(self, input_dim: int) -> Sequential:
        """Create the neural network model."""
        model = Sequential([
            Embedding(input_dim=input_dim, output_dim=128, input_length=self.max_len),
            LSTM(128, return_sequences=True),
            Dropout(0.2),
            LSTM(64),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dropout(0.2),
            Dense(1, activation='sigmoid')
        ])
        
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        return model
    
    def prepare_data(self, X_train: pd.Series, X_test: pd.Series) -> Dict[str, np.ndarray]:
        """Prepare data for model training."""
        # Fit tokenizer on training data
        self.tokenizer.fit_on_texts(X_train)
        
        # Convert text to sequences
        X_train_seq = self.tokenizer.texts_to_sequences(X_train)
        X_test_seq = self.tokenizer.texts_to_sequences(X_test)
        
        # Pad sequences
        X_train_pad = pad_sequences(X_train_seq, maxlen=self.max_len)
        X_test_pad = pad_sequences(X_test_seq, maxlen=self.max_len)
        
        return {
            'X_train': X_train_pad,
            'X_test': X_test_pad
        }
    
    def train(self, X_train: np.ndarray, y_train: np.ndarray,
              X_val: np.ndarray, y_val: np.ndarray,
              epochs: int = 10, batch_size: int = 32) -> Dict[str, Any]:
        """Train the model."""
        if self.model is None:
            raise ValueError("Model not initialized")
            
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=batch_size,
            verbose=str(1)
        )
        
        return history.history
    
    def evaluate(self, X_test: np.ndarray, y_test: np.ndarray) -> Dict[str, float]:
        """Evaluate the model on test data."""
        if self.model is None:
            raise ValueError("Model not initialized")
            
        loss, accuracy = self.model.evaluate(X_test, y_test, verbose=str(0))
        y_pred = (self.model.predict(X_test) > 0.5).astype(int)
        
        report = cast(Dict[str, Dict[str, float]], classification_report(y_test, y_pred, output_dict=True))
        metrics = report['weighted avg']
        
        return {
            'loss': float(loss),
            'accuracy': float(accuracy),
            'precision': float(metrics['precision']),
            'recall': float(metrics['recall']),
            'f1_score': float(metrics['f1-score'])
        }
    
    def save_model(self, model_dir: str) -> None:
        """Save the model and tokenizer."""
        if self.model is None:
            raise ValueError("Model not initialized")
            
        os.makedirs(model_dir, exist_ok=True)
        
        # Save model
        self.model.save(os.path.join(model_dir, 'model.h5'))
        
        # Save tokenizer
        tokenizer_config = self.tokenizer.to_json()
        with open(os.path.join(model_dir, 'tokenizer.json'), 'w') as f:
            json.dump(tokenizer_config, f)
    
    def load_model(self, model_dir: str) -> None:
        """Load a saved model and tokenizer."""
        # Load model
        self.model = tf.keras.models.load_model(os.path.join(model_dir, 'model.h5'))
        
        # Load tokenizer
        with open(os.path.join(model_dir, 'tokenizer.json'), 'r') as f:
            tokenizer_config = json.load(f)
        self.tokenizer = tf.keras.preprocessing.text.tokenizer_from_json(tokenizer_config) 