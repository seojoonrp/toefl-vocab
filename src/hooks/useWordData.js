import { useEffect, useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzlU6YFbMhh0uPFke31Q1w5X3wXbWljM4sKB78MSfQb7w6iW8DPKSeve9H0YHbSDEY/exec";

const useWordData = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((rows) => {
        const parsed = rows.slice(1).map((row) => ({
          english: row[0],
          korean: row[1],
          week: parseInt(row[2]),
          date: row[3],
          total: parseInt(row[4]),
          correct: parseInt(row[5]),
        }));
        setWords(parsed);
      });
  }, []);

  return words;
};

export default useWordData;
