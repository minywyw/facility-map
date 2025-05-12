import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CategoryButtons from "./CategoryButtons";
import MapComponent from "./MapComponent";
import FacilityCardList from "./FacilityCardList";
import StatisticsChart from "./StatisticsChart";

const ShelterPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [isCardListVisible, setIsCardListVisible] = useState(true);
  const [capacityStats, setCapacityStats] = useState([]);
  const [statusStats, setStatusStats] = useState([]);
  const cardRefs = useRef({});

  useEffect(() => {
    axios
      .get("http://localhost:8000/places?category=대피소")
      .then((res) => {
        const sheltersWithType = res.data.map((s) => ({
          ...s,
          type: "대피소",
          id: `shelter${s.id}`,
        }));
        setFacilities(sheltersWithType);

        // 수용 인원 구간별 통계 계산
        const capacityGroups = {
          "0–999": 0,
          "1000–2999": 0,
          "3000–5999": 0,
          "6000+": 0,
        };
        
        sheltersWithType.forEach((s) => {
          const cap = s.capacity;
          if (cap < 1000) capacityGroups["0–999"]++;
          else if (cap < 3000) capacityGroups["1000–2999"]++;
          else if (cap < 6000) capacityGroups["3000–5999"]++;
          else capacityGroups["6000+"]++;
        });
        const capacityStatsData = Object.entries(capacityGroups).map(
          ([range, count]) => ({ year: range, count })
        );
        setCapacityStats(capacityStatsData);

        // 상태값 통계 계산
        const statusMap = {};
        sheltersWithType.forEach((s) => {
          const status = s.status;
          statusMap[status] = (statusMap[status] || 0) + 1;
        });
        const statusStatsData = Object.entries(statusMap).map(
          ([status, count]) => ({ year: status, count })
        );
        setStatusStats(statusStatsData);
      })
      .catch((err) => {
        console.error("대피소 데이터를 불러오는 데 실패했어요", err);
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
            title="✔️ 수용 인원 구간별 대피소 수"
            data={capacityStats}
            dataKey="count"
            fillColor="#A3C9A8"
          />
        </div>
        <div style={{ flex: 1 }}>
          <StatisticsChart
            title="✔️ 운영 상태별 대피소 수"
            data={statusStats}
            dataKey="count"
            fillColor="#B0C4DE"
            type="pie"
          />
        </div>
      </div>
    </div>
  );
};

export default ShelterPage;