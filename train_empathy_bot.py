import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib
import json

# Load and prepare training data
def prepare_training_data():
    # Sample training data (in real scenario, this would be your dataset)
    training_data = [
        {"text": "I'm feeling really anxious about my exams", "emotion": "anxiety"},
        {"text": "My anxiety about work is overwhelming", "emotion": "anxiety"},
        {"text": "I've been feeling really down lately", "emotion": "depression"},
        {"text": "Nothing seems to make me happy anymore", "emotion": "depression"},
        {"text": "I'm so stressed about my job", "emotion": "stress"},
        {"text": "The pressure from school is too much", "emotion": "stress"}
    ]
    
    # Convert to DataFrame
    df = pd.DataFrame(training_data)
    return df

def train_empathy_model():
    print("Preparing training data...")
    df = prepare_training_data()
    
    print("Creating and training the model...")
    # Create a pipeline with TF-IDF vectorizer and Naive Bayes classifier
    model = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', MultinomialNB())
    ])
    
    # Train the model
    model.fit(df['text'], df['emotion'])
    
    # Save the model
    joblib.dump(model, 'models/empathy_model.joblib')
    print("Model trained and saved successfully!")
    
    # Test the model
    test_texts = [
        "I'm worried about my future",
        "I feel hopeless",
        "Work is stressing me out"
    ]
    
    print("\nTesting the model:")
    for text in test_texts:
        prediction = model.predict([text])[0]
        print(f"Text: '{text}' -> Predicted emotion: {prediction}")

if __name__ == "__main__":
    train_empathy_model() 