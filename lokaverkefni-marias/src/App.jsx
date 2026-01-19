import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles.css";
import logo from "./assets/imatinn-logo.png";

import Recipes from "./pages/Recipes";
import Category from "./pages/Category";
import RecipeDetails from "./pages/RecipeDetails";
import Favorites from "./pages/Favorites";

export default function App() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [featured, setFeatured] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState("");

  const moodMap = {
    "Ég vil eitthvað fljótlegt": {
      cats: ["Chicken", "Pasta", "Seafood"],
      img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=70",
    },
    "Hollt og gott": {
      cats: ["Vegetarian", "Seafood"],
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=70",
    },
    "Sæt löngun": {
      cats: ["Dessert"],
      img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=70",
    },
    Ævintýri: {
      cats: ["Lamb", "Goat", "Miscellaneous"],
      img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=70",
    },
  };

  function goMood(moodName) {
    const options = moodMap[moodName].cats || [];
    const pick = options[Math.floor(Math.random() * options.length)];
    if (pick) navigate(`/recipes/${pick}`);
  }

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
        setFeatured(shuffled.slice(0, 8));
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

            <input
              className="nav-search"
              type="text"
              placeholder="Leita að uppskrift..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/recipes?search=${query}`);
                  setQuery("");
                }
              }}
            />
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
                    <div className="hero-box">
                      <h1>Veistu ekki hvað á að vera í matinn?</h1>
                      <p className="subtitle">
                        Við hjálpum þér að finna það sem þig langar í
                      </p>

                      <div className="hero-actions">
                        <button
                          className="btn"
                          onClick={async () => {
                            try {
                              const res = await fetch(
                                "https://www.themealdb.com/api/json/v1/1/random.php",
                              );
                              const data = await res.json();
                              const id = data.meals?.[0]?.idMeal;
                              if (id) navigate(`/recipe/${id}`);
                            } catch (e) {
                              alert("Tókst ekki að sækja uppskrift ");
                            }
                          }}
                        >
                          Veldu fyrir mig
                        </button>
                        <button
                          className="btn secondary"
                          onClick={() => navigate("/recipes")}
                        >
                          Flokkar
                        </button>
                      </div>
                    </div>
                  </section>

                  <section className="featured">
                    <div className="section-head">
                      <h2>Skemmtilegar hugmyndir</h2>
                      <Link className="section-link" to="/recipes">
                        Sýna allar →
                      </Link>
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
                            />
                            <h3>{meal.strMeal}</h3>
                            <p className="subtitle">
                              Ready in {25 + idx * 5} min
                            </p>
                          </div>
                        ))}
                    </div>
                  </section>

                  <section className="moods">
                    <div className="section-head">
                      <h2>Veldu eftir skapi</h2>
                      <span className="subtitle">Smelltu og fáðu hugmynd</span>
                    </div>

                    <div className="mood-grid">
                      {Object.entries(moodMap).map(([mood, data]) => (
                        <button
                          key={mood}
                          className="mood-card"
                          style={{ backgroundImage: `url(${data.img})` }}
                          onClick={() => goMood(mood)}
                        >
                          <div className="mood-overlay">
                            <div className="mood-title">{mood}</div>
                            <div className="mood-sub">
                              Velur flokk fyrir þig →
                            </div>
                          </div>
                        </button>
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
          <small>
            © {new Date().getFullYear()} Lokaverkefni 1.önn - Marías Leó
          </small>
        </div>
      </footer>
    </div>
  );
}
