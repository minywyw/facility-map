import { Link, useLocation } from "react-router-dom";

const CategoryButtons = () => {
   // 현재 주소 경로를 가져옴 (예: "/", "/hospital", "/shelter")
  const location = useLocation();
  const selectedPath = location.pathname;

  const categories = [
    { path: "/", label: "정릉3동 보기" },
    { path: "/hospital", label: "병원 모아보기" },
    { path: "/shelter", label: "대피소 모아보기" },
    { path: "/statistics", label: "통계 모아보기" }
  ];

  return (
    // 버튼 전체 박스 스타일: 상단 중앙 고정 + 배경/둥근 테두리
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        display: "flex",
        gap: "1rem",
        background: "white",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      {categories.map(({ path, label }) => (
        <Link to={path} key={path}>
          <button
            style={{
              backgroundColor: selectedPath === path ? "#4CAF50" : "#f1f1f1",
              color: selectedPath === path ? "#fff" : "#000",
              border: "1px solid #ccc",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
            }}
          >
            {label}
          </button>
        </Link>
      ))}
    </div>
  );
};

export default CategoryButtons;
