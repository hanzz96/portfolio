import { useState } from "react";
import "./styles.css";
import { useScrollReveal } from "./hooks/useScrollReveal.js";
import { QuestProgress } from "./components/QuestProgress.jsx";
import { GalleryModal } from "./components/GalleryModal.jsx";
import { Hero } from "./sections/Hero.jsx";
import { Intro } from "./sections/Intro.jsx";
import { Work } from "./sections/Work.jsx";
import { Timeline } from "./sections/Timeline.jsx";
import { Process } from "./sections/Process.jsx";
import { Contact } from "./sections/Contact.jsx";

export default function App() {
  const [gallery, setGallery] = useState(null);
  useScrollReveal();

  return (
    <main>
      <QuestProgress />
      <Hero />
      <Intro />
      <Work />
      <Timeline onOpenGallery={(company, items) => setGallery({ company, items, index: 0 })} />
      <Process />
      <Contact />

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
