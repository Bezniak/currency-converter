import React from 'react';
import CurrencyConverter from "./components/CurrencyConverter";

const App = () => {
    return (
        <div className="min-h-screen bg-[url(/bg.jpg)] bg-center bg-no-repeat bg-cover flex flex-col items-center md:items-start justify-center">
            <div className='p-5 md:p-10 rounded-2xl'>
                <h1 className="text-3xl md:text-5xl lg:text-6xl text-white text-center mb-10 md:mb-18">
                    Конвертер валют
                </h1>
                <CurrencyConverter />
            </div>
        </div>
    );
};

export default App;
