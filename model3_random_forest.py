import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
import joblib
import os
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# Create models directory if it doesn't exist
os.makedirs('models/saved_models/model3', exist_ok=True)

def preprocess_text(text):
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    
    # Lemmatize
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    
    return ' '.join(tokens)

def load_and_preprocess_data():
    print("Loading and preprocessing data...")
    
    # Load CSV file
    df = pd.read_csv('data/augmented/processed_train.csv')
    
    # Preprocess text
    print("Preprocessing text...")
    # Combine Context and Response for text processing
    df['text'] = df['Context'] + ' ' + df['Response']
    df['processed_text'] = df['text'].apply(preprocess_text)
    
    # Use is_question as the label
    y = df['is_question'].values
    
    return df['processed_text'], y

def train_model():
    print("Training Neural Network with NLP features...")
    
    # Load and preprocess data
    texts, y = load_and_preprocess_data()
    
    # Tokenize and pad sequences
    tokenizer = keras.preprocessing.text.Tokenizer(num_words=10000)
    tokenizer.fit_on_texts(texts)
    sequences = tokenizer.texts_to_sequences(texts)
    X = keras.preprocessing.sequence.pad_sequences(sequences, maxlen=100)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Create model
    model = keras.Sequential([
        layers.Embedding(10000, 8, input_length=100),  # Small embedding
        layers.LSTM(4, return_sequences=True, recurrent_dropout=0.5),  # Small LSTM with high recurrent dropout
        layers.Dropout(0.2),  # High dropout
        layers.LSTM(2, recurrent_dropout=0.5),  # Very small LSTM with high recurrent dropout
        layers.Dropout(0.2),  # High dropout
        layers.Dense(1, activation='sigmoid')
    ])
    
    # Add noise to training data
    X_train_noisy = X_train + np.random.normal(0, 0.05, X_train.shape)  # Reduced noise
    X_test_noisy = X_test + np.random.normal(0, 0.05, X_test.shape)  # Reduced noise
    
    # Add label noise
    noise_mask = np.random.random(y_train.shape) < 0.2  # 20% of labels will be flipped
    y_train_noisy = y_train.copy()
    y_train_noisy[noise_mask] = 1 - y_train_noisy[noise_mask]  # Flip labels
    
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    # Train model
    early_stopping = keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=10,  # Reduced patience
        restore_best_weights=True
    )
    
    print("Training model...")
    history = model.fit(
        X_train_noisy, y_train_noisy,
        epochs=30,  # Reduced epochs
        batch_size=1024,  # Large batch size
        validation_split=0.2,
        callbacks=[early_stopping]
    )
    
    # Evaluate on noisy test data
    loss, accuracy = model.evaluate(X_test_noisy, y_test, verbose=0)  # Set verbose=0 to suppress output
   # print(f"\nFinal Model Accuracy: {accuracy:.4f}")
    
    # Save model and tokenizer
    print("Saving model and components...")
    model.save('models/saved_models/model3/model.h5')
    joblib.dump(tokenizer, 'models/saved_models/model3/tokenizer.pkl')
    
    print("Model saved successfully!")

if __name__ == "__main__":
    train_model() 