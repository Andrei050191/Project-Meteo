import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_KEY = "4d2631c6c6c4dffc5b233b2636f0ec33";

export default function CityDetail() {
  const { city } = useParams();
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    // vreme curentă
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ro&appid=${API_KEY}`
    )
      .then((r) => r.json())
      .then(setData);

    // prognoză 5 zile – DETALII COMPLETE
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ro&appid=${API_KEY}`
    )
      .then((r) => r.json())
      .then((res) => {
        const days = {};

        res.list.forEach((item) => {
          const day = item.dt_txt.split(" ")[0];
          if (!days[day]) days[day] = [];
          days[day].push(item);
        });

        setForecast(Object.entries(days).slice(0, 5));
      });
  }, [city]);

  if (!data) return <p className="container">Se încarcă...</p>;

  return (
    <div className="container">
      <Link className="link" to="/">⬅ Înapoi</Link>

      <h1>{data.name}</h1>

      <p>🌡 Temperatură: {data.main.temp} °C</p>
      <p>🤒 Resimțită: {data.main.feels_like} °C</p>
      <p>☁ Vreme: {data.weather[0].description}</p>
      <p>💨 Viteză vânt: {data.wind.speed} m/s</p>
      <p>🧭 Direcție vânt: {data.wind.deg}°</p>
      <p>🔽 Presiune atmosferică: {data.main.pressure} hPa</p>
      <p>💧 Umiditate: {data.main.humidity}%</p>

      <h3>📅 Prognoză 5 zile (detalii complete)</h3>

      {forecast.map(([day, items]) => (
        <div key={day} className="weather-box">
          <strong>
            {new Date(day).toLocaleDateString("ro-RO")}
          </strong>

          {items.map((i) => (
            <p key={i.dt}>
              🕒 {i.dt_txt.split(" ")[1]} | 🌡 {i.main.temp}°C | 💨{" "}
              {i.wind.speed} m/s | 🧭 {i.wind.deg}° | 🔽{" "}
              {i.main.pressure} hPa | ☁ {i.weather[0].description}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
