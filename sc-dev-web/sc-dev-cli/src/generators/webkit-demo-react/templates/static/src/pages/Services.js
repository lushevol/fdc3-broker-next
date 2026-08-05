import React, { useState } from 'react';
import '@sctoolkit/webkit/elements'
import AppSettings from './AppSettings';
import { ReactWrapper } from '@sctoolkit/webkit/ReactWrapper.js';
import BannerIcon from '../images/services/house-view.png';
import AppSettingIcon from '../images/services/app-settings.svg';
import ATMIcon from '../images/services/atm.svg';
import CommSettingIcon from '../images/services/comm-settings.svg';
import CreditCardActivationIcon from '../images/services/credit-card-activate.svg';
import CreditCardReportIcon from '../images/services/credit-card-report.svg';
import LanguageIcon from '../images/services/language.svg';
import OverseasUseIcon from '../images/services/overseas-use.svg';
import PasswordSecurityIcon from '../images/services/password-security.svg';
import PayTransferIcon from '../images/services/pay-transfer.svg';
import PersonalDetailsIcon from '../images/services/personal-details.svg';
import SGFinDexIcon from '../images/services/SGFinDex.svg';
import AboutIcon from '../images/services/about.svg';
import EStatementsIcon from '../images/services/e-statements.svg';
import FAQIcon from '../images/services/faq.svg';
import NotAvailable from '../common/NotAvailable';

function Services({
    mode,
    accessibilityMode,
    onModeChange,
    onAccessibilityModeChange,
}) {

    const profile = {
        name: 'JOHN SMITH',
        type: 'Priority Banking',
        lastLogin: 'Thus, 25 jan 2024, 11:56 am'
    }

    const digitalServices = [
        {
            code: 'report-lost-card',
            title: 'Report Lost/Stolen Card',
            icon: CreditCardReportIcon
        },
        {
            code: 'card-activation',
            title: 'Debit/ATM Card Activation',
            icon: ATMIcon
        },
        {
            code: 'credit-card-setup',
            title: 'Credit Card Activation & PIN Setup',
            icon: CreditCardActivationIcon
        },
        {
            code: 'overseas-usage',
            title: 'Overseas Card Usage',
            icon: OverseasUseIcon
        }
    ];

    const additionalServices = [
        {
            code: 'personal-details',
            title: 'Personal Details',
            copy: 'Edit Personal Details',
            icon: PersonalDetailsIcon
        },
        {
            code: 'mange-sg-fin-dex',
            title: 'Manage SGFinDex',
            copy: 'Consolidated Financial View',
            icon: SGFinDexIcon
        }
    ]

    const settings = [
        {
            title: 'Settings & Configuration',
            options: [
                {
                    code: 'security-settings',
                    title: 'Password and Security Settings',
                    icon: PasswordSecurityIcon
                },
                {
                    code: 'transfer-settings',
                    title: 'Pay & Transfer Settings',
                    icon: PayTransferIcon
                },
                {
                    code: 'communication-settings',
                    title: 'Communication Settings',
                    icon: CommSettingIcon
                },
                {
                    code: 'app-settings',
                    title: 'App Settings',
                    icon: AppSettingIcon
                },
                {
                    code: 'language',
                    title: 'Language / 语言',
                    icon: LanguageIcon
                }
            ]
        },
        {
            title: 'Statements & Documents',
            options: [
                {
                    code: 'view-statement',
                    title: 'View eStatements',
                    icon: EStatementsIcon
                }
            ]
        },
        {
            title: 'Useful Links',
            options: [
                {
                    code: 'faq',
                    title: 'FAQs',
                    copy: 'Self help on frequently asked questions.',
                    icon: FAQIcon
                },
                {
                    code: 'about',
                    title: 'About',
                    icon: AboutIcon
                }
            ]
        }
    ];

    const ScCard = ReactWrapper('sc-card');
    const ScIconCard = ReactWrapper('sc-icon-card');
    const ScLink = ReactWrapper('sc-link');
    const ScSideSheet = ReactWrapper('sc-side-sheet');
    const [showSideSheet, setShowSideSheet] = useState(false);
    const [selectedSideSheet, setSelectedSideSheet] = useState('');

    const onShowSideSheet = (type) => {
        setSelectedSideSheet(type);
        setShowSideSheet(true);
    }

    const onHideSideSheet = () => {
        setSelectedSideSheet('');
        setShowSideSheet(false);
    }

    const renderUserCard = () => {
        const user = profile;

        return (
            <div className='mx-3 mb-4'>
                <h4 className='mb-2'>Services &amp; Settings</h4>
                <div
                    className='rounded-md mb-1 p-3 user-card'
                    style={{
                        borderLeftWidth: '4px'
                    }}
                >
                    <h3>{user.name}</h3>
                    <span>{user.type}</span>
                </div>
                <span className='text-muted text-sm'>Last login: {user.lastLogin}</span>
            </div>
        );
    }

    const renderDigitalServices = () => {
        const list = digitalServices;
        const additionaList = additionalServices;

        return (
            <div className='mb-5'>
                <div className='mx-3 flex'>
                    <div className='flex grow items-center'>
                        <h4>Digital Services</h4>
                    </div>
                    <div className='flex justify-items-end'>
                        <ScLink
                            compact
                            onClick={() => {
                                onShowSideSheet('services')
                            }}
                        >
                            View All
                        </ScLink>
                    </div>
                </div>
                <div className='flex space-between mb-3 ml-2 overflow-x-auto no-scrollbar'>
                    {list.map((item, index) => {
                        return (
                            <div key={index} className='p-2'>
                                <ScIconCard
                                    image={item.icon}
                                    width='26vw'
                                    size='one-third'
                                    onClick={() => {
                                        onShowSideSheet(item.code)
                                    }}
                                >
                                    <div slot='title' className='font-semibold line-clamp-2'>{item.title}</div>
                                </ScIconCard>
                            </div>
                        )
                    })}
                </div>

                {additionaList.map((item, index) => {
                    return (
                        <div key={index} className='mx-3 mb-3'>
                            <ScCard
                                vertical-align='top'
                                image={item.icon}
                                title={item.title}
                                body={item.copy}
                                onClick={() => {
                                    onShowSideSheet(item.code)
                                }}
                            />
                        </div>
                    )
                })}
            </div>
        );
    }

    const renderBanner = () => {
        return (
            <div className='mx-3'>
                <h4 className='mb-2'>SC Referral Club</h4>
                <img
                    src={BannerIcon}
                    className='rounded-xl'
                    alt=''
                />
            </div>
        );
    }

    const renderSettings = () => {
        const list = settings;

        return (
            <div className='mx-3 mb-5'>
                {list.map((item, index) => {
                    return (
                        <div key={index} className='mt-5'>
                            <h4 className='mb-3'>{item.title}</h4>
                            {renderSettingItem(item.options)}
                        </div>
                    )
                })}
            </div>
        );
    }

    const renderSettingItem = (options) => {
        const list = options

        return (
            <>
                {list.map((item, index) => {
                    return (
                        <div key={index} className='mb-3'>
                            <ScCard
                                vertical-align={`${item.copy ? 'top' : 'middle'}`}
                                image={item.icon}
                                title={item.title}
                                body={item.copy}
                                icon='arrow-ios-forward'
                                onClick={() => {
                                    onShowSideSheet(item.code)
                                }}
                            />
                        </div>
                    )
                })}
            </>
        );
    }

    const renderSideSheet = () => {
        return (
            <ScSideSheet
                open={showSideSheet}
                onScHide={onHideSideSheet}
            >
                {selectedSideSheet === 'app-settings' ? (
                    <AppSettings 
                        mode={mode}
                        accessibilityMode={accessibilityMode}
                        onModeChange={onModeChange}
                        onAccessibilityModeChange={onAccessibilityModeChange}
                    />                    
                ) : (
                    <NotAvailable />
                )}
            </ScSideSheet>
        );
    }

    return (
        <>
            {renderUserCard()}
            {renderDigitalServices()}
            {renderBanner()}
            {renderSettings()}
            {renderSideSheet()}
        </>
    );
}

export default Services;