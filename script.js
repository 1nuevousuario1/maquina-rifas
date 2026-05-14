function generarCuadricula(cantidad) {
  const contenedor = document.getElementById("cuadricula");
  contenedor.innerHTML = "";
  for (let i = 1; i <= cantidad; i++) {
    const div = document.createElement("div");
    div.classList.add("numero");
    div.textContent = i;
    div.addEventListener("click", () => div.classList.toggle("seleccionado"));
    contenedor.appendChild(div);
  }
}

document.getElementById("imagenProducto").addEventListener("change", function(e) {
  const preview = document.getElementById("preview");
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function() {
    preview.innerHTML = `<img src="${reader.result}" alt="Producto" style="width:200px;border-radius:10px;">`;
  };
  reader.readAsDataURL(file);
});

function finalizarRifa() {
  const seleccionados = document.querySelectorAll(".numero.seleccionado");
  const numeros = Array.from(seleccionados).map(n => n.textContent);
  alert(`Rifa finalizada con números: ${numeros.join(", ")}`);
}
