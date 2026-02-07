import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import {
  getFavorites,
  addFavorite,
  removeFavorite
} from "../firebase/favoritesService";

const API_KEY = "4d2631c6c6c4dffc5b233b2636f0ec33";

export default function Home() {
  const { dark, setDark } = useTheme();
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    refreshFavorites();
  }, []);

  const refreshFavorites = async () => {
    const data = await getFavorites();
    setFavorites(data);
  };

  const search = async () => {
  if (!city.trim()) return;

  setError("");
  setWeather(null);

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ro&appid=${API_KEY}`
  );

  const data = await res.json();

  if (data.cod !== 200) {
    setError("❌ Orașul nu a fost găsit. Verifică denumirea.");
    return;
  }

  setWeather(data);
};


  const isFavorite = (id) => {
    return favorites.some((f) => f.id === id);
  };

  const toggleFavorite = async () => {
    if (!weather) return;

    const id = `${weather.name}_${weather.sys.country}`;

    if (isFavorite(id)) {
      await removeFavorite(id);
    } else {
      await addFavorite({
        id,
        name: weather.name,
        country: weather.sys.country
      });
    }

    await refreshFavorites();
  };

  return (
    <div className={dark ? "container dark" : "container"}>
      <h1>🌤 Weather Dashboard</h1>
      <button onClick={() => setDark(!dark)}>
         {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>
      
      <input
  value={city}
  onChange={(e) => setCity(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      search();
    }
  }}
  placeholder="Introdu orașul"
/>

      <button onClick={search}>Caută</button>
      {error && (
  <p style={{ color: "#dc2626", marginTop: 10 }}>
    {error}
  </p>
)}


      {weather && (
        <div className="weather-box">
  <h2>
    {weather.name} ({weather.sys.country})
  </h2>

  <p>🌡 Temperatură: {weather.main.temp} °C</p>
  <p>☁ Vreme: {weather.weather[0].description}</p>
  <p>💨 Viteză vânt: {weather.wind.speed} m/s</p>
  <p>🧭 Direcție vânt: {weather.wind.deg}°</p>
  <p>🔽 Presiune atmosferică: {weather.main.pressure} hPa</p>

  <button className="favorite-btn" onClick={toggleFavorite}>
    {isFavorite(`${weather.name}_${weather.sys.country}`)
      ? "❌ Remove favorite"
      : "⭐ Add favorite"}
  </button>

  <br />
  <Link className="link" to={`/city/${weather.name}`}>
    Vezi detalii →
  </Link>
</div>

      )}

      <div className="favorites">
        <h3>⭐ Favorite</h3>
        <ul>
          {favorites.map((f) => (
            <li key={f.id}>
  <Link
    className="link"
    to={`/city/${f.name}`}
    style={{ flex: 1 }}
  >
    {f.name} ({f.country})
  </Link>

  <button
    className="remove-btn"
    onClick={async (e) => {
      e.preventDefault();
      await removeFavorite(f.id);
      refreshFavorites();
    }}
  >
    ❌
  </button>
</li>

          ))}
        </ul>
      </div>
    </div>
  );
}
