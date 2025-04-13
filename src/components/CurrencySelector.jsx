import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Flag from './Flag';

const CurrencySelect = ({ currencies, selected, onChange, amount, onAmountChange, label }) => {
    const [options, setOptions] = useState([]);
    const [frequentCurrencies, setFrequentCurrencies] = useState([]);
    const [otherCurrencies, setOtherCurrencies] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const storedFrequent = JSON.parse(localStorage.getItem('frequentCurrencies')) || [];
        setFrequentCurrencies(storedFrequent);

        const formattedOptions = currencies.map(({ code, name }) => ({
            value: code,
            label: `${code} — ${name}`,
            code,
            name,
        }));

        setOptions(formattedOptions);
        setOtherCurrencies(formattedOptions.filter(option => !storedFrequent.some(item => item.value === option.value)));
    }, [currencies]);

    useEffect(() => {
        if (frequentCurrencies.length) {
            localStorage.setItem('frequentCurrencies', JSON.stringify(frequentCurrencies));
        }
    }, [frequentCurrencies]);

    const handleCurrencyChange = (selectedOption) => {
        if (!frequentCurrencies.some(item => item.value === selectedOption.value)) {
            setFrequentCurrencies([selectedOption, ...frequentCurrencies]);
        }
        onChange(selectedOption.value);
    };

    const handleAmountChange = (e) => {
        let value = e.target.value.trim();
        if (value === '0' || value === '0.') {
            onAmountChange('0');
        } else {
            value = value.replace(',', '.');
            onAmountChange(value);
        }
    };

    const shouldRenderSelect = frequentCurrencies.length > 0 || otherCurrencies.length > 0;
    const shouldRenderLabel = label && (frequentCurrencies.length > 0 || otherCurrencies.length > 0);

    return (
        <div className='w-full md:w-1/2'>
            {shouldRenderLabel && <label className="block text-xl font-medium text-gray-200 mb-3">{label}</label>}
            <div className="flex flex-col gap-6 flex-wrap sm:flex-nowrap">
                {shouldRenderSelect && (
                    <div className="relative w-full">
                        <Select
                            options={[
                                ...(frequentCurrencies.length > 0 ? [{
                                    label: 'Часто используемые',
                                    isDisabled: true,
                                    value: 'divider',
                                }] : []),
                                ...frequentCurrencies,
                                { label: 'Все', isDisabled: true, value: 'all-divider' },
                                ...otherCurrencies
                            ]}
                            value={options.find((option) => option.value === selected)}
                            onChange={handleCurrencyChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            getOptionLabel={(e) => (
                                <div className="flex items-center space-x-3">
                                    {e.value !== 'divider' && e.value !== 'all-divider' && <Flag currencyCode={e.value} />}
                                    <span>{e.label}</span>
                                </div>
                            )}
                            className="w-full"
                            placeholder="Выберите валюту"
                            filterOption={(option, inputValue) => {
                                const { label, code, name } = option.data || {};
                                const lowerCaseInput = inputValue.toLowerCase();
                                return (label && label.toLowerCase().includes(lowerCaseInput)) ||
                                    (code && code.toLowerCase().includes(lowerCaseInput)) ||
                                    (name && name.toLowerCase().includes(lowerCaseInput));
                            }}
                            classNamePrefix="currency-select"
                            noOptionsMessage={() => 'Нет вариантов'}
                        />
                        {/* Frequently used currencies */}
                        {frequentCurrencies.length > 0 && !isFocused && (
                            <div className="mt-3">
                                <div className="flex flex-wrap gap-2">
                                    {frequentCurrencies.map(currency => (
                                        <button
                                            key={currency.value}
                                            onClick={() => handleCurrencyChange(currency)}
                                            className="text-white hover:text-orange-500 transition cursor-pointer"
                                        >
                                            {currency.value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <input
                    type="number"
                    value={amount === '' ? '' : amount}
                    onChange={handleAmountChange}
                    className="border-2 border-white rounded-lg px-6 py-3 w-full focus:outline-none text-white transition duration-300"
                    placeholder="Сумма"
                    style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                />
            </div>
        </div>
    );
};

export default CurrencySelect;
