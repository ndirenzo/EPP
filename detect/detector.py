import torch
import cv2
from ultralytics import YOLO
import base64
import io
from PIL import Image

# Cargar el modelo
modelo = YOLO('best.pt')

# Captura de video
cap = cv2.VideoCapture(0)

# Leer un solo frame de la cámara
ret, frame = cap.read()
if ret:
    detect = modelo(frame)
    frame_box = detect[0].plot()

    # Guardar la imagen en un archivo
    cv2.imwrite('public/image.jpg', frame_box)

# Liberar la cámara
cap.release()
