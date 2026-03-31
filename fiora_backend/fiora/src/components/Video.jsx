import React from "react";
import { useNavigate } from "react-router-dom";

const Video = () => {
  const navigate = useNavigate();

  const handleCategory = (category) => {
    navigate("/products", { state: { category } });
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ height: 750 }}
        >
          <source src="/products/making.mp4" type="video/mp4" />
        </video>
      </div>

      <div
        className="absolute inset-0  bg-opacity-40"
        style={{ height: 750 }}
      />

      <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
  <div className="max-w-4xl">
    <h2 className="text-4xl md:text-6xl lg:text-7xl font-thin mb-6 tracking-widest text-white font-serif">
      Experience Elegance<br />in Every Drop
    </h2>

    <div className="flex items-center justify-center space-x-6 mb-8">
      <div className="w-16 h-px bg-white/40"></div>
      <div className="text-white/60 text-sm tracking-widest uppercase font-sans">FIORA</div>
      <div className="w-16 h-px bg-white/40"></div>
    </div>

    <p className="text-lg md:text-xl lg:text-2xl mb-10 opacity-90 text-white/80 font-light tracking-widest uppercase">
      Exclusively Available Online
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        className="bg-transparent text-white px-8 py-4 font-normal text-lg border border-white/50 hover:bg-white hover:text-gray-900 transition-all duration-500 rounded-none tracking-widest uppercase"
        onClick={() => handleCategory("women")}
      >
        SHOP WOMEN
      </button>
      <button
        className="bg-transparent text-white px-8 py-4 font-normal text-lg border border-white/50 hover:bg-white hover:text-gray-900 transition-all duration-500 rounded-none tracking-widest uppercase"
        onClick={() => handleCategory("men")}
      >
        SHOP MEN
      </button>
    </div>
  </div>
</div>
    </div>
  );
};

export default Video;
