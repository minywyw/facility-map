import React, { useState, useEffect, useRef } from "react";
import CategoryButtons from "./CategoryButtons";
import MapComponent from "./MapComponent";
import hospitals from "../data/병원.json";
import FacilityCardList from "./FacilityCardList";

const HospitalPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [isCardListVisible, setIsCardListVisible] = useState(true);
  const cardRefs = useRef({});

  // 병원 데이터 로드 (id와 type 추가)
  useEffect(() => {
    const hospitalsWithType = hospitals.map((h) => ({
      ...h,
      type: "병원",
      id: `hospital_${h.id}`, // 고유 ID
    }));
    setFacilities(hospitalsWithType);
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

export default HospitalPage;
