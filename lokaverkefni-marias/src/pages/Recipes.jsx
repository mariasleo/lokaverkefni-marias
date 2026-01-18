import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Recipes() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

  return (
    <div className="recipes-page">
      <div className="page-head">
        <div>
          <h1>Uppskriftir</h1>
          <p className="subtitle">Veldu flokk til að skoða uppskriftir.</p>
        </div>
      </div>

      {loading && <p className="subtitle">Sæki flokka…</p>}
      {error && <p className="subtitle">{error}</p>}

      {!loading && !error && (
        <div className="cat-grid">
          {categories.map((cat) => {
            const description = (cat.strCategoryDescription || "").trim();
            const shortDescription =
              description.length > 80
                ? description.slice(0, 80) + "…"
                : description;

            return (
              <div
                key={cat.idCategory}
                className="cat-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/recipes/${cat.strCategory}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    navigate(`/recipes/${cat.strCategory}`);
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
    </div>
  );
}
