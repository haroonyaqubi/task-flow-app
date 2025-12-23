import React, { useEffect, useState } from 'react';
import { taskApi } from '../api/tasks';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';

function Taches({ isAdmin = false }) {
  // State management
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [count, setCount] = useState(0);

  const token = localStorage.getItem("access");

  // Fetch tasks from API
  const fetchTasks = async (url = "tasks/") => {
    if (!token) return;

    setLoading(true);
    setError("");

    const result = await taskApi.getTasks(url);

    if (result.success) {
      setTasks(Array.isArray(result.data.results) ? result.data.results : []);
      setNextUrl(result.data.next);
      setPrevUrl(result.data.previous);
      setCount(result.data.count || 0);
    } else {
      setError(result.error?.message || "Impossible de charger les tâches.");
    }

    setLoading(false);
  };

  // Load tasks on component mount
  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  // Add new task
  const addTask = async (e) => {
    e.preventDefault();

    if (!newTask.trim()) {
      setError("La tâche ne peut pas être vide");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    const result = await taskApi.createTask({ task: newTask });

    if (result.success) {
      setNewTask("");
      setSuccess("Tâche ajoutée avec succès!");
      setTimeout(() => setSuccess(""), 3000);
      fetchTasks();
    } else {
      setError(result.error?.task?.[0] || "Erreur lors de l'ajout.");
    }

    setSubmitting(false);
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;

    setLoading(true);
    setError("");

    const result = await taskApi.deleteTask(id);

    if (result.success) {
      setSuccess("Tâche supprimée avec succès!");
      setTimeout(() => setSuccess(""), 3000);
      fetchTasks();
    } else {
      setError("Erreur lors de la suppression.");
      setLoading(false);
    }
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task);
    setEditTaskText(task.task);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTask(null);
    setEditTaskText("");
  };

  // Save edited task
  const saveEdit = async () => {
    if (!editTaskText.trim() || !editingTask) return;

    setLoading(true);
    setError("");

    const result = await taskApi.updateTask(editingTask.id, {
      task: editTaskText,
      done: editingTask.done,
    });

    if (result.success) {
      setSuccess("Tâche modifiée avec succès!");
      setTimeout(() => setSuccess(""), 3000);
      cancelEditing();
      fetchTasks();
    } else {
      setError(result.error?.task?.[0] || "Erreur lors de la modification.");
      setLoading(false);
    }
  };

  // Toggle task completion status
  const toggleDone = async (task) => {
    setLoading(true);
    setError("");

    const result = task.done
        ? await taskApi.markPending(task.id)
        : await taskApi.markComplete(task.id);

    if (result.success) {
      fetchTasks();
    } else {
      setError("Erreur lors de la mise à jour du statut.");
      setLoading(false);
    }
  };

  // Check if user is logged in
  if (!token) {
    return (
        <div className="container mt-5 text-center">
          <div className="alert alert-warning">
            <h4>Accès non autorisé</h4>
            <p>Vous devez être connecté pour voir vos tâches.</p>
            <a href="/login" className="btn btn-primary">Se connecter</a>
          </div>
        </div>
    );
  }

  return (
      <div className="container mt-5">
        <h3 className="mb-3">Mes Tâches</h3>

        {/* Show alerts */}
        {error && (
            <AlertMessage
                type="error"
                message={error}
                onClose={() => setError("")}
            />
        )}

        {success && (
            <AlertMessage
                type="success"
                message={success}
                onClose={() => setSuccess("")}
            />
        )}

        {/* Show loading spinner */}
        {loading && <LoadingSpinner message="Chargement des tâches..." />}

        {/* Add task form */}
        <form onSubmit={addTask} className="d-flex mb-3">
          <input
              type="text"
              className="form-control me-2"
              placeholder="Nouvelle tâche"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              disabled={submitting || loading}
          />
          <button
              type="submit"
              className="btn"
              style={{ backgroundColor: "#7C3AED", color: "white" }}
              disabled={submitting || loading}
          >
            {submitting ? "Ajout..." : "Ajouter"}
          </button>
        </form>

        {/* Task list */}
        {!loading && tasks.length === 0 ? (
            <div className="alert alert-info">
              Aucune tâche pour le moment. Ajoutez votre première tâche!
            </div>
        ) : (
            <ul className="list-group">
              {tasks.map((task) => (
                  <li
                      key={task.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {/* Edit mode or view mode */}
                    {editingTask?.id === task.id ? (
                        <input
                            type="text"
                            className="form-control me-3"
                            value={editTaskText}
                            onChange={(e) => setEditTaskText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                            autoFocus
                        />
                    ) : (
                        <span style={{ textDecoration: task.done ? "line-through" : "none" }}>
                  {task.task}
                          {task.done && <span className="badge bg-success ms-2">Terminée</span>}
                          {task.gestionnaire && !isAdmin && (
                              <small className="text-muted d-block mt-1">
                                Créée par: {task.gestionnaire}
                              </small>
                          )}
                </span>
                    )}

                    {/* Action buttons */}
                    <div>
                      {editingTask?.id === task.id ? (
                          <>
                            <button
                                className="btn btn-sm btn-success me-2"
                                onClick={saveEdit}
                                disabled={!editTaskText.trim()}
                            >
                              Sauvegarder
                            </button>
                            <button
                                className="btn btn-sm btn-secondary"
                                onClick={cancelEditing}
                            >
                              Annuler
                            </button>
                          </>
                      ) : (
                          <>
                            <button
                                className={`btn btn-sm me-2 ${task.done ? "btn-warning" : "btn-success"}`}
                                onClick={() => toggleDone(task)}
                                disabled={loading}
                                title={task.done ? "Marquer comme en attente" : "Marquer comme terminée"}
                            >
                              {task.done ? "En attente" : "Terminer"}
                            </button>
                            <button
                                className="btn btn-sm btn-primary me-2"
                                onClick={() => startEditing(task)}
                                disabled={loading}
                                title="Modifier la tâche"
                            >
                              Modifier
                            </button>
                            {isAdmin && (
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => deleteTask(task.id)}
                                    disabled={loading}
                                    title="Supprimer la tâche"
                                >
                                  Supprimer
                                </button>
                            )}
                          </>
                      )}
                    </div>
                  </li>
              ))}
            </ul>
        )}

        {/* Pagination controls */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <button
              className="btn"
              style={{ backgroundColor: "#7C3AED", color: "white" }}
              onClick={() => prevUrl && fetchTasks(prevUrl)}
              disabled={!prevUrl || loading}
          >
            Précédent
          </button>
          <span>{count} tâches au total</span>
          <button
              className="btn"
              style={{ backgroundColor: "#7C3AED", color: "white" }}
              onClick={() => nextUrl && fetchTasks(nextUrl)}
              disabled={!nextUrl || loading}
          >
            Suivant
          </button>
        </div>
      </div>
  );
}

export default Taches;