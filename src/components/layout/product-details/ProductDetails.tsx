import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Product } from "../../../types/Product";
import type { Offer } from "../../../types/Offer";
import { getProductOffers } from "../../../types/offerService";
import "../../../styles/product-details/ProductDetails.css";
interface ProductDetailsProps {
  products: Product[];
  loading: boolean;
  addToCart: (product: Product, offer?: Offer) => void;
}

function ProductDetails({
  products,
  loading,
  addToCart,
}: ProductDetailsProps) {
  const { id } = useParams();

  const [offerState, setOfferState] = useState<{
    productId: number | null;
    offers: Offer[];
    loading: boolean;
    error: string;
  }>({
    productId: null,
    offers: [],
    loading: true,
    error: "",
  });

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const productId = product?.id;

  useEffect(() => {
    if (productId === undefined) return;

    let cancelled = false;

    getProductOffers(productId)
      .then((data) => {
        if (!cancelled) {
          setOfferState({
            productId,
            offers: data,
            loading: false,
            error: "",
          });
        }
      })
      .catch((error: unknown) => {
        console.error("Error loading offers:", error);

        if (!cancelled) {
          setOfferState({
            productId,
            offers: [],
            loading: false,
            error: "Could not load offers",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const offersLoading =
    productId === undefined ||
    offerState.productId !== productId ||
    offerState.loading;

  const offersError =
    offerState.productId === productId
      ? offerState.error
      : "";

  const offers =
    offerState.productId === productId
      ? offerState.offers
      : [];

  if (loading) {
    return <p className="product-loading">Loading product...</p>;
  }

  if (!product) {
    return (
      <main className="product-details">
        <h2>Product not found</h2>
        <Link to="/">Back to home</Link>
      </main>
    );
  }

  return (
    <main className="product-details">
      <Link to="/" className="back-link">
        ← Back to games
      </Link>

      <section className="product-overview">
        <div className="product-details-image">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="product-details-info">
          <div className="product-details-meta">
            <span>{product.platform}</span>
            <span>{product.launcher}</span>
            <span>{product.genre}</span>
          </div>

          <h1>{product.title}</h1>

          <p className="product-region">
            Region: {product.region}
          </p>

          <div className="product-discount">
            -{product.discountPercent}%
          </div>

          <div className="product-price-details">
            <del>€{product.originalPrice.toFixed(2)}</del>
            <strong>€{product.price.toFixed(2)}</strong>
          </div>

          <p className="product-note">
            Digital game key · {product.region} activation
          </p>

          <button
            className="product-add-button"
            type="button"
            onClick={() => addToCart(product)}
          >
            🛒 Add to cart
          </button>
        </div>
      </section>

      <section className="seller-offers">
        <h2>Available offers</h2>

        {offersLoading && (
          <p>Loading offers...</p>
        )}

        {offersError && (
          <p>{offersError}</p>
        )}

        {!offersLoading &&
          !offersError &&
          offers.length === 0 && (
            <p>No offers available.</p>
          )}

        {!offersLoading &&
          !offersError &&
          offers.map((offer) => (
            <div
              className="seller-offer"
              key={offer.id}
            >
              <div className="seller-offer-info">
                <strong>{offer.sellerName}</strong>

                <span>
                  ⭐ {offer.sellerRating}
                </span>

                <small>
                  {offer.stock} keys available
                </small>
              </div>

              <strong className="seller-offer-price">
                €{Number(offer.price).toFixed(2)}
              </strong>

              <button
                type="button"
                className="seller-offer-button"
                onClick={() =>
                  addToCart(
                    {
                      ...product,
                      price: Number(offer.price),
                    },
                    offer
                  )
                }
              >
                Add to cart
              </button>
            </div>
          ))}
      </section>
    </main>
  );
}

export default ProductDetails;