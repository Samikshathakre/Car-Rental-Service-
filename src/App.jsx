import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './components/Login/LoginPage';
import Home from "./components/Customer_support/Customer_support";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home/*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
