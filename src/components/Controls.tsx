import { Trash2 } from 'lucide-react';

interface ControlsProps {
    selectedColor: string;
    onColorSelect: (color: string) => void;
    onClear: () => void;
}

const COLORS = [
    { hex: '#FF4136', name: 'Red' },
    { hex: '#0074D9', name: 'Blue' },
    { hex: '#2ECC40', name: 'Green' },
    { hex: '#B10DC9', name: 'Purple' },
    { hex: '#000000', name: 'Black' },
];

export function Controls({
    selectedColor,
    onColorSelect,
    onClear
}: ControlsProps) {
    return (
        <div className="controls-container">
            <div className="color-palette">
                {COLORS.map(({ hex, name }) => (
                    <button
                        key={hex}
                        className={`color-btn ${selectedColor === hex ? 'active' : ''}`}
                        style={{
                            backgroundColor: hex,
                            width: selectedColor === hex ? '44px' : '36px',
                            height: selectedColor === hex ? '44px' : '36px',
                        }}
                        onClick={() => onColorSelect(hex)}
                        aria-label={`Select ${name}`}
                        aria-pressed={selectedColor === hex}
                    />
                ))}
            </div>

            <div className="separator" />

            <button
                className="clear-btn"
                onClick={onClear}
                aria-label="Clear canvas"
            >
                <Trash2 size={20} />
                Clear
            </button>
        </div>
    );
}
