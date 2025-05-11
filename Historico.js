  // Obtener referencias a los elementos HTML
//  const btndate = document.getElementById("btndate");
//  const cryptodate = document.getElementById("cryptodate");
//  const date = document.getElementById("date");
//  const valorcryptodate = document.getElementById("valorcryptodate");


 btndate.addEventListener("click", obtenerValorCriptomoneda);

  // Función para obtener el valor de la criptomoneda seleccionada en la fecha 
 function obtenerValorCriptomoneda() {
   const selectedCryptocurrencyName = cryptodate.options[cryptodate.selectedIndex].text;

   const selectedCryptocurrency = cryptodate.value;
   const selectedDate = date.value;

    // Verificar si se seleccionó una criptomoneda y una fecha
   if (selectedCryptocurrency && selectedDate) {
     const apiUrl = "https://api.coinpaprika.com/v1/tickers";
   const params = {
     id: selectedCryptocurrency,
     start: selectedDate,
     interval: "1d",
     limit: 1,
   };
   const url = buildUrl(apiUrl, params);

   fetch(url)
     .then((response) => response.json())
     .then((data) => {
       // Verificar si se obtuvo un resultado válido
       if (data.length > 0 && data[0].quotes && data[0].quotes.USD && data[0].quotes.USD.price) {
         const cryptocurrencyValue = data[0].quotes.USD.price;
         valorcryptodate.textContent = "El valor " + "de " + 
         `${selectedCryptocurrencyName}` + " " + "en la fecha " + `${selectedDate}` + " es: " + cryptocurrencyValue.toFixed(2); + "USD";
       } else {
         valorcryptodate.textContent = "No se encontraron datos para la fecha seleccionada.";
       }
     })
     .catch((error) => {
       console.error("Error:", error);
       valorcryptodate.textContent = "Error al obtener el valor de la criptomoneda.";
     });
 } else {
   valorcryptodate.textContent = "Seleccione una criptomoneda y una fecha.";
 }
}

// // Función para construir la URL con los parámetros
 function buildUrl(url, params) {
 const urlObj = new URL(url);

 if (params !== undefined) {
   urlObj.search = new URLSearchParams(params).toString();
 }

 return urlObj.toString();
}

