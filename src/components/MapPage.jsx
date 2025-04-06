import React, { useState, useRef } from "react";
import MapComponent from "./MapComponent";
import CategoryButtons from "./CategoryButtons";
import hospitals from "../data/병원.json";
import shelters from "../data/대피소.json";
import DetailCard from "./DetailCard";

const MapPage = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [isCardListVisible, setIsCardListVisible] = useState(true); // 카드 보이기 여부
  const cardRefs = useRef({});

  // 병원, 대피소 데이터에 고유 ID 부여
  const hospitalsWithType = hospitals.map((h) => ({
    ...h,
    type: "병원",
    id: `hospital_${h.id}`,
  }));

  const sheltersWithType = shelters.map((s) => ({
    ...s,
    type: "대피소",
    id: `shelter_${s.id}`,
  }));

  const facilities = [...hospitalsWithType, ...sheltersWithType];

  const handleMarkerClick = (facility) => {
    setSelectedFacilityId(facility.id);
    setIsCardListVisible(true); // 마커 클릭 시 카드 다시 열기

    setTimeout(() => {
      cardRefs.current[facility.id]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* 지도 영역 */}
      <div style={{ flex: 1 }}>
        <CategoryButtons />
        <MapComponent facilities={facilities} onMarkerClick={handleMarkerClick} />
      </div>

      {/* 카드 리스트 영역 */}
      {isCardListVisible ? (
        <div
          style={{
            width: "30%",
            padding: "1rem",
            backgroundColor: "#f8f8f8",
            height: "100vh",
            overflowY: "auto",
            position: "relative",
          }}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={() => setIsCardListVisible(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
            }}
            aria-label="카드 리스트 닫기"
          >
            X
          </button>

          {facilities.map((facility) => (
            <div
              key={facility.id}
              ref={(el) => (cardRefs.current[facility.id] = el)}
            >
              <DetailCard
                facility={facility}
                isSelected={facility.id === selectedFacilityId}
                onClose={() => setSelectedFacilityId(null)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            width: "30px",
            height: "100vh",
            backgroundColor: "#f8f8f8",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* 다시 열기 버튼 */}
          <button
            onClick={() => setIsCardListVisible(true)}
            style={{
              fontSize: "18px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
            aria-label="카드 리스트 열기"
          >
            {`<`}
          </button>
        </div>
      )}
    </div>
  );
};

export default MapPage;
