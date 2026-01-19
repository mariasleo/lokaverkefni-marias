import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFavoriteIds, removeFavorite } from "../favorites";

export default function Favorites() {
  const navigate = useNavigate();

  const [ids, setIds] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIds(getFavoriteIds());
  }, []);

  function handleRemove(id) {
    const next = removeFavorite(id);
    setIds(next);
    setMeals((prev) => prev.filter((m) => m.idMeal !== id));
  }

  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        setError("");
        setMeals([]);

        if (ids.length === 0) return;

        const results = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
                id,
              )}`,
            );
            if (!res.ok) throw new Error("fetch failed");
            const data = await res.json();
            return data.meals?.[0] ?? null;
          }),
        );

        setMeals(results.filter(Boolean));
      } catch (e) {
        setError("Tókst ekki að sækja uppáhald.");
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, [ids]);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Uppáhald</h1>
          <p className="subtitle">
            Hér eru uppskriftirnar sem þú hefur vistað.
          </p>
        </div>

        <Link className="back-link" to="/recipes">
          ← Til baka í flokka
        </Link>
      </div>

      {loading && <p className="subtitle">Sæki uppáhald…</p>}
      {error && <p className="subtitle">{error}</p>}

      {!loading && !error && ids.length === 0 && (
        <p className="subtitle">
          Engin uppáhald enn. Opnaðu uppskrift og ýttu á “Setja í uppáhald”.
        </p>
      )}

      {!loading && !error && meals.length > 0 && (
        <div className="card-grid">
          {meals.map((meal) => (
            <div
              key={meal.idMeal}
              className="card fav-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/recipe/${meal.idMeal}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  navigate(`/recipe/${meal.idMeal}`);
              }}
            >
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(meal.idMeal);
                }}
                aria-label="Remove from favorites"
                title="Remove"
              >
                ✕
              </button>

              <div
                className="card-img"
                style={{ backgroundImage: `url(${meal.strMealThumb})` }}
              />
              <h3>{meal.strMeal}</h3>
              <p className="subtitle">
                {meal.strCategory} • {meal.strArea}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
