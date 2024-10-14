import firebase_admin
from firebase_admin import credentials, firestore

# Configura Firebase con los datos de tu proyecto y las credenciales de servicio
firebase_config = {
  "type": "service_account",
  "project_id": "detector-de-epp",
  "private_key_id": "7a8aa2a16510f407b2aaa2f66977271656fa318e",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDM2z6lJpJxUq8g\noUO0c9cFQ1NKj7oS/nFNzqiDe8iEFBPLaeRqZ11hSasMUvjDscFB0cTgCjgWElte\nPHQdeo62lztsvX44zE4m36Fw/OTTdJ3hQlfVYaSRARVzlcG1hcxnU0yi69vv1jL7\nPUp5LwtiMc9DX8tmC5n0KMgGHI5UCX1xnQLsKMVT6ilm5twRMUdfPcIv9P+RMIq+\narvq31f6HoA2+Reo42NpIA4KxvRs6JUsTtk7/h3H59WiNu/B/UyjoMOuF+jOah6r\nOddWUgTFM2yXPwNjHg792Vm/oXhvl4hNreGiVO2fsMgSsrvDUemy05daUeBQWLUr\nL9PIgXMRAgMBAAECggEAFZlwS317p1Muf+RA/T/Rhg6JM61f0yzcyXVmsyZUCAkN\n5T6vBMENSXq4/D2rWQbe94+kkHLDYyBgXdlF7O3FKl9btqVsL5TrEJI3tXAUuG7t\nTpjuJeN7tIZGur8pg3guCx7vT6ZKtEkDaxYVSh25t4rE7bel/IZwnxvFq09LenSt\naHDKY7gxNXihqyAnIetFAYIm9vHQ8iihvHo62Agro3/0zfNdFmIkyiDahMtQavMs\nUKSAB5zGKOa75YnBnNNFe0pusYlUn0FFpMbK2pPtMBYlxWCfF6iK97ngxD0C4KIB\nMOp3cAgPTFfd0Ha7VemJe5Y3SfarzQtYisCO027MIQKBgQDmTitNB1D31o1wqjBp\nt+M8Fim7PWxJVWy66QLQG+9/laOzyyY33RdI1Ao9e66ga3p9S1o7ldxLY1bZQQIF\nkewFVInKGSCyyF/wDAiQqGEnbBlnbilrMIl6XU3f3v3gAVTdiJF472Ko+/9wDqjA\n2w2Aw8pXwthm0YiC6XP4wVwTLQKBgQDjtjhUcH3Q/BJJmlbHoU+Q2dFl0rfXNPa4\nJ/MY/zWnzE1w17NYW94Qyqtjuce9zd/uZF7rACDd9rlDpkbNo7Klr5C25aegZy7T\ne4lQtKeXxZoi9ug7DJU5Z9SXERsR9eWJGLQRxDqvLIEHF1uREzXV4vg/gs2n48NR\nq21ncHMd9QKBgQCZzYRfac5p5TAKGK5CO9sWSprN/6QsiU8Wt/v37WARbWao8Ldy\nQUWGjozUKKAjZAOmX0dAWcGH2yyp5B8shxn/KUjn3cYXf3eKgQ7LRJe1UxzYFRq2\nCfEV9e/G3U3gZiM92zGDeSMDRV9+f1u1h9TJtHeSCn6ok7A99RhM/Ry3dQKBgE3t\nYkGjbatDWI7Pvrr6vVv47uxFvJxth7FmGo+HZzlRdX8Ukk++wLRGZ3jtbynJdsUC\nnGkX1ief867vDHP7fXuuJXwyA7elGCVPtaJk8KXD/gfRL5Blsfu/SMWaGQWAfVj5\nl0YtPVgNhuqCV9fCFz5nOkWh4fd+vq0IWZx4oyyxAoGBAI0R+lYsfnlT6BAeJCqs\nO4iFAg+ZTtDewoMS/bT05G9L7cphMH+YJAeoacKux1ZSqclKAbi3svE9YnvdMnz0\nmV6F3k6Qf3xXZVyV0gt7BucH1EZxJEjjLuwMZ7CudACMU7/05su/57+uttC8+1Fa\nulfP1OPVBiayRBjRaISGHMT8\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-vxgjd@detector-de-epp.iam.gserviceaccount.com",
  "client_id": "111946098305273247445",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-vxgjd%40detector-de-epp.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

# Inicializar Firebase con las credenciales en el código
cred = credentials.Certificate(firebase_config)
firebase_admin.initialize_app(cred)

# Obtener acceso a Firestore
db = firestore.client()

# ID del área que deseas consultar
area_id = 0 # Cambia esto por el ID del área que necesitas

# Crear una referencia a la colección 'areas'
areas_ref = db.collection('area')

# Construir la consulta
query = areas_ref.where('id', '==', area_id).limit(1)

# Ejecutar la consulta
area_docs = query.get()

# Verificar si se encontraron documentos
if area_docs:
    # Obtener la referencia al primer documento encontrado
    area_ref = area_docs[0].reference

    # Datos que deseas almacenar en la colección 'workers'
    data = {
        'area': area_ref,           # Referencia al documento del área
        'carduid': '667653',      # ID de la tarjeta RFID del operario
        'lastname': 'Sosa',       # Apellido del operario
        'name': 'Jose'            # Nombre del operario
    }

    # Agregar el documento a la colección 'workers' y dejar que Firebase genere el ID automáticamente
    db.collection('workers').add(data)
    print("Documento agregado exitosamente.")
else:
    print(f"No se encontró el documento del área con ID: {area_id}")