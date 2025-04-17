import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './components/Login/LoginPage';
import AdminNavbar from "./components/Home/AdminNavbar";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AdminNavbar />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
