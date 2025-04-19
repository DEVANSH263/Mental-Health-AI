import os
import argparse
from data.preprocessor import DataPreprocessor
from models.trainer import ModelTrainer
import pandas as pd
import json
from datetime import datetime

def main():
    parser = argparse.ArgumentParser(description='Train mental health classification model')
    parser.add_argument('--data_path', type=str, required=True, help='Path to training data CSV')
    parser.add_argument('--text_column', type=str, default='text', help='Name of text column in CSV')
    parser.add_argument('--label_column', type=str, default='label', help='Name of label column in CSV')
    parser.add_argument('--output_dir', type=str, default='models', help='Directory to save trained model')
    parser.add_argument('--epochs', type=int, default=10, help='Number of training epochs')
    parser.add_argument('--batch_size', type=int, default=32, help='Training batch size')
    
    args = parser.parse_args()
    
    # Create output directory with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    model_dir = os.path.join(args.output_dir, f'model_{timestamp}')
    os.makedirs(model_dir, exist_ok=True)
    
    # Initialize components
    preprocessor = DataPreprocessor()
    trainer = ModelTrainer()
    
    # Load and preprocess data
    print("Loading and preprocessing data...")
    data = preprocessor.load_data(args.data_path)
    processed_data = preprocessor.prepare_dataset(data, args.text_column, args.label_column)
    
    # Prepare data for model
    print("Preparing data for model...")
    prepared_data = trainer.prepare_data(processed_data['X_train'], processed_data['X_test'])
    
    # Create and train model
    print("Creating and training model...")
    trainer.create_model(input_dim=trainer.max_words)
    history = trainer.train(
        prepared_data['X_train'],
        processed_data['y_train'],
        prepared_data['X_test'],
        processed_data['y_test'],
        epochs=args.epochs,
        batch_size=args.batch_size
    )
    
    # Evaluate model
    print("Evaluating model...")
    metrics = trainer.evaluate(prepared_data['X_test'], processed_data['y_test'])
    
    # Save model and metrics
    print("Saving model and metrics...")
    trainer.save_model(model_dir)
    
    # Save training history and metrics
    with open(os.path.join(model_dir, 'metrics.json'), 'w') as f:
        json.dump({
            'training_history': history,
            'evaluation_metrics': metrics
        }, f, indent=2)
    
    print(f"\nTraining completed! Model saved to {model_dir}")
    print("\nEvaluation Metrics:")
    for metric, value in metrics.items():
        print(f"{metric}: {value:.4f}")

if __name__ == '__main__':
    main() 