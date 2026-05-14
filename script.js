<main>
  <section class="upload">
    <label for="imagenProducto">Sube la imagen del producto:</label>
    <input type="file" id="imagenProducto" accept="image/*">
    <div id="preview"></div>
    <input type="text" id="nombreProducto" placeholder="Nombre del producto">
    <input type="number" id="precioNumero" placeholder="Precio por número">
    <button id="guardarRifa">Guardar Rifa</button>
  </section>

  <section class="config">
    <h2>Selecciona tipo de rifa</h2>
    <div class="botones">
      <button onclick="generarCuadricula(10)">Rifa de 10</button>
      <button onclick="generarCuadricula(20)">Rifa de 20</button>
      <button onclick="generarCuadricula(30)">Rifa de 30</button>
      <button onclick="generarCuadricula(40)">Rifa de 40</button>
      <button onclick="generarCuadricula(100)">Rifa de 100</button>
    </div>
  </section>

  <section id="cuadricula" class="grid">
    <!-- Aquí se mostrarán los números -->
  </section>
</main>

<footer>
  <button id="finalizar" onclick="finalizarRifa()">Finalizar Rifa</button>
</footer>

