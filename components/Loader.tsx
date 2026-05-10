import React from "react";
import { Spinner } from "@/components/ui/spinner";

const Loader: React.FC = () => {
  return (
    // <div className="loader-container">
    //   <div className="loader"></div>
    //   <p></p>
    // </div>
    <Spinner
      size="small"
      className="h-fit p-4 justify-start items-start w-full"
    />
  );
};

export default Loader;
