import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...', fullPage = false }) => {
    const sizeClasses = {
        sm: 'spinner-border-sm',
        md: '',
        lg: 'spinner-border-lg'
    };

    const spinner = (
        <div className="text-center">
            <div
                className={`spinner-border text-primary ${sizeClasses[size]}`}
                role="status"
            >
                <span className="visually-hidden">Loading...</span>
            </div>
            {message && <p className="mt-2 text-muted">{message}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;