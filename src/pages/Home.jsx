import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentWeather, getForecast } from "../services/weatherApi";
import {
  addFavorite,
  removeFavorite,
  getFavorites
} from "../firebase/favoritesService";

function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // încarcă favoritele la pornire
  useEffect(() => {
    async function loadFavorites() {
      const data = await getFavorites();
      setFavorites(data);
    }
    loadFavorites();
  }, []);

  const handleSearch = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      const current = await getCurrentWeather(city);
      const forecastData = await getForecast(city);

      setWeather(current);

      // o prognoză pe zi (din 3h în 3h)
      const daily = forecastData.list.filter(
        (_, index) => index % 8 === 0
      );
      setForecast(daily);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!weather) return;

    const cityId = `${weather.name}_${weather.sys.country}`;
    const exists = favorites.find((f) => f.id === cityId);

    if (exists) {
      await removeFavorite(cityId);
    } else {
      await addFavorite({
        id: cityId,
        name: weather.name,
        country: weather.sys.country
      });
    }

    const updated = await getFavorites();
    setFavorites(updated);
  };

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <h2>🌦️ Meteo Moldova</h2>
      </div>

      {/* SEARCH */}
      <div className="search">
        <input
          type="text"
          placeholder="Introdu orașul (ex: Chisinau)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Caută</button>
      </div>

      {loading && <p>Se încarcă...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* WEATHER CARD */}
      {weather && (
        <div className="card">
          <h3>
            {weather.name} ({weather.sys.country})
          </h3>
          <p>🌡️ Temperatura: {weather.main.temp} °C</p>
          <p>☁️ Vreme: {weather.weather[0].description}</p>
          <p>💧 Umiditate: {weather.main.humidity}%</p>
          <p>🌬️ Vânt: {weather.wind.speed} m/s</p>

          <button
            className={`favorite-btn ${
              favorites.find(
                (f) =>
                  f.id === `${weather.name}_${weather.sys.country}`
              )
                ? "remove"
                : "add"
            }`}
            onClick={toggleFavorite}
          >
            {favorites.find(
              (f) =>
                f.id === `${weather.name}_${weather.sys.country}`
            )
              ? "❌ Elimină din favorite"
              : "⭐ Adaugă la favorite"}
          </button>
        </div>
      )}

      {/* FORECAST */}
      {forecast.length > 0 && (
        <div className="card">
          <h3>Prognoză următoarele zile</h3>
          <div className="forecast">
            {forecast.map((item) => (
              <div className="forecast-item" key={item.dt}>
                <p>
                  {new Date(item.dt * 1000).toLocaleDateString()}
                </p>
                <p>🌡️ {item.main.temp} °C</p>
                <p>{item.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAVORITES */}
      {favorites.length > 0 && (
        <div className="card favorites">
          <h3>⭐ Orașe favorite</h3>
          <ul>
            {favorites.map((city) => (
              <li
                key={city.id}
                onClick={() => navigate(`/city/${city.id}`)}
              >
                {city.name} ({city.country})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;
