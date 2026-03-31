import React, { useEffect, useState } from "react";
import { Search, Menu, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SkeletonProductCard from "../components/Skelton";
import { getProducts, getProductsByCategory } from "../api/productApi";

function Products() {
  const location = useLocation();
  const categoryProp = location.state?.category;

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResult, setNoResult] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const productsPerPage = 8;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, categoryProp]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let res;

      if (categoryProp) {
        res = await getProductsByCategory(categoryProp, currentPage);
      } else {
        res = await getProducts(currentPage);
      }

      const data = res.data.results || res.data;

      setProducts(data);
      setFilteredProducts(data);

      if (res.data.count) {
        setTotalPages(Math.ceil(res.data.count / productsPerPage));
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (search.trim() === "") {
      setFilteredProducts(products);
      setNoResult(false);
      return;
    }

    const result = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (result.length === 0) {
      setFilteredProducts([]);
      setNoResult(true);
    } else {
      setFilteredProducts(result);
      setNoResult(false);
    }
  };

  const handleFilter = (type) => {
    const sorted = [...filteredProducts].sort((a, b) => {
      if (type === "lowToHigh") return a.price - b.price;
      if (type === "highToLow") return b.price - a.price;
      return 0;
    });

    setFilteredProducts(sorted);
    setShowFilter(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-6 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* SEARCH + FILTER */}
      <div className="w-full bg-white border-b px-4 py-3 flex gap-4 relative">

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 border px-3 py-2 rounded"
        >
          <Menu size={18} />
          Filter
          <ChevronDown size={16} />
        </button>

        {showFilter && (
          <div className="absolute left-4 top-14 bg-white shadow-lg border p-2 z-50 rounded">
            <button
              onClick={() => handleFilter("lowToHigh")}
              className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
            >
              Price Low → High
            </button>

            <button
              onClick={() => handleFilter("highToLow")}
              className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
            >
              Price High → Low
            </button>
          </div>
        )}

        <input
          className="flex-1 border px-4 py-2 rounded"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-gray-900 text-white px-4 rounded"
        >
          <Search size={20} />
        </button>

      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-4 gap-6 p-6">
        {noResult ? (
          <p>No products found</p>
        ) : (
          filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 pb-10">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </>
  );
}

export default Products;
