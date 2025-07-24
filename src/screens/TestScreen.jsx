import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/styles.css";
import "../styles/test.css";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzlU6YFbMhh0uPFke31Q1w5X3wXbWljM4sKB78MSfQb7w6iW8DPKSeve9H0YHbSDEY/exec";

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
    if (curIndex + 1 < curQueue.length) {
      setCurIndex((prev) => prev + 1);
    } else if (nextReviewQueue.length > 0) {
      setCurQueue(nextReviewQueue);
      setReviewQueue([]);
      setCurIndex(0);
    } else {
      setIsFinished(true);
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

  const [isFinished, setIsFinished] = useState(false);

  const sendResultsToSheet = async () => {
    const resultPayLoad = mainQueue.map((word) => ({
      english: word.english,
      correctDelta: word.correct,
      totalDelta: word.correct + word.wrong,
    }));

    await fetch(API_URL, {
      redirect: "follow",
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(resultPayLoad),
    });

    console.log("Successfully Sent Data");
  };

  return (
    <div className="test-screen-wrapper">
      {!isFinished ? (
        <>
          <span className="title-text">Test</span>
          <span className="cur-word-count-text">
            {curCorrectCount} / {mainQueue.length}
          </span>

          <div className="test-prompt">{prompt}</div>

          {isWrong ? (
            <div className="wrong-answer-block">
              <del className="user-answer">{userInput}</del>
              <span>{answer}</span>
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
              <button
                className="test-next-button"
                onClick={handleCorrect}
                style={{ backgroundColor: "var(--light-blue)" }}
              >
                Check as Correct
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <span className="finished-text">시험 종료</span>
          <button className="send-results-button" onClick={sendResultsToSheet}>
            결과 전송
          </button>
          <button className="home-button" onClick={() => navigate("/")}>
            홈으로
          </button>
        </>
      )}
    </div>
  );
};

export default TestScreen;
