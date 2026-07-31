import { Images } from "lucide-react";
import { experience } from "../data/experience.js";

export function Timeline({ onOpenGallery }) {
  return (
    <section className="section timeline" id="experience">
      <div className="section-head" data-reveal>
        <p className="section-kicker">Campaign timeline</p>
        <h2>5+ years leveling up production software</h2>
      </div>
      <div className="timeline-list">
        {experience.map((item) => (
          <article className="timeline-item" key={item.company} data-reveal>
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
                    onClick={() => onOpenGallery(item.company, item.gallery)}
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
  );
}
