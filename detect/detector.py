import torch
import cv2
from ultralytics import YOLO

# Cargar el modelo
modelo = YOLO('best.pt')  # Asegúrate de que 'best.pt' esté en la ruta correcta.

# Captura de video
cap = cv2.VideoCapture(0)  # 0 para la cámara predeterminada

while True:
    # Leer un frame de la cámara
    ret, frame = cap.read()
    
    if not ret:
        print("No se puede capturar el video")
        break

    # Realizar la detección
    results = modelo(frame)

    # Dibujar las boxes en el frame
    frame_box = results[0].plot()

    # Mostrar el frame con las detecciones
    cv2.imshow('Detección de Objetos', frame_box)

    # Salir del bucle si se presiona la tecla 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Liberar la cámara y cerrar todas las ventanas
cap.release()
cv2.destroyAllWindows()
