body {
  font-family: 'Inter', sans-serif;
  background: #f9f9f9;
  text-align: center;
  margin: 0;
  padding: 0;
}

header {
  background: #0078d7;
  color: white;
  padding: 20px;
}

.upload, .config {
  margin: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 5px;
  justify-content: center;
  margin: 20px;
}

.numero {
  background: #fff;
  border: 2px solid #0078d7;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.numero.seleccionado {
  background: #0078d7;
  color: white;
}

#finalizar {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}
