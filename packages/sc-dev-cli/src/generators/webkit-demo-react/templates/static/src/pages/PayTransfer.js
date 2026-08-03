import React, { useState } from 'react';
import '@sctoolkit/webkit/elements'
import { ReactWrapper } from '@sctoolkit/webkit/ReactWrapper.js';
import Transfer from './Transfer';
import SwipablePanel from '../common/SwipablePanel';
import ImageButton from '../common/ImageButton';
import BetweenMyAccountIcon from '../images/pay-transfer/between-my-accounts.svg';
import AngBaoIcon from '../images/pay-transfer/eangbao-sparkle.svg';
import LocalTransferIcon from '../images/pay-transfer/transfer.svg';
import IntXferIcon from '../images/pay-transfer/int-xfer.svg';
import ScanPayIcon from '../images/pay-transfer/scan-pay.svg';
import CreditCardIcon from '../images/pay-transfer/credit-card.svg';
import PayBillIcon from '../images/pay-transfer/pay-transfer.svg';
import AddPayeeIcon from '../images/pay-transfer/add-payee.svg';
import NotAvailable from '../common/NotAvailable';

function PayTransfer() {

    const payTransfer = [
        {
            code: 'between-accounts',
            title: 'Between My Accounts',
            icon: BetweenMyAccountIcon
        },
        {
            code: 'paynow',
            title: 'eAng Bao (PayNow)',
            icon: AngBaoIcon
        },
        {
            code: 'local-transfer',
            title: 'Local Transfer',
            icon: LocalTransferIcon
        },
        {
            code: 'international-transfer',
            title: 'International Transfer',
            icon: IntXferIcon
        }
    ];

    const quickLinks = [
        {
            code: 'scan-pay',
            title: 'Scan & Pay',
            icon: ScanPayIcon
        },
        {
            code: 'pay-credit-cards',
            title: 'Pay Credit Cards',
            icon: CreditCardIcon
        },
        {
            code: 'pay-bills',
            title: 'Pay Bills',
            icon: PayBillIcon
        },
        {
            code: 'add-payees',
            title: 'Add Payees',
            icon: AddPayeeIcon
        }
    ];

    const listOptions = [
        {
            id: 'myPayees',
            title: 'My Payees'
        },
        {
            id: 'transactions',
            title: 'Transactions'
        },
        {
            id: 'scheduled',
            title: 'Scheduled'
        },
        {
            id: 'manage',
            title: 'Manage'
        }
    ];

    const payeeFilters = [
        {
            id: 'all',
            title: 'All'
        },
        {
            id: 'paynow',
            title: 'PayNow'
        },
        {
            id: 'local',
            title: 'Local'
        },
        {
            id: 'international',
            title: 'International'
        },
        {
            id: 'biller',
            title: 'Biller'
        },
        {
            id: 'cards',
            title: 'Cards'
        }
    ];

    const payees = [
        {
            channel: 'M',
            title: 'ASIA WEALTH PLATFORM',
            copy: 'UEN 201624878Z'
        },
        {
            channel: 'I',
            title: 'Peter Parker',
            copy: 'DBS BANK LIMITED *1234'
        },
        {
            channel: 'M',
            title: 'Tony Stark Williamson',
            copy: 'Mobile +6590807065'
        },
        {
            channel: 'M',
            title: 'THE GARAGE SG PTE LTD.',
            copy: 'PayNow: 201536439H'
        }
    ];

    const ScIconCard = ReactWrapper('sc-icon-card');
    const ScCard = ReactWrapper('sc-card');
    const ScIcon = ReactWrapper('sc-icon');
    const ScSideSheet = ReactWrapper('sc-side-sheet');
    const ScSearchField = ReactWrapper('sc-search-field');
    const [selectedTab, setSelectedTab] = useState({ id: 'myPayees', title: 'My Payees' });
    const [selectedPayeeFilter, setSelectedPayeeFilter] = useState({ id: 'all', title: 'All' });
    const [isPanelMaximise, setIsPanelMaximise] = useState(false);
    const [showSideSheet, setShowSideSheet] = useState(false);
    const [selectedSideSheet, setSelectedSideSheet] = useState({});

    const onShowSideSheet = (type) => {
        setSelectedSideSheet(type);
        setShowSideSheet(true);
    }

    const onHideSideSheet = () => {
        setSelectedSideSheet({});
        setShowSideSheet(false);
    }

    const onMaximise = () => {
        setIsPanelMaximise(true);
    }

    const onMinimise = () => {
        setIsPanelMaximise(false);
    }

    const renderPayTransfer = () => {
        const list = payTransfer;

        return (
            <div className='mx-2'>
                <h4 className='pl-2'>Pay &amp; Transfer</h4>
                <div className='grid grid-cols-2 justify-center space-between mt-1 mb-3'>
                    {list.map((item, index) => {
                        return (
                            <div key={index} className='p-2'>
                                <ScIconCard
                                    image={item.icon}
                                    width='100%'
                                    height='150px'
                                    size='half'
                                    onClick={() => {
                                        onShowSideSheet({
                                            code: item.code,
                                            title: item.title
                                        })
                                    }}
                                >
                                    <div slot='title' className='text-base font-semibold line-clamp-2'>{item.title}</div>
                                </ScIconCard>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    const renderQuickLinks = () => {
        const list = quickLinks;

        return (
            <div className='mx-2 mb-5'>
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
                                        onClick={() => {
                                            onShowSideSheet({
                                                code: item.code,
                                                title: item.title
                                            })
                                        }}
                                    />                                    
                                </div>
                                <div className='mt-1 px-1 text-center text-xs font-semibold line-clamp-3'>{item.title}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    const getIcon = (item) => {
        return (
            <>
                {item.channel === 'M' &&
                    <ScIcon
                        slot='prefix'
                        name='smartphone--line'
                        size='md'
                    ></ScIcon>
                }
                {item.channel === 'I' &&
                    <div
                        slot='prefix'
                        className='font-semibold text-lg text-center'
                    >
                        {item.title.substring(0, 1)}
                    </div>
                }
            </>
        );
    }

    const renderPayees = () => {
        const list = payees;
        const listFilter = payeeFilters;

        return (
            <>
                {isPanelMaximise &&
                    <>
                        <div className='border-bottom mb-3'>
                            <div className='px-3'>
                                <ScSearchField />
                            </div>
                            <div className='flex space-x-3 mt-3 mb-3 pl-3 overflow-y-auto no-scrollbar'>
                                {listFilter.map((item, index) => {
                                    return (
                                        <ImageButton
                                            key={index}
                                            title={item.title}
                                            highlight={selectedPayeeFilter.id === item.id}
                                            compact={true}
                                            onClick={() => {
                                                setSelectedPayeeFilter(item);
                                            }}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                        <div className='mb-3 px-3 text-sm'>
                            {selectedPayeeFilter.id === 'all' ? '' : 'All'} {selectedPayeeFilter.title} Payees
                        </div>
                    </>
                }
                {(list && list.length > 0) &&
                    <>
                        {list.map((item, index) => {
                            return (
                                <div key={index} className='mb-3 text-left mx-3'>
                                    <ScCard
                                        vertical-align='top'
                                        title={item.title}
                                        body={item.copy}
                                        icon='info-circle--line'
                                    >
                                        {getIcon(item)}
                                    </ScCard>
                                </div>
                            )
                        })}
                    </>
                }
            </>
        );
    }

    const renderList = () => {
        const list = listOptions;

        return (
            <>
                <SwipablePanel
                    minHeight='320px'
                    maxHeight='87%'
                    expand={false}
                    onMaximise={onMaximise}
                    onMinimise={onMinimise}
                >
                    <div className='flex space-x-2 mt-3 mb-3 justify-center overflow-y-auto no-scrollbar'>
                        {list.map((item, index) => {
                            return (
                                <ImageButton
                                    key={index}
                                    title={item.title}
                                    highlight={selectedTab.id === item.id}
                                    compact={true}
                                    onClick={() => {
                                        setSelectedTab(item);
                                    }}
                                />
                            )
                        })}
                    </div>
                    <div>
                        {selectedTab.id === 'myPayees' && renderPayees()}
                        {selectedTab.id === 'transactions' && renderNotAvailable()}
                        {selectedTab.id === 'scheduled' && renderNotAvailable()}
                        {selectedTab.id === 'manage' && renderNotAvailable()}
                    </div>
                </SwipablePanel>
            </>
        );
    }

    const renderNotAvailable = () => {
        return (
            <NotAvailable />
        );
    }

    const renderSideSheet = () => {
        return (
            <ScSideSheet
                open={showSideSheet}
                onScHide={onHideSideSheet}
                label={selectedSideSheet.title}
            >
                {selectedSideSheet.code === 'add-payees' ? (
                    <NotAvailable />
                ) : (
                    <Transfer 
                        onTransferClose={onHideSideSheet}
                    />                    
                )}
            </ScSideSheet>
        );
    }

    return (
        <>
            {renderPayTransfer()}
            {renderQuickLinks()}
            {renderList()}
            {renderSideSheet()}
        </>
    );
}

export default PayTransfer;