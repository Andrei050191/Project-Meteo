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

    // prognoză 5 zile – DOAR ZI / NOAPTE
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ro&appid=${API_KEY}`
    )
      .then((r) => r.json())
      .then((res) => {
        const days = {};

        res.list.forEach((item) => {
          const [date, time] = item.dt_txt.split(" ");
          if (!days[date]) {
            days[date] = { day: null, night: null };
          }

          // zi ≈ ora 12:00
          if (time === "12:00:00") {
            days[date].day = item;
          }

          // noapte ≈ ora 00:00
          if (time === "00:00:00") {
            days[date].night = item;
          }
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

      <h3>📅 Prognoză 5 zile (zi / noapte)</h3>

      {forecast.map(([day, values]) => (
        <div key={day} className="weather-box">
          <strong>
            {new Date(day).toLocaleDateString("ro-RO")}
          </strong>

          {values.day && (
            <p>
              ☀ Zi: {values.day.main.temp}°C | 💨{" "}
              {values.day.wind.speed} m/s | 🔽{" "}
              {values.day.main.pressure} hPa | ☁{" "}
              {values.day.weather[0].description}
            </p>
          )}

          {values.night && (
            <p>
              🌙 Noapte: {values.night.main.temp}°C | 💨{" "}
              {values.night.wind.speed} m/s | 🔽{" "}
              {values.night.main.pressure} hPa | ☁{" "}
              {values.night.weather[0].description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
