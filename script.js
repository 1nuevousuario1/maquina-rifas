// 📊 Generar cuadrícula con ocupados desde Firestore
function generarCuadricula(cantidad, ocupados = []) {
  const contenedor = document.getElementById("cuadricula");
  contenedor.innerHTML = "";
  for (let i = 1; i <= cantidad; i++) {
    const div = document.createElement("div");
    div.classList.add("numero");
    div.textContent = i;

    // Si el número está ocupado en Firestore → marcar verde
    if (ocupados.includes(i.toString())) {
      div.classList.add("ocupado");
    } else {
      div.addEventListener("click", () => div.classList.toggle("seleccionado"));
    }

    contenedor.appendChild(div);
  }
}

// 📷 Vista previa de imagen al seleccionar archivo
document.addEventListener("DOMContentLoaded", () => {
  const inputImagen = document.getElementById("imagenProducto");
  const preview = document.getElementById("preview");

  if (inputImagen && preview) {
    inputImagen.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        preview.innerHTML = `
         <img src="${data.imagenURL}" alt="${data.nombre}">

        `;
        setTimeout(() => {
          const mensaje = preview.querySelector("p");
          if (mensaje) mensaje.remove();
        }, 3000);
      };
      reader.readAsDataURL(file);
    });
  }
});

// 🔥 Firebase configuración
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDk...tu_api_key...",
  authDomain: "maquina-rifas.firebaseapp.com",
  projectId: "maquina-rifas",
  storageBucket: "maquina-rifas.appspot.com",
  messagingSenderId: "492909881871",
  appId: "1:492909881871:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 💾 Guardar rifa con imagen subida
document.getElementById("guardarRifa").addEventListener("click", async () => {
  const file = document.getElementById("imagenProducto").files[0];
  const nombre = document.getElementById("nombreProducto").value;
  const precio = document.getElementById("precioNumero").value;

  if (!file || !nombre || !precio) {
    alert("Completa todos los campos.");
    return;
  }

  // Subir imagen a Firebase Storage
  const storageRef = ref(storage, "productos/" + file.name);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  // Guardar datos en Firestore
  await addDoc(collection(db, "rifas"), {
    nombre: nombre,
    precio: parseFloat(precio),
    imagenURL: url,
    ocupados: []
  });

  alert("✅ Rifa guardada correctamente.");
  mostrarRifas();
});

// 🚀 Finalizar rifa → guardar ocupados en Firestore
async function finalizarRifa() {
  const seleccionados = document.querySelectorAll(".numero.seleccionado");
  const numeros = Array.from(seleccionados).map((n) => n.textContent);

  if (numeros.length === 0) {
    alert("Selecciona al menos un número.");
    return;
  }

  // Identificar la rifa activa (ejemplo: la última creada)
  const querySnapshot = await getDocs(collection(db, "rifas"));
  if (querySnapshot.empty) {
    alert("No hay rifas guardadas.");
    return;
  }

  // Tomamos la primera rifa como ejemplo
  const rifaDoc = querySnapshot.docs[0];
  const rifaRef = rifaDoc.ref;

  // Actualizamos el campo ocupados
  const data = rifaDoc.data();
  const nuevosOcupados = [...data.ocupados, ...numeros];

  await rifaRef.update({
    ocupados: nuevosOcupados,
  });

  alert(`Rifa actualizada con números ocupados: ${numeros.join(", ")}`);
  mostrarRifas();
}

// 📥 Mostrar rifas guardadas con ocupados
async function mostrarRifas() {
  const contenedor = document.getElementById("cuadricula");
  contenedor.innerHTML = "<p>Cargando rifas...</p>";
  const querySnapshot = await getDocs(collection(db, "rifas"));
  contenedor.innerHTML = "";
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // Mostrar tarjeta de la rifa
    contenedor.innerHTML += `
      <div class="rifa">
        <h2>${data.nombre}</h2>
        <img src="${data.imagenURL}" alt="${data.nombre}">
        <p>Precio por número: $${data.precio}</p>
      </div>
    `;
    // Generar cuadrícula con ocupados
    generarCuadricula(100, data.ocupados);
  });
}

