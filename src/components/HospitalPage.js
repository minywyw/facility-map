import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CategoryButtons from "./CategoryButtons";
import MapComponent from "./MapComponent";
import FacilityCardList from "./FacilityCardList";
import StatisticsChart from "./StatisticsChart";

const HospitalPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [isCardListVisible, setIsCardListVisible] = useState(true);
  const [createdStats, setCreatedStats] = useState([]);
  const [operatingStats, setOperatingStats] = useState([]);
  const cardRefs = useRef({});

  useEffect(() => {
    axios
      .get("http://localhost:8000/places/병원")
      .then((res) => {
        const hospitalsWithType = res.data.map((h) => ({
          ...h,
          type: "병원",
          id: `hospital_${h.id}`,
        }));
        setFacilities(hospitalsWithType);

        // 연도별 병원 설립 수 계산
        const yearMap = {};
        hospitalsWithType.forEach((h) => {
          const year = h.builtYear;
          if (year) {
            yearMap[year] = (yearMap[year] || 0) + 1;
          }
        });
        const stats = Object.entries(yearMap)
          .map(([year, count]) => ({ year: Number(year), count }))
          .sort((a, b) => a.year - b.year);
        setCreatedStats(stats);

        // 연도별 운영 중 병원 누적 수 계산
        const operatingHospitals = hospitalsWithType.filter(
          (h) => h.status === "운영 중" && h.builtYear
        );
        const cumulativeMap = {};
        operatingHospitals.forEach((h) => {
          const year = h.builtYear;
          cumulativeMap[year] = (cumulativeMap[year] || 0) + 1;
        });

        // 누적값 계산
        const sortedYears = Object.keys(cumulativeMap)
          .map(Number)
          .sort((a, b) => a - b);

        let cumulative = 0;
        const cumulativeStats = sortedYears.map((year) => {
          cumulative += cumulativeMap[year];
          return { year, count: cumulative };
        });

        setOperatingStats(cumulativeStats);
      })
      .catch((err) => {
        console.error("병원 데이터를 불러오는 데 실패했어요", err);
      });
  }, []);

  const handleMarkerClick = (facility) => {
    setSelectedFacilityId(facility.id);
    setIsCardListVisible(true);
    setTimeout(() => {
      cardRefs.current[facility.id]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* 상단 지도 + 카드 리스트 */}
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <CategoryButtons />
          <MapComponent
            facilities={facilities}
            onMarkerClick={handleMarkerClick}
          />
        </div>
        <FacilityCardList
          facilities={facilities}
          selectedFacilityId={selectedFacilityId}
          onCloseCard={() => setSelectedFacilityId(null)}
          cardRefs={cardRefs}
          isVisible={isCardListVisible}
          setIsVisible={setIsCardListVisible}
        />
      </div>

      {/* 하단 통계 차트 */}
      <div style={{ width: "100%", padding: "2rem", display: "flex", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
          <StatisticsChart
            title="✔️ 연도별 병원 설립 수"
            data={createdStats}
            dataKey="count"
            fillColor="#A3C9A8"
          />
        </div>
        <div style={{ flex: 1 }}>
          <StatisticsChart
            title="✔️ 운영 중인 병원 누적 수"
            data={operatingStats}
            dataKey="count"
            fillColor="#B0C4DE"
          />
        </div>
      </div>
    </div>
  );
};

export default HospitalPage;