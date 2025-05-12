import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MapPage from "./components/MapPage"; // 모든 시설 보기
import HospitalPage from "./components/HospitalPage"; // 병원 모아보기
import ShelterPage from "./components/ShelterPage"; // 대피소 모아보기
import StatisticsPage from "./components/StatisticsPage"; // 통계 보기

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/hospital" element={<HospitalPage />} />
          <Route path="/shelter" element={<ShelterPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;