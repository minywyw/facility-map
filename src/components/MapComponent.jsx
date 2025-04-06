import React, { useEffect, useState } from "react";
import L from "leaflet";

const MapComponent = ({ facilities, onMarkerClick }) => {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setIsKakaoLoaded(true);
    } else {
      const script = document.createElement("script");
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_API_KEY&autoload=false";
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => {
          setIsKakaoLoaded(true);
        });
      };
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!isKakaoLoaded || !facilities || facilities.length === 0) return;

    const { kakao } = window;
    const container = document.getElementById("map");
    const map = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.613, 127.005),
      level: 5,
    });

    facilities.forEach((facility) => {
      const markerPosition = new kakao.maps.LatLng(facility.lat, facility.lng);
      const markerIcon = new kakao.maps.MarkerImage(
        facility.type === "병원" ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png" : "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
        new kakao.maps.Size(32, 32),
        new kakao.maps.Point(16, 32)
      );

      const mapMarker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerIcon,
      });

      kakao.maps.event.addListener(mapMarker, "click", () => {
        onMarkerClick(facility); // 클릭된 시설 정보를 부모에게 전달
      });

      mapMarker.setMap(map);
    });
  }, [isKakaoLoaded, facilities, onMarkerClick]);

  if (!isKakaoLoaded) return <div>지도를 불러오는 중...</div>;

  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
};

export default MapComponent; 
