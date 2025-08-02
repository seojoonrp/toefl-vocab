import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import useWordData from "../hooks/useWordData";
import WeekCard from "../components/WeekCard.jsx";
import "../styles/styles.css";
import ArrowImage from "../assets/images/arrow.svg";

const HomeScreen = () => {
  const navigate = useNavigate();

  const words = useWordData();

  const [testWordCount, setTestWordCount] = useState(30);
  const [testLanguage, setTestLanguage] = useState("e_from_k");
  const [testMode, setTestMode] = useState("practice");

  const weeks = [...new Set(words.map((word) => word.week))].sort(
    (a, b) => b - a
  );

  const handleStartTest = () => {
    if (testMode === "test") {
      navigate("/test", {
        state: { testWordCount, testLanguage, words },
      });
    } else {
      navigate("/practice", {
        state: { testWordCount, testLanguage, words },
      });
    }
  };

  return (
    <div className="main-wrapper">
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

        <div className="test-language-wrapper">
          <button
            className="test-language-button"
            onClick={() => setTestLanguage("e_from_k")}
            style={{
              backgroundColor: testLanguage === "e_from_k" ? "var(--blue)" : "",
              color: testLanguage === "e_from_k" ? "white" : "",
            }}
          >
            Guess English from Korean
          </button>
          <button
            className="test-language-button"
            onClick={() => setTestLanguage("k_from_e")}
            style={{
              backgroundColor: testLanguage === "k_from_e" ? "var(--blue)" : "",
              color: testLanguage === "k_from_e" ? "white" : "",
            }}
          >
            Guess Korean from English
          </button>
        </div>

        <div className="test-mode-wrapper">
          <button
            className="test-language-button"
            onClick={() => setTestMode("practice")}
            style={{
              backgroundColor: testMode === "practice" ? "var(--blue)" : "",
              color: testMode === "practice" ? "white" : "",
            }}
          >
            Practice Mode
          </button>
          <button
            className="test-language-button"
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

      {weeks.map((week) => (
        <WeekCard key={week} week={week} words={words} />
      ))}
    </div>
  );
};

export default HomeScreen;
