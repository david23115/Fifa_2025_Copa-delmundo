const jugadores = [
  "Eduard Navas", "Tatan", "Juan Manuel", "Duvan Mendoza",
  "Dylan Camilo", "Dylan Castiblanco", "David Contreras", "Maicol Moreno",
  "Sebastian Osuna", "David Muñoz"
];

let stats = {};
const datosGuardados = localStorage.getItem("estadisticasFIFA");

if (datosGuardados) {
  stats = JSON.parse(datosGuardados);
} else {
  reiniciarStats();
}

function reiniciarStats() {
  stats = {};
  jugadores.forEach(j => {
    stats[j] = { PJ: 0, PG: 0, PE: 0, PP: 0, GF: 0, GC: 0, DG: 0, Pts: 0 };
  });
}

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

  stats[j1].PJ++; stats[j2].PJ++;
  stats[j1].GF += g1; stats[j1].GC += g2;
  stats[j2].GF += g2; stats[j2].GC += g1;
  stats[j1].DG = stats[j1].GF - stats[j1].GC;
  stats[j2].DG = stats[j2].GF - stats[j2].GC;

  if (g1 > g2) {
    stats[j1].PG++; stats[j2].PP++; stats[j1].Pts += 3;
  } else if (g1 < g2) {
    stats[j2].PG++; stats[j1].PP++; stats[j2].Pts += 3;
  } else {
    stats[j1].PE++; stats[j2].PE++;
    stats[j1].Pts += 1; stats[j2].Pts += 1;
  }

  guardarEnLocalStorage();
  mostrarTabla();
  document.getElementById("ingresoGoles").innerHTML = "<strong>¡Resultado guardado!</strong>";
}

function guardarEnLocalStorage() {
  localStorage.setItem("estadisticasFIFA", JSON.stringify(stats));
}

function mostrarTabla() {
  const cuerpo = document.getElementById("tabla-estadisticas");
  cuerpo.innerHTML = "";

  const ordenado = Object.entries(stats).sort(([, a], [, b]) => {
    if (b.Pts === a.Pts) return b.DG - a.DG;
    return b.Pts - a.Pts;
  });

  ordenado.forEach(([jugador, fila]) => {
    cuerpo.innerHTML += `
      <tr>
        <td>${jugador}</td>
        <td>${fila.PJ}</td><td>${fila.PG}</td><td>${fila.PE}</td><td>${fila.PP}</td>
        <td>${fila.GF}</td><td>${fila.GC}</td><td>${fila.DG}</td><td>${fila.Pts}</td>
      </tr>`;
  });
}

function resetearCampeonato() {
  if (confirm("¿Estás seguro de reiniciar todo?")) {
    localStorage.removeItem("estadisticasFIFA");
    reiniciarStats();
    mostrarTabla();
    document.getElementById("resultado").innerText = "";
    document.getElementById("ingresoGoles").innerHTML = "";
  }
}

function exportarTabla() {
  let csv = "Jugador,PJ,PG,PE,PP,GF,GC,DG,Pts\\n";
  for (const [nombre, s] of Object.entries(stats)) {
    csv += `${nombre},${s.PJ},${s.PG},${s.PE},${s.PP},${s.GF},${s.GC},${s.DG},${s.Pts}\\n`;
  }

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'campeonato_fifa.csv';
  a.click();

  URL.revokeObjectURL(url);
}

let modoOscuro = true;
function cambiarTema() {
  const body = document.body;
  modoOscuro = !modoOscuro;

  if (!modoOscuro) {
    body.style.backgroundColor = '#f0f0f0';
    body.style.color = '#000';
    document.querySelector('.container').style.background = '#fff';
    document.querySelector('.container').style.boxShadow = '0 0 20px #666';
  } else {
    body.style.backgroundColor = '#1e1e2f';
    body.style.color = '#fff';
    document.querySelector('.container').style.background = '#2e2e4d';
    document.querySelector('.container').style.boxShadow = '0 0 20px #00ff88';
  }
}

mostrarTabla();
