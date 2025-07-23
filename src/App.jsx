import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomeScreen from "./screens/HomeScreen.jsx";
import TestScreen from "./screens/TestScreen.jsx";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/test" element={<TestScreen />} />
    </Routes>
  </Router>
);

export default App;
