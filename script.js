// ===============================
// FIREBASE
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyDro83v9wZNYfY9N5NzrJH4eKrfDo1cVeM",
  authDomain: "maquina-rifas-new.firebaseapp.com",
  databaseURL: "https://maquina-rifas-new-default-rtdb.firebaseio.com",
  projectId: "maquina-rifas-new",
  storageBucket: "maquina-rifas-new.appspot.com",
  messagingSenderId: "14102154747",
  appId: "1:14102154747:web:6ef2e73ec068a062aacf5e",
  measurementId: "G-64E3WC679C"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Firestore
const db = firebase.firestore();

// Storage (para imágenes y archivos binarios)
const storage = firebase.storage();

console.log("🔥 Firebase conectado");

document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // VISTA PREVIA DE IMAGEN (solo admin)
  // ===============================
  const imagenInput = document.getElementById("imagenProducto");
  const preview = document.getElementById("preview");

  if (imagenInput) {
    imagenInput.addEventListener("change", (e) => {
      const archivo = e.target.files[0];
      if (!archivo) {
        preview.innerHTML = `<p style="color:#666;">No hay imagen seleccionada</p>`;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        preview.innerHTML = `
          <img src="${reader.result}" 
               alt="Imagen seleccionada" 
               class="preview-image"
               style="width:220px;border-radius:10px;display:block;margin:10px auto;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
          <p style="text-align:center;color:#28a745;font-weight:600;">
            ✅ Imagen cargada correctamente
          </p>
        `;
        setTimeout(() => {
          const mensaje = preview.querySelector("p");
          if (mensaje) mensaje.remove();
        }, 3000);
      };
      reader.readAsDataURL(archivo);
    });
  }

  // ===============================
  // GUARDAR RIFA REAL (admin)
  // ===============================
  const guardarBtn = document.getElementById("guardarRifa");

  if (guardarBtn) {
    guardarBtn.addEventListener("click", async () => {
      try {
        const nombre = document.getElementById("nombreProducto").value;
        const precio = document.getElementById("precioNumero").value;
        const totalBoletos = document.getElementById("totalBoletos").value;
        const valorPremio = document.getElementById("valorPremio").value;
        const descripcion = document.getElementById("descripcionPremio").value;
        const archivo = imagenInput.files[0];

        if (nombre === "" || precio === "" || totalBoletos === "") {
          alert("⚠️ Completa todos los campos");
          return;
        }
        if (!archivo) {
          alert("⚠️ Debes subir una imagen");
          return;
        }

        const nombreArchivo = Date.now() + "_" + archivo.name;
        const referencia = storage.ref("rifas/" + nombreArchivo);

        await referencia.put(archivo);
        const imagenURL = await referencia.getDownloadURL();

        console.log("🖼️ Imagen subida a Storage");

        const nuevaRifa = await db.collection("rifas").add({
          nombre: nombre,
          precio: Number(precio),
          totalBoletos: Number(totalBoletos),
          valorPremio: Number(valorPremio),
          descripcion: descripcion,
          imagen: imagenURL,
          estado: "activa",
          fecha: new Date()
        });

        console.log("🎟️ Rifa creada en Firestore");

        for (let i = 1; i <= totalBoletos; i++) {
          await db.collection("boletos").add({
            numero: i,
            estado: "disponible",
            rifaId: nuevaRifa.id,
            usuario: null,
            fecha: new Date()
          });
        }

        document.getElementById("nombreProducto").value = "";
        document.getElementById("precioNumero").value = "";
        document.getElementById("totalBoletos").value = "";
        document.getElementById("valorPremio").value = "";
        document.getElementById("descripcionPremio").value = "";
        imagenInput.value = "";
        preview.innerHTML = `<p style="color:#666;">No hay imagen seleccionada</p>`;

        cargarRifas();

        alert("🎉 Rifa y boletos creados correctamente");
      } catch (error) {
        console.error(error);
        alert("❌ Error al guardar la rifa");
      }
    });
  }

  // ===============================
  // MOSTRAR RIFAS DESDE FIREBASE (usuarios)
  // ===============================
  const contenedorRifas = document.getElementById("rifas");

  async function cargarRifas() {
    try {
      const snapshot = await db.collection("rifas").orderBy("fecha", "desc").get();
      contenedorRifas.innerHTML = `<h2>🎲 Rifas Guardadas</h2>`;

      if (snapshot.empty) {
        contenedorRifas.innerHTML += "<p style='color:#999;'>No hay rifas publicadas aún.</p>";
        return;
      }

      snapshot.forEach(doc => {
        const rifa = doc.data();
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-rifa");

        tarjeta.innerHTML = `
          <img src="${rifa.imagen}" class="imagen-rifa">
          <h3>${rifa.nombre}</h3>
          <p>💵 Precio: $${rifa
