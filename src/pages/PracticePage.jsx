import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/styles.css";
import "../styles/test.css";
import LoadingOverlay from "../components/LoadingOverlay";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzlU6YFbMhh0uPFke31Q1w5X3wXbWljM4sKB78MSfQb7w6iW8DPKSeve9H0YHbSDEY/exec";

const PracticePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { testWordCount, testLanguage, words } = location.state || {};

  const mainQueue = useMemo(() => {
    if (!words || words.length === 0) return [];

    const totalCount = testWordCount;

    const latestWeek = Math.max(...words.map((word) => word.week));

    const latestWeekWords = words.filter((word) => word.week === latestWeek);
    const previousWeekWords = words.filter((word) => word.week !== latestWeek);

    const recentCount = Math.floor(totalCount * 0.4);
    const recentSample = [...latestWeekWords]
      .sort(() => 0.5 - Math.random())
      .slice(0, recentCount);

    const sortedByAccuracy = [...previousWeekWords].sort((a, b) => {
      const aTotal = a.total || 0;
      const bTotal = b.total || 0;
      const aAccuracy = aTotal > 0 ? a.correct / aTotal : 0;
      const bAccuracy = bTotal > 0 ? b.correct / bTotal : 0;
      return aAccuracy - bAccuracy;
    });

    const accuracyCount = Math.floor(totalCount * 0.35);
    const accuracySample = sortedByAccuracy.slice(0, accuracyCount);

    const remainingWords = previousWeekWords.filter(
      (word) => !accuracySample.includes(word)
    );
    const randomCount =
      totalCount - (recentSample.length + accuracySample.length);
    const randomSample = [...remainingWords]
      .sort(() => 0.5 - Math.random())
      .slice(0, randomCount);

    const finalQueue = [...recentSample, ...accuracySample, ...randomSample]
      .sort(() => 0.5 - Math.random())
      .map((word) => ({
        english: word.english,
        korean: word.korean,
        correct: 0,
        wrong: 0,
      }));

    return finalQueue;
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
    }

    setUserInput("");
    setIsWrong(false);
  };

  const handleNext = () => {
    const normalizedAnswer = answer
      .split(",")
      .map((item) => item.trim().toLowerCase());
    const userAnswer = userInput.trim().toLowerCase();

    const isCorrect = normalizedAnswer.includes(userAnswer);

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
  const [sentResults, setSentResults] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    await fetch(API_URL, {
      redirect: "follow",
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(resultPayLoad),
    });

    setSentResults(true);
    setLoading(false);
    // alert("결과가 전송되었습니다!");
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
      {loading && <LoadingOverlay message="결과를 전송중입니다..." />}

      {!isFinished ? (
        <>
          <span className="title-text">Practice</span>
          <span className="cur-word-count-text">
            {curCorrectCount} / {mainQueue.length}
          </span>

          <div className="test-prompt">{prompt}</div>

          {isWrong ? (
            <>
              <div className="wrong-answer-block">
                <del className="user-answer">{userInput}</del>
                <span>{answer}</span>
              </div>

              <input
                style={{
                  position: "absolute",
                  top: "-1000px",
                  fontSize: "100px",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNext();
                  if (e.key === " ") {
                    e.preventDefault();
                    handleCorrect();
                  }
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

export default PracticePage;
