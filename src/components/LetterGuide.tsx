interface LetterGuideProps {
    char: string;
}

export function DashedLetter({ char }: LetterGuideProps) {
    return (
        <div className="letter-guide">
            <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet">
                <text
                    x="50"
                    y="95"
                    textAnchor="middle"
                    className="letter-text"
                >
                    {char}
                </text>
            </svg>
        </div>
    );
}
