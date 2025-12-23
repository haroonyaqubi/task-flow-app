import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from '../api/auth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';

function Login() {
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear server error
    if (serverError) setServerError("");
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est obligatoire.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Le mot de passe est obligatoire.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setServerError("");

      // 1. Login and get JWT tokens
      const loginResult = await authApi.login({
        username: formData.username,
        password: formData.password,
      });

      if (!loginResult.success) {
        throw new Error(loginResult.error?.detail || "Échec de la connexion");
      }

      const { access, refresh } = loginResult.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // 2. Get user info
      const userResult = await authApi.getCurrentUser();

      if (userResult.success) {
        const { est_admin } = userResult.data;
        localStorage.setItem("user", JSON.stringify(userResult.data));
        localStorage.setItem("is_staff", est_admin || false);

        // 3. Redirect based on role
        navigate(est_admin ? "/admin-taches" : "/taches");
      } else {
        throw new Error("Impossible de récupérer les informations utilisateur");
      }

    } catch (err) {
      console.error("Login error:", err);

      let errorMessage = "Une erreur est survenue lors de la connexion.";

      if (err.message.includes("401") || err.message.includes("invalid")) {
        errorMessage = "Nom d'utilisateur ou mot de passe incorrect.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setServerError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  // Check if already logged in (optional)
  if (authApi.isAuthenticated()) {
    navigate("/taches");
    return <LoadingSpinner message="Redirection..." />;
  }

  return (
      <div className="container d-flex justify-content-center align-items-center mt-5">
        <div className="card shadow p-4 bg-light" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="text-center mb-4">Connexion</h3>

          {/* Server error message */}
          {serverError && (
              <AlertMessage
                  type="error"
                  message={serverError}
                  onClose={() => setServerError("")}
                  className="mb-3"
              />
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Username field */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Nom d'utilisateur <span className="text-danger">*</span>
              </label>
              <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`form-control ${errors.username ? "is-invalid" : ""}`}
                  placeholder="Entrez votre nom d'utilisateur"
                  disabled={loading}
              />
              {errors.username && (
                  <div className="text-danger small mt-1">{errors.username}</div>
              )}
            </div>

            {/* Password field */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Mot de passe <span className="text-danger">*</span>
              </label>
              <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Entrez votre mot de passe"
                  disabled={loading}
              />
              {errors.password && (
                  <div className="text-danger small mt-1">{errors.password}</div>
              )}
            </div>

            {/* Submit button */}
            <button
                type="submit"
                className="btn btn-lg w-100"
                style={{ backgroundColor: "#7C3AED", color: "white" }}
                disabled={loading}
            >
              {loading ? (
                  <>
                <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                ></span>
                    Connexion...
                  </>
              ) : (
                  "Connexion"
              )}
            </button>

            {/* Registration link */}
            <div className="text-center mt-3">
              <p className="mb-0">
                Pas encore de compte?{" "}
                <a href="/register" className="text-decoration-none" style={{ color: "#7C3AED" }}>
                  S'inscrire
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
  );
}

export default Login;