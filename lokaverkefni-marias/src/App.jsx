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
          <h1>Heim</h1>
          <p>Meira kemur seinna</p>
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
