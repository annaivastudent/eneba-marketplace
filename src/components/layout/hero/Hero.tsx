import { useEffect, useRef, useState } from "react";
import "../../../styles/hero/Hero.css";
import search from "../../../assets/images/search.png";
import type { Product } from "../../../types/Product";
interface HeroProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  products: Product[];
}
function Hero({ searchQuery, setSearchQuery, products }: HeroProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const suggestions = products
    .filter((product) =>
      product.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    )
    .slice(0, 5);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);
  return (
    <section>
      <div className="hero-content">
        <span className="hero-label">MORE PLAY. LESS TO PAY.</span>
        <h1>
          Discover your next
          <span> gaming obsession.</span>
        </h1>
        <p className="hero-description">
          Great games. Better prices. Your next adventure is one search away.
        </p>
        <form
          className="hero-search"
          ref={searchRef}
          onSubmit={(event) => {
            event.preventDefault();
            setShowSuggestions(false);
          }}
          onFocus={() => setShowSuggestions(true)}
        >
          <button type="button" aria-label="Search">
            <img src={search} alt="Search" />
          </button>
          <input
            type="search"
            placeholder="What will you play next?"
            aria-label="Find your next game"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setShowSuggestions(false);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions &&
            searchQuery.trim().length >= 2 &&
            suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((product) => (
                  <button
                    type="button"
                    className="suggestion-item"
                    key={product.id}
                    onClick={() => {
                      setSearchQuery(product.title);
                      setShowSuggestions(true);
                    }}
                  >
                    <img src={product.image} alt={product.title} />
                    <span>{product.title}</span>
                  </button>
                ))}
              </div>
            )}
          <button type="submit" className="find-btn">
            Find games →
          </button>
        </form>
        <div className="searches">
          <a href="#store">Trending</a>
          <a href="#store">Cyberpunk 2077</a>
          <a href="#store">Elden Ring</a>
          <a href="#store">Baldur's Gate 3</a>
        </div>
      </div>
    </section>
  );
}
export default Hero;
