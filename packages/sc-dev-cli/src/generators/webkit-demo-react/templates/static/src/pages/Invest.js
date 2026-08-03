import React, { useState } from 'react';
import '@sctoolkit/webkit/elements'
import { ReactWrapper } from '@sctoolkit/webkit/ReactWrapper.js';
import AccountIcon from '../images/invest/account.svg';
import InsuranceIcon from '../images/invest/insurance.svg';
import InvestIcon from '../images/invest/invest.svg';
import MortgageIcon from '../images/invest/mortgage.svg';
import CreditCardIcon from '../images/invest/credit-cards.svg';
import HouseViewIcon from '../images/invest/house-view.png';
import NotAvailable from '../common/NotAvailable';

function Invest() {

    const solutions = [
        {
            title: 'Equities',
            icon: AccountIcon
        },
        {
            title: 'Unit Trusts',
            icon: CreditCardIcon
        },
        {
            title: 'LiveFX',
            icon: MortgageIcon
        },
        {
            title: 'Goals Planner',
            icon: InvestIcon
        },
        {
            title: 'Insure',
            icon: InsuranceIcon
        }
    ];

    const relatedItems = [
        {
            headline: 'Market Views on-the-go',
            title: 'House Views across the Asset Class and Global Markets',
            icon: HouseViewIcon
        },
    ]

    const ScCard = ReactWrapper('sc-card');
    const ScIconCard = ReactWrapper('sc-icon-card');
    const ScSideSheet = ReactWrapper('sc-side-sheet');
    const [showSideSheet, setShowSideSheet] = useState(false);

    const onShowSideSheet = () => {
        setShowSideSheet(true);
    }

    const onHideSideSheet = () => {
        setShowSideSheet(false);
    }

    const renderInvestmentProfile = () => {
        return (
            <div className='mx-2 mt-2 mb-3 px-2'>
                <ScCard
                    onClick={onShowSideSheet}
                >
                    <div slot='title' className='text-sm font-semibold'>
                        Investment Profile: 4 - Moderately Aggressive (Active)
                    </div>
                </ScCard>
            </div>
        );
    }

    const renderPortfolio = () => {
        return (
            <div className='mx-2 mb-5 px-2'>
                <ScCard
                    vertical-align='top'
                    title='MyPortfolio'
                    icon='arrow-ios-forward'
                    onClick={onShowSideSheet}
                >
                    <div slot='body' className='text-sm'>
                        View your investments at a glance
                    </div>
                </ScCard>
            </div>
        );
    }

    const renderSolutions = () => {
        const list = solutions ?? [];

        return (
            <div className='mx-2'>
                <h4 className='pl-2'>Investment Solutions</h4>
                <div className='flex flex-wrap justify-center space-between mt-2 mb-5'>
                    {list.map((item, index) => {
                        return (
                            <div key={index} className='basis-1/3 p-2 grow'>
                                <ScIconCard
                                    image={item.icon}
                                    width='100%'
                                    size='one-third'
                                    onClick={onShowSideSheet}
                                >
                                    <div slot='title' className='font-semibold line-clamp-2'>{item.title}</div>
                                </ScIconCard>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    const renderRelatedItems = () => {
        const list = relatedItems ?? [];

        return (
            <>
                {list &&
                    <div className='mx-2 mb-5 px-2'>
                        {list.map((item, index) => {
                            return (
                                <ScCard
                                    key={index}
                                    space-size='xs'
                                    title={item.title}
                                    onClick={onShowSideSheet}
                                >
                                    <img slot='prefix'
                                        width='180px'
                                        src={item.icon}
                                        className='rounded-lg'
                                        alt=''
                                    />
                                    <div slot='sub-title' className='mt-1 mr-2'>
                                        {item.headline}
                                    </div>
                                </ScCard>
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
            {renderInvestmentProfile()}
            {renderPortfolio()}
            {renderSolutions()}
            {renderRelatedItems()}
            {renderSideSheet()}
        </>
    );
}

export default Invest;