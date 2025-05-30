import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import classification_report
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
os.makedirs('models/saved_models/model2', exist_ok=True)

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
    df = pd.read_csv('data/augmented/processed_emotion_dataset.csv')
    
    # Preprocess text
    print("Preprocessing text...")
    df['processed_text'] = df['text'].apply(preprocess_text)
    
    # Get labels (emotion classes)
    y = df['label'].values  # Using 'label' column which contains emotion classes
    
    return df['processed_text'], y

def train_model():
    print("Training Multi-class SVM Model...")
    
    # Load and preprocess data
    texts, y = load_and_preprocess_data()
    
    # Vectorize text
    vectorizer = TfidfVectorizer(max_features=5000)
    X = vectorizer.fit_transform(texts)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Create and train model with multi-class support
    model = SVC(
        kernel='linear',
        decision_function_shape='ovr',  # one-vs-rest for multi-class
        probability=True
    )
    
    print("Training model...")
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model and vectorizer
    print("Saving model and components...")
    joblib.dump(model, 'models/saved_models/model2/model.pkl')
    joblib.dump(vectorizer, 'models/saved_models/model2/vectorizer.pkl')
    
    print("Model saved successfully!")

if __name__ == "__main__":
    train_model() 