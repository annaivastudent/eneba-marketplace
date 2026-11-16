import { useState, useMemo } from "react";
import type { Product } from "../../../types/Product";
import "../../../styles/product/BestSellers.css";
import { useNavigate } from "react-router-dom";
interface BestSellersProps {
  searchQuery: string;
  products: Product[];
  loading: boolean;
  addToCart: (product: Product) => void;
}

function BestSellers({ searchQuery, products, loading,addToCart, }: BestSellersProps) {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedLauncher, setSelectedLauncher] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const navigate = useNavigate();
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPlatform =
        selectedPlatform === "" || product.platform === selectedPlatform;

      const matchesLauncher =
        selectedLauncher === "" || product.launcher === selectedLauncher;

      const matchesMinPrice =
        minPrice === "" || product.price >= Number(minPrice);

      const matchesMaxPrice =
        maxPrice === "" || product.price <= Number(maxPrice);

      const matchesGenre =
        selectedGenre === "" ||
        product.genre.toLowerCase().includes(selectedGenre.toLowerCase());

      return (
        matchesPlatform &&
        matchesLauncher &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesGenre &&
        matchesSearch
      );
    });

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [
    products,
    selectedPlatform,
    selectedLauncher,
    minPrice,
    maxPrice,
    selectedGenre,
    sortBy,
    searchQuery,
  ]);
  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <>
      <div className="product-layout">
        <aside className="filters">
          <div className="filter-group">
            <h4>Platform</h4>
            <button
              type="button"
              className="clear-filters"
              onClick={() => {
                setSelectedPlatform("");
                setSelectedLauncher("");
                setMinPrice("");
                setMaxPrice("");
                setSelectedGenre("");
                setSortBy("featured");
              }}
            >
              Clear all
            </button>
            {["PC", "PlayStation", "Xbox"].map((platform) => (
              <label className="filter-option" key={platform}>
                <input
                  type="checkbox"
                  checked={selectedPlatform === platform}
                  onChange={() =>
                    setSelectedPlatform(
                      selectedPlatform === platform ? "" : platform,
                    )
                  }
                />
                <span>{platform}</span>
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h4>Launcher</h4>

            {["Steam", "Epic Games", "EA app"].map((launcher) => (
              <label className="filter-option" key={launcher}>
                <input
                  type="checkbox"
                  checked={selectedLauncher === launcher}
                  onChange={() =>
                    setSelectedLauncher(
                      selectedLauncher === launcher ? "" : launcher,
                    )
                  }
                />

                <span>{launcher}</span>
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h4>Price range</h4>

            <div className="price-inputs">
              <input
                type="number"
                min="0"
                placeholder="Min €"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
              />

              <input
                type="number"
                min="0"
                placeholder="Max €"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </div>
          </div>
          <div className="filter-group">
            <h4>Genre</h4>

            {["Action", "Adventure", "RPG", "Horror", "Survival"].map(
              (genre) => (
                <label className="filter-option" key={genre}>
                  <input
                    type="checkbox"
                    checked={selectedGenre === genre}
                    onChange={() =>
                      setSelectedGenre(selectedGenre === genre ? "" : genre)
                    }
                  />

                  <span>{genre}</span>
                </label>
              ),
            )}
          </div>
        </aside>
        <div className="products-section">
          <div className="products-toolbar">
            <div className="sort-select-wrapper">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-asc">Sort by: Price: Low to High</option>
                <option value="price-desc">Sort by: Price: High to Low</option>
                <option value="name">Sort by: Name</option>
              </select>
              <span className="sort-arrow"></span>
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <article
                  className="product-card"
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="product-art">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="product-image"
                      loading="lazy"
                    />
                    <span className="discount-badge">
                      -{product.discountPercent}%
                    </span>
                    <button
                      type="button"
                      className="favorite-button"
                      aria-label={`Add ${product.title} to favorites`}
                    >
                      ♡
                    </button>
                  </div>

                  <div className="product-info">
                    <div className="product-meta">
                      <span className="platform-badge">{product.platform}</span>

                      <span className="product-genre">{product.genre}</span>
                    </div>

                    <h3>{product.title}</h3>

                    <div className="product-price">
                      <div>
                        <del>€{product.originalPrice.toFixed(2)}</del>
                        <strong>€{product.price.toFixed(2)}</strong>
                      </div>

                      <button type="button" className="offer-button" onClick={() => addToCart(product)}>
                        🛒 Add to cart
                      </button>
                    </div>

                    <p className="product-region">
                      PC digital key · {product.region} activation
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="no-products">
                <h3>No games found</h3>
                <p>Try changing your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BestSellers;
