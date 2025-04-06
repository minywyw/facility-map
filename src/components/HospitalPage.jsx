import React, { useState, useEffect, useRef } from "react";
import CategoryButtons from "./CategoryButtons";
import MapComponent from "./MapComponent";
import hospitals from "../data/병원.json";
import DetailCard from "./DetailCard";

const HospitalPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [isCardListVisible, setIsCardListVisible] = useState(true);
  const cardRefs = useRef({});

  useEffect(() => {
    const hospitalsWithType = hospitals.map((h) => ({
      ...h,
      type: "병원",
      id: `hospital_${h.id}`, // 고유 ID
    }));
    setFacilities(hospitalsWithType);
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
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <CategoryButtons />
        <MapComponent facilities={facilities} onMarkerClick={handleMarkerClick} />
      </div>

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
          <button
            onClick={() => setIsCardListVisible(true)}
            style={{
              fontSize: "18px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {`<`}
          </button>
        </div>
      )}
    </div>
  );
};

export default HospitalPage;
