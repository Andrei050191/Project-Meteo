const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function getCurrentWeather(city) {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&units=metric&lang=ro&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Orașul nu a fost găsit");
  }

  return response.json();
}

export async function getForecast(city) {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&units=metric&lang=ro&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Nu pot obține prognoza");
  }

  return response.json();
}
