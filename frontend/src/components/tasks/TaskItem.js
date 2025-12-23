import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Task item component for displaying individual tasks
 */
const TaskItem = ({
                      task,
                      onToggleComplete,
                      onEdit,
                      onDelete,
                      isEditing,
                      editText,
                      onEditChange,
                      onSaveEdit,
                      onCancelEdit,
                      isAdmin = false,
                  }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDeleteClick = () => {
        if (isAdmin) {
            setShowConfirm(true);
        } else {
            onDelete(task.id);
        }
    };

    const confirmDelete = () => {
        onDelete(task.id);
        setShowConfirm(false);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };

    if (isEditing) {
        return (
            <li className="list-group-item d-flex justify-content-between align-items-center">
                <input
                    type="text"
                    className="form-control me-3"
                    value={editText}
                    onChange={(e) => onEditChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onSaveEdit()}
                    autoFocus
                />
                <div>
                    <button
                        className="btn btn-sm btn-success me-2"
                        onClick={onSaveEdit}
                        disabled={!editText.trim()}
                    >
                        Save
                    </button>
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={onCancelEdit}
                    >
                        Cancel
                    </button>
                </div>
            </li>
        );
    }

    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
                <input
                    type="checkbox"
                    className="form-check-input me-3"
                    checked={task.done}
                    onChange={() => onToggleComplete(task)}
                    style={{ cursor: 'pointer' }}
                />
                <div>
          <span
              style={{
                  textDecoration: task.done ? 'line-through' : 'none',
                  opacity: task.done ? 0.7 : 1,
              }}
          >
            {task.task}
          </span>
                    {task.done && (
                        <span className="badge bg-success ms-2">Completed</span>
                    )}
                    {task.gestionnaire && !isAdmin && (
                        <small className="text-muted d-block mt-1">
                            Created by: {task.gestionnaire}
                        </small>
                    )}
                </div>
            </div>

            <div>
                <button
                    className={`btn btn-sm me-2 ${task.done ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => onToggleComplete(task)}
                    title={task.done ? 'Mark as pending' : 'Mark as complete'}
                >
                    {task.done ? '↩️' : '✓'}
                </button>

                <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                >
                    ✏️
                </button>

                {isAdmin && (
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={handleDeleteClick}
                        title="Delete task"
                    >
                        🗑️
                    </button>
                )}
            </div>

            {/* Delete confirmation modal */}
            {showConfirm && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this task?
                                <p className="mt-2 text-muted"><strong>{task.task}</strong></p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={cancelDelete}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
};

TaskItem.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.number.isRequired,
        task: PropTypes.string.isRequired,
        done: PropTypes.bool.isRequired,
        gestionnaire: PropTypes.string,
    }).isRequired,
    onToggleComplete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    isEditing: PropTypes.bool,
    editText: PropTypes.string,
    onEditChange: PropTypes.func,
    onSaveEdit: PropTypes.func,
    onCancelEdit: PropTypes.func,
    isAdmin: PropTypes.bool,
};

export default TaskItem;