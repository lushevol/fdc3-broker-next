import React from 'react';
import '@sctoolkit/webkit/elements'
import { ReactWrapper } from '@sctoolkit/webkit/ReactWrapper.js';

function Header() {

    const ScIcon = ReactWrapper('sc-icon');
    const ScButton = ReactWrapper('sc-button');

    return (
        <div className='header flex justify-end text-center space-x-3 mr-0 py-4 mr-3'>
            <ScIcon
                name='bell--line'
                size='md'
                compact
            />
            <ScIcon
                name='chat--line'
                size='md'
                compact
            />
            <ScButton
                size='sm'
            >
                Logout
            </ScButton>
        </div>
    );
}

export default Header;