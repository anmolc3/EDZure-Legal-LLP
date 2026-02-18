import React, { useEffect, useRef, useState } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
    const cursorRef = useRef(null);
    const bigCursorRef = useRef(null);
    const smallCursorRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            const { clientX, clientY } = e;
            if (cursorRef.current) {
                // Use translate3d for better performance
                cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
            }
        };

        const handleMouseOver = (e) => {
            // Check if the target is interactive
            if (e.target.closest('a, button, input, textarea, .curserhover, .clickable, [role="button"]')) {
                setIsHovering(true);
            }
        };

        const handleMouseOut = (e) => {
            // Check if leaving an interactive element
            if (e.target.closest('a, button, input, textarea, .curserhover, .clickable, [role="button"]')) {
                setIsHovering(false);
            }
        };

        // Add event listeners
        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <div className={`custom-cursor ${isHovering ? 'hovering' : ''}`} ref={cursorRef} id="js-cursor">
            <div className="cursor__small abs-center" ref={smallCursorRef} id="js-cursor__small"></div>
            <div className="cursor__big abs-center" ref={bigCursorRef} id="js-cursor__big"></div>
        </div>
    );
};

export default CursorFollower;
