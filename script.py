const jugadores = [
  "Eduard Navas", "Tatan", "Juan Manuel", "Duvan Mendoza",
  "Dylan Camilo", "Dylan Castiblanco", "David Contreras", "Maicol Moreno",
  "Sebastian Osuna", "David Muñoz"
];

const stats = {};
jugadores.forEach(j => {
  stats[j] = { PJ: 0, PG: 0, PE: 0, PP: 0, GF: 0, GC: 0, DG: 0, Pts: 0 };
});

let j1 = "", j2 = "";

function elegirVersus() {
  const copia = [...jugadores];
  j1 = copia.splice(Math.floor(Math.random() * copia.length), 1)[0];
  j2 = copia.splice(Math.floor(Math.random() * copia.length), 1)[0];

  document.getElementById("resultado").innerText = `${j1} 🆚 ${j2}`;

  document.getElementById("ingresoGoles").innerHTML = `
    <label>${j1} Goles: <input type="number" id="gol1" min="0"></label>
    <label>${j2} Goles: <input type="number" id="gol2" min="0"></label>
    <br><br>
    <button onclick="guardarResultado()">Guardar Resultado</button>
  `;
}

function guardarResultado() {
  const g1 = parseInt(document.getElementById("gol1").value);
  const g2 = parseInt(document.getElementById("gol2").value);
  if (isNaN(g1) || isNaN(g2)) return alert("Debes ingresar ambos resultados");

  stats[j1].PJ++;
  stats[j2].PJ++;

  stats[j1].GF += g1;
  stats[j1].GC += g2;
  stats[j2].GF += g2;
  stats[j2].GC += g1;

  stats[j1].DG = stats[j1].GF - stats[j1].GC;
  stats[j2].DG = stats[j2].GF - stats[j2].GC;

  if (g1 > g2) {
    stats[j1].PG++;
    stats[j2].PP++;
    stats[j1].Pts += 3;
  } else if (g1 < g2) {
    stats[j2].PG++;
    stats[j1].PP++;
    stats[j2].Pts += 3;
  } else {
    stats[j1].PE++;
    stats[j2].PE++;
    stats[j1].Pts += 1;
    stats[j2].Pts += 1;
  }

  mostrarTabla();
  document.getElementById("ingresoGoles").innerHTML = "<strong>¡Resultado guardado!</strong>";
}

function mostrarTabla() {
  const cuerpo = document.getElementById("tabla-estadisticas");
  cuerpo.innerHTML = "";
  for (let jugador of jugadores) {
    const fila = stats[jugador];
    cuerpo.innerHTML += `
      <tr>
        <td>${jugador}</td>
        <td>${fila.PJ}</td><td>${fila.PG}</td><td>${fila.PE}</td><td>${fila.PP}</td>
        <td>${fila.GF}</td><td>${fila.GC}</td><td>${fila.DG}</td><td>${fila.Pts}</td>
      </tr>`;
  }
}

mostrarTabla();
