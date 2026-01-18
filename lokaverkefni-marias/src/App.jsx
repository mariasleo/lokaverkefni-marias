import { Routes, Route, Link } from "react-router-dom";
import "./styles.css";
import Recipes from "./pages/Recipes";
import Category from "./pages/Category";
import RecipeDetails from "./pages/RecipeDetails";

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
            <Link className="nav-link" to="/">
              Heim
            </Link>
            <Link className="nav-link" to="/recipes">
              Uppskriftir
            </Link>
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
          <Routes>
            <Route
              path="/"
              element={
                <>
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
                </>
              }
            />

            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:category" element={<Category />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
          </Routes>
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
