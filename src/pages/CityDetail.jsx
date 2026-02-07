import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentWeather, getForecast } from "../services/weatherApi";

function CityDetail() {
  const { id } = useParams();
  const cityName = id.split("_")[0];

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const current = await getCurrentWeather(cityName);
        const forecastData = await getForecast(cityName);

        setWeather(current);
        const daily = forecastData.list.filter(
          (_, index) => index % 8 === 0
        );
        setForecast(daily);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [cityName]);

  if (loading) return <p>Se încarcă...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Detalii meteo – {cityName}</h2>

      {weather && (
        <>
          <p>🌡️ Temperatura: {weather.main.temp} °C</p>
          <p>☁️ Vreme: {weather.weather[0].description}</p>
          <p>💧 Umiditate: {weather.main.humidity}%</p>
          <p>🌬️ Vânt: {weather.wind.speed} m/s</p>
        </>
      )}

      {forecast.length > 0 && (
        <>
          <h3>Prognoză</h3>
          {forecast.map((item) => (
            <div key={item.dt}>
              <p>
                📅{" "}
                {new Date(item.dt * 1000).toLocaleDateString()}
              </p>
              <p>🌡️ {item.main.temp} °C</p>
              <p>☁️ {item.weather[0].description}</p>
              <hr />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default CityDetail;
