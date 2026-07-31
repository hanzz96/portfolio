import { projects } from "../data/projects.js";

export function Work() {
  return (
    <section className="section work" id="work">
      <div className="section-head" data-reveal>
        <p className="section-kicker">Mission log</p>
        <h2>Production systems I have shipped</h2>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title} data-reveal>
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
  );
}
