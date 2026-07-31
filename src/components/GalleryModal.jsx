import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function GalleryModal({ company, gallery, index, onClose, onPrev, onNext }) {
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
