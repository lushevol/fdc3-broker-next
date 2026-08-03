import React, { useState } from 'react';
import HomeIcon from '../images/footer/home.svg';
import HomeActiveIcon from '../images/footer/home-active.svg';
import CreditCardIcon from '../images/footer/credit-card.svg';
import CreditCardActiveIcon from '../images/footer/credit-card-active.svg';
import TrendingUpIcon from '../images/footer/trending-up.svg';
import TrendingUpActiveIcon from '../images/footer/trending-up-active.svg';
import GridIcon from '../images/footer/grid.svg';
import GridActiveIcon from '../images/footer/grid-active.svg';
import PersonIcon from '../images/footer/person.svg';
import PersonActiveIcon from '../images/footer/person-active.svg';

function Footer({ onMenuChange }) {

    const navigation = [
        {
            id: 'home',
            title: 'Home',
            icons: [HomeIcon, HomeActiveIcon]
        }, {
            id: 'pay-transfer',
            title: 'Pay & transfer',
            icons: [CreditCardIcon, CreditCardActiveIcon]
        }, {
            id: 'invest',
            title: 'Invest',
            icons: [TrendingUpIcon, TrendingUpActiveIcon]
        }, {
            id: 'discover',
            title: 'Discover',
            icons: [GridIcon, GridActiveIcon]
        }, {
            id: 'services',
            title: 'Services',
            icons: [PersonIcon, PersonActiveIcon]
        }
    ]

    const [selectedFooter, setSelectedFooter] = useState({ id: 'home', title: 'Home' });

    return (
        <footer className='bottom-0 left-0 flex space-between py-4 pt-3 fixed w-full'>
            {
                navigation.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={`basis-1/5 text-center ${selectedFooter.id === item.id ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedFooter(item);
                                if (onMenuChange) {
                                    onMenuChange(item.id);
                                }
                            }}>
                            <img
                                src={item.icons[selectedFooter.id === item.id ? 1 : 0]}
                                width='24px'
                                height='24px'
                                alt={item.title}
                                className='m-auto'
                            />
                            <span className='text-xs'>{item.title}</span>
                        </div>
                    )
                })
            }
        </footer>
    );
}

export default Footer;