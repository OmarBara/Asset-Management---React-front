import { useState } from 'react';

interface ListManagerProps {
    title: string;
    items: string[];
    onAdd: (item: string) => void;
    onDelete: (item: string) => void;
    placeholder?: string;
}

export const ListManager = ({ title, items, onAdd, onDelete, placeholder }: ListManagerProps) => {
    const [newItem, setNewItem] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim()) {
            onAdd(newItem.trim());
            setNewItem('');
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-transparent border-bottom border-secondary py-3">
                <h5 className="card-title fw-bold mb-0">{title}</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={placeholder || `Add new ${title.toLowerCase().slice(0, -1)}...`}
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={!newItem.trim()}
                        >
                            Add
                        </button>
                    </div>
                </form>

                <div className="list-group list-group-flush">
                    {items.map((item) => (
                        <div key={item} className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-3 border-secondary">
                            <span className="fw-medium">{item}</span>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => onDelete(item)}
                                title="Delete"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center py-4 text-muted">
                            No items found. Add one to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
