import React, { useState, useRef } from 'react';

function SwipablePanel({
    minHeight = '100px',
    maxHeight = '800px',
    expand = false,
    threshold = 50,
    children,
    onMaximise,
    onMinimise
}) {

    const [panelHeight, setPanelHeight] = useState(expand ? maxHeight : minHeight);
    const [startY, setStartY] = useState(null);
    const panelRef = useRef(null);

    const onTouchStart = (e) => {
        setStartY(e.touches[0].clientY);
    }

    const onTouchMove = (e) => {
        if (startY === null) return;

        const deltaY = e.touches[0].clientY - startY;

        if (deltaY > threshold) {
            setPanelHeight(minHeight);

            if (onMinimise) {
                onMinimise();
            }
        } else if (deltaY < -threshold) {
            setPanelHeight(maxHeight);

            if (onMaximise) {
                onMaximise();
            }
        }
    }

    const onTouchEnd = () => {
        setStartY(null);
    }

    return (
        <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            ref={panelRef}
            className='swipable-panel'
            style={{
                width: '100%',
                position: 'absolute',
                bottom: '60px',
                height: panelHeight,                
                transition: 'height 0.3s ease',
                overflow: 'hidden',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                borderTopWidth: '0px'
            }}
        >
            {children}
        </div>
    );
}

export default SwipablePanel;