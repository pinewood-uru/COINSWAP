function getCryptocurrencies() {
    return fetch('https://api.coinpaprika.com/v1/tickers')
      .then(response => response.json())
      .then(data => data.map(crypto => ({
        symbol: crypto.symbol,
        percent_change_24h: crypto.quotes.USD.percent_change_24h
      })))
      .catch(error => console.log(error));
  }
  
  function filterTop3Cryptocurrencies(cryptocurrencies) {
    return cryptocurrencies.sort((a, b) =>
      b.percent_change_24h - a.percent_change_24h
    ).slice(0, 3);
  }
  
  function displayCryptocurrencies(cryptocurrencies) {
    const contenedorRating = document.getElementById('contenedorating');
  
    cryptocurrencies.forEach((crypto, index) => {
      const div = document.createElement('div');
      div.classList.add('carousel-item');
      if (index === 0) {
        div.classList.add('active');
      }
  
      const strong = document.createElement('strong');
      strong.textContent = `--${crypto.rank} ${crypto.symbol} ⬆️ ${crypto.percent_change_24h.toFixed(1)}--`;
  
      div.appendChild(strong);
      contenedorRating.appendChild(div);
    });
  }
  
  // Uso de las funciones
  getCryptocurrencies()
    .then(cryptocurrencies => filterTop3Cryptocurrencies(cryptocurrencies))
    .then(top3Cryptocurrencies => displayCryptocurrencies(top3Cryptocurrencies));
  