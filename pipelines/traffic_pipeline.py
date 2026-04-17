import cv2
import numpy as np
from src.detection.yolo_model import detect

def process(image_path):
    img = cv2.imread(image_path)

    if img is None:
        raise Exception("Không đọc được ảnh")

    boxes = detect(img)

    return {
        "boxes": boxes
    }