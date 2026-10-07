// ============ EDIT THIS FILE ONLY ============
window.SHOP = {
  name: "Quick Shop",
  owner: "Shantel Shan",                      // "Curated by ..." ("" to hide)
  tagline: "Hand-picked Kilimall finds, delivered to your door.",
  welcome: "Karibu! Tap what you like and order safely on Kilimall.",
  whatsapp: "254112111612",                   // your number, no + or spaces ("" to hide)
  whatsappText: "Hi! I need help choosing something from your shop.",
  disclosure: true,
  accent: "#6D3FD0",                          // purple
  accent2: "#2F6BFF",                         // blue

  // Add a link and the site tries to fetch the photo, title and price from Kilimall by itself.
  // Optional overrides (they always win): title, image, price, category, tag
  //   image: "images/shoe.jpg"  (photo saved in an images folder next to index.html)
  //   price: only type one if you are sure it is right. Empty = no price shown.
  products: [
    { link: "https://k.kili.co/245a9" },
    // { link: "https://k.kili.co/xxxxx", category: "Fashion", tag: "Popular" },
  ]
};
