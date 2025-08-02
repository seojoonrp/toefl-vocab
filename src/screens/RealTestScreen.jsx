import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/styles.css";
import "../styles/test.css";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzlU6YFbMhh0uPFke31Q1w5X3wXbWljM4sKB78MSfQb7w6iW8DPKSeve9H0YHbSDEY/exec";

const RealTestScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { testWordCount, testLanguage, words } = location.state || {};

  const mainQueue = useMemo(() => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, testWordCount).map((word) => ({
      english: word.english,
      korean: word.korean,
      correct: 0,
      wrong: 0,
    }));
  }, [words, testWordCount]);

  const [correctCount, setCorrectCount] = useState(0);
  const [curIndex, setCurIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isWrong, setIsWrong] = useState(false);

  const curWord = mainQueue[curIndex];
  const prompt = testLanguage === "e_from_k" ? curWord.korean : curWord.english;
  const answer = testLanguage === "e_from_k" ? curWord.english : curWord.korean;

  const moveToNextWord = () => {
    if (curIndex + 1 < mainQueue.length) {
      setCurIndex((prev) => prev + 1);
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
      moveToNextWord();
    }
  };

  const handleCorrect = () => {
    curWord.correct += 1;
    setCorrectCount((prev) => prev + 1);
    moveToNextWord();
  };

  const [isFinished, setIsFinished] = useState(false);
  const [sentResults, setSentResults] = useState(false);

  const sendResultsToSheet = async () => {
    if (sentResults) {
      alert("결과 전송중임 ㄱㄷ");
      return;
    }

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

    setSentResults(true);
    alert("결과가 전송되었습니다!");
  };

  const handleGoHome = () => {
    if (!sentResults) {
      alert("결과전송하셈");
      return;
    }

    setSentResults(false);
    setIsFinished(false);

    navigate("/");
  };

  return (
    <div className="test-screen-wrapper">
      {!isFinished ? (
        <>
          <span className="title-text">Test</span>
          <span className="cur-word-count-text">
            {curIndex + 1} / {mainQueue.length}
          </span>

          <div className="test-prompt">{prompt}</div>

          {isWrong ? (
            <>
              <div className="wrong-answer-block">
                <del className="user-answer">{userInput}</del>
                <span>{answer}</span>
              </div>

              <input
                style={{ position: "absolute", top: "-1000px" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNext();
                }}
                autoFocus
              />
            </>
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
          <span className="finished-text">시험 종료!</span>
          <span className="correct-count-text">
            {correctCount} / {mainQueue.length}
          </span>
          <button className="send-results-button" onClick={sendResultsToSheet}>
            Send Results
          </button>
          <button className="home-button" onClick={handleGoHome}>
            Home
          </button>
        </>
      )}
    </div>
  );
};

export default RealTestScreen;
