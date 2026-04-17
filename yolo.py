from ultralytics import YOLO
import cv2
from pipelines.traffic_pipeline import process
model = YOLO("yolov8n.pt")

img = cv2.imread(r"D:\hinh anh va giong nio\project\images.jpg")

results = model(img)
result = process(r"D:\hinh anh va giong nio\project\images.jpg")
boxes = results[0].boxes

for box in boxes:
    cls = int(box.cls[0])

    # COCO class
    if cls in [0, 2, 3]:  # person, car, motorbike
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        
        cv2.rectangle(img, (x1, y1), (x2, y2), (0,255,0), 2)

cv2.imshow("Filtered Detection", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
print(result)