import { useEffect, useState } from "react";

export default function Recipes() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // meals for selected category
  const [meals, setMeals] = useState([]);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [mealsError, setMealsError] = useState("");

  // 1) Load categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/categories.php",
        );
        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        setCategories(data.categories ?? []);
      } catch (e) {
        setError("Tókst ekki að sækja flokka.");
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  // 2) Whenever selected changes, load meals for that category
  useEffect(() => {
    if (!selected) return;

    async function loadMealsForCategory() {
      try {
        setMealsLoading(true);
        setMealsError("");
        setMeals([]);

        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(selected)}`,
        );
        if (!res.ok) throw new Error("Failed to fetch meals");

        const data = await res.json();
        setMeals(data.meals ?? []);
      } catch (e) {
        setMealsError("Tókst ekki að sækja uppskriftir fyrir þennan flokk.");
      } finally {
        setMealsLoading(false);
      }
    }

    loadMealsForCategory();
  }, [selected]);

  return (
    <div className="recipes-page">
      <div className="page-head">
        <div>
          <h1>Uppskriftir</h1>
          <p className="subtitle">Veldu flokk til að skoða uppskriftir.</p>
        </div>

        <div className="selected-box">
          <span className="subtitle">Valið:</span>
          <strong>{selected || "Ekkert"}</strong>
        </div>
      </div>

      {loading && <p className="subtitle">Sæki flokka…</p>}
      {error && <p className="subtitle">{error}</p>}

      {!loading && !error && (
        <div className="cat-grid">
          {categories.map((cat) => {
            const isActive = selected === cat.strCategory;

            const description = (cat.strCategoryDescription || "").trim();
            const shortDescription =
              description.length > 80
                ? description.slice(0, 80) + "…"
                : description;

            return (
              <div
                key={cat.idCategory}
                className={`cat-card ${isActive ? "active" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(cat.strCategory)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setSelected(cat.strCategory);
                }}
              >
                <img
                  src={cat.strCategoryThumb}
                  alt={cat.strCategory}
                  className="cat-img"
                  loading="lazy"
                />
                <div className="cat-content">
                  <h3>{cat.strCategory}</h3>
                  <p className="subtitle">{shortDescription}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Meals section */}
      {selected && (
        <section style={{ marginTop: 28 }}>
          <div className="section-head">
            <h2>{selected} uppskriftir</h2>
            <span className="subtitle">
              {meals.length ? `${meals.length} niðurstöður` : ""}
            </span>
          </div>

          {mealsLoading && <p className="subtitle">Sæki uppskriftir…</p>}
          {mealsError && <p className="subtitle">{mealsError}</p>}

          {!mealsLoading && !mealsError && meals.length === 0 && (
            <p className="subtitle">
              Engar uppskriftir fundust í þessum flokki.
            </p>
          )}

          {!mealsLoading && !mealsError && meals.length > 0 && (
            <div className="card-grid">
              {meals.map((meal) => (
                <div className="card" key={meal.idMeal}>
                  <img
                    className="card-img"
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                  />
                  <h3>{meal.strMeal}</h3>
                  <p className="subtitle">ID: {meal.idMeal}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
