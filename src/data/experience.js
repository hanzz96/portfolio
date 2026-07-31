import { asset } from "../lib/asset.js";

export const experience = [
  {
    company: "Fore Coffee Indonesia",
    role: "Senior Backend Engineer",
    period: "Oct 2024 - Dec 2025",
    text: "Developed backend features to support GMV growth, payment reliability, system performance, and maintainability across commerce services.",
    gallery: [
      { src: asset("fore_coffee/e-receipt.jpg"), caption: "E-Receipt" },
      { src: asset("fore_coffee/link-number.jpg"), caption: "Link Any Number" },
      { src: asset("fore_coffee/payment-method.jpg"), caption: "Payment List" },
      { src: asset("fore_coffee/progressive-promo.jpg"), caption: "Progressive Promo" },
    ],
  },
  {
    company: "Platinum Ceramics Industry",
    role: "Senior System Specialist / Senior Fullstack Developer",
    period: "Jul 2021 - Jul 2024",
    text: "Built ERP modules, vendor portals, reusable frontend components, Kafka libraries, mobile API proxies, Redis-based stock safeguards, and approval workflows.",
    gallery: [
      { src: asset("platinum_ceramics/payment-ap.png"), caption: "Landing Page Module" },
      { src: asset("platinum_ceramics/transaction-erp.png"), caption: "Transaction ERP Payment AP" },
      { src: asset("platinum_ceramics/sql-report.png"), caption: "SQL Report Custom" },
    ],
  },
  {
    company: "Dealjava",
    role: "Backend Developer",
    period: "Mar 2020 - Jun 2021",
    text: "Implemented e-commerce backend services, website ordering flows, BCA OneKlik integration, and third-party transaction logging for Diyo.",
    gallery: [
      { src: asset("diyo/checkout-page.png"), caption: "Checkout Page" },
      { src: asset("diyo/order-detail.png"), caption: "Order Detail" },
      { src: asset("diyo/store-product.png"), caption: "Store Product" },
    ],
  },
  {
    company: "camLine Pte. Ltd.",
    role: "Software Developer",
    period: "Apr 2019 - Oct 2019",
    text: "Maintained production manufacturing systems for international clients and optimized Java applications integrated with factory operations.",
  },
];
