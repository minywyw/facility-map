import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CategoryButtons from "./CategoryButtons";
import MapComponent from "./MapComponent";
import FacilityCardList from "./FacilityCardList";
import SliderComponent from "./Slider";

const HospitalPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [isCardListVisible, setIsCardListVisible] = useState(true);
  const cardRefs = useRef({});

  // 병원 데이터 API에서 로드
  useEffect(() => {
    axios
      .get("http://localhost:8000/places?category=병원")
      .then((res) => {
        const hospitalsWithType = res.data.map((h) => ({
          ...h,
          type: "병원",
          builtYear:h.built_year ,
          id: `hospital_${h.id}`,
        }));
        setFacilities(hospitalsWithType);
      })
      .catch((err) => {
        console.error("병원 데이터를 불러오는 데 실패했어요", err);
      });
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
      <SliderComponent /> {/* 슬라이더 */}
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