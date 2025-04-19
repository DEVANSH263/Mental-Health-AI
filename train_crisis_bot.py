import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

def prepare_crisis_data():
    # Sample crisis training data
    training_data = [
        {"text": "I don't want to live anymore", "is_crisis": True, "crisis_type": "suicidal_thoughts"},
        {"text": "I'm thinking about ending it all", "is_crisis": True, "crisis_type": "suicidal_thoughts"},
        {"text": "I want to hurt myself", "is_crisis": True, "crisis_type": "self_harm"},
        {"text": "I'm having a panic attack", "is_crisis": True, "crisis_type": "panic_attack"},
        {"text": "I'm feeling a bit stressed", "is_crisis": False, "crisis_type": "none"},
        {"text": "I'm worried about my exam", "is_crisis": False, "crisis_type": "none"}
    ]
    
    return pd.DataFrame(training_data)

def train_crisis_models():
    print("Preparing crisis detection data...")
    df = prepare_crisis_data()
    
    # Train crisis detection model (binary classification)
    print("\nTraining crisis detection model...")
    crisis_detector = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', LogisticRegression())
    ])
    crisis_detector.fit(df['text'], df['is_crisis'])
    
    # Train crisis type classifier (multi-class classification)
    print("Training crisis type classifier...")
    crisis_classifier = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', LogisticRegression())
    ])
    crisis_classifier.fit(df[df['is_crisis']]['text'], df[df['is_crisis']]['crisis_type'])
    
    # Save models
    joblib.dump(crisis_detector, 'models/crisis_detector.joblib')
    joblib.dump(crisis_classifier, 'models/crisis_classifier.joblib')
    print("Models trained and saved successfully!")
    
    # Test the models
    test_texts = [
        "I want to end my life",
        "I'm having a panic attack right now",
        "I'm feeling a bit stressed about work"
    ]
    
    print("\nTesting the models:")
    for text in test_texts:
        is_crisis = crisis_detector.predict([text])[0]
        if is_crisis:
            crisis_type = crisis_classifier.predict([text])[0]
            print(f"Text: '{text}' -> CRISIS DETECTED! Type: {crisis_type}")
        else:
            print(f"Text: '{text}' -> No crisis detected")

if __name__ == "__main__":
    train_crisis_models() 