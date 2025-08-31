const WeekCard = ({ week, words, setIsModalOpen, setSelectedWeek }) => {
  const weekWords = words.filter((word) => word.week === week);

  if (weekWords.length === 0) return null;

  const date = weekWords[0].date;
  const total = weekWords.reduce((acc, word) => acc + word.total, 0);
  const correct = weekWords.reduce((acc, word) => acc + word.correct, 0);
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;

  return (
    <>
      <div
        className="week-card-wrapper"
        onClick={() => {
          setIsModalOpen(true);
          setSelectedWeek(week);
        }}
        style={{
          backgroundColor: week % 2 === 0 ? "var(--light-blue)" : "var(--blue)",
        }}
      >
        <div className="week-text-wrapper">
          <span className="week-text">Week {week}</span>
          <span className="date-text">{date}</span>
        </div>
        <span className="accuracy-text">
          <span className="accuracy-label">Accuracy &nbsp;&nbsp;</span>
          {accuracy}%
        </span>
      </div>
    </>
  );
};

export default WeekCard;
