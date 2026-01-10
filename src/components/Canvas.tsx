import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

interface CanvasProps {
    color: string;
    brushSize: number;
}

export interface CanvasRef {
    clear: () => void;
    save: () => void;
}

const Canvas = forwardRef<CanvasRef, CanvasProps>(({ color, brushSize }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const dprRef = useRef<number>(1);

    // Initialize and handle resize
    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        const dpr = window.devicePixelRatio || 1;
        dprRef.current = dpr;
        const rect = parent.getBoundingClientRect();

        // Preserve existing drawing if resizing
        const existingData = canvas.toDataURL();
        const hadContent = contextRef.current !== null;

        // Set canvas dimensions
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, rect.width, rect.height);

        contextRef.current = ctx;

        // Restore previous drawing if resizing
        if (hadContent && existingData) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, rect.width, rect.height);
            };
            img.src = existingData;
        }
    };

    useEffect(() => {
        initCanvas();

        // Handle window resize
        const resizeObserver = new ResizeObserver(() => {
            initCanvas();
        });

        if (canvasRef.current?.parentElement) {
            resizeObserver.observe(canvasRef.current.parentElement);
        }

        return () => resizeObserver.disconnect();
    }, []);

    useImperativeHandle(ref, () => ({
        clear: () => {
            if (!contextRef.current || !canvasRef.current) return;
            const dpr = dprRef.current;
            const logicalWidth = canvasRef.current.width / dpr;
            const logicalHeight = canvasRef.current.height / dpr;
            contextRef.current.fillStyle = 'white';
            contextRef.current.fillRect(0, 0, logicalWidth, logicalHeight);
        },
        save: () => {
            if (!canvasRef.current) return;
            const link = document.createElement('a');
            link.download = 'my-tracing.png';
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

        const logicalWidth = canvas.width / dpr;
        const logicalHeight = canvas.height / dpr;
        const scaleX = logicalWidth / rect.width;
        const scaleY = logicalHeight / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const ctx = contextRef.current;
        if (!ctx) return;

        const { x, y } = getLogicalCoords(e);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const ctx = contextRef.current;
        if (!ctx) return;

        if ('touches' in e) {
            e.preventDefault();
        }

        const { x, y } = getLogicalCoords(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        contextRef.current?.closePath();
        setIsDrawing(false);
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
                cursor: 'crosshair'
            }}
        />
    );
});

export default Canvas;
