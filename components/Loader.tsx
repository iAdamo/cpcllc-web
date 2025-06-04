// components/Loader.tsx
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p>Loading map...</p>
    </div>
  );
};

export default Loader;
