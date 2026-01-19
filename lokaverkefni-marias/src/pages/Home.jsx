import { Link, useNavigate } from "react-router-dom";

export default function Home({
  featured,
  featuredLoading,
  featuredError,
  moodMap,
  goMood,
}) {
  const navigate = useNavigate();

  return (
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
          {featuredLoading && <p className="subtitle">Sæki hugmyndir…</p>}
          {featuredError && <p className="subtitle">{featuredError}</p>}

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
                <p className="subtitle">Ready in {25 + idx * 5} min</p>
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
                <div className="mood-sub">Velur flokk fyrir þig →</div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
