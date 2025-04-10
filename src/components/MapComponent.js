import React, { useEffect, useRef, useState } from "react";

const MapComponent = ({ facilities, onMarkerClick }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); // 지도 인스턴스 저장
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 카카오맵 동적 로딩
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

  // 지도 생성 (최초 한 번)
  useEffect(() => {
    if (!isMapLoaded || mapRef.current) return;

    const { kakao } = window;
    const map = new kakao.maps.Map(mapContainerRef.current, {
      center: new kakao.maps.LatLng(37.613, 127.005),
      level: 5,
    });

    mapRef.current = map;
  }, [isMapLoaded]);

  // 마커 표시
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

      kakao.maps.event.addListener(mapMarker, "click", () => {
        onMarkerClick(facility);
      });

      mapMarker.setMap(map);

      // 운영 중이 아닌 경우 ❌ 오버레이 표시
      if (facility.status !== "운영 중") {
        const overlayContent = `
          <div style="
            color: red;
            font-weight: bold;
            font-size: 20px;
            transform: translate(-50%, -100%);
          ">❌</div>
        `;

        const overlay = new kakao.maps.CustomOverlay({
          position: markerPosition,
          content: overlayContent,
          yAnchor: 1,
        });

        overlay.setMap(map);
      }
    });
  }, [isMapLoaded, facilities, onMarkerClick]);

  if (!isMapLoaded) return <div>지도를 불러오는 중...</div>;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* 지도 */}
      <div ref={mapContainerRef} id="map" style={{ width: "100%", height: "100%" }}></div>

      {/* 범례 - 좌측 상단 */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
          zIndex: 10,
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        <strong>범례</strong>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
          <img src="https://maps.google.com/mapfiles/ms/icons/green-dot.png" alt="병원" width="20" />
          병원
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
          <img src="https://maps.google.com/mapfiles/ms/icons/orange-dot.png" alt="대피소" width="20" />
          대피소
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
          <span style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}>❌</span>
          운영 중 아님
        </div>
      </div>
    </div>
  );
};

export default MapComponent;