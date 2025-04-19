import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
import joblib

def prepare_flow_data():
    # Sample conversation flow training data
    training_data = [
        {"text": "I've been feeling really anxious lately", "flow_type": "initial_disclosure"},
        {"text": "I need to talk about something", "flow_type": "initial_disclosure"},
        {"text": "It started when I lost my job", "flow_type": "exploration"},
        {"text": "I think it's because of my family", "flow_type": "exploration"},
        {"text": "I feel a bit better now", "flow_type": "closure"},
        {"text": "Thank you for listening", "flow_type": "closure"}
    ]
    
    return pd.DataFrame(training_data)

def train_flow_model():
    print("Preparing conversation flow data...")
    df = prepare_flow_data()
    
    print("\nTraining conversation flow model...")
    # Create a pipeline with TF-IDF vectorizer and SVM classifier
    flow_model = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', SVC(kernel='linear'))
    ])
    
    # Train the model
    flow_model.fit(df['text'], df['flow_type'])
    
    # Save the model
    joblib.dump(flow_model, 'models/flow_model.joblib')
    print("Model trained and saved successfully!")
    
    # Test the model
    test_texts = [
        "I've been feeling really down",
        "It all started last month",
        "I feel better after talking"
    ]
    
    print("\nTesting the model:")
    for text in test_texts:
        prediction = flow_model.predict([text])[0]
        print(f"Text: '{text}' -> Predicted flow type: {prediction}")

if __name__ == "__main__":
    train_flow_model() 