import { Routes, Route, Link } from "react-router-dom";
import "./styles.css";
import Recipes from "./pages/Recipes";
import Category from "./pages/Category";
import RecipeDetails from "./pages/RecipeDetails";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Favorites from "./pages/Favorites";

export default function App() {
  const navigate = useNavigate();

  const [featured, setFeatured] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState("");

  useEffect(() => {
    async function loadFeatured() {
      try {
        setFeaturedLoading(true);
        setFeaturedError("");

        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/search.php?f=a",
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const list = data.meals ?? [];

        const shuffled = [...list].sort(() => Math.random() - 0.5);
        setFeatured(shuffled.slice(0, 4));
      } catch (e) {
        setFeaturedError("Tókst ekki að sækja hugmyndir.");
      } finally {
        setFeaturedLoading(false);
      }
    }

    loadFeatured();
  }, []);
  return (
    <div>
      <header>
        <div className="container">
          <nav className="nav">
            <Link className="nav-link" to="/">
              Heim
            </Link>
            <Link className="nav-link" to="/recipes">
              Uppskriftir
            </Link>
            <Link className="nav-link" to="/favorites">
              Uppáhald
            </Link>
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
                    <div className="hero-box hero-grid">
                      <div>
                        <h1>Veistu ekki hvað á að vera í matinn?</h1>
                        <p className="subtitle">
                          Við hjálpum þér að finna það sem þig langar í
                        </p>
                      </div>

                      <div className="hero-actions">
                        <button className="btn">Uppskriftir</button>
                        <button className="btn secondary">Flokkar</button>
                      </div>
                    </div>
                  </section>

                  <section className="featured">
                    <div className="section-head">
                      <h2>Skemmtilegar hugmyndir</h2>
                      <a className="section-link" href="/recipes">
                        Sýna allar →
                      </a>
                    </div>

                    <div className="card-grid">
                      {featuredLoading && (
                        <p className="subtitle">Sæki hugmyndir…</p>
                      )}
                      {featuredError && (
                        <p className="subtitle">{featuredError}</p>
                      )}

                      {!featuredLoading &&
                        !featuredError &&
                        featured.map((meal, idx) => (
                          <div
                            key={meal.idMeal}
                            className="card"
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate(`/recipe/${meal.idMeal}`)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ")
                                navigate(`/recipe/${meal.idMeal}`);
                            }}
                          >
                            <div
                              className="card-img"
                              style={{
                                backgroundImage: `url(${meal.strMealThumb})`,
                              }}
                            ></div>

                            <h3>{meal.strMeal}</h3>

                            <p className="subtitle">
                              Ready in {25 + idx * 5} min
                            </p>
                          </div>
                        ))}
                    </div>
                  </section>
                </>
              }
            />

            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:category" element={<Category />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/favorites" element={<Favorites />} />
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
