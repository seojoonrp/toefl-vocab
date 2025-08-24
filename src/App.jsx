import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import PracticePage from "./pages/PracticePage";
import TestPage from "./pages/TestPage";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/practice" element={<PracticePage />} />
      <Route path="/test" element={<TestPage />} />
    </Routes>
  </Router>
);

export default App;
