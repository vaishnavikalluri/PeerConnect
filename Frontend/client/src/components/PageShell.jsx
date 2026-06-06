function PageShell({ eyebrow, title, description, actions, children }) {
  return (
    <section className="page-shell">
      <header className="page-hero">
        <div className="page-hero__top">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1>{title}</h1>
            <p className="page-lead">{description}</p>
          </div>
          {actions ? <div className="hero-actions">{actions}</div> : null}
        </div>
      </header>
      {children}
    </section>
  )
}

export default PageShell