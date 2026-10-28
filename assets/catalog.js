/* ==========================================================================
   EnterTheKi — catalog.json (single source of truth for shop data)
   Prices are stored in USD cents. EUR display/checkout uses EUR_RATE below.
   NOTE (TODO): full catalog will be restored from Shopify export; at launch
   only products verified to exist are listed. Prices marked null are TBC
   and cannot be purchased until the owner confirms them.
   ========================================================================== */

const CATALOG = {
  currency: { base: "USD", alt: "EUR", EUR_RATE: 0.92 /* TODO: set manual FX rate */ },
  products: [
    {
      id: "trucker-hat",
      title: "ETK Trucker Hat",
      handle: "trucker-hat",
      priceUsd: 2700,
      priceEur: 2484, /* kept in sync with EUR_RATE; verified by worker */
      image: "/images/product-hat.jpg",
      alt: "Black trucker hat with an embroidered blue dragon and a golden warrior character on the front",
      collections: ["best-sellers", "distracted-world"],
      desc: "Black trucker hat with the signature ETK dragon artwork embroidered on the front. Breathable mesh back, snapback closure, one size fits most.",
      bullets: [
        "Breathable mesh back — light on the head",
        "Adjustable snapback closure",
        "High-stitch embroidery of the ETK dragon",
        "One size fits most"
      ],
      descriptionHTML: `<p>The ETK Trucker Hat carries the dragon — the symbol of rising Ki. Black crown and brim, breathable mesh back, and a snapback closure so it fits right the day it arrives.</p>
<p><em>Wear your energy. Move in silence.</em></p>`,
      variants: [{ id: "default", title: "One Size", available: true }]
    },
    {
      id: "sticker-set",
      title: "Ki Sticker Set (5-Pack)",
      handle: "sticker-set",
      priceUsd: 1699,
      priceEur: 1563,
      image: "/images/product-stickers.jpg",
      alt: "Five round vinyl stickers: a boy in a green hoodie, glowing 気 triangle, pyramid man, back view with neon 気, and a misty mountain 気",
      collections: ["best-sellers", "kiut"],
      desc: "Five round vinyl stickers carrying the 気 energy — your laptop, your case, your world.",
      bullets: [
        "Five original 気 designs",
        "Round, durable vinyl",
        "Perfect for laptops, bottles and cases",
        "Printed with the ETK color palette"
      ],
      descriptionHTML: `<p>Five stickers, one signal. From the 気 triangle to the pyramid dweller — carry the frequency into the distracted world and let it mark your gear.</p>
<p><em>A signal in the noise.</em></p>`,
      variants: [{ id: "default", title: "5-Pack", available: true }]
    },
    {
      id: "old-money-knitted-sweater",
      title: "Old Money Knitted Sweater",
      handle: "old-money-knitted-sweater",
      priceUsd: null,
      priceEur: null,
      image: "/images/etkicon.png",
      alt: "Enter The Ki neon triangle logo representing the upcoming Old Money Knitted Sweater",
      collections: ["imaginary-nostalgia"],
      comingSoon: true,
      desc: "Wear the Grace. Not the Price. Premium materials, tailored fit, breathable & lightweight knit. Price and photos coming soon.",
      bullets: ["Premium materials", "Tailored fit", "Breathable & lightweight", "Price available soon"],
      descriptionHTML: `<p>The Old Money Knitted Sweater is the home-page featured piece of the new collection.</p>
<div class="tbc-note"><strong>Price coming soon.</strong> Sign up for <a href="/#flow">Tap Into the Flow</a> or email <a href="mailto:entertheki@gmail.com">entertheki@gmail.com</a> to be notified when this piece drops.</div>`,
      variants: []
    },
    {
      id: "etk-beanie",
      title: "ETK 気 Beanie",
      handle: "etk-beanie",
      priceUsd: null,
      priceEur: null,
      image: "/images/product-beanie.jpg",
      alt: "Teal green knit beanie with the 気 triangle patch, worn on a model",
      collections: ["kiut"],
      comingSoon: true,
      desc: "Teal green knit beanie with the signature 気 triangle patch.",      bullets: [
        "Soft knit beanie",
        "気 triangle patch embroidered in teal",
        "One size fits most",
        "Price available soon"
      ],
      descriptionHTML: `<p>The 気 Beanie: a quiet statement in teal with the kit triangle patch stitched at the temple.</p>
<div class="tbc-note"><strong>Price coming soon.</strong> Email <a href="mailto:entertheki@gmail.com">entertheki@gmail.com</a> to reserve yours.</div>`,
      variants: []
    }
  ],
  collections: [
    {
      id: "imaginary-nostalgia",
      title: "Imaginary Nostalgia",
      sub: "Homesickness & Solitude — the Hall 80 aesthetic",
      image: "/images/imaginary_nostalgia.jpg",
      alt: "Imaginary Nostalgia collection artwork",
      desc: "Homesickness rendered in color and silence. Pieces from the Imaginary Nostalgia chapter — nostalgia for places that felt safe, places that never fully existed."
    },
    {
      id: "distracted-world",
      title: "Distracted Wꙩrld",
      sub: "Escape the distracted world",
      image: "/images/dworld.jpg",
      alt: "Distracted Wꙩrld collection artwork",
      desc: "The world is moving fast — but the signal is always there. You just have to tune in."
    },
    {
      id: "kiut",
      title: "Kiut",
      sub: "Enter the Ki and find the Kiut",
      image: "/images/kiut.jpg",
      alt: "Kiut collection artwork — Y2K and Frutiger Aero energy",
      desc: "The playful, lighter extension of the brand — Y2K, Frutiger Aero and deep nostalgia."
    },
    {
      id: "best-sellers",
      title: "Best Sellers",
      sub: "The most awakened pieces",
      image: "/images/kipaints.jpg",
      alt: "Painted Ki artwork used for the Best Sellers collection",
      desc: "The pieces the community keeps coming back for."
    }
  ]
};
window.ETK = window.ETK || {};
window.ETK.CATALOG = CATALOG;
if (typeof module !== "undefined") module.exports = { CATALOG };
