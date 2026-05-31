from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np

app = Flask(__name__)
# CORS enable karne se aapka React frontend is Python server se baat kar payega
CORS(app)

# YOLOv8 model load ho raha hai (ye automatic .pt file download kar lega pehli baar chalne par)
print("Loading YOLOv8 model...")
model = YOLO('yolov8n.pt')
print("Model loaded successfully!")

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Zero-Waste AI Backend is running!"})

@app.route('/predict', methods=['POST'])
def predict():
    # Check karna ki image aayi hai ya nahi
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
        
    file = request.files['image']
    
    try:
        # Image file ko openCV format mein convert karna read karne ke liye
        file_bytes = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        
        # YOLOv8 se prediction lena
        results = model.predict(source=img, save=False)
        
        # Jo jo items detect huye hain unki list nikalna
        detected_items = []
        for result in results:
            for box in result.boxes:
                # Class ID se item ka naam pata karna (jaise bottle, cup, etc.)
                class_id = int(box.cls[0])
                item_name = model.names[class_id]
                detected_items.append(item_name)
        
        # Agar kuch detect nahi hua toh empty list na bhej kar custom message dena
        if not detected_items:
            detected_items = ["unknown waste"]

        return jsonify({
            "status": "success",
            "predictions": detected_items
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Server port 5000 par chalega
    app.run(host='0.0.0.0', port=5000, debug=True)