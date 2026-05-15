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

// Storage

const storage = firebase.storage();

console.log("🔥 Firebase conectado");


// ===============================
// VISTA PREVIA DE IMAGEN
// ===============================

const imagenInput =
document.getElementById("imagenProducto");

const preview =
document.getElementById("preview");

imagenInput.addEventListener("change", (e) => {

    const archivo = e.target.files[0];

    if (!archivo) {

        preview.innerHTML = `
            <p style="color:#666;">
                No hay imagen seleccionada
            </p>
        `;

        return;
    }

    // Crear URL local

    const imagenURL =
    URL.createObjectURL(archivo);

    // Crear imagen

    const img =
    document.createElement("img");

    img.src = imagenURL;

    img.classList.add("preview-image");

    // Limpiar preview

    preview.innerHTML = "";

    // Insertar imagen

    preview.appendChild(img);

    console.log("🖼️ Imagen seleccionada");

});


// ===============================
// GUARDAR RIFA REAL
// ===============================

const guardarBtn =
document.getElementById("guardarRifa");

guardarBtn.addEventListener("click", async () => {

    try {

        // ===============================
        // OBTENER DATOS
        // ===============================

        const nombre =
        document.getElementById("nombreProducto").value;

        const precio =
        document.getElementById("precioNumero").value;

        const totalBoletos =
        document.getElementById("totalBoletos").value;

        const valorPremio =
        document.getElementById("valorPremio").value;

        const descripcion =
        document.getElementById("descripcionPremio").value;

        const archivo =
        imagenInput.files[0];

        // ===============================
        // VALIDACIONES
        // ===============================

        if(
            nombre === "" ||
            precio === "" ||
            totalBoletos === ""
        ) {

            alert("⚠️ Completa todos los campos");

            return;
        }

        if(!archivo) {

            alert("⚠️ Debes subir una imagen");

            return;
        }

        // ===============================
        // SUBIR IMAGEN A FIREBASE STORAGE
        // ===============================

        const nombreArchivo =
        Date.now() + "_" + archivo.name;

        const referencia =
        storage.ref("rifas/" + nombreArchivo);

        // Subir archivo

        await referencia.put(archivo);

        // Obtener URL

        const imagenURL =
        await referencia.getDownloadURL();

        console.log("🖼️ Imagen subida");

        // ===============================
        // CREAR RIFA
        // ===============================

        const nuevaRifa =
        await db.collection("rifas").add({

            nombre: nombre,

            precio: Number(precio),

            totalBoletos: Number(totalBoletos),

            valorPremio: Number(valorPremio),

            descripcion: descripcion,

            imagen: imagenURL,

            estado: "activa",

            fecha: new Date()

        });

        console.log("🎟️ Rifa creada");

        // ===============================
        // CREAR BOLETOS
        // ===============================

        for(let i = 1; i <= totalBoletos; i++) {

            await db.collection("boletos").add({

                numero: i,

                estado: "disponible",

                rifaId: nuevaRifa.id,

                usuario: null,

                fecha: new Date()

            });

            console.log("🎫 Boleto creado:", i);

        }

        // ===============================
        // LIMPIAR FORMULARIO
        // ===============================

        document.getElementById("nombreProducto").value = "";

        document.getElementById("precioNumero").value = "";

        document.getElementById("totalBoletos").value = "";

        document.getElementById("valorPremio").value = "";

        document.getElementById("descripcionPremio").value = "";

        imagenInput.value = "";

        preview.innerHTML = `
            <p style="color:#666;">
                No hay imagen seleccionada
            </p>
        `;

        // ===============================
        // RECARGAR RIFAS
        // ===============================

        cargarRifas();

        // ===============================
        // MENSAJE FINAL
        // ===============================

        alert("🎉 Rifa y boletos creados correctamente");

        console.log("✅ Todo guardado en Firebase");

    } catch(error) {

        console.error(error);

        alert("❌ Error al guardar la rifa");

    }

});


// ===============================
// GENERAR CUADRÍCULA
// ===============================

const cuadricula =
document.getElementById("cuadricula");

function generarCuadricula(cantidad) {

    cuadricula.innerHTML = "";

    for(let i = 1; i <= cantidad; i++) {

        const numero =
        document.createElement("div");

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

    const seleccionados =
    document.querySelectorAll(".boleto.seleccionado");

    let numeros = [];

    seleccionados.forEach(boleto => {

        numeros.push(boleto.textContent);

    });

    if(numeros.length === 0) {

        alert("⚠️ No seleccionaste números");

        return;

    }

    alert(
        "🎟️ Números seleccionados: " +
        numeros.join(", ")
    );

}


// ===============================
// MOSTRAR RIFAS DESDE FIREBASE
// ===============================

const contenedorRifas =
document.getElementById("rifas");

async function cargarRifas() {

    try {

        // Obtener rifas

        const snapshot =
        await db.collection("rifas")
        .orderBy("fecha", "desc")
        .get();

        // Limpiar contenedor

        contenedorRifas.innerHTML = `
            <h2>🎲 Rifas Guardadas</h2>
        `;

        // Recorrer rifas

        snapshot.forEach(doc => {

            const rifa = doc.data();

            // Crear tarjeta

            const tarjeta =
            document.createElement("div");

            tarjeta.classList.add("tarjeta-rifa");

            tarjeta.innerHTML = `

                <img
                    src="${rifa.imagen}"
                    class="imagen-rifa"
                >

                <h3>${rifa.nombre}</h3>

                <p>
                    💵 Precio:
                    $${rifa.precio}
                </p>

                <p>
                    🎟️ Boletos:
                    ${rifa.totalBoletos}
                </p>

                <p>
                    🟢 Estado:
                    ${rifa.estado}
                </p>

                <p>
                    📦 Premio:
                    $${rifa.valorPremio || 0}
                </p>

                <p>
                    📝 ${rifa.descripcion || ""}
                </p>

            `;

            contenedorRifas.appendChild(tarjeta);

        });

    } catch(error) {

        console.error(error);

        alert("❌ Error cargando rifas");

    }

}

// Ejecutar automáticamente

cargarRifas();
