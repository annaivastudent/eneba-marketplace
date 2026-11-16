
import { Link } from "react-router-dom";
import "../../../styles/footer/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              ENEBA<span>.</span>
            </Link>

            <p>
              Discover your next favorite game
              at the best prices.
            </p>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <Link to="/">Home</Link>
            <Link to="/">Games</Link>
            <Link to="/cart">Shopping cart</Link>
          </div>

          <div className="footer-column">
            <h3>Account</h3>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Create account</Link>
            <Link to="/orders">My orders</Link>
          </div>

          <div className="footer-column">
            <h3>About</h3>
            <p>Digital games marketplace</p>
            <p>Secure test checkout</p>
            <p>Instant digital delivery</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ENEBA. All rights reserved.</p>
          <p>Made for gamers 🎮</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
