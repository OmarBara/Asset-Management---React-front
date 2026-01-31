import { useState } from 'react';
import { useAuth } from '../../providers/AuthContext';
import { Button } from '../../components/shared/Button';

export const LoginView = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(username, password);
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="vh-100 d-flex align-items-center justify-content-center bg-dark text-white px-3" style={{
            background: 'radial-gradient(circle at top right, #1a1a2e, #16213e, #0f3460)'
        }}>
            <div className="card bg-dark border-secondary shadow-lg" style={{ maxWidth: '400px', width: '100%', borderRadius: '16px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(26, 26, 46, 0.8)' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle mb-3" style={{ width: '64px', height: '64px', fontSize: '2rem' }}>
                            📦
                        </div>
                        <h2 className="fw-bold">AssetFlow</h2>
                        <p className="text-secondary small">Enter your credentials to access your account</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 small border-0 bg-danger bg-opacity-10 text-danger mb-4" role="alert">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small text-secondary fw-bold">USERNAME</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ borderRadius: '8px', padding: '12px' }}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label small text-secondary fw-bold">PASSWORD</label>
                            <input
                                type="password"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ borderRadius: '8px', padding: '12px' }}
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-100 py-3 fw-bold"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : null}
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-secondary smaller mb-0">Mock Login: <strong>admin</strong> / <strong>password</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
