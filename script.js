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

// 🚀 Finalizar rifa → guardar ocupados en Firestore
async function finalizarRifa() {
  const seleccionados = document.querySelectorAll(".numero.seleccionado");
  const numeros = Array.from(seleccionados).map(n => n.textContent);

  if (numeros.length === 0) {
    alert("Selecciona al menos un número.");
    return;
  }

  // Aquí deberías identificar la rifa activa (ejemplo: la última creada)
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
    ocupados: nuevosOcupados
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
