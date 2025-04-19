from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline, Trainer, TrainingArguments
import torch
import pandas as pd
from typing import Dict, Any, Tuple, Optional
import os
from datasets import Dataset, DatasetDict  # type: ignore

class MultiModelChatbot:
    def __init__(self, model_paths: Optional[Dict[str, str]] = None):
        """Initialize the multi-model chatbot.
        
        Args:
            model_paths: Dictionary of model paths for each task
        """
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.models = {}
        self.tokenizers = {}
        
        # Default model paths if none provided
        if model_paths is None:
            model_paths = {
                "emotion": "models/emotion_model",
                "sentiment": "models/sentiment_model",
                "intent": "models/intent_model"
            }
        
        # Load models for each task
        for task, path in model_paths.items():
            if os.path.exists(path):
                self.load_model(task, path)
            else:
                print(f"Model not found for {task}, will need to train first")
    
    def load_model(self, task: str, model_path: str):
        """Load a pre-trained model for a specific task."""
        try:
            self.tokenizers[task] = AutoTokenizer.from_pretrained(model_path)
            self.models[task] = AutoModelForSequenceClassification.from_pretrained(model_path)
            self.models[task].to(self.device)
            print(f"Loaded {task} model successfully")
        except Exception as e:
            print(f"Error loading {task} model: {e}")
    
    def train_model(self, task: str, train_data: pd.DataFrame, 
                   model_name: str = "bert-base-uncased",
                   num_epochs: int = 3, batch_size: int = 16):
        """Train a model for a specific task."""
        # Convert DataFrame to HuggingFace Dataset
        dataset = Dataset.from_pandas(train_data)
        
        # Tokenize the data
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        def tokenize_function(examples):
            return tokenizer(examples["text"], padding="max_length", truncation=True)
        
        tokenized_dataset: Dataset = dataset.map(tokenize_function, batched=True)
        
        # Prepare model
        model = AutoModelForSequenceClassification.from_pretrained(
            model_name, 
            num_labels=len(train_data["label"].unique())
        )
        
        # Training arguments
        training_args = TrainingArguments(
            output_dir=f"models/{task}_model",
            num_train_epochs=num_epochs,
            per_device_train_batch_size=batch_size,
            save_strategy="epoch",
            evaluation_strategy="epoch"
        )
        
        # Initialize trainer
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=tokenized_dataset,  # type: ignore
            tokenizer=tokenizer
        )
        
        # Train the model
        trainer.train()
        
        # Save the model
        trainer.save_model(f"models/{task}_model")
        self.models[task] = model
        self.tokenizers[task] = tokenizer
    
    def predict(self, text: str) -> Dict[str, Any]:
        """Make predictions using all three models."""
        results = {}
        
        for task, model in self.models.items():
            if task in self.tokenizers:
                inputs = self.tokenizers[task](text, return_tensors="pt").to(self.device)
                with torch.no_grad():
                    outputs = model(**inputs)
                    predictions = torch.softmax(outputs.logits, dim=-1)
                    results[task] = {
                        "label": model.config.id2label[torch.argmax(predictions).item()],
                        "confidence": torch.max(predictions).item()
                    }
        
        return results
    
    def generate_response(self, text: str) -> str:
        """Generate a response based on the predictions."""
        predictions = self.predict(text)
        
        # Get the dominant emotion and sentiment
        emotion = predictions.get("emotion", {}).get("label", "neutral")
        sentiment = predictions.get("sentiment", {}).get("label", "neutral")
        intent = predictions.get("intent", {}).get("label", "general")
        
        # Generate appropriate response based on predictions
        if intent == "mood_check" and sentiment == "negative":
            return f"I understand you're feeling {emotion}. Would you like to talk about what's bothering you?"
        elif intent == "help":
            return "I'm here to help. What specific support do you need?"
        elif intent == "appointment_request":
            return "I can help you schedule an appointment. When would you like to meet?"
        else:
            return "I'm here to listen and support you. How can I help today?" 