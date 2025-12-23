import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";  // NEW

// Pages
import Accueil from "./pages/accueil";
import Taches from "./pages/Taches";
import AdminTaches from "./pages/AdminTaches";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/contact";
import Apropos from "./pages/Apropos";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import LoadingSpinner from "./components/common/LoadingSpinner";  // NEW

// Private Route wrapper
function PrivateRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();  // UPDATED

  if (loading) {
    return <LoadingSpinner fullPage message="Chargement..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/taches" replace />;
  }

  return children;
}

// Public Route wrapper (redirect if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();  // UPDATED

  if (loading) {
    return <LoadingSpinner fullPage message="Chargement..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/taches" replace />;
  }

  return children;
}

function App() {
  const { loading } = useAuth();  // NEW

  if (loading) {
    return <LoadingSpinner fullPage message="Initialisation..." />;
  }

  return (
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/apropos" element={<Apropos />} />

              {/* Auth Routes */}
              <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
              />

              <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
              />

              {/* Protected Routes */}
              <Route
                  path="/taches"
                  element={
                    <PrivateRoute>
                      <Taches />
                    </PrivateRoute>
                  }
              />

              <Route
                  path="/admin-taches"
                  element={
                    <PrivateRoute requireAdmin={true}>
                      <AdminTaches />
                    </PrivateRoute>
                  }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
  );
}

export default App;