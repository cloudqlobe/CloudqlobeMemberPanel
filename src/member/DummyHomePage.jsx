import { useNavigate } from "react-router-dom";

const DummyHome = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h1>Welcome to Member Portal</h1>
      <p>This is a dummy home page</p>

      <button
        onClick={() => navigate("/member/signin")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Go to Login
      </button>
    </div>
  );
};

export default DummyHome;
