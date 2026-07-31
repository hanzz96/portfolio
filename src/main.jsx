import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  Images,
  Mail,
  MapPin,
  Sparkles,
  TerminalSquare,
  Gamepad2,
  X,
} from "lucide-react";
import "./styles.css";

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const projects = [
  {
    title: "Fore Coffee Platform",
    type: "Main Quest: Commerce Backend",
    metric: "Payment engines, GMV systems, scalability",
    text: "Built and maintained backend features for high-traffic commerce flows, integrated Midtrans, OVO, ShopeePay, and Stripe, and improved legacy services with Product, Frontend, QA, and backend teams.",
    tags: ["Node.js", "Express", "MySQL", "AWS Lambda", "Elasticsearch", "Docker", "NestJs"],
  },
  {
    title: "ERP & Vendor Systems",
    type: "Co-op Raid: Enterprise ERP",
    metric: "Finance, inventory, approvals, Kafka",
    text: "Delivered ERP modules for Account Payable, Inventory, custom reporting, vendor PO confirmation & generate secure link, approval engines, and cross-company mobile APIs connected through Kafka and Redis.",
    tags: ["Laravel", "Nuxt.js", "Vue", "PostgreSQL", "Kafka", "Redis"],
  },
  {
    title: "Diyo Commerce Apps",
    type: "Side Quest: Startup Commerce",
    metric: "E-commerce, OneKlik, transaction logs",
    text: "Helped build Diyo's mobile and web ordering platform, implemented BCA OneKlik and payment integrations, and created logging for reliable transaction tracking across users and merchants.",
    tags: ["Laravel", "Redis", "PostgreSQL", "Docker", "Vue"],
  },
  {
    title: "camLine Manufacturing Systems",
    type: "Origin Quest: Manufacturing Software",
    metric: "4 global clients, Java optimization, uptime",
    text: "Managed production manufacturing systems for clients across Kuala Lumpur, Kaohsiung, Bangkok, and Tianjin, fixed critical bugs in Java-integrated manufacturing software, and optimized performance to eliminate machine overheating on the production line.",
    tags: ["Java", "Oracle"],
  }
];

const stack = [
  "JavaScript",
  "TypeScript",
  "PHP",
  "Dart",
  "Java",
  "Node.js",
  "NestJS",
  "React",
  "Vue",
  "Nuxt",
  "Next.js",
  "Laravel",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "MongoDB",
  "Docker",
  "Kafka",
  "AWS Lambda",
  "Unreal Engine",
];

const experience = [
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

function PixelHero() {
  return (
    <div className="pixel-world" aria-hidden="true">
      <div className="pixel-sun" />
      <div className="pixel-cloud cloud-a" />
      <div className="pixel-cloud cloud-b" />
      <div className="pixel-window">
        <div className="pixel-titlebar">
          <span />
          <span />
          <span />
          <strong>FULLSTACK.EXE</strong>
        </div>
        <div className="pixel-screen">
          <div className="pixel-avatar">
            <div className="avatar-head" />
            <div className="avatar-body" />
            <div className="avatar-arm arm-left" />
            <div className="avatar-arm arm-right" />
            <div className="avatar-leg leg-left" />
            <div className="avatar-leg leg-right" />
          </div>
          <div className="pixel-terminal-lines">
            <span>LOAD: BACKEND_ENGINE</span>
            <span>QUEST: SHIP_PRODUCTION</span>
            <span>STACK: REACT / NODE / LARAVEL</span>
          </div>
          <div className="pixel-hearts">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <div className="pixel-ground">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function GalleryModal({ company, gallery, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  const item = gallery[index];

  return (
    <div className="gallery-overlay" onClick={onClose}>
      <div className="gallery-modal" onClick={(event) => event.stopPropagation()}>
        <div className="gallery-modal-head">
          <span>{company}</span>
          <button type="button" className="gallery-close" onClick={onClose} aria-label="Close gallery">
            <X size={20} />
          </button>
        </div>
        <div className="gallery-modal-body">
          {gallery.length > 1 && (
            <button type="button" className="gallery-nav prev" onClick={onPrev} aria-label="Previous image">
              <ChevronLeft size={22} />
            </button>
          )}
          <img src={item.src} alt={item.caption} />
          {gallery.length > 1 && (
            <button type="button" className="gallery-nav next" onClick={onNext} aria-label="Next image">
              <ChevronRight size={22} />
            </button>
          )}
        </div>
        <div className="gallery-modal-foot">
          <p>{item.caption}</p>
          {gallery.length > 1 && (
            <span>
              {index + 1} / {gallery.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [gallery, setGallery] = useState(null);

  return (
    <main>
      <section className="hero">
        <PixelHero />
        <nav className="nav" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Home">
            JP
          </a>
          <div className="nav-links">
            <a href="#work">Work</a>
            <a href="#experience">Experience</a>
            <a href="#process">Skills</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div className="hero-copy" id="top">
          <p className="eyebrow"><Sparkles size={16} /> Player class: Fullstack Developer • 5+ years XP</p>
          <h1>Johan Andreas Pranoto</h1>
          <p className="hero-text">
            I am a fullstack developer from Surabaya with strong backend experience in commerce, ERP, payments,
            microservices, reporting, and real-time integrations.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#work">
              Start campaign <ArrowUpRight size={18} />
            </a>
            <a className="button secondary" href={asset("resume-johan-andreas-pranoto-v1.pdf")}>
              <Download size={18} /> Download CV
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <div>
            <span>Focus</span>
            <strong>Fullstack Engineering with a focus on Backend, Payments, ERP, and Scalable Systems</strong>
          </div>
          <div>
            <span>Spawn point</span>
            <strong><MapPin size={16} /> Surabaya, East Java, Indonesia</strong>
          </div>
          <div className="drag-note">
            <Gamepad2 size={17} />
            <span>Gaming & Code</span>
          </div>
        </div>
      </section>

      <section className="section intro">
        <div>
          <p className="section-kicker">Character profile</p>
          <h2>A practical engineer with backend armor, fullstack mobility, and a game-inspired eye for interfaces.</h2>
        </div>
        <p>
          I have worked across coffee commerce, Account payable ERP, e-commerce apps, and inventory systems.
          My strongest work is turning business workflows into stable APIs, reusable frontend interfaces, integrations,
          dashboards, reports, and automation that teams can depend on.
        </p>
      </section>

      <section className="section work" id="work">
        <div className="section-head">
          <p className="section-kicker">Mission log</p>
          <h2>Production systems I have shipped</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="project-visual">
                <span>{project.type}</span>
                <div className="mini-orbit" />
              </div>
              <div className="project-body">
                <p>{project.metric}</p>
                <h3>{project.title}</h3>
                <span>{project.text}</span>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <small key={tag}>{tag}</small>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section timeline" id="experience">
        <div className="section-head">
          <p className="section-kicker">Campaign timeline</p>
          <h2>5+ years leveling up production software</h2>
        </div>
        <div className="timeline-list">
          {experience.map((item) => (
            <article className="timeline-item" key={item.company}>
              <div>
                <span>{item.period}</span>
                <h3>{item.company}</h3>
              </div>
              <div>
                <div className="timeline-role">
                  <strong>{item.role}</strong>
                  {item.gallery && (
                    <button
                      type="button"
                      className="gallery-trigger"
                      onClick={() => setGallery({ company: item.company, items: item.gallery, index: 0 })}
                      aria-label={`View ${item.company} portfolio screenshots`}
                    >
                      <span className="gallery-trigger-stack">
                        {item.gallery.slice(0, 3).map((shot) => (
                          <img key={shot.src} src={shot.src} alt="" aria-hidden="true" />
                        ))}
                      </span>
                      <span className="gallery-trigger-label">
                        <span className="gallery-trigger-title">
                          <Images size={14} /> View portfolio
                        </span>
                        <span className="gallery-trigger-count">{item.gallery.length} screenshots</span>
                      </span>
                    </button>
                  )}
                </div>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section process" id="process">
        <div className="terminal">
          <div className="terminal-top">
            <TerminalSquare size={18} />
            <span>developer-loadout.ts</span>
          </div>
          <ol>
            <li><strong>01</strong><span>Backend strength: APIs, payment gateways, ERP workflows, reporting, Redis safeguards, Kafka messaging, and SQL performance.</span></li>
            <li><strong>02</strong><span>Fullstack delivery: React, Vue, Nuxt, Laravel, Node.js, reusable components, vendor portals, and production-ready admin tools.</span></li>
            <li><strong>03</strong><span>Creative edge: Game Engine learning, strong interest in game-inspired interfaces, game mechanics implementation, and animated UI interfaces for website.</span></li>
          </ol>
        </div>
        <div className="stack-panel">
          <p className="section-kicker">Skill loadout</p>
          <h2>Modern web stack with serious backend damage.</h2>
          <div className="stack-list">
            {stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact" id="contact">
        <div>
          <p className="section-kicker">Ready for next mission</p>
          <h2>Looking for a fullstack or backend developer who can carry production systems?</h2>
        </div>
        <div className="contact-actions">
          <a className="button primary" href="mailto:johanandreas74@gmail.com">
            <Mail size={18} /> johanandreas74@gmail.com
          </a>
          <a className="icon-link" href="https://github.com/hanzz96" aria-label="GitHub">
            <Code2 size={20} />
          </a>
          <a className="icon-link" href="https://www.linkedin.com/in/johan-andreas-a08402132/" aria-label="LinkedIn">
            <Briefcase size={20} />
          </a>
        </div>
      </section>

      {gallery && (
        <GalleryModal
          company={gallery.company}
          gallery={gallery.items}
          index={gallery.index}
          onClose={() => setGallery(null)}
          onPrev={() =>
            setGallery((current) => ({
              ...current,
              index: (current.index - 1 + current.items.length) % current.items.length,
            }))
          }
          onNext={() =>
            setGallery((current) => ({
              ...current,
              index: (current.index + 1) % current.items.length,
            }))
          }
        />
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
