import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MemberRoutes from "./routes/MemberRoutes.jsx";
import ScrollToTop from "./ScrollToTop.js";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalLoader from "./components/GlobalLoader.jsx";
import DummyHome from "./member/DummyHomePage.jsx";

function App() {

  return (
    <>
      <GlobalLoader />

      <Router>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<DummyHome />} />
          {/* Member Routes */}
          <Route path="/member/*" element={<MemberRoutes />} />
        </Routes>

      </Router>
    </>

  );
}

export default App;