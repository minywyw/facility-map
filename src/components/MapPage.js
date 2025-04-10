import React, { useState, useRef } from "react";
import MapComponent from "./MapComponent";
import CategoryButtons from "./CategoryButtons";
import hospitals from "../data/병원.json";
import shelters from "../data/대피소.json";
import FacilityCardList from "./FacilityCardList";

const MapPage = () => {
  const [selectedFacilityId, setSelectedFacilityId] = useState(null); // 클릭된 시설 ID
  const [isCardListVisible, setIsCardListVisible] = useState(true); // 카드 보이기 여부
  const cardRefs = useRef({});

  // 병원, 대피소에 고유 ID와 type 추가
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

  // 병원 + 대피소 통합 목록
  const facilities = [...hospitalsWithType, ...sheltersWithType];

  // 마커 클릭 시: 선택 시설 ID 설정 + 카드 다시 보이게 + 스크롤 이동
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
    <div style={{ display: "flex" }}>
      {/* 지도 영역 */}
      <div style={{ flex: 1 }}>
        <CategoryButtons />
        <MapComponent facilities={facilities} onMarkerClick={handleMarkerClick} />
      </div>

      {/* 상세정보 카드 리스트 영역 */}
      <FacilityCardList
        facilities={facilities}
        selectedFacilityId={selectedFacilityId}
        onCloseCard={() => setSelectedFacilityId(null)}
        cardRefs={cardRefs}
        isVisible={isCardListVisible}
        setIsVisible={setIsCardListVisible}
      />
    </div>
  );
};

export default MapPage;