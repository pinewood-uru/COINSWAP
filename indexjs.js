// ELEMENTOS --
const nav = document.getElementById("navmain");
const nombrenav = document.getElementById("nombreusuario");

const btnburger = document.getElementById("btn-burger");

const exchange = document.getElementById("exchange");
const tendencia = document.getElementById("monedatendencia");
const spinner = document.getElementById("spinner");
const modal = document.getElementById("accountmodal");
const contblur = document.getElementById("blur");
const btn_invert = document.getElementById("btn-invert");


const currency = document.getElementById("currency");
const montoinicial = document.getElementById("montoinicial");
const monedacrypto = document.getElementById("monedas");
const montofinal = document.getElementById("montofinal");
const btnconvert = document.getElementById("btn-exchange");


const contenedordate = document.getElementById("contenedorhist");
const selectcryptodate = document.getElementById("cryptodate");
const btndate = document.getElementById("btndate");
const cryptodate = document.getElementById("cryptodate");
const date = document.getElementById("date");
const valorcryptodate = document.getElementById("valorcryptodate");

const contenedorgrafico = document.getElementById("contenedorgraficas");
const convertChart = document.getElementById("chart")
const chartitle = document.getElementById("cryptocharttitle");

const footer = document.getElementById("footer");
const contenedorating = document.getElementById("contenedorating");

// CONTENEDORES

// KEY ----

const currencyUrl = "https://api.getgeoapi.com/v2/currency";
const currencyApiKey = "71cbeb036b0bb2c54f83eb0f23e1125c68cef093";

// EVENTOS

nav.addEventListener("click", openmodal);

//   modal

function openmodal() {
  modal.style.display = "block";
  contblur.style.display = "block";

  let closemodal = document.getElementById("cerrarmodal");
  closemodal.addEventListener("click", cerrarmodal);

  function cerrarmodal() {
    modal.style.display = "none";
    contblur.style.display = "none";
    nav.disabled
    nav.style.display = "block";
    exchange.style.display = "block";
    tendencia.style.display = "block";
    contenedordate.style.display = "block";


    let inputname = document.getElementById("validationCustom01");
    inputname = inputname.value;

    nombrenav.innerHTML = inputname;

    
  }
}

// FUNIONES --

iniciarapp();
function iniciarapp() {
  setTimeout(loading, 4000);
  precargarValores();
  agregarEventos();
  
}

// spinner

function loading() {spinner.style.display="none";
  const listaContenedores = [nav, btnburger, exchange, tendencia, contenedordate, contenedorgrafico, footer];

  listaContenedores.forEach(elemento => {
    if (elemento) {
      elemento.classList.add('block');
    }
  });
}

function precargarValores() {
  precargarListaMonedas();
  precargarListacrypto();
}

// FILTRO DE MONEDAS
function filtrarMoneda(moneda) {

  // Si deseo agregar una moneda, la ingreso al array por su denominacion en la documentacion de getgeoapi

  const monedasDeseadas = ["USD"];
  return monedasDeseadas.includes(moneda);
}

function precargarListaMonedas() {
  const params = {
    api_key: currencyApiKey,
  };

  fetch(buildUrl(`${currencyUrl}/list`, params))
    .then(apiToJson)
    .then((jsonResponse) => {
      console.log("currency list", jsonResponse);

      if (jsonResponse.status === "success") {
        // Filtrar el listado de monedas
        const monedasFiltradas = Object.keys(jsonResponse.currencies).filter(
          filtrarMoneda
        );

        escribirHtmlListaMonedas(monedasFiltradas);
      } else {
        console.log("error api", jsonResponse.error);
      }
    })
    .catch(mostrarError)
    .finally(() => {ocultarLoading();
      desbloquearFormConvert()

    });
}

function escribirHtmlListaMonedas(listaMonedas) {
  let selectOptionsHtml = `<option value=""></option>`;

  for (let currencyCode of listaMonedas) {

    // El valor de USD es 1 ya que el valor en coinpaprika esta en USD

    selectOptionsHtml += `<option value="${1}">${currencyCode}</option>`;
  }

  currency.innerHTML = selectOptionsHtml;
}

// Agregar eventos
function agregarEventos() {
  
  document
  .querySelector("#formConvert")
  .addEventListener("submit", handleFormConvertSubmit);

document
  .querySelector("#btn-invert")
  .addEventListener("click", invertirMonedas);
}

function invertirMonedas(event) {
  event.preventDefault();
  
  const currencyValue = currency.innerHTML;
  const monedacryptoValue = monedacrypto.innerHTML;
  
  currency.innerHTML = monedacryptoValue;
  monedacrypto.innerHTML = currencyValue;
}

function handleFormConvertSubmit(event) {
  event.preventDefault();
  console.log("submit form", event);

  const data = obtenerDatosFormConvert();
  const sonDatosValidos = validarDatos(data);

  if (sonDatosValidos) {
    ultimaBusqueda = data;
    console.log(data);

    mostrarLoading();
    ocultarErrorUsuario();
    convertirMonedas(data);
  }
}

// PAPRIKA ---------------------------

function precargarListacrypto() {
  fetch("https://api.coinpaprika.com/v1/tickers")
    .then((response) => response.json())
    .then((data) => {
      console.log("crypto list", data);

      // Filtro por id de las primeras 25 monedas
      const filteredCoins = data.slice(0, 25);

      escribirHtmlListaCrypto(filteredCoins);
    })
    .catch((error) => {
      console.error("Error:", error)
      mostrarError();
    })
    .finally(() => {
      ocultarLoading()
      desbloquearFormConvert()
    });
}

function escribirHtmlListaCrypto(listaCrypto) {
  let selectOptionsHtml2 = `<option value=""></option>`;

  listaCrypto.forEach((coin) => {
    const price = coin.quotes.USD.price;
    const percentChange24h = coin.quotes.USD.percent_change_24h;
    const color = percentChange24h >= 0 ? 'greenyellow' : 'tomato';

    selectOptionsHtml2 += `<option value="${price.toFixed(3)}" style="color:${color}">${
      coin.name
    }</option>`;
  });

  monedacrypto.innerHTML = selectOptionsHtml2;
  selectcryptodate.innerHTML = selectOptionsHtml2;
}

// Add events
function agregarEventoscrypto() {
  document
    .querySelector("#formConvert")
    .addEventListener("submit", handleFormConvertSubmit2);
}

function handleFormConvertSubmit2(event) {
  event.preventDefault();
  console.log("submit form", event);

  const datacrypto = obtenerDatosFormConvert();
  const sonDatosValidos = validarDatos(datacrypto);

  if (sonDatosValidos) {
    ultimaBusqueda = datacrypto;
    console.log(datacrypto);

    mostrarLoading();
    ocultarErrorUsuario();
    convertirMonedas(datacrypto);
  }
}

// CARGAR LISTAS

function buildUrl(url, params) {
  const urlObj = new URL(url);

  if (params !== undefined) {
    urlObj.search = new URLSearchParams(params).toString();
  }

  // console.log(urlObj);
  return urlObj;
}

function apiToJson(rawResponse) {
  console.log("rawResponse", rawResponse);
  return rawResponse.json();
}

// FUNCIONALES

function mostrarError(error) {
  console.warn("error", error);
  mostrarErrorUsuario("Hubo un error en la consulta");
}

function bloquearFormConvert() {
  currency.setAttribute("disabled", true);
  monedacrypto.setAttribute("disabled", true);
  btnconvert.setAttribute("disabled", true);
}

function desbloquearFormConvert() {
  currency.removeAttribute("disabled");
  monedacrypto.removeAttribute("disabled");
  btnconvert.removeAttribute("disabled");
}

function mostrarLoading() {
  setTimeout(loading, 4000);

}

function ocultarLoading() {

}

function mostrarErrorUsuario(mensaje) {
  document.querySelector("#errorUsuario").classList.remove("none");
  document.querySelector("#errorUsuario").innerHTML = mensaje;
}

function ocultarErrorUsuario() {
  document.querySelector("#errorUsuario").classList.add("none");
}



