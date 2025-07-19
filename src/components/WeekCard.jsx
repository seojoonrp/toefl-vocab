import React, { useState } from "react";
import wordData from "../data/wordData";
import WeekModal from "./WeekModal.jsx";

const WeekCard = ({ week }) => {
  const [open, setOpen] = useState(false);
  const words = wordData().filter((word) => word.week === week);

  if (words.length === 0) return null;

  const date = words[0].date;
  const total = words.reduce((acc, word) => acc + word.total, 0);
  const correct = words.reduce((acc, word) => acc + word.correct, 0);
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;

  return (
    <>
      <div
        className="week-card-wrapper"
        onClick={() => setOpen(true)}
        style={{
          backgroundColor: week % 2 === 0 ? "var(--light-blue)" : "var(--blue)",
        }}
      >
        <div className="week-text-wrapper">
          <span className="week-text">Week {week}</span>
          <span className="date-text">{date}</span>
        </div>
        <span className="accuracy-text">
          <span className="accuracy-label">Accuracy </span>
          {accuracy}%
        </span>
      </div>

      {open && <WeekModal week={week} onClose={() => setOpen(false)} />}
    </>
  );
};

export default WeekCard;
