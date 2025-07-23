import { useEffect, useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbyoVT5NHzjF5Lyi6QTESJGnEaUWgUFsRlYse5WGgM1NkG_roebgPbbktJoxbDBhYlBJ/exec";

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
