import React from "react";

import "../styles/styles.css";

const LoadingOverlay = ({ message }) => {
  return (
    <div className="loading-overlay">
      <span className="loading-text">{message}</span>
    </div>
  );
};

export default LoadingOverlay;
