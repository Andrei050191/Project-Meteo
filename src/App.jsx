import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CityDetail from "./pages/CityDetail.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/city/:city" element={<CityDetail />} />
    </Routes>
  );
}
