import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MapPage from "./components/MapPage"; // 모든 시설 보기
import HospitalPage from "./components/HospitalPage"; // 병원 모아보기
import ShelterPage from "./components/ShelterPage"; // 대피소 모아보기
import SliderComponent from "./components/Slider"; // 지도 슬라이더

function App() {
  return (
    <Router>
      <div>
        <SliderComponent /> {/* 모든 페이지에 슬라이더 표시 */}
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/hospital" element={<HospitalPage />} />
          <Route path="/shelter" element={<ShelterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;