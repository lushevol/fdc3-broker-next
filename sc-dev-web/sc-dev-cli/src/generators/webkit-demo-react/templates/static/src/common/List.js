import React from 'react';
import '@sctoolkit/webkit/elements'
import { ReactWrapper } from '@sctoolkit/webkit/ReactWrapper.js';

function List({
    title,
    copy,
    iconLeft,
    iconLeftSize = 'md',
    iconRight,
    iconRightSize = 'md',
    imageLeft,
    imageLeftSize = 'md',
    imageRight,
    imageRightSize = 'md',
    onClick
}) {

    const ScIcon = ReactWrapper('sc-icon');

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
        <div className='flex flex-row' onClick={onClick ?? null}>
            {iconLeft &&
                <div className='pr-3 text-left'>
                    <ScIcon
                        name={iconLeft}
                        size={iconLeftSize}
                        compact
                    />
                </div>
            }
            {imageLeft &&
                <div className='pr-3 text-left'>
                    <img
                        src={imageLeft}
                        width={size(imageLeftSize)}
                        alt=''
                    />
                </div>
            }
            <div className='grow'>
                <span className='font-semibold'>{title}</span>
                <p className='text-muted'>{copy}</p>
            </div>
            {iconRight &&
                <div className='pt-1 pl-3 text-right'>
                    <ScIcon
                        name={iconRight}
                        size={iconRightSize}
                        compact
                    />
                </div>
            }
            {imageRight &&
                <div className='pt-1 pl-3 text-right'>
                    <img
                        src={imageRight}
                        width={size(imageRightSize)}
                        alt=''
                    />
                </div>
            }
        </div >
    );
}

export default List;