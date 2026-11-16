import { useEffect, useRef, useState } from "react";
import "../../../styles/header/Header.css";
import search from "../../../assets/images/search.png";
import type { Product } from "../../../types/Product";
import { Link } from "react-router-dom";
import type { AuthUser } from "../../../services/authService";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  products: Product[];
  cartCount: number;
  user: AuthUser | null;
  onLogout: () => void;
}

function Header({
  searchQuery,
  setSearchQuery,
  products,
  cartCount,
  user,
  onLogout,
}: HeaderProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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
    <header>
      <div className="inner-header">
        <Link to="/" className="brand">
          <span className="brand-mark">E</span>
          <span className="brand-name">Eneba</span>
        </Link>

        <nav className="main-nav">
          <a href="#store">Store</a>
          <a href="#deals">Deals</a>
          <a href="#gift-cards">Gift Cards</a>
          <a href="#support">Support</a>
        </nav>

        <div className="header-search" ref={searchRef}>
          <button type="button" aria-label="Search">
            <img src={search} alt="Search" />
          </button>

          <input
            type="search"
            placeholder="Search games..."
            aria-label="Search games"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setShowSuggestions(true);
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
                      setShowSuggestions(false);
                    }}
                  >
                    <img src={product.image} alt={product.title} />
                    <span>{product.title}</span>
                  </button>
                ))}
              </div>
            )}
        </div>

        <div className="header-actions">
          <button className="language-button" type="button">
            EN / EUR
          </button>

          <a href="#favorites" className="icon-button" aria-label="Favorites">
            ♡
          </a>

          <Link to="/cart" className="icon-button" aria-label="Cart">
            🛒
            <span className="cart-count">{cartCount}</span>
          </Link>

          {user ? (
            <>
              <span>Hi, {user.name}</span>

              <Link to="/orders" className="header-orders-link">
                My orders
              </Link>

              <button
                className="logout-button"
                type="button"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
