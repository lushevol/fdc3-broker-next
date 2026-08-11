import React, { useState } from 'react';
import '@sctoolkit/webkit/elements'
import { ReactWrapper } from '@sctoolkit/webkit/ReactWrapper.js';
import BannerIcon from '../images/pay-transfer/transfer-complete.png';

function Transfer({
    onTransferClose
}) {

    const accounts = [
        {
            code: '600000',
            title: 'BONUS$AVER'
        },
        {
            code: '600001',
            title: 'SECURITIES SETTLEMENT ACCOUNT'
        },
        {
            code: '600002',
            title: 'Bonus$aver World Mastercard'
        },
        {
            code: '600003',
            title: 'Simply Cash Credit Card'
        }
    ];

    const payees = [
        {
            code: '600000',
            title: 'BONUS$AVER'
        },
        {
            code: '600001',
            title: 'SECURITIES SETTLEMENT ACCOUNT'
        }
    ];

    const ScButton = ReactWrapper('sc-button');
    const ScDropdown = ReactWrapper('sc-dropdown-input');
    const ScOption = ReactWrapper('sc-option');
    const ScValueInput = ReactWrapper('sc-value-input');
    const ScTextInput = ReactWrapper('sc-text-input');
    
    const [transferFrom, setTransferFrom] = useState(accounts[0].code);
    const [transferTo, setTransferTo] = useState(payees[0].code);
    const [transferAmount, setTransferAmount] = useState(0);
    const [transferComplete, setTransferComplete] = useState(false);
    
    const onTransfer = () => {
        setTransferComplete(true);
    }

    const onNewTransfer = () => {
        setTransferTo('');
        setTransferAmount(0);
        setTransferComplete(false);
    }

    const renderTransfer = () => {
        return (
            <>
                {!transferComplete &&     
                    <div className='mb-5'>
                        <div className='mb-5'>
                            <div className='mb-4'>
                                <ScDropdown
                                    label="From"
                                    placeholder="Which account would you like to transfer from?"
                                    value={transferFrom}
                                >
                                    ${accounts.map((item, index) => {
                                        return (
                                            <ScOption 
                                                value={item.code}
                                                key={index}
                                            >
                                                {item.title}
                                            </ScOption>
                                        )                                
                                    })}                            
                                </ScDropdown>
                            </div>
                            <div className='mb-4'>
                                <ScDropdown
                                    label="To"
                                    placeholder="Where would you like to transfer to?"
                                    value={transferTo}
                                >
                                    ${payees.map((item, index) => {
                                        return (
                                            <ScOption 
                                                value={item.code}
                                                key={index}
                                            >
                                                {item.title}
                                            </ScOption>
                                        )
                                    })}     
                                </ScDropdown>
                            </div>
                            <div className='mb-5'>
                                <ScValueInput
                                    label="Amount"
                                    placeholder="0"
                                    value={transferAmount}
                                    onValueChange={value => setTransferAmount(value)}
                                />
                            </div>
                            <div className='mb-3'>
                                <ScButton
                                    size='md'
                                    onClick={onTransfer}
                                    primary
                                >
                                    Transfer
                                </ScButton>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    }

    const renderTransferResult = () => {
        return (
            <>
                {transferComplete &&       
                    <>  
                        <div className='mb-5'>
                            <img
                                src={BannerIcon}
                                className='rounded-xl'
                                alt=''
                            />
                        </div> 
                        <h4>Transfer completed</h4>  
                        <div className='mt-4 mb-5'>
                            <div className='mb-3'>
                                <ScTextInput
                                    label="From"
                                    value={transferFrom}
                                    readonly
                                />
                            </div>
                            <div className='mb-3'>
                                <ScTextInput
                                    label="To"
                                    value={transferTo}
                                    readonly
                                />
                            </div>
                            <div className='mb-3'>
                                <ScTextInput
                                    label="Amount"
                                    value={transferAmount}
                                    readonly
                                />
                            </div>
                        </div>
                        <div className='mb-3'>
                            <div className='mb-3'>
                                <ScButton
                                    size='md'
                                    onClick={onTransferClose}
                                    primary
                                >
                                    Close
                                </ScButton>
                            </div>
                            <ScButton
                                size='md'
                                onClick={onNewTransfer}
                            >
                                Another transaction
                            </ScButton>
                        </div>
                    </>
                }
            </>
        );
    }

    return (
        <>
            {renderTransfer()}
            {renderTransferResult()}
        </>
    );
}

export default Transfer;