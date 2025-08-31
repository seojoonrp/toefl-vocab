import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/styles.css";
import useWordData from "../hooks/useWordData.js";
import WeekCard from "../components/WeekCard.jsx";
import WeekModal from "../components/WeekModal.jsx";
import ArrowImage from "../assets/images/arrow.svg";
import LoadingOverlay from "../components/LoadingOverlay.jsx";

const HomePage = () => {
  const navigate = useNavigate();

  const words = useWordData();

  const [testWordCount, setTestWordCount] = useState(40);
  const [testMode, setTestMode] = useState("practice");
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weeks = [...new Set(words.map((word) => word.week))].sort(
    (a, b) => b - a
  );

  const handleStartTest = () => {
    if (testMode === "test") {
      navigate("/test", {
        state: { testWordCount, words },
      });
    } else {
      navigate("/practice", {
        state: { testWordCount, words },
      });
    }
  };

  return (
    <div className="main-wrapper">
      {words.length === 0 && (
        <LoadingOverlay message="단어를 로딩중입니다..." />
      )}

      <div className="test-wrapper">
        <div className="test-words-wrapper">
          <span className="test-words-text">Words</span>
          <div className="test-words-counter-wrapper">
            <img
              src={ArrowImage}
              className="arrow-image reverse nondraggable"
              onClick={() => setTestWordCount(Math.max(testWordCount - 5, 5))}
            />
            <span className="test-words-counter-text">{testWordCount}</span>
            <img
              src={ArrowImage}
              className="arrow-image nondraggable"
              onClick={() =>
                setTestWordCount(
                  Math.min(testWordCount + 5, words.length - (words.length % 5))
                )
              }
            />
          </div>
        </div>

        <div className="test-mode-wrapper">
          <button
            className="test-mode-button"
            onClick={() => setTestMode("practice")}
            style={{
              backgroundColor: testMode === "practice" ? "var(--blue)" : "",
              color: testMode === "practice" ? "white" : "",
            }}
          >
            Practice Mode
          </button>
          <button
            className="test-mode-button"
            onClick={() => setTestMode("test")}
            style={{
              backgroundColor: testMode === "test" ? "var(--blue)" : "",
              color: testMode === "test" ? "white" : "",
            }}
          >
            Test Mode
          </button>
        </div>

        <button className="test-start-button" onClick={handleStartTest}>
          GO!
        </button>
      </div>

      <div className="weeks-wrapper">
        {weeks.map((week) => (
          <WeekCard
            key={week}
            week={week}
            words={words}
            setIsModalOpen={setIsModalOpen}
            setSelectedWeek={setSelectedWeek}
          />
        ))}
      </div>

      {isModalOpen && (
        <WeekModal
          week={selectedWeek}
          onClose={() => setIsModalOpen(false)}
          weekWords={words.filter((word) => word.week === selectedWeek)}
        />
      )}
    </div>
  );
};

export default HomePage;
