

interface LetterGuideProps {
    char: string;
}

export function LetterGuide({ char }: LetterGuideProps) {
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '400px',
            fontFamily: '"Courier New", monospace', // Fallback, we'll want a Google Font later
            fontWeight: 'bold',
            color: '#e0e0e0', // Light gray
            pointerEvents: 'none', // Allow clicks to pass through to canvas
            userSelect: 'none',
            zIndex: 0,
            border: '2px dashed #ccc', // Temporary visualization of box
            lineHeight: 1,
            textAlign: 'center'
        }}>
            <span style={{
                // Dashed effect usually requires SVG or specific fonts, 
                // for MVP we use a light gray color or a font that supports it.
                // Alternatively, we can use SVG text with stroke-dasharray.
            }}>
                {char}
            </span>
        </div>
    );
}

// Better approach: SVG for true dashed lines independent of font availability
export function DashedLetter({ char }: LetterGuideProps) {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 0
        }}>
            <svg viewBox="0 0 100 120" width="95%" height="95%">
                <text
                    x="50"
                    y="95"
                    textAnchor="middle"
                    fontSize="110"
                    fontFamily="'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', 'Comic Neue', sans-serif"
                    fontWeight="bold"
                    fill="none"
                    stroke="#cccccc"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                >
                    {char}
                </text>
            </svg>
        </div>
    );
}
