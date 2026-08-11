import React from 'react';
import '@sctoolkit/webkit/elements'
import { ReactWrapper } from '@sctoolkit/webkit/ReactWrapper.js';

function NotAvailable() {

    const ScIcon = ReactWrapper('sc-icon');

    return (
        <div className='text-center mt-5'>
            <ScIcon
                name='emotion-happy'
                size='lg'
            ></ScIcon>
            <h4 className='mt-2'>
                Not available in demo version
            </h4>
        </div>
    )
}

export default NotAvailable;