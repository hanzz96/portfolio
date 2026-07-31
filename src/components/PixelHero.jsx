export function PixelHero() {
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
