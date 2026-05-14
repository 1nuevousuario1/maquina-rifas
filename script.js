// ===============================
// FIREBASE
// ===============================

const firebaseConfig = {

    apiKey: "AIzaSyCHlznxpY-pAtOd9fUrFfJTyM7x-ojbWbw",

    authDomain: "project-3481698b-9510-41-57c46.firebaseapp.com",

    projectId: "project-3481698b-9510-41-57c46",

    storageBucket: "project-3481698b-9510-41-57c46.firebasestorage.app",

    messagingSenderId: "799751399012",

    appId: "1:799751399012:web:a6dcd71aa98bce829de171",

    measurementId: "G-BW4GW5BJQQ"

};

// Inicializar Firebase

firebase.initializeApp(firebaseConfig);

// Firestore

const db = firebase.firestore();

// Storage

const storage = firebase.storage();

console.log("🔥 Firebase conectado");


// ===============================
// VISTA PREVIA DE IMAGEN
// ===============================

const imagenInput = document.getElementById("imagenProducto");

const preview = document.getElementById("preview");

imagenInput.addEventListener("change", function(e) {

    const archivo = e.target.files[0];

    if (!archivo) return;

    const imagenURL = URL.createObjectURL(archivo);

    preview.innerHTML = `
        <img src="${imagenURL}" class="preview-image">
    `;
});


// ===============================
// GUARDAR RIFA
// ===============================

const guardarBtn = document.getElementById("guardarRifa");

guardarBtn.addEventListener("click", async () => {

    const nombre = document.getElementById("nombreProducto").value;

    const precio = document.getElementById("precioNumero").value;

    const archivo = imagenInput.files[0];

    // Validaciones

    if(nombre === "" || precio === "") {

        alert("Completa todos los campos");

        return;
    }

    if(!archivo) {

        alert("Sube una imagen");

        return;
    }

    try {

        // ===============================
        // SUBIR IMAGEN A FIREBASE STORAGE
        // ===============================

        const nombreArchivo = Date.now() + "_" + archivo.name;

        const referencia = storage.ref("rifas/" + nombreArchivo);

        await referencia.put(archivo);

        // Obtener URL

        const imagenURL = await referencia.getDownloadURL();

        // ===============================
        // GUARDAR EN FIRESTORE
        // ===============================

        await db.collection("rifas").add({

            nombre: nombre,

            precio: precio,

            imagen: imagenURL,

            fecha: new Date()

        });

        alert("🎉 Rifa guardada en Firebase");

        console.log("✅ Rifa guardada");

    } catch(error) {

        console.error(error);

        alert("❌ Error al guardar rifa");
    }

});


// ===============================
// GENERAR CUADRÍCULA
// ===============================

const cuadricula = document.getElementById("cuadricula");

function generarCuadricula(cantidad) {

    cuadricula.innerHTML = "";

    for(let i = 1; i <= cantidad; i++) {

        const numero = document.createElement("div");

        numero.classList.add("boleto");

        numero.textContent = i;

        numero.addEventListener("click", () => {

            numero.classList.toggle("seleccionado");

        });

        cuadricula.appendChild(numero);
    }
}


// ===============================
// FINALIZAR RIFA
// ===============================

function finalizarRifa() {

    const seleccionados = document.querySelectorAll(".boleto.seleccionado");

    let numeros = [];

    seleccionados.forEach(boleto => {

        numeros.push(boleto.textContent);

    });

    if(numeros.length === 0) {

        alert("No seleccionaste números");

        return;
    }

    alert("🎟️ Números seleccionados: " + numeros.join(", "));
}
