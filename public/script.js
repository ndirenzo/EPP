// Update the imports to include necessary Firestore functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDLqPKNtCK4cO93Zn1Yiik89OyRWYFif0U",
    authDomain: "detector-de-epp.firebaseapp.com",
    projectId: "detector-de-epp",
    storageBucket: "detector-de-epp.appspot.com",
    messagingSenderId: "427537022126",
    appId: "1:427537022126:web:139e07f28006ad73f2413f",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Referencia al botón de logout
const logoutButton = document.getElementById("logoutButton");

// Agregar un evento de clic al botón
logoutButton.addEventListener("click", () => {
    // Llamar a la función de cierre de sesión de Firebase
    signOut(auth)
        .then(() => {
            // Redirigir al usuario a la página de inicio de sesión
            window.location.href = "login.html";
        })
        .catch((error) => {
            console.error("Error al cerrar sesión:", error);
        });
});

// Verificar si el usuario está autenticado
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Si el usuario no está autenticado, redirigir al login
        window.location.href = "login.html";
    } else {
        // Si el usuario está autenticado, puedes cargar los datos
        console.log("Usuario autenticado:", user);
        loadWorkers();
    }
});


// Función para actualizar el ID más reciente
async function updateLatestRead(id) {
    const latestIdElement = document.getElementById('latestId');
    const latestNameElement = document.getElementById('latestName');
    const latestLastnameElement = document.getElementById('latestLastname');
    const latestAreaElement = document.getElementById('latestArea');

    if (!id) {
        latestIdElement.textContent = "Esperando tarjeta...";
        latestNameElement.textContent = "-";
        latestLastnameElement.textContent = "-";
        latestAreaElement.textContent = "-";
        return;
    }

    latestIdElement.textContent = id;
    
    try {
        const numericId = Number(id);
        const workersRef = collection(db, 'workers');
        const q = query(workersRef, where("carduid", "==", numericId));
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const workerData = querySnapshot.docs[0].data();
            latestNameElement.textContent = workerData.name || 'No encontrado';
            latestLastnameElement.textContent = workerData.lastname || 'No encontrado';
            latestAreaElement.textContent = workerData.area || 'No encontrado';
        } else {
            latestNameElement.textContent = 'No encontrado';
            latestLastnameElement.textContent = 'No encontrado';
            latestAreaElement.textContent = 'No encontrado';
        }
    } catch (error) {
        console.error("Error al buscar el trabajador:", error);
        latestNameElement.textContent = 'Error';
        latestLastnameElement.textContent = 'Error';
        latestAreaElement.textContent = 'Error';
    }
}


// Escuchar lecturas de Firestore en la colección readings_rfid
const lecturasRef = collection(db, 'readings_rfid');
let initialLoad = true;

onSnapshot(lecturasRef, (snapshot) => {
    if (initialLoad) {
        updateLatestRead(null);  // Esto mostrará "Esperando tarjeta..." al cargar la página
        initialLoad = false;
    } else {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const newReading = change.doc.data();
                updateLatestRead(newReading.id);
            }
        });
    }
});
document.getElementById('download-csv').addEventListener('click', async () => {
    try {
        const workersRef = collection(db, 'workers'); // Referencia a la colección workers
        const querySnapshot = await getDocs(workersRef); // Obtener los documentos

        // Crea el contenido del CSV
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "ID,Nombre,Apellido,UID,Área\n";  // Encabezado del CSV

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            csvContent += `${doc.id},${data.name},${data.lastname},${data.carduid},${data.area}\n`;  // Reemplaza según tus campos
        });

        // Crear un enlace de descarga
        const now = new Date();
        const options = { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedDate = now.toLocaleString('es-AR', options).replace(/[/]/g, '-').replace(/:/g, '-'); // Formato: DD-MM-YYYY_HH-MM-SS
        const filename = `workers_report_${formattedDate}.csv`; // Nombre del archivo
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename); // Usar el nuevo nombre con fecha y hora
       
        document.body.appendChild(link);
        link.click();  // Dispara la descarga
    } catch (error) {
        console.error("Error al obtener los datos de Firestore:", error);
    }
});