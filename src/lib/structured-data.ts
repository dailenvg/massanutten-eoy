import { CANONICAL_URL, PAGE_DESCRIPTION } from "./site";
import { PACKAGE_NAME, PRICE_NUMBER, REVIEWS, TA_BUBBLES, TA_REVIEW_COUNT } from "./offer";

/** Product + reviews, from the same V2 Tripadvisor data as GuestReviews. */
export const PRODUCT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: PACKAGE_NAME,
  description: PAGE_DESCRIPTION,
  image: "https://www.vacationvip.com/images/og-share.jpg",
  brand: { "@type": "Brand", name: "VacationVIP" },
  offers: {
    "@type": "Offer",
    url: CANONICAL_URL,
    price: PRICE_NUMBER.toFixed(2),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    category: "Vacation Package",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: TA_BUBBLES,
    bestRating: 5,
    reviewCount: Number(TA_REVIEW_COUNT.replace(/[^0-9]/g, "")),
  },
  review: REVIEWS.map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    reviewRating: { "@type": "Rating", ratingValue: r.stars, bestRating: 5 },
    reviewBody: r.quote,
  })),
};
export const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "VacationVIP", item: "https://www.vacationvip.com" },
    { "@type": "ListItem", position: 2, name: PACKAGE_NAME, item: CANONICAL_URL },
  ],
};
