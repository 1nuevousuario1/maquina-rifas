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

guardarBtn.addEventListener("click", () => {

    const nombre = document.getElementById("nombreProducto").value;
    const precio = document.getElementById("precioNumero").value;

    if(nombre === "" || precio === "") {
        alert("Completa todos los campos");
        return;
    }

    alert("🎉 Rifa guardada correctamente");
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
