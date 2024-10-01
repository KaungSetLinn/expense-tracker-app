import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const LoadingScreen = () => {
    return (
        <div className='loading-container'>
            <div>処理中です。<br/>しばらくお待ちください。</div>
        </div>
    );
};

export default LoadingScreen;