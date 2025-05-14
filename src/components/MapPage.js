import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import MapComponent from "./MapComponent";
import CategoryButtons from "./CategoryButtons";
import FacilityCardList from "./FacilityCardList";
import SliderComponent from "./Slider";

const MapPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [isCardListVisible, setIsCardListVisible] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2025);
  const cardRefs = useRef({});

  useEffect(() => {
    const fetchHospitals = axios.get("http://localhost:8000/places?category=병원");
    const fetchShelters = axios.get("http://localhost:8000/places?category=대피소");

    Promise.all([fetchHospitals, fetchShelters])
      .then(([res1, res2]) => {
        const hospitals = res1.data.map((f) => ({
          ...f,
          type: "병원",
          builtYear: f.built_year,
          id: `hospital_${f.id}`
        }));

        const shelters = res2.data.map((f) => ({
          ...f,
          type: "대피소",
          builtYear: f.built_year,
          id: `shelter_${f.id}`
        }));

        setFacilities([...hospitals, ...shelters]);
      })
      .catch((err) => {
        console.error("전체 시설 데이터를 불러오지 못했어요", err);
      });
  }, []);

  const handleMarkerClick = (facility) => {
    setSelectedFacilityId(facility.id);
    setIsCardListVisible(true);

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

export default MapPage;
