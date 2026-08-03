import React from 'react';
import '@sctoolkit/webkit/elements'
import { ReactWrapper } from '@sctoolkit/webkit/ReactWrapper.js';
import DarkFillDarkIcon from '../images/services/dark-fill-dark-mode.svg';
import DarkLineLightIcon from '../images/services/dark-line-light-mode.svg';
import LightFilLightIcon from '../images/services/light-fill-light-mode.svg';
import LightLineDarkIcon from '../images/services/light-line-dark-mode.svg';

function AppSettings({
    mode,
    accessibilityMode,
    onModeChange,
    onAccessibilityModeChange
}) {

    const ScCard = ReactWrapper('sc-card');
    const ScIcon = ReactWrapper('sc-icon');
    const ScCheckbox = ReactWrapper('sc-checkbox');    

    const onChange = (mode) => {
        onModeChange(mode);
    }

    const onAccessibilityChange = (e) => {
        onAccessibilityModeChange(!accessibilityMode);
    }

    return (
        <>
            <div className='mb-5'>
                <div className='mb-5'>
                    <div className='mb-5'>
                        <h5>Appearance</h5>
                        <div className={`mt-3 mb-3 ${mode === ''? 'highlight-border' : ''}`}>
                            <ScCard
                                vertical-align='middle'
                                image={mode === '' ? LightFilLightIcon : LightLineDarkIcon}
                                title='Light Mode'
                                onClick={() => {
                                    onChange('')
                                }}
                            >
                                <div slot='suffix'>
                                    {mode === '' &&
                                        <ScIcon
                                            name='tick'
                                            compact
                                        />
                                    }
                                </div>
                            </ScCard>
                        </div>  
                        <div className={`mb-3 ${mode !== ''? 'highlight-border' : ''}`}>
                            <ScCard
                                vertical-align='middle'
                                image={mode === '' ? DarkLineLightIcon : DarkFillDarkIcon}
                                title='Dark Mode'
                                onClick={() => {
                                    onChange('sc-mode-dark')
                                }}
                            >
                                <div slot='suffix'>
                                    {mode !== '' &&
                                        <ScIcon
                                            name='tick'
                                            compact
                                        />
                                    }
                                </div>
                            </ScCard>                            
                        </div>                        
                    </div>
                    <div>
                        <h5>Accessibility</h5>
                        <div className='mt-3 mb-3 px-2'>
                            <ScCheckbox
                                disabled={mode === ''? false : true}
                                checked={accessibilityMode? true : false}
                                onClick={onAccessibilityChange}
                            >
                                Dyslexia support
                            </ScCheckbox>
                        </div>                  
                    </div>
                </div>
            </div>
        </>
    );
}

export default AppSettings;