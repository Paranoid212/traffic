from ultralytics import YOLO

# load 1 lần (không load lại nhiều lần)
model = YOLO("yolov8n.pt")

def detect(image):
    results = model(image)

    boxes = []
    for box in results[0].boxes:
        cls = int(box.cls[0])
        conf = float(box.conf[0])
        x1, y1, x2, y2 = map(int, box.xyxy[0])

        boxes.append({
            "class": cls,
            "confidence": conf,
            "bbox": [x1, y1, x2, y2]
        })

    return boxes
