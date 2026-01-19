import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles.css";

import Home from "./pages/Home";
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
    const options = moodMap[moodName]?.cats || [];
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
      } catch {
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
                  const q = query.trim();
                  if (!q) return;
                  navigate(`/recipes?search=${encodeURIComponent(q)}`);
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
                <Home
                  featured={featured}
                  featuredLoading={featuredLoading}
                  featuredError={featuredError}
                  moodMap={moodMap}
                  goMood={goMood}
                />
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
