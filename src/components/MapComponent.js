import React, { useEffect, useRef, useState } from "react";

const MapComponent = ({ facilities, onMarkerClick }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); // 지도 인스턴스 저장
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 카카오맵 동적으로 로드
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setIsMapLoaded(true);
    } else {
      const script = document.createElement("script");
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=3ffa9c0dd348e5aacd7d3c618ac9654e&autoload=false";
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => {
          setIsMapLoaded(true);
        });
      };
      document.head.appendChild(script);
    }
  }, []);

  // 지도 인스턴스 생성 & 재생성 방지
  useEffect(() => {
    if (!isMapLoaded || mapRef.current) return;

    const { kakao } = window;
    const map = new kakao.maps.Map(mapContainerRef.current, {
      center: new kakao.maps.LatLng(37.613, 127.005), // 정릉3동 좌표
      level: 5,
    });

    mapRef.current = map;
  }, [isMapLoaded]);

  // 시설 목록(facilities) 받아서 지도에 마커 표시
  useEffect(() => {
    if (!isMapLoaded || !facilities || facilities.length === 0) return;

    const { kakao } = window;
    const map = mapRef.current;
    if (!map) return;

    facilities.forEach((facility) => {
      const markerPosition = new kakao.maps.LatLng(facility.lat, facility.lng);
      const markerIcon = new kakao.maps.MarkerImage(
        facility.type === "병원"
          ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
          : "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
        new kakao.maps.Size(32, 32),
        new kakao.maps.Point(16, 32)
      );

      const mapMarker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerIcon,
      });

      // 마커 클릭 시 부모로 선택된 시설 정보 전달
      kakao.maps.event.addListener(mapMarker, "click", () => {
        onMarkerClick(facility);
      });

      mapMarker.setMap(map); // 마커를 지도에 표시
    });
  }, [isMapLoaded, facilities, onMarkerClick]);

  if (!isMapLoaded) return <div>지도를 불러오는 중...</div>;

  // 지도를 그릴 영역
  return <div ref={mapContainerRef} id="map" style={{ width: "100%", height: "100vh" }}></div>;
};

export default MapComponent;
