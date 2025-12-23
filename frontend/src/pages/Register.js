import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from '../api/auth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';

function Register() {
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    consentement_rgpd: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear server messages
    if (serverError) setServerError("");
    if (success) setSuccess("");
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est obligatoire.";
    } else if (formData.username.length < 3) {
      newErrors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères.";
    }

    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = "Le prénom est obligatoire.";
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Le nom est obligatoire.";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Veuillez entrer un email valide.";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Le mot de passe est obligatoire.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    // GDPR consent validation
    if (!formData.consentement_rgpd) {
      newErrors.consentement_rgpd = "Vous devez accepter la politique de confidentialité.";
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
      setSuccess("");

      // Prepare registration data
      const registrationData = {
        username: formData.username.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        consentement_rgpd: formData.consentement_rgpd,
      };

      // Register user
      const result = await authApi.register(registrationData);

      if (result.success) {
        setSuccess("Inscription réussie! Vous pouvez maintenant vous connecter.");

        // Clear form
        setFormData({
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          confirmPassword: "",
          consentement_rgpd: false,
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);

      } else {
        throw new Error(result.error || "Échec de l'inscription");
      }

    } catch (err) {
      console.error("Registration error:", err);

      let errorMessage = "Une erreur est survenue lors de l'inscription.";

      if (err.message.includes("username already exists")) {
        errorMessage = "Ce nom d'utilisateur est déjà pris.";
      } else if (err.message.includes("email already exists")) {
        errorMessage = "Cet email est déjà utilisé.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setServerError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  // Check if already logged in
  if (authApi.isAuthenticated()) {
    navigate("/taches");
    return <LoadingSpinner message="Redirection..." />;
  }

  return (
      <div className="container d-flex justify-content-center align-items-center mt-4">
        <div className="card shadow p-4 bg-light mb-5" style={{ maxWidth: "500px", width: "100%" }}>
          <h3 className="text-center mb-4">S'inscrire</h3>

          {/* Success message */}
          {success && (
              <AlertMessage
                  type="success"
                  message={success}
                  className="mb-3"
              />
          )}

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
            {/* Username */}
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
                  placeholder="Choisissez un nom d'utilisateur"
                  disabled={loading}
              />
              {errors.username && (
                  <div className="text-danger small mt-1">{errors.username}</div>
              )}
            </div>

            {/* First and Last name */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="first_name" className="form-label">
                  Prénom <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
                    placeholder="Votre prénom"
                    disabled={loading}
                />
                {errors.first_name && (
                    <div className="text-danger small mt-1">{errors.first_name}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="last_name" className="form-label">
                  Nom <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
                    placeholder="Votre nom"
                    disabled={loading}
                />
                {errors.last_name && (
                    <div className="text-danger small mt-1">{errors.last_name}</div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email <span className="text-danger">*</span>
              </label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="exemple@email.com"
                  disabled={loading}
              />
              {errors.email && (
                  <div className="text-danger small mt-1">{errors.email}</div>
              )}
            </div>

            {/* Password */}
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
                  placeholder="Au moins 6 caractères"
                  disabled={loading}
              />
              {errors.password && (
                  <div className="text-danger small mt-1">{errors.password}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe <span className="text-danger">*</span>
              </label>
              <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  placeholder="Répétez votre mot de passe"
                  disabled={loading}
              />
              {errors.confirmPassword && (
                  <div className="text-danger small mt-1">{errors.confirmPassword}</div>
              )}
            </div>

            {/* GDPR Consent */}
            <div className="mb-3 form-check">
              <input
                  type="checkbox"
                  id="consentement_rgpd"
                  name="consentement_rgpd"
                  checked={formData.consentement_rgpd}
                  onChange={handleChange}
                  className={`form-check-input ${errors.consentement_rgpd ? "is-invalid" : ""}`}
                  disabled={loading}
              />
              <label htmlFor="consentement_rgpd" className="form-check-label">
                J'accepte les{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#7C3AED" }}>
                  conditions d'utilisation
                </a>{" "}
                et la{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#7C3AED" }}>
                  politique de confidentialité
                </a>
                <span className="text-danger">*</span>
              </label>
              {errors.consentement_rgpd && (
                  <div className="text-danger small mt-1">{errors.consentement_rgpd}</div>
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
                    Inscription...
                  </>
              ) : (
                  "S'inscrire"
              )}
            </button>

            {/* Login link */}
            <div className="text-center mt-3">
              <p className="mb-0">
                Déjà inscrit?{" "}
                <a href="/login" className="text-decoration-none" style={{ color: "#7C3AED" }}>
                  Se connecter
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
  );
}

export default Register;