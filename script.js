// ===============================
// MOSTRAR RIFAS DESDE FIREBASE (usuarios)
// ===============================

const contenedorRifas = document.getElementById("rifas");

async function cargarRifas() {
  try {
    const snapshot = await db.collection("rifas").orderBy("fecha", "desc").get();
    contenedorRifas.innerHTML = `<h2>🎲 Rifas Guardadas</h2>`;

    snapshot.forEach(doc => {
      const rifa = doc.data();
      const tarjeta = document.createElement("div");
      tarjeta.classList.add("tarjeta-rifa");

      tarjeta.innerHTML = `
        <img src="${rifa.imagen}" class="imagen-rifa">
        <h3>${rifa.nombre}</h3>
        <p>💵 Precio: $${rifa.precio}</p>
        <p>🎟️ Boletos: ${rifa.totalBoletos}</p>
        <p>🟢 Estado: ${rifa.estado}</p>
        <p>📦 Premio: $${rifa.valorPremio || 0}</p>
        <p>📝 ${rifa.descripcion || ""}</p>
        <button class="abrir-rifa">Participar</button>
      `;

      // Evento para abrir la rifa y mostrar boletos
      tarjeta.querySelector(".abrir-rifa").addEventListener("click", () => {
        mostrarBoletos(doc.id, rifa.totalBoletos);
      });

      contenedorRifas.appendChild(tarjeta);
    });
  } catch (error) {
    console.error(error);
    alert("❌ Error cargando rifas");
  }
}

// ===============================
// MOSTRAR BOLETOS DE UNA RIFA
// ===============================

async function mostrarBoletos(rifaId, totalBoletos) {
  const cuadricula = document.getElementById("cuadricula");
  cuadricula.innerHTML = "";

  try {
    const snapshot = await db.collection("boletos").where("rifaId", "==", rifaId).get();

    snapshot.forEach(doc => {
      const boleto = doc.data();
      const numero = document.createElement("div");
      numero.classList.add("boleto");
      numero.textContent = boleto.numero;

      // Estado visual
      if (boleto.estado === "ocupado") {
        numero.classList.add("ocupado"); // CSS: fondo rojo
      } else {
        numero.addEventListener("click", () => {
          numero.classList.toggle("seleccionado"); // CSS: fondo verde
        });
      }

      cuadricula.appendChild(numero);
    });

    alert("✅ Boletos cargados, selecciona tu número");
  } catch (error) {
    console.error(error);
    alert("❌ Error cargando boletos");
  }
}
