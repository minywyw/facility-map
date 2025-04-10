import React, { useState, useEffect, useRef } from "react";
import CategoryButtons from "./CategoryButtons";
import MapComponent from "./MapComponent";
import shelters from "../data/대피소.json";
import FacilityCardList from "./FacilityCardList";

const ShelterPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [isCardListVisible, setIsCardListVisible] = useState(true);
  const cardRefs = useRef({});

  // 대피소 데이터 로드 (id와 type 추가)
  useEffect(() => {
    const sheltersWithType = shelters.map((s) => ({
      ...s,
      type: "대피소",
      id: `shelter_${s.id}`, // 고유 ID
    }));
    setFacilities(sheltersWithType);
  }, []);

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

export default ShelterPage;
