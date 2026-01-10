import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { floodFill } from '../utils/floodFill';

interface CanvasProps {
    tool: 'brush' | 'bucket' | 'eraser';
    color: string;
    brushSize: number;
    initialImage?: string; // URL to background image
}

export interface CanvasRef {
    undo: () => void;
    clear: () => void;
    save: () => void;
}

const Canvas = forwardRef<CanvasRef, CanvasProps>(({ tool, color, brushSize, initialImage }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState<ImageData[]>([]);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const overlayRef = useRef<HTMLCanvasElement | null>(null);
    const dprRef = useRef<number>(1);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Handle high DPI displays for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        dprRef.current = dpr;
        const rect = canvas.parentElement?.getBoundingClientRect();
        if (rect) {
            // Set the internal resolution to match display size * device pixel ratio
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
        }

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Scale context to account for DPI
        ctx.scale(dpr, dpr);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = 'white';
        // Use logical dimensions (physical / dpr) since context is scaled
        const logicalWidth = canvas.width / dpr;
        const logicalHeight = canvas.height / dpr;
        ctx.fillRect(0, 0, logicalWidth, logicalHeight);

        contextRef.current = ctx;
        saveState(); // Save initial blank state
    }, []);

    // Load image if provided
    useEffect(() => {
        if (!initialImage || !contextRef.current || !canvasRef.current) return;

        const img = new Image();
        img.crossOrigin = "anonymous"; // Important for editing
        img.onerror = () => {
            console.error('Failed to load image:', initialImage);
        };
        img.onload = () => {
            const ctx = contextRef.current;
            const canvas = canvasRef.current;
            if (!ctx || !canvas) return;

            const dpr = dprRef.current;
            // Use logical dimensions since context is scaled by dpr
            const logicalWidth = canvas.width / dpr;
            const logicalHeight = canvas.height / dpr;

            // Center and fit image within logical dimensions
            const scale = Math.min(logicalWidth / img.width, logicalHeight / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            const x = (logicalWidth - w) / 2;
            const y = (logicalHeight - h) / 2;

            // 1. Draw original base image (flat)
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, logicalWidth, logicalHeight);
            ctx.drawImage(img, x, y, w, h);
            saveState();

            // 2. Extract Line Art (create overlay) - use physical pixels for offscreen canvas
            const offscreen = document.createElement('canvas');
            offscreen.width = canvas.width;
            offscreen.height = canvas.height;
            const oCtx = offscreen.getContext('2d')!;

            // Scale offscreen context to match main canvas
            oCtx.scale(dpr, dpr);
            // Draw image to offscreen at same logical position
            oCtx.drawImage(img, x, y, w, h);

            // Convert to transparent - work with physical pixels
            const id = oCtx.getImageData(0, 0, canvas.width, canvas.height);
            const d = id.data;
            for (let i = 0; i < d.length; i += 4) {
                const r = d[i];
                const g = d[i + 1];
                const b = d[i + 2];
                // Simple threshold: if mostly white, make transparent
                // Keeping black lines opaque
                if (r > 200 && g > 200 && b > 200) {
                    d[i + 3] = 0; // Alpha 0
                }
            }
            oCtx.putImageData(id, 0, 0);
            overlayRef.current = offscreen;
        };
        img.src = initialImage;
    }, [initialImage]);

    const redrawLines = () => {
        if (contextRef.current && overlayRef.current && canvasRef.current) {
            const dpr = dprRef.current;
            const logicalWidth = canvasRef.current.width / dpr;
            const logicalHeight = canvasRef.current.height / dpr;
            // Draw overlay at logical size since context is scaled
            contextRef.current.drawImage(overlayRef.current, 0, 0, logicalWidth, logicalHeight);
        }
    };

    const saveState = () => {
        if (!canvasRef.current || !contextRef.current) return;
        const imageData = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        setHistory(prev => [...prev.slice(-10), imageData]); // Keep last 10 states
    };

    useImperativeHandle(ref, () => ({
        undo: () => {
            if (history.length <= 1 || !contextRef.current) return;
            const newHistory = [...history];
            newHistory.pop(); // Remove current state
            const prevState = newHistory[newHistory.length - 1];
            contextRef.current.putImageData(prevState, 0, 0);
            redrawLines(); // Re-apply lines after undo
            setHistory(newHistory);
        },
        clear: () => {
            if (!contextRef.current || !canvasRef.current) return;
            const dpr = dprRef.current;
            const logicalWidth = canvasRef.current.width / dpr;
            const logicalHeight = canvasRef.current.height / dpr;
            contextRef.current.fillStyle = 'white';
            contextRef.current.fillRect(0, 0, logicalWidth, logicalHeight);
            // Re-apply lines if we have them
            redrawLines();
            saveState();
        },
        save: () => {
            if (!canvasRef.current) return;
            const link = document.createElement('a');
            link.download = 'my-masterpiece.png';
            link.href = canvasRef.current.toDataURL();
            link.click();
        }
    }));

    const getLogicalCoords = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const dpr = dprRef.current;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        // The canvas internal logical size (used by the scaled context)
        const logicalWidth = canvas.width / dpr;
        const logicalHeight = canvas.height / dpr;

        // Scale from displayed size to logical size
        const scaleX = logicalWidth / rect.width;
        const scaleY = logicalHeight / rect.height;

        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        return { x, y };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (!canvas || !ctx) return;

        const { x: logicalX, y: logicalY } = getLogicalCoords(e);
        const dpr = dprRef.current;

        if (tool === 'bucket') {
            // floodFill works with physical pixels via getImageData, so scale up
            const physicalX = Math.floor(logicalX * dpr);
            const physicalY = Math.floor(logicalY * dpr);
            floodFill(ctx, physicalX, physicalY, color);
            redrawLines(); // Put lines back on top
            saveState();
            return;
        }

        ctx.beginPath();
        ctx.moveTo(logicalX, logicalY);
        ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
        ctx.lineWidth = brushSize;
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const ctx = contextRef.current;
        if (!ctx) return;

        if ('touches' in e) {
            e.preventDefault(); // Prevent scrolling
        }

        const { x: logicalX, y: logicalY } = getLogicalCoords(e);

        ctx.lineTo(logicalX, logicalY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        if (contextRef.current) {
            contextRef.current.closePath();
        }
        setIsDrawing(false);
        redrawLines(); // Re-apply lines on top after stroke completes
        saveState();
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
                width: '100%',
                height: '100%',
                touchAction: 'none',
                borderRadius: 'inherit',
                cursor: tool === 'bucket' ? 'crosshair' : 'crosshair'
            }}
        />
    );
});

export default Canvas;
