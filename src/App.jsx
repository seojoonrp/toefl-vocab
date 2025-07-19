import wordData from "./data/wordData.js";
import WeekCard from "./components/WeekCard.jsx";
import "./styles/styles.css";

const App = () => {
  const words = wordData();

  const weeks = [...new Set(words.map((word) => word.week))].sort(
    (a, b) => b - a
  );

  return (
    <div className="main-wrapper">
      {weeks.map((week) => (
        <WeekCard key={week} week={week} />
      ))}
    </div>
  );
};

export default App;
