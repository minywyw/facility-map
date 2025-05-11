import { Link, useLocation } from "react-router-dom";

const CategoryButtons = () => {
  const location = useLocation();
  const selectedPath = location.pathname;

  const mainCategories = [
    { path: "/", label: "정릉3동 보기" },
    { path: "/hospital", label: "병원 모아보기" },
    { path: "/shelter", label: "대피소 모아보기" },
  ];

  const statsCategory = { path: "/statistics", label: "통계 보기" };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "white",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      {mainCategories.map(({ path, label }) => (
        <Link key={path} to={path}>
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
      <span style={{ margin: "0 0.5rem", color: "#ccc" }}>|</span>
      <Link to={statsCategory.path}>
        <button
          style={{
            backgroundColor: selectedPath === statsCategory.path ? "#4CAF50" : "#f1f1f1",
            color: selectedPath === statsCategory.path ? "#fff" : "#000",
            border: "1px solid #ccc",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
          }}
        >
          {statsCategory.label}
        </button>
      </Link>
    </div>
  );
};

export default CategoryButtons;