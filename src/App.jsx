import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomeScreen from "./screens/HomeScreen.jsx";
import TestScreen from "./screens/TestScreen.jsx";
import RealTestScreen from "./screens/RealTestScreen.jsx";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/practice" element={<TestScreen />} />
      <Route path="/test" element={<RealTestScreen />} />
    </Routes>
  </Router>
);

export default App;
