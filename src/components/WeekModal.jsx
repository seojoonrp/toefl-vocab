import wordData from "../data/wordData";

const WeekModal = ({ week, onClose }) => {
  const words = wordData().filter((word) => word.week === week);
  const date = words[0]?.date;

  return (
    <div
      className="modal-overlay"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onClick={onClose}
    >
      <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
        {/* <button className="modal-close-button" onClick={onClose}>
          ⨉
        </button> */}
        <span className="modal-title-text">
          Week {week}
          <span className="modal-date-text">&nbsp;&nbsp;{date}</span>
        </span>
        <div className="modal-word-wrapper">
          {words.map((word, i) => (
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
