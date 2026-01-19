import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Recipes() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read ?search= from URL
  const search = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("search") || "").trim();
  }, [location.search]);

  // Categories (shown only when NOT searching)
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState("");

  // Recipe search results (shown only when searching)
  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState("");

  // Load categories once (for normal mode)
  useEffect(() => {
    async function loadCategories() {
      try {
        setCatLoading(true);
        setCatError("");

        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/categories.php",
        );
        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        setCategories(data.categories ?? []);
      } catch (e) {
        setCatError("Tókst ekki að sækja flokka.");
      } finally {
        setCatLoading(false);
      }
    }

    loadCategories();
  }, []);

  // Search recipes by name whenever search changes
  useEffect(() => {
    if (!search) {
      setResults([]);
      setResultsError("");
      setResultsLoading(false);
      return;
    }

    async function searchRecipes() {
      try {
        setResultsLoading(true);
        setResultsError("");

        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
            search,
          )}`,
        );
        if (!res.ok) throw new Error("Failed to search recipes");

        const data = await res.json();
        setResults(data.meals ?? []);
      } catch (e) {
        setResultsError("Tókst ekki að leita að uppskriftum.");
        setResults([]);
      } finally {
        setResultsLoading(false);
      }
    }

    searchRecipes();
  }, [search]);

  return (
    <div className="recipes-page">
      <div className="page-head">
        <div>
          <h1>Uppskriftir</h1>
          <p className="subtitle">
            {search
              ? `Leitarniðurstöður fyrir: "${search}"`
              : "Veldu flokk til að skoða uppskriftir."}
          </p>
        </div>
      </div>

      {/* ============ SEARCH MODE (ONLY RECIPES) ============ */}
      {search && (
        <>
          {resultsLoading && <p className="subtitle">Leita að uppskriftum…</p>}
          {resultsError && <p className="subtitle">{resultsError}</p>}

          {!resultsLoading && !resultsError && results.length === 0 && (
            <p className="subtitle">Engar uppskriftir fundust.</p>
          )}

          {!resultsLoading && !resultsError && results.length > 0 && (
            <div className="card-grid">
              {results.map((meal) => (
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
                  <p className="subtitle">
                    {meal.strCategory}
                    {meal.strArea ? ` • ${meal.strArea}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ============ NORMAL MODE (CATEGORIES) ============ */}
      {!search && (
        <>
          {catLoading && <p className="subtitle">Sæki flokka…</p>}
          {catError && <p className="subtitle">{catError}</p>}

          {!catLoading && !catError && (
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
        </>
      )}
    </div>
  );
}
