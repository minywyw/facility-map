import { Link, useLocation } from "react-router-dom";

const CategoryButtons = () => {
  const location = useLocation(); // 현재 경로 정보 가져오기
  const selectedPath = location.pathname;

  return (
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
      <Link to="/">
        <button
          style={{
            backgroundColor: selectedPath === "/" ? "#4CAF50" : "#f1f1f1",
            color: selectedPath === "/" ? "#fff" : "#000",
            border: "1px solid #ccc",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
          }}
        >
          정릉3동 모아보기
        </button>
      </Link>

      <Link to="/hospital">
        <button
          style={{
            backgroundColor: selectedPath === "/hospital" ? "#4CAF50" : "#f1f1f1",
            color: selectedPath === "/hospital" ? "#fff" : "#000",
            border: "1px solid #ccc",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
          }}
        >
          병원 모아보기
        </button>
      </Link>

      <Link to="/shelter">
        <button
          style={{
            backgroundColor: selectedPath === "/shelter" ? "#4CAF50" : "#f1f1f1",
            color: selectedPath === "/shelter" ? "#fff" : "#000",
            border: "1px solid #ccc",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
          }}
        >
          대피소 모아보기
        </button>
      </Link>
    </div>
  );
};

export default CategoryButtons;
