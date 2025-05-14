import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CategoryButtons from "./CategoryButtons";
import MapComponent from "./MapComponent";
import FacilityCardList from "./FacilityCardList";
import SliderComponent from "./Slider";

const ShelterPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [isCardListVisible, setIsCardListVisible] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2025);
  const cardRefs = useRef({});

  useEffect(() => {
    axios
      .get("http://localhost:8000/places?category=대피소")
      .then((res) => {
        const sheltersWithType = res.data.map((s) => ({
          ...s,
          type: "대피소",
          builtYear: s.built_year,
          id: `shelter_${s.id}`
        }));
        setFacilities(sheltersWithType);
      })
      .catch((err) => {
        console.error("대피소 데이터를 불러오는 데 실패했어요", err);
      });
  }, []);

  const handleMarkerClick = (facility) => {
    setSelectedFacilityId(facility.id);
    setIsCardListVisible(true);
    // 카드 리스트로 스크롤
    setTimeout(() => {
      cardRefs.current[facility.id]?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  };

  const filteredFacilities = facilities.filter(
    (f) => f.builtYear <= selectedYear
  );

  return (
    <div style={{ display: "flex" }}>
      <SliderComponent
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <div style={{ flex: 1 }}>
        <CategoryButtons />
        <MapComponent
          facilities={filteredFacilities}
          onMarkerClick={handleMarkerClick}
        />
      </div>
      <FacilityCardList
        facilities={filteredFacilities}
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
