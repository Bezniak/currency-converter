import React, {useEffect, useState} from 'react';
import {fetchRates} from '../api/api.js';
import CurrencySelect from './CurrencySelector.jsx';
import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {format} from 'date-fns';
import ru from 'date-fns/locale/ru';
import {FaCalendarAlt} from "react-icons/fa";
import {FaArrowRightArrowLeft} from "react-icons/fa6";

registerLocale('ru', ru);

const CurrencyConverter = () => {
    const [currencies, setCurrencies] = useState([]);
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('EUR');
    const [amount, setAmount] = useState('');
    const [converted, setConverted] = useState(null);
    const [date, setDate] = useState(new Date());
    const [error, setError] = useState(null);
    const [activeInput, setActiveInput] = useState('from');

    useEffect(() => {
        fetch('https://api.frankfurter.app/currencies')
            .then(res => res.json())
            .then(data => {
                const arr = Object.entries(data).map(([code, name]) => ({code, name}));
                setCurrencies(arr);
            })
            .catch(() => {
                setError('Ошибка при загрузке валют');
            });
    }, []);

    useEffect(() => {
        if (from === to || amount === '' || amount === 0) {
            setConverted(amount);
            setError(null);
            return;
        }

        const base = activeInput === 'from' ? from : to;
        const target = activeInput === 'from' ? to : from;
        const realAmount = amount || 1;

        fetchRates(format(date, 'yyyy-MM-dd'), realAmount, base, target)
            .then((res) => {
                const value = Object.values(res.rates)[0];
                setConverted(value);
                setError(null);
            })
            .catch((err) => {
                setError(err.message === 'Conversion failed' ? 'Ошибка при конвертации валют' : err.message);
            });
    }, [amount, from, to, date, activeInput]);

    const swapCurrencies = () => {
        setFrom(to);
        setTo(from);
    };

    return (
        <div className="container mx-auto w-full md:max-w-5xl">
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8">
                <CurrencySelect
                    currencies={currencies}
                    selected={from}
                    onChange={setFrom}
                    amount={activeInput === 'from' ? amount : converted || ''}
                    onAmountChange={(val) => {
                        setAmount(val);
                        setActiveInput('from');
                    }}
                />

                <button
                    type="button"
                    onClick={swapCurrencies}
                    className="w-fit px-8 py-2 border-white rounded-full text-2xl border-2 text-white hover:bg-orange-500 cursor-pointer hover:border-orange-500 hover:text-white transition-all duration-300"
                >
                    <FaArrowRightArrowLeft/>
                </button>

                <CurrencySelect
                    currencies={currencies}
                    selected={to}
                    onChange={setTo}
                    amount={activeInput === 'to' ? amount : converted || ''}
                    onAmountChange={(val) => {
                        setAmount(val);
                        setActiveInput('to');
                    }}
                />
            </div>

            <div className="flex justify-center items-center my-10">
                <div className="relative">
                    <DatePicker
                        selected={date}
                        onChange={(d) => setDate(d)}
                        maxDate={new Date()}
                        dateFormat="dd.MM.yyyy"
                        locale="ru"
                        className="bg-transparent text-white border-2 border-white w-fit rounded-lg px-6 py-3 pr-12 focus:outline-none"
                        calendarClassName="!bg-gray-900 !text-white"
                        popperPlacement="bottom-start"
                        popperModifiers={[
                            {
                                name: "offset",
                                options: {
                                    offset: [0, 8],
                                },
                            },
                        ]}
                        portalId="root-portal"
                        withPortal={true}
                        shouldCloseOnScroll={false}
                        dayClassName={(d) => {
                            const isSelected = format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
                            const isFuture = d > new Date();

                            if (isFuture) {
                                return '!text-gray-600 !cursor-not-allowed';
                            }

                            return [
                                '!text-white',
                                isSelected
                                    ? '!bg-orange-500 !text-white'
                                    : 'hover:!bg-orange-500 hover:!text-white transition duration-150 ease-in-out',
                            ].join(' ');
                        }}
                    />
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white">
                        <FaCalendarAlt size={20}/>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm shadow-md">
                    {error}
                </div>
            )}
        </div>
    );
};

export default CurrencyConverter;