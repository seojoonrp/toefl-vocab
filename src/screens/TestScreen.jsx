import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/styles.css";
import "../styles/test.css";

const TestScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    testWordCount = 30,
    testLanguage = "e_from_k",
    words = [],
  } = location.state || {};

  const mainQueue = useMemo(() => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, testWordCount).map((word) => ({
      english: word.english,
      korean: word.korean,
      correct: 0,
      wrong: 0,
    }));
  }, [words, testWordCount]);

  const [curQueue, setCurQueue] = useState(mainQueue);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [curCorrectCount, setCurCorrectCount] = useState(0);
  const [curIndex, setCurIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isWrong, setIsWrong] = useState(false);

  const curWord = curQueue[curIndex];
  const prompt = testLanguage === "e_from_k" ? curWord.korean : curWord.english;
  const answer = testLanguage === "e_from_k" ? curWord.english : curWord.korean;

  const moveToNextWord = (nextReviewQueue = reviewQueue) => {
    console.log("curIndex:", curIndex);
    console.log("curCorrectCount:", curCorrectCount);
    console.log("curQueue:", curQueue);
    console.log("reviewQueue:", reviewQueue);

    if (curIndex + 1 < curQueue.length) {
      setCurIndex((prev) => prev + 1);
    } else if (nextReviewQueue.length > 0) {
      setCurQueue(nextReviewQueue);
      setReviewQueue([]);
      setCurIndex(0);
    } else {
      alert("시험 종료!");
      console.log("최종 결과:", mainQueue);
    }

    setUserInput("");
    setIsWrong(false);
  };

  const handleNext = () => {
    const isCorrect =
      userInput.trim().toLowerCase() === answer.trim().toLowerCase();

    if (!isWrong) {
      if (isCorrect) {
        handleCorrect();
      } else {
        setIsWrong(true);
      }
    } else {
      curWord.wrong += 1;

      const updatedReviewQueue = [...reviewQueue, curWord];
      setReviewQueue(updatedReviewQueue);
      moveToNextWord(updatedReviewQueue);
    }
  };

  const handleCorrect = () => {
    curWord.correct += 1;
    setCurCorrectCount((prev) => prev + 1);
    moveToNextWord();
  };

  return (
    <div className="test-screen-wrapper">
      <span className="title-text">Test</span>
      <span className="cur-word-count-text">
        {curCorrectCount} / {mainQueue.length}
      </span>

      <div className="test-prompt">{prompt}</div>

      {isWrong ? (
        <div className="wrong-answer-block">
          <div className="user-answer">
            <del>{userInput}</del>
          </div>
          <div className="correct-answer">{answer}</div>
        </div>
      ) : (
        <input
          className="test-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="정답 입력"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleNext();
          }}
          autoFocus
        />
      )}

      <div className="test-button-wrapper">
        <button className="test-next-button" onClick={handleNext}>
          Next
        </button>
        {isWrong && (
          <button className="test-correct-button" onClick={handleCorrect}>
            Check as Correct
          </button>
        )}
      </div>

      <button onClick={() => navigate("/")}>홈으로</button>
    </div>
  );
};

export default TestScreen;
