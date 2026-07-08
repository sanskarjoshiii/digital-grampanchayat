import React from "react";

const NoDataFound = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-mist border border-line flex items-center justify-center">
        <img
          width="26"
          height="26"
          src="https://img.icons8.com/ios/50/8a8a82/empty-box.png"
          alt="empty"
        />
      </div>
      <p className="text-muted text-sm">No data found</p>
    </div>
  );
};

export default NoDataFound;
