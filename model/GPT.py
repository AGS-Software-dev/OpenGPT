import random
import string

DataSet = [
    "How are you doing today?",
    "Good morning! Hope you have a great day ahead.",
    "Hi",
    "What do you want to learn today?",
    "Tell me a joke.",
    "What's the weather like?",
    "Can you help me with my homework?",
    "What's your favorite book?",
    "Do you like music?",
    "What's the capital of France?"
]  
            

class Model:
    def __init__(self, name, layers):
        self.name = name
        self.layers = layers
        
    def Transform(self, input_data):
        token = ""
        for input_char in input_data:
            if input_char.isdigit():
                # Shift numeric characters by +3
                token += str((int(input_char) + 3) % 10)
            else:
                # Shift letters by +3 (simple Caesar cipher)
                if input_char.isalpha():
                    base = 'A' if input_char.isupper() else 'a'
                    shifted = chr((ord(input_char) - ord(base) + 3) % 26 + ord(base))
                    token += shifted
                else:
                    # Keep spaces and punctuation unchanged
                    token += input_char
        return token

        
    def generate_text(self, token):
        transformed_token = self.Transform(token)
        print(f"Transformed Token: {transformed_token}")

        # Simulate basic "response" behavior:
        for data in DataSet:
            # Check if the transformed token (after decoding) matches any known phrase
            if token.lower() in data.lower():
                return data
        

    def summary(self):
        print(f"Model Name: {self.name}")
        print("Layers:")
        for layer in self.layers:
            print(f"- {layer}")
            
# Example usage
if __name__ == "__main__":
    gpt_model = Model(
        "GPT-5", [
            "Embedding Layer",
            "Transformer Layer 1",
            "Transformer Layer 2",
            "Output Layer"
        ]
    )

    response = gpt_model.generate_text("hi")
    print(f"Response: {response}\n")
    gpt_model.summary()