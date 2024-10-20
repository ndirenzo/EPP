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

let currentPage = 1;
const rowsPerPage = 5;

// Cargar datos de la colección "workers"
async function loadWorkers() {
    const list = document.getElementById("workersList");
    const workersCollection = collection(db, "workers");
    const querySnapshot = await getDocs(workersCollection);
    
    // Limpiar la lista anterior
    list.innerHTML = '';
    
    // Iterar sobre cada trabajador
    for (const doc of querySnapshot.docs) {
        const data = doc.data();
        
        // Crear el elemento de fila
        const listItem = document.createElement("tr");
        listItem.innerHTML = `<td>${data.name}</td><td>${data.lastname}</td><td>${data.carduid}</td><td>${data.area}</td>`;
        list.appendChild(listItem);
    }
    displayPage(1); // Mostrar la primera página después de cargar los datos
}

// Mostrar solo las filas de la página actual
function displayPage(page) {
    const rows = document.querySelectorAll("#workersTable tbody tr");
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    // Validar que la página esté dentro de los límites
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    currentPage = page;

    // Ocultar todas las filas
    rows.forEach((row, index) => {
        row.style.display = "none"; // Ocultar todas las filas por defecto
        if (index >= (page - 1) * rowsPerPage && index < page * rowsPerPage) {
            row.style.display = ""; // Mostrar solo las filas de la página actual
        }
    });

    // Actualizar los controles de paginación
    displayPaginationControls(totalPages);
}

function displayPaginationControls(totalPages) {
    const paginationControls = document.getElementById("paginationControls");
    paginationControls.innerHTML = "";

    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.innerText = "Anterior";
        prevButton.addEventListener("click", () => displayPage(currentPage - 1));
        paginationControls.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.innerText = i;
        pageButton.addEventListener("click", () => displayPage(i));
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        paginationControls.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.innerText = "Siguiente";
        nextButton.addEventListener("click", () => displayPage(currentPage + 1));
        paginationControls.appendChild(nextButton);
    }
}

document.getElementById("searchInput").addEventListener("input", filterWorkers);

function filterWorkers() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#workersTable tbody tr");

    rows.forEach(row => {
        const name = row.cells[0].innerText.toLowerCase();
        const lastname = row.cells[1].innerText.toLowerCase();
        const cardUID = row.cells[2].innerText.toLowerCase();
        const area = row.cells[3].innerText.toLowerCase();

        if (name.includes(searchInput) || lastname.includes(searchInput) || cardUID.includes(searchInput) || area.includes(searchInput)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Manejador del clic en el botón para mostrar/ocultar la tabla
document.getElementById("showTableButton").addEventListener("click", () => {
    const table = document.getElementById("workersTable");
    if (table.style.display === "none") {
        table.style.display = "table"; // Mostrar la tabla
        document.getElementById("showTableButton").innerText = "Ocultar Lista de Usuarios"; // Cambiar texto del botón
    } else {
        table.style.display = "none"; // Ocultar la tabla
        document.getElementById("showTableButton").innerText = "Mostrar Lista de Usuarios"; // Cambiar texto del botón
    }
});

// Función para actualizar el ID más reciente
async function updateLatestRead(id) {
    const latestIdElement = document.getElementById('latestId');
    const latestNameElement = document.getElementById('latestName');
    const latestLastnameElement = document.getElementById('latestLastname');
    const latestAreaElement = document.getElementById('latestArea');

    latestIdElement.textContent = id;
    
    try {
        const numericId = Number(id);
        const workersRef = collection(db, 'workers');
        const q = query(workersRef, where("carduid", "==", numericId));
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const workerData = querySnapshot.docs[0].data();
            latestNameElement.textContent = workerData.name || '-';
            latestLastnameElement.textContent = workerData.lastname || '-';
            latestAreaElement.textContent = workerData.area || '-';
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
onSnapshot(lecturasRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const newReading = change.doc.data();
            updateLatestRead(newReading.id);
        }
    });
});