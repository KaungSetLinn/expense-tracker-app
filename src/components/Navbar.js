import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowRight, faFile, faCog, faCreditCard, faHandHoldingDollar, faUser, faChartLine, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    return (
        <header className="main-header">
            <div className="container">
                <div className="d-flex align-items-center">
                    <span className="site-name h3">家計簿マスター</span>
                </div>
                <nav className="main-nav">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link" activeclassname="active">
                                <FontAwesomeIcon icon={faHouse} className='icon-margin' />
                                ホーム
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/transaction" className="nav-link" activeclassname="active">
                                <FontAwesomeIcon icon={faArrowRightArrowLeft} className='icon-margin' />
                                トランザクション
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/expense" className="nav-link" activeclassname="active">
                                <FontAwesomeIcon icon={faCreditCard} className='icon-margin' />
                                支出
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/report" className="nav-link" activeclassname="active">
                                <FontAwesomeIcon icon={faChartLine} className='icon-margin' />
                                レポート
                            </NavLink>
                        </li>
                        
                        <li className="nav-item">
                            <NavLink to="/account" className="nav-link" activeclassname="active">
                                <FontAwesomeIcon icon={faUser} className='icon-margin' />
                                アカウント
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
