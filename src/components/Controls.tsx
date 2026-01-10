import { Trash2 } from 'lucide-react';

interface ControlsProps {
    selectedColor: string;
    onColorSelect: (color: string) => void;
    onClear: () => void;
}

const COLORS = [
    '#FF4136', // Red
    '#0074D9', // Blue
    '#2ECC40', // Green
    '#B10DC9', // Purple
    '#000000', // Black
];

export function Controls({
    selectedColor,
    onColorSelect,
    onClear
}: ControlsProps) {

    return (
        <div className="controls-container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            <div className="color-palette" style={{ display: 'flex', gap: '1rem' }}>
                {COLORS.map((color) => (
                    <button
                        key={color}
                        className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                        style={{
                            backgroundColor: color,
                            width: selectedColor === color ? '48px' : '40px',
                            height: selectedColor === color ? '48px' : '40px',
                            borderRadius: '50%',
                            border: selectedColor === color ? '3px solid #333' : '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                        onClick={() => onColorSelect(color)}
                        aria-label={`Select color ${color}`}
                    />
                ))}
            </div>

            <div className="separator" style={{ width: '2px', height: '40px', backgroundColor: '#eee' }} />

            <button
                className="action-btn clear-btn"
                onClick={onClear}
                title="Clear Canvas"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#FFDC00',
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer'
                }}
            >
                <Trash2 size={24} />
                Clear
            </button>
        </div>
    );
}
