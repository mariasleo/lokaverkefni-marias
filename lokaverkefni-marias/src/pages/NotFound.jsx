import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound">
      <h1>404</h1>
      <p className="subtitle">Síðan fannst ekki.</p>

      <Link className="btn" to="/">
        Fara á forsíðu
      </Link>
    </div>
  );
}
