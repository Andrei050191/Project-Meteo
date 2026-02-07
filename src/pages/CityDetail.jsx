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

    // prognoză 5 zile
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ro&appid=${API_KEY}`
    )
      .then((r) => r.json())
      .then((res) => {
        const daily = res.list.filter((_, i) => i % 8 === 0);
        setForecast(daily);
      });
  }, [city]);

  if (!data) return <p className="container">Se încarcă...</p>;

  return (
    <div className="container">
      <Link className="link" to="/">⬅ Înapoi</Link>

      <h1>{data.name}</h1>
      <p>🌡 {data.main.temp} °C</p>
      <p>☁ {data.weather[0].description}</p>

      <h3>📅 Prognoză 5 zile</h3>

      {forecast.map((day) => (
        <div key={day.dt} className="weather-box">
          <strong>
            {new Date(day.dt * 1000).toLocaleDateString("ro-RO")}
          </strong>
          <p>🌡 {day.main.temp} °C</p>
          <p>☁ {day.weather[0].description}</p>
        </div>
      ))}
    </div>
  );
}
