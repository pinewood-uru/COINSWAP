// CHARTconst contenedorgrafico = document.getElementById("contenedorgraficas");
// const convertChart = document.getElementById("chart")
// const chartitle = document.getElementById("cryptocharttitle");

// const btndate = document.getElementById("btndate");
// const cryptodate = document.getElementById("cryptodate");
// const date = document.getElementById("date");
// const valorcryptodate = document.getElementById("valorcryptodate");

// Evento para el botón de búsqueda
date.addEventListener("click", handleHistoricoMonedas);

// Función para manejar la búsqueda del histórico de conversiones
function handleHistoricoMonedas(event) {
  event.preventDefault();

  const data = {
    date: date.value,
    selectcryptodate: valorcryptodate.value,
  };

  if (validarDatos(data)) {
    convertirRangoMonedas(data);
  }
}

// Función para validar los datos del formulario
function validarDatos(data) {
  if (date === ""){
    mostrarErrorUsuario("La fecha no puede ser vacía");
    return false;
  }
  if (valorcryptodate === "" || valorcryptodate === undefined) {
    mostrarErrorUsuario("Selecciona una cryptomoneda");
    return false;
  }

  return true;
}

// Función para convertir el rango de monedas
function convertirRangoMonedas(data) {
  const params = {
    apikey: historicalApiKey,
    date_from: modificarFecha(data.date, -15),
    date_to: data.date,
    base_currency: data.selectcryptodate,
    currencies: "USD",
  };

  fetch(buildUrl(historicalUrl, params))
    .then(apiToJson)
    .then((rangoResponse) => {
      handleRangoMonedas(rangoResponse, data);
    })
    .catch(mostrarError)
    .finally(
    ocultarLoading(),
    desbloquearFormConvert());
}

// Función para manejar la respuesta del rango de monedas
function handleRangoMonedas(rangoResponse, data) {
  if (rangoResponse.errors === undefined) {
    crearGraficaHistorico(rangoResponse.data, data);
  } else {
    mostrarErrorGrafica(rangoResponse.errors);
  }
}

// Función para modificar una fecha dada por un número de días
function modificarFecha(fecha, deltaDias) {
  const date = new Date(fecha);
  date.setDate(date.getDate() + deltaDias);
  return date.toISOString().split("T")[0];
}

// Función para crear la gráfica de rango histórico
function crearGraficaHistorico(historico, busqueda) {
  if (graficaRangoHistorico !== undefined) {
    graficaRangoHistorico.destroy();
  }

  const fechas = [];
  const valores = [];

  for (const fecha in historico) {
    fechas.push(fecha);
    valores.push(historico[fecha].USD);
  }

  const ctx = convertChart.getContext("2d");
  graficaRangoHistorico = new Chart(ctx, {
    type: "line",
    data: {
      labels: fechas,
      datasets: [
        {
          label: `${busqueda.selectcryptodate} a USD`,
          data: valores,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          display: true,
        },
        y: {
          display: true,
          beginAtZero: true,
        },
      },
    },
  });
}


