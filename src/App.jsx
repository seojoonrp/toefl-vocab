import React, { useState } from "react";

import wordData from "./data/wordData.js";
import WeekCard from "./components/WeekCard.jsx";
import "./styles/styles.css";
import ArrowImage from "./assets/images/arrow.svg";

const App = () => {
  const words = wordData();

  const [testWordCount, setTestWordCount] = useState(30);
  const [testLanguage, setTestLanguage] = useState("e_from_k");

  const weeks = [...new Set(words.map((word) => word.week))].sort(
    (a, b) => b - a
  );

  return (
    <div className="main-wrapper">
      <div className="test-wrapper">
        <div className="test-words-wrapper">
          <span className="test-words-text">Words</span>
          <div className="test-words-counter-wrapper">
            <img
              src={ArrowImage}
              className="arrow-image reverse"
              onClick={() => setTestWordCount(Math.max(testWordCount - 5, 0))}
            />
            <span className="test-words-counter-text">{testWordCount}</span>
            <img
              src={ArrowImage}
              className="arrow-image"
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

        <button className="test-start-button">GO!</button>
      </div>
      {weeks.map((week) => (
        <WeekCard key={week} week={week} />
      ))}
    </div>
  );
};

export default App;
