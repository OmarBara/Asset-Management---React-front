import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark' | 'outline-primary' | 'outline-secondary' | 'outline-danger' | 'outline-success' | 'outline-warning' | 'outline-info' | 'outline-light' | 'outline-dark';
    size?: 'sm' | 'md' | 'lg';
    icon?: ReactNode;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    ...props
}: ButtonProps) => {
    const sizeClass = size === 'md' ? '' : `btn-${size}`;
    return (
        <button
            className={`btn btn-${variant} ${sizeClass} ${className}`}
            {...props}
        >
            {icon && <span className="me-2">{icon}</span>}
            {children}
        </button>
    );
};
