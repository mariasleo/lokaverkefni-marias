import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMeal() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setMeal(data.meals?.[0] ?? null);
      } catch (e) {
        setError("Tókst ekki að sækja uppskrift.");
      } finally {
        setLoading(false);
      }
    }

    loadMeal();
  }, [id]);

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

      <h1>{meal.strMeal}</h1>
      <p className="subtitle">
        {meal.strCategory} • {meal.strArea}
      </p>

      <img className="details-img" src={meal.strMealThumb} alt={meal.strMeal} />

      <div className="details-grid">
        <div className="details-box">
          <h2>Hráefni</h2>
          <ul>
            {ingredients.map((x, idx) => (
              <li key={idx} className="subtitle">
                {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="details-box">
          <h2>Leiðbeiningar</h2>
          <p className="subtitle" style={{ whiteSpace: "pre-line" }}>
            {meal.strInstructions}
          </p>
        </div>
      </div>
    </div>
  );
}
