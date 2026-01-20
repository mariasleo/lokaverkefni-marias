import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isFavorite, toggleFavorite } from "../favorites";

function getIngredients(meal) {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      items.push(`${(meas || "").trim()} ${ing.trim()}`.trim());
    }
  }
  return items;
}

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fav, setFav] = useState(false);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    async function loadMeal() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
            id,
          )}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const found = data.meals?.[0] ?? null;

        setMeal(found);
        setFav(found ? isFavorite(found.idMeal) : false);
      } catch (e) {
        setError("Tókst ekki að sækja uppskrift.");
      } finally {
        setLoading(false);
      }
    }

    loadMeal();
  }, [id]);

  useEffect(() => {
    if (!meal) return;

    async function loadSimilar() {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
            meal.strCategory,
          )}`,
        );
        if (!res.ok) {
          setSimilar([]);
          return;
        }

        const data = await res.json();
        const list = data.meals ?? [];

        const shuffled = [...list]
          .filter((x) => x.idMeal !== meal.idMeal)
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);

        setSimilar(shuffled);
      } catch {
        setSimilar([]);
      }
    }

    loadSimilar();
  }, [meal]);

  function handleFav() {
    if (!meal) return;
    toggleFavorite(meal.idMeal);
    setFav(isFavorite(meal.idMeal));
  }

  if (loading) return <p className="subtitle">Sæki uppskrift…</p>;

  if (error || !meal) {
    return (
      <div>
        <Link className="back-link" to="/recipes">
          ← Til baka í flokka
        </Link>
        <p className="subtitle">{error || "Uppskrift fannst ekki."}</p>
      </div>
    );
  }

  const ingredients = getIngredients(meal);

  return (
    <div className="details">
      <Link className="back-link" to="/recipes">
        ← Til baka í flokka
      </Link>

      <div className="details-head">
        <div>
          <h1 className="details-title">{meal.strMeal}</h1>
          <p className="details-meta">
            {meal.strCategory} • {meal.strArea}
          </p>
        </div>

        <button className="btn" onClick={handleFav}>
          {fav ? "Fjarlægja úr uppáhaldi" : "Setja í uppáhald"}
        </button>
      </div>

      <div className="details-top">
        <img
          className="details-img"
          src={meal.strMealThumb}
          alt={meal.strMeal}
        />

        <div className="details-box">
          <h2>Hráefni</h2>
          <ul className="details-list">
            {ingredients.map((x, idx) => (
              <li key={idx} className="subtitle">
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="details-box" style={{ marginTop: 18 }}>
        <h2>Leiðbeiningar</h2>
        <p className="subtitle" style={{ whiteSpace: "pre-line" }}>
          {meal.strInstructions}
        </p>
      </div>

      {similar.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <div className="section-head">
            <h2>Svipaðar uppskriftir</h2>
          </div>

          <div className="card-grid">
            {similar.map((x) => (
              <div
                key={x.idMeal}
                className="card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/recipe/${x.idMeal}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    navigate(`/recipe/${x.idMeal}`);
                }}
              >
                <div
                  className="card-img"
                  style={{ backgroundImage: `url(${x.strMealThumb})` }}
                />
                <h3>{x.strMeal}</h3>
                <p className="subtitle">Svipuð uppskrift</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
