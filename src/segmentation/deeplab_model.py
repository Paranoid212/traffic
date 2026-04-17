import torch
import torchvision.transforms as T
from PIL import Image
import numpy as np
import torchvision.models as models

# load model pretrained
model = models.segmentation.deeplabv3_resnet50(pretrained=True)
model.eval()

# transform ảnh
transform = T.Compose([
    T.Resize((512, 512)),
    T.ToTensor()
])

def segment(image):
    img = Image.fromarray(image)
    img = transform(img).unsqueeze(0)

    with torch.no_grad():
        output = model(img)["out"][0]

    mask = output.argmax(0).cpu().numpy()

    return mask