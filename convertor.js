// const currency = document.getElementById("currency");
// const montoinicial = document.getElementById("montoinicial");
// const monedacrypto = document.getElementById("monedas");
// const montofinal = document.getElementById("montofinal");
// const btnconvert = document.getElementById("btn-exchange");

btnconvert.addEventListener("click", convertor);

function convertor() {
  const selectedCurrency = currency.value;
  const initialAmount = montoinicial.value;
  const selectedCrypto = monedacrypto.value;

  // Validador: Verificar si se seleccionó una opción en el select currency
  if (selectedCurrency === "") {
    alert("Por favor, seleccione una opción en el campo 'Currency'.");
    return;
  }

  // Validador: Verificar si montoinicial no es 0 ni está vacío
  if (initialAmount === "" || parseFloat(initialAmount) === 0) {
    alert("Por favor, ingrese un monto inicial válido.");
    return;
  }

    // Validador: Verificar si montoinicial tiene max 4 unidades
    if (parseFloat(initialAmount) >= 9999 ){
        alert("Por favor, ingrese un monto inicial menor a 9999");
        return;
      }

  // Validador: Verificar si se seleccionó una opción en el select monedacrypto
  if (selectedCrypto === "") {
    
    alert("Por favor, seleccione una opción en el campo 'Moneda Crypto'.");
    return;
  }

  let reglade3 = (parseFloat(initialAmount) * parseFloat(selectedCurrency)) / parseFloat(selectedCrypto);

  reglade3 = reglade3.toFixed(3);

  montofinal.innerHTML = reglade3.toString() + "<br>" + monedacrypto.options[monedacrypto.selectedIndex].text;
  
  actualizarColorMontofinal()

}

// Color respuesta

function actualizarColorMontofinal() {
 
  const selectedCrypto = monedacrypto.value;

  fetch("https://api.coinpaprika.com/v1/tickers")
    .then((response) => response.json())
    .then((data) => {
      const cryptoData = data.find((coin) => coin.name === selectedCrypto);

      if (cryptoData && cryptoData.quotes && cryptoData.quotes.USD && cryptoData.quotes.USD.percent_change_24h) {
        const percentChange24h = cryptoData.quotes.USD.percent_change_24h;

        const montofinal = document.getElementById("montofinal");
        if (percentChange24h > 0) {
          montofinal.style.color = "green";
        } else {
          montofinal.style.color = "red";
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}


