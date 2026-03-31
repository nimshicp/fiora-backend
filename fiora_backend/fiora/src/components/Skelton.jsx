
import React from "react";
function SkeletonProductCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-300"></div>

      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>

        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-gray-300 rounded w-16"></div>
          <div className="h-6 bg-gray-300 rounded w-12"></div>
        </div>

        <div className="flex gap-2 mt-4">
          <div className="h-10 bg-gray-300 rounded flex-1"></div>
          <div className="h-10 bg-gray-300 rounded flex-1"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonProductCard;
