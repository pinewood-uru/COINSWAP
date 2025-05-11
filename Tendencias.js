const listatendencia = document.getElementById("listadotendencia");

// Función para obtener el listado de monedas de la API
function obtenerMonedas() {
    fetch("https://api.coinpaprika.com/v1/tickers")
      .then(response => response.json())
      .then(data => {
        // Filtrar las monedas por rango (rank) del 1 al 4
        const monedasFiltradas = data.filter(moneda => moneda.rank >= 1 && moneda.rank <= 4);
  
        // Limpiar el contenedor
        listatendencia.innerHTML = "";
         
        // Imprimir cada una de las monedas filtradas en el contenedor
        monedasFiltradas.forEach(coin => {
          listatendencia.innerHTML += `
        <li>
        <strong>#${coin.rank}</strong>
        <p>${coin.name}</p>
        <small>Valor en USD: ${coin.quotes.USD.price.toFixed(2)}</small>
         </li>`
        });
      })
      .catch(error => console.log(error));
  }
  
  // Llamar a la función para obtener y mostrar las monedas
  obtenerMonedas();