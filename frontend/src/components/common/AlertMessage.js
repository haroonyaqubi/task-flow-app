import React from 'react';

const AlertMessage = ({
                          type = 'info',
                          message,
                          onClose,
                          dismissible = true,
                          className = '',
                      }) => {
    if (!message) return null;

    const alertClasses = {
        success: 'alert-success',
        error: 'alert-danger',
        warning: 'alert-warning',
        info: 'alert-info',
    };

    return (
        <div
            className={`alert ${alertClasses[type]} ${dismissible ? 'alert-dismissible fade show' : ''} ${className}`}
            role="alert"
        >
            {message}
            {dismissible && onClose && (
                <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                />
            )}
        </div>
    );
};

export default AlertMessage;