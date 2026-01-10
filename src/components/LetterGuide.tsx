interface LetterGuideProps {
    char: string;
}

export function DashedLetter({ char }: LetterGuideProps) {
    return (
        <div className="letter-guide">
            <svg viewBox="0 0 100 120" width="95%" height="95%">
                <text
                    x="50"
                    y="100"
                    textAnchor="middle"
                    fontSize="140"
                    fontFamily="'Comic Neue', 'Comic Sans MS', 'Chalkboard SE', sans-serif"
                    fontWeight="bold"
                    fill="none"
                    stroke="#cccccc"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                >
                    {char}
                </text>
            </svg>
        </div>
    );
}
