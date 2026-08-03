import React from 'react';
import '@sctoolkit/webkit/elements'

function ImageButton({
    title,
    image,
    imageSize = 'md',
    highlight = false,
    compact = false,
    onClick
}) {

    const size = (imageSize) => {
        switch (imageSize) {
            case 'sm':
                return '16px';
            case 'md':
                return '24px';
            case 'lg':
                return '32px';
            default:
                return '24px';
        }
    }

    return (
        <div
            className={`flex flex-row rounded-full py-1 image-button ${compact ? 'px-2' : 'px-3'} ${highlight ? 'highlight' : ''}`}
            style={{
                whiteSpace: 'nowrap'
            }}
            onClick={onClick ?? null}
        >
            {image &&
                <div
                    className='mr-2 text-left'
                    style={{
                        width: size(imageSize)
                    }}
                >
                    <img
                        src={image}
                        width={size(imageSize)}
                        alt=''
                    />
                </div>
            }
            <div className='text-center m-auto'>
                <span className='font-semibold'>{title}</span>
            </div>
        </div >
    );
}

export default ImageButton;