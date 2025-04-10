const DetailCard = ({ facility, isSelected }) => {
  if (!facility) return null;

  return (
    <div
      style={{
        marginBottom: "1rem",
        padding: "1rem",
        border: isSelected ? "2px solid #4CAF50" : "1px solid #ccc", // 선택 여부에 따라 테두리 색상 변경
        borderRadius: "8px",
        backgroundColor: isSelected ? "#e8f5e9" : "#fff", // 선택 시 연두색 배경
        transition: "all 0.3s", // 전환 효과
      }}
    >
      <h3 style={{ marginTop: 0 }}>{facility.name}</h3>
      <p>상태: {facility.status}</p>

      {/* 유형에 따라 다른 정보 출력 */}
      {facility.type === "병원" && (
        <p>설립 연도: {facility.builtYear}년</p>
      )}
      {facility.type === "대피소" && (
        <p>수용 인원: {facility.capacity}명</p>
      )}
    </div>
  );
};

export default DetailCard;