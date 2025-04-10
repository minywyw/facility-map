import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import MapComponent from "./MapComponent";
import CategoryButtons from "./CategoryButtons";
import FacilityCardList from "./FacilityCardList";

const MapPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null); // 클릭된 시설 ID
  const [isCardListVisible, setIsCardListVisible] = useState(true); // 카드 보이기 여부
  const cardRefs = useRef({});

  // 시설 각각 API에서 로드 후 병합
  useEffect(() => {
    const fetchHospitals = axios.get("http://localhost:8000/places/병원");
    const fetchShelters = axios.get("http://localhost:8000/places/대피소");
  
    Promise.all([fetchHospitals, fetchShelters])
      .then(([res1, res2]) => {
        const hospitals = res1.data.map((f) => ({
          ...f,
          type: "병원",
          id: `hospital_${f.id}`,
        }));
        const shelters = res2.data.map((f) => ({
          ...f,
          type: "대피소",
          id: `shelter_${f.id}`,
        }));
  
        setFacilities([...hospitals, ...shelters]);
      })
      .catch((err) => {
        console.error("전체 시설 데이터를 불러오지 못했어요", err);
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