import "../styles/week_modal_styles.css";

const WeekModal = ({ week, onClose, weekWords }) => {
  const date = weekWords[0]?.date;

  return (
    <div
      className="modal-overlay"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onClick={onClose}
    >
      <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <span className="modal-title-text">
          Week {week}
          <span className="modal-date-text">&nbsp;&nbsp;{date}</span>
        </span>
        <div className="modal-word-wrapper">
          {weekWords.map((word, i) => (
            <div key={i} className="modal-word-row">
              <div
                className="modal-word english"
                style={{
                  backgroundColor:
                    i % 2 === 0 ? "var(--light-blue)" : "var(--blue)",
                }}
              >
                {word.english}
              </div>
              <div
                className="modal-word korean"
                style={{
                  color: i % 2 === 0 ? "var(--light-blue)" : "var(--blue)",
                }}
              >
                {word.korean}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekModal;
