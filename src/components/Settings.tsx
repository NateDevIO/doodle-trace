import { useState } from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';

interface SettingsProps {
    apiKey: string;
    setApiKey: (key: string) => void;
}

export function Settings({ apiKey, setApiKey }: SettingsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempKey, setTempKey] = useState(apiKey);

    const handleSave = () => {
        setApiKey(tempKey);
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: apiKey ? '#e6ffe6' : 'white', // Green tint if key exists
                    border: apiKey ? '2px solid #4CAF50' : '2px solid #ddd',
                    cursor: 'pointer',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
                title={apiKey ? "API Key Active" : "Settings"}
            >
                <SettingsIcon size={20} color={apiKey ? '#4CAF50' : '#666'} />
                {apiKey && <span style={{ fontSize: '12px', color: '#4CAF50', fontWeight: 'bold' }}>ON</span>}
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '400px',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ marginTop: 0 }}>Settings</h2>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                AI API Key (Optional)
                            </label>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                                Enter your Anthropic or OpenAI key to enable custom image generation for any topic!
                            </p>
                            <input
                                type="password"
                                value={tempKey}
                                onChange={(e) => setTempKey(e.target.value)}
                                placeholder="sk-..."
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '2px solid #ddd',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            }}
                        >
                            Save API Key
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
