import "./styles.css";

export default function App() {
  return (
    <div>
      <header>
        <div className="container header-inner">
          <div className="header-left">
            <div className="logo"></div>
            <h2>Lokaverkefni Marias</h2>
          </div>
          <nav className="nav">
            <a className="nav-link" href="#">
              Heim
            </a>
            <a className="nav-link" href="#">
              Uppskriftir
            </a>
            <a className="nav-link" href="#">
              Uppáhald
            </a>
            <a className="nav-link" href="#">
              Meira
            </a>
          </nav>
        </div>
      </header>

      <main>
        <div className="container">
          <section className="hero">
            <h1>Veistu ekki hvað á að vera í matinn?</h1>
            <p className="subtitle">
              Við hjálpum þér að finna það sem þig langar í
            </p>

            <div className="hero-actions">
              <button className="btn">Uppskriftir</button>
              <button className="btn secondary">Flokkar</button>
            </div>
          </section>

          <section className="featured">
            <div className="section-head">
              <h2>Skemmtilegar hugmyndir</h2>
              <a className="section-link" href="#">
                Sýna allar →
              </a>
            </div>

            <div className="card-grid">
              <div className="card">
                <div className="card-img"></div>
                <h3>Rjóma Pasta</h3>
                <p className="subtitle">Ready in 25 min</p>
              </div>

              <div className="card">
                <div className="card-img"></div>
                <h3>Fiskur</h3>
                <p className="subtitle">Ready in 30 min</p>
              </div>

              <div className="card">
                <div className="card-img"></div>
                <h3>Kjúklingur</h3>
                <p className="subtitle">Ready in 35 min</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer>
        <div className="container">
          <small>© {new Date().getFullYear()} Uppskriftir</small>
        </div>
      </footer>
    </div>
  );
}
