import React from "react";
import { useNavigate } from "react-router-dom";

const FragranceCollections = () => {
  const navigate = useNavigate();

  const handleCategory = (category) => {
    navigate("/products", { state: { category } });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-thin text-gray-900 mb-6 tracking-widest font-serif">
            FRAGRANCE COLLECTIONS
          </h2>
          <div className="w-40 h-0.5 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Discover our exclusive ranges, each crafted to evoke emotions and
            create lasting memories through scent
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-2xl border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10"></div>
            <div
              className="h-96 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: 'url("./products/women.jpg")',
              }}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-3xl font-thin text-white mb-3 tracking-wider font-serif">
                Women
              </h3>
              <p className="text-white/80 mb-6 leading-relaxed font-light text-lg">
                Elegant and captivating fragrances designed for the modern
                woman.
              </p>
              <button
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 font-light text-base border border-white/40 hover:bg-white hover:text-gray-900 transition-all duration-500 rounded-full tracking-widest uppercase w-full"
                onClick={() => handleCategory("women")}
              >
                Discover
              </button>
            </div>
          </div>

          <div className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-2xl border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10"></div>
            <div
              className="h-96 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: 'url("./products/men.jpg")',
              }}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-3xl font-thin text-white mb-3 tracking-wider font-serif">
                Men
              </h3>
              <p className="text-white/80 mb-6 leading-relaxed font-light text-lg">
                <span className="font-medium">Bold and distinctive</span> scents
                that command attention.
              </p>
              <button
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 font-light text-base border border-white/40 hover:bg-white hover:text-gray-900 transition-all duration-500 rounded-full tracking-widest uppercase w-full"
                onClick={() => handleCategory("men")}
              >
                Discover
              </button>
            </div>
          </div>

          <div className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-2xl border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10"></div>
            <div
              className="h-96 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: 'url("./products/unisex.jpg")',
              }}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-3xl font-thin text-white mb-3 tracking-wider font-serif">
                Unisex
              </h3>
              <p className="text-white/80 mb-6 leading-relaxed font-light text-lg">
                <span className="font-medium">
                  Universal fragrances for all
                </span>
                , transcending boundaries.
              </p>
              <button
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 font-light text-base border border-white/40 hover:bg-white hover:text-gray-900 transition-all duration-500 rounded-full tracking-widest uppercase w-full"
                onClick={() => handleCategory("unisex")}
              >
                Discover
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FragranceCollections;
