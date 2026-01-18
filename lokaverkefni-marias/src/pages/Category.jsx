import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Category() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMeals() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
            category,
          )}`,
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setMeals(data.meals ?? []);
      } catch (e) {
        setError("Tókst ekki að sækja uppskriftir.");
      } finally {
        setLoading(false);
      }
    }

    loadMeals();
  }, [category]);

  return (
    <div className="category-page">
      {/* HEADER */}
      <div className="page-head">
        <div>
          <Link className="back-link" to="/recipes">
            ← Til baka í flokka
          </Link>

          <h1>{category}</h1>
          <p className="subtitle">
            {loading ? "" : `${meals.length} uppskriftir fundust`}
          </p>
        </div>
      </div>

      {/* STATES */}
      {loading && <p className="subtitle">Sæki uppskriftir…</p>}
      {error && <p className="subtitle">{error}</p>}

      {/* MEALS */}
      {!loading && !error && (
        <div className="card-grid">
          {meals.map((meal) => (
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
              <img
                className="card-img"
                src={meal.strMealThumb}
                alt={meal.strMeal}
              />
              <h3>{meal.strMeal}</h3>
              <p className="subtitle">Smelltu til að sjá meira</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
