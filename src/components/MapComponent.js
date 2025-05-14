import React, { useEffect, useRef, useState } from "react";

const MapComponent = ({ facilities, onMarkerClick }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const overlaysRef = useRef([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 1. 카카오맵 스크립트 로드
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setIsMapLoaded(true);
    } else {
      const script = document.createElement("script");
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=3ffa9c0dd348e5aacd7d3c618ac9654e&autoload=false";
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => setIsMapLoaded(true));
      };
      document.head.appendChild(script);
    }
  }, []);

  // 2. 맵 인스턴스 생성 (한 번)
  useEffect(() => {
    if (!isMapLoaded || mapRef.current) return;
    const { kakao } = window;
    const map = new kakao.maps.Map(mapContainerRef.current, {
      center: new kakao.maps.LatLng(37.613, 127.005),
      level: 5,
    });
    mapRef.current = map;
  }, [isMapLoaded]);

  // 3. facilities 변경 시 마커 및 오버레이 갱신
  useEffect(() => {
    if (!mapRef.current) return;
    const { kakao } = window;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    // 기존 오버레이 제거
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    // 새 마커 및 오버레이 생성
    facilities.forEach((facility) => {
      const position = new kakao.maps.LatLng(facility.lat, facility.lng);
      // 원래 마커 아이콘 사용
      const markerIcon = new kakao.maps.MarkerImage(
        facility.type === "병원"
          ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
          : "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
        new kakao.maps.Size(32, 32),
        new kakao.maps.Point(16, 32)
      );
      const marker = new kakao.maps.Marker({
        position,
        image: markerIcon,
        map: mapRef.current,
      });
      kakao.maps.event.addListener(marker, "click", () => {
        onMarkerClick(facility);
      });
      markersRef.current.push(marker);

      // 운영 중이 아닌 경우 ❌ 오버레이
      if (facility.status !== "운영 중") {
        const overlayContent = `
          <div style="
            color: red;
            font-weight: bold;
            font-size: 20px;
            transform: translate(-50%, -100%);
          ">❌</div>`;
        const overlay = new kakao.maps.CustomOverlay({
          position,
          content: overlayContent,
          map: mapRef.current,
          yAnchor: 1,
        });
        overlaysRef.current.push(overlay);
      }
    });
  }, [facilities, onMarkerClick]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* 지도 */}
      <div
        ref={mapContainerRef}
        id="map"
        style={{ width: "100%", height: "85%" }}
      ></div>

      {/* 범례 (상단 좌측) */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 100,
          fontSize: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <img
            src="https://maps.google.com/mapfiles/ms/icons/green-dot.png"
            alt="병원"
            width="20"
          />
          병원
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "4px",
          }}
        >
          <img
            src="https://maps.google.com/mapfiles/ms/icons/orange-dot.png"
            alt="대피소"
            width="20"
          />
          대피소
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "4px",
          }}
        >
          <span style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}>
            ❌
          </span>
          운영 중 아님
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
