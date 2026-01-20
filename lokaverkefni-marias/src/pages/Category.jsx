import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Category() {
  const { category } = useParams();
  const navigate = useNavigate();

  const PAGE_SIZE = 12;

  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMeals() {
      try {
        setLoading(true);
        setError("");
        setMeals([]);
        setPage(1);

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

  const totalPages = Math.max(1, Math.ceil(meals.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const visibleMeals = meals.slice(start, start + PAGE_SIZE);

  return (
    <div className="category-page">
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

      {loading && <p className="subtitle">Sæki uppskriftir…</p>}
      {error && <p className="subtitle">{error}</p>}

      {!loading && !error && (
        <>
          <div className="card-grid">
            {visibleMeals.map((meal) => (
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
                  style={{ backgroundImage: `url(${meal.strMealThumb})` }}
                />
                <h3>{meal.strMeal}</h3>
                <p className="subtitle">Smelltu til að sjá meira</p>
              </div>
            ))}
          </div>

          {meals.length > PAGE_SIZE && (
            <div className="pagination">
              <button
                className="btn secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Fyrri
              </button>

              <span className="subtitle">
                Síða {page} / {totalPages}
              </span>

              <button
                className="btn secondary"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Næsta →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
