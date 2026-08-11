import React, { useState } from 'react';
import '@sctoolkit/webkit/elements'
import { ReactWrapper } from '@sctoolkit/webkit/ReactWrapper.js';
import HouseView from '../images/home/house-view.png';
import LifeStyle from '../images/home/lifestyle.png';
import Celebratory from '../images/home/celebratory.png';
import AccountIcon from '../images/home/account.svg';
import CreditCardIcon from '../images/home/credit-cards.svg';
import LoanIcon from '../images/home/loans.svg';
import InvestIcon from '../images/home/invest.svg';
import PayNowIcon from '../images/home/paynow.svg';
import FXIcon from '../images/home/fx.svg';
import InsightIcon from '../images/home/insight.svg';
import RemitIcon from '../images/home/sc-remit.svg';
import NotAvailable from '../common/NotAvailable';

function Home() {

    const profile = {
        name: 'JOHN SMITH'
    }

    const banners = [
        {
            title: 'Save big and win bigger',
            copy: 'Stand to win a S$20,000 cash prize and get up to S$500 Cashback. T&C apply.',
            action: 'How to join',
            image: Celebratory,
            product: 'account'
        },
        {
            title: 'Swipe, explore, enjoy! Exciting cre...',
            copy: 'Discover cashback, discounts, vouchers and more with our exclusive promotions..',
            action: 'Learn More',
            image: HouseView,
            product: 'credit-card'
        },
        {
            title: 'Insurance',
            copy: 'Get greater peace of mind when you are insured against lifes eventualities.',
            action: 'Learn More',
            image: LifeStyle,
            product: 'insure'
        }
    ];

    const shortcuts = [
        {
            title: 'PayNow',
            icon: PayNowIcon
        },
        {
            title: 'FX',
            icon: FXIcon
        },
        {
            title: 'Insights',
            icon: InsightIcon
        },
        {
            title: 'EasyPay',
            icon: RemitIcon
        }
    ];

    const accounts = [
        {
            title: 'Deposits',
            icon: AccountIcon,
            currency: 'SGD',
            amount: '123,000.90',
            label: 'Total balance'
        },
        {
            title: 'Credit Cards',
            icon: CreditCardIcon,
            currency: 'SGD',
            amount: '300.50',
            label: 'Outstanding Balance'
        },
        {
            title: 'Investments',
            icon: LoanIcon,
            currency: 'SGD',
            amount: '50,000.00',
            label: ''
        },
        {
            title: 'Loans',
            icon: InvestIcon,
            currency: 'SGD',
            amount: '100,000.00',
            label: 'Outstanding Balance'
        }
    ];

    const ScIconCard = ReactWrapper('sc-icon-card');
    const ScCard = ReactWrapper('sc-card');
    const ScSideSheet = ReactWrapper('sc-side-sheet');
    const [showSideSheet, setShowSideSheet] = useState(false);

    const onShowSideSheet = () => {
        setShowSideSheet(true);
    }

    const onHideSideSheet = () => {
        setShowSideSheet(false);
    }

    const renderProfile = () => {
        const user = profile;

        return (
            <div className='mx-3 mb-4'>
                <h4>Good Morning, {user.name}</h4>
            </div>
        );
    }

    const renderBanner = () => {
        const list = banners ?? [];

        return (
            <>
                <div className='flex space-x-4 mt-3 px-3 mb-4 overflow-y-auto no-scrollbar'>
                    {list.map((item, index) => {
                        return (
                            <img
                                key={index}
                                src={item.image}
                                width='90%'
                                className='mb-2 rounded-lg'
                                alt=''
                            />
                        )
                    })}
                </div>
            </>
        );
    }

    const renderShortcut = () => {
        const list = shortcuts;

        return (
            <div className='mx-2 mb-4'>
                <div className='grid grid-cols-4 justify-center space-between mt-1 mb-4 quick-links'>
                    {list.map((item, index) => {
                        return (
                            <div key={index}>
                                <div className='px-3'>
                                    <ScIconCard
                                        image={item.icon}
                                        width='100%'
                                        height='60px'
                                        size='one-fourth'
                                        layout='title-out'
                                        onClick={onShowSideSheet}
                                    >
                                    </ScIconCard>
                                </div>
                                <div className='mt-1 px-1 text-center text-xs font-semibold line-clamp-3'>{item.title}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    const renderList = () => {
        const list = accounts;

        return (
            <div>
                <div className='border-bottom'></div>
                {list.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className='mt-3 mb-3 mx-3'
                        >
                            <ScCard
                                vertical-align='top'
                                image={item.icon}
                                icon='arrow-ios-downward'
                            >
                                <div slot='title' className='grid grid-cols-2 w-full'>
                                    <div className='align-middle'>
                                        <span>
                                            {item.title}
                                        </span>
                                    </div>
                                    <div className='mr-2 align-top text-right justify-items-end justify-end'>
                                        <div>{item.currency} <span className='text-lg font-bold'>{item.amount}</span></div>
                                        <div
                                            className='text-sm text-muted font-normal'
                                            style={{
                                                minWidth: '30vw'
                                            }}
                                        >{item.label}</div>
                                    </div>
                                </div>
                            </ScCard>
                        </div>
                    )
                })}
            </div>
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
            {renderProfile()}
            {renderBanner()}
            {renderShortcut()}
            {renderList()}
            {renderSideSheet()}
        </>
    );
}

export default Home;