import { type ReactNode } from 'react';
import { useAuth } from '../../providers/AuthContext';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirection logic is handled by the parent (App.tsx) 
        // which conditionally renders LoginView or Main App
        return null;
    }

    return <>{children}</>;
};
