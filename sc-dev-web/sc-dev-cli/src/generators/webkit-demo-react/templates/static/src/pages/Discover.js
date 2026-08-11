import React, { useState } from 'react';
import '@sctoolkit/webkit/elements'
import { ReactWrapper } from '@sctoolkit/webkit/ReactWrapper.js';
import List from '../common/List';
import ImageButton from '../common/ImageButton';
import AccountIcon from '../images/discover/account.svg';
import CreditCardIcon from '../images/discover/credit-cards.svg';
import LoanIcon from '../images/discover/loans.svg';
import InvestIcon from '../images/discover/invest.svg';
import InsureIcon from '../images/discover/insurance.svg';
import MortgageIcon from '../images/discover/mortgage.svg';
import CreditCardPromotionIcon from '../images/discover/credit-card-active.svg';
import ReferFriendIcon from '../images/discover/pay-transfer.svg';
import NotAvailable from '../common/NotAvailable';

function Discover() {

    const products = [
        {
            id: 'accounts',
            title: 'Accounts',
            icon: AccountIcon,
            solutions: [
                {
                    title: 'Current Account',
                    icon: AccountIcon
                },
                {
                    title: 'Savings Account',
                    icon: AccountIcon
                },
                {
                    title: 'Foreign Currency',
                    icon: AccountIcon
                },
                {
                    title: 'Time Deposit',
                    icon: AccountIcon
                }
            ]
        }, {
            id: 'credit-card',
            title: 'Credit Card',
            icon: CreditCardIcon,
            solutions: [
                {
                    title: 'Cashback',
                    icon: CreditCardIcon
                },
                {
                    title: 'Miles and Rewards',
                    icon: CreditCardIcon
                },
                {
                    title: 'Credit Limit',
                    icon: CreditCardIcon
                },
                {
                    title: 'Cash Transfer',
                    icon: CreditCardIcon
                },
                {
                    title: 'Credit Card Promotions',
                    icon: CreditCardIcon
                }
            ],
            feature: {
                title: 'Card Features',
                features: [
                    {
                        title: 'Get cash in 15 minutes with CashOne',
                        copy: 'Interest rates from 3.48% p.a. (EIR from 6.95% p.a.)'
                    },
                    {
                        title: 'Get interest-free cash with Credit Card Funds Transfer',
                        copy: 'Flexible repayment and low processing fee'
                    },
                    {
                        title: 'Get a Temporary Credit Limit Increase',
                        copy: 'For emergencies, expenses for your overseas travel, or wedding banquet'
                    }
                ]
            }
        }, {
            id: 'loans',
            title: 'Loans',
            icon: LoanIcon,
            solutions: [
                {
                    title: 'Personal Loans',
                    icon: LoanIcon
                },
                {
                    title: 'Flexible Repayment Loans',
                    icon: LoanIcon
                }
            ],
            feature: {
                title: 'Loan Tailored To Your Needs',
                features: [
                    {
                        title: 'Get interest-free cash with Credit Card Funds Transfer',
                        copy: 'Flexible repayment and low processing fee'
                    }
                ]
            }
        }, {
            id: 'invest',
            title: 'Invest',
            icon: InvestIcon,
            solutions: []
        }, {
            id: 'insure',
            title: 'Insure',
            icon: InsureIcon,
            solutions: []
        }, {
            id: 'mortgages',
            title: 'Mortgages',
            icon: MortgageIcon,
            solutions: [
                {
                    title: 'Mortgage for Home',
                    icon: MortgageIcon
                }
            ]
        }
    ]

    const promotions = [
        {
            title: 'Credit Card Promotions',
            icon: CreditCardPromotionIcon
        },
        {
            title: 'Refer A Friend',
            icon: ReferFriendIcon
        }
    ];

    const ScCard = ReactWrapper('sc-card');
    const ScIconCard = ReactWrapper('sc-icon-card');
    const ScSideSheet = ReactWrapper('sc-side-sheet');
    const [selectedProduct, setSelectedProduct] = useState({ id: '', title: '' });
    const [showSideSheet, setShowSideSheet] = useState(false);

    const onShowSideSheet = () => {
        setShowSideSheet(true);
    }

    const onHideSideSheet = () => {
        setShowSideSheet(false);
    }

    const renderProducts = () => {
        const all = { id: '', title: 'All' };
        const list = products;

        return (
            <>
                <div className='flex mx-3'>
                    <h4 className='headline py-1'>Products and Solutions</h4>
                </div>
                <div className='flex space-x-2 mt-4 mb-4 '>
                    <div className='flex pl-3'>
                        <ImageButton 
                            title={all.title}
                            highlight={selectedProduct.id === all.id}
                            onClick={() => {
                                setSelectedProduct(all);
                            }}
                        />
                    </div>
                    <div className='divider'></div>
                    <div
                        className='flex space-x-2 overflow-y-auto no-scrollbar px-2'
                        style={{
                            marginLeft: '0px'
                        }}
                    >
                        {list.map((item, index) => {
                            return (
                                <ImageButton
                                    key={index}
                                    title={item.title}
                                    image={item.icon}
                                    highlight={selectedProduct.id === item.id}
                                    onClick={() => {
                                        setSelectedProduct(item);
                                    }}
                                />
                            )
                        })}
                    </div>
                </div >
            </>
        );
    }

    const renderSolutions = () => {
        const list = selectedProduct.id === '' ? products : selectedProduct.solutions ?? [];
        const title = selectedProduct.id === '' ? 'Our Solutions' : `Find Out The Best ${selectedProduct.title} For You`;

        return (
            <>
                {(list && list.length > 0) &&
                    <div className='mx-2 mb-4'>
                        <h4 className='pl-2'>{title}</h4>
                        <div className='flex flex-wrap justify-center space-between mt-1 mb-3'>
                            {list.map((item, index) => {
                                return (
                                    <div key={index} className='basis-1/3 p-2 grow'>
                                        <ScIconCard                                                                                
                                            image={item.icon}
                                            width='100%'
                                            size='one-third'
                                            height='110px'
                                            onClick={onShowSideSheet}
                                        >
                                            <div slot='title' className='font-semibold line-clamp-2'>{item.title}</div>
                                        </ScIconCard>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }
            </>
        );
    }

    const renderFeatures = () => {
        const feature = selectedProduct.feature ?? {};
        const list = feature.features ?? [];

        return (
            <>
                {(feature && list.length > 0) &&
                    <div className='mx-3 mb-5'>
                        <h4>{feature.title}</h4>
                        <div className='features rounded-xl py-3 mt-3 p-3 pb-1 '>
                            {list.map((item, index) => {
                                return (
                                    <div key={index} className='mb-4'>
                                        <List
                                            title={item.title}
                                            copy={item.copy}
                                            iconRight='arrow-ios-forward'
                                            onClick={onShowSideSheet}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }
            </>
        );
    }

    const renderPromotions = () => {
        const list = promotions ?? [];

        return (
            <>
                {list &&
                    <div className='mx-2 mb-4 p-2'>
                        {list.map((item, index) => {
                            return (
                                <div key={index} className='mb-4'>
                                    <ScCard
                                        vertical-align='middle'
                                        image={item.icon}
                                        title={item.title}
                                        icon='newwindow'
                                        onClick={onShowSideSheet}
                                    />
                                </div>
                            )
                        })}
                    </div>
                }
            </>
        );
    }

    const renderSideSheet = () => {
        return (
            <ScSideSheet
                open={showSideSheet}
                onScHide={onHideSideSheet}
            >
                <NotAvailable />
            </ScSideSheet>
        );
    }

    return (
        <>
            {renderProducts()}
            {renderSolutions()}
            {renderFeatures()}
            {renderPromotions()}
            {renderSideSheet()}
        </>
    );
}

export default Discover;