import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Select from 'react-select';
import Flag from './Flag';

const CurrencySelect = ({ currencies, selected, onChange, amount, onAmountChange, label }) => {
    const [frequentCurrencies, setFrequentCurrencies] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('frequentCurrencies')) || [];
        setFrequentCurrencies(stored);
    }, []);

    useEffect(() => {
        if (frequentCurrencies.length) {
            localStorage.setItem('frequentCurrencies', JSON.stringify(frequentCurrencies));
        }
    }, [frequentCurrencies]);

    const options = useMemo(() => currencies.map(({ code, name }) => ({
        value: code,
        label: `${code} — ${name}`,
        code,
        name,
    })), [currencies]);

    const otherCurrencies = useMemo(() => {
        return options.filter(option => !frequentCurrencies.some(item => item.value === option.value));
    }, [options, frequentCurrencies]);

    const handleCurrencyChange = useCallback((selectedOption) => {
        if (!frequentCurrencies.some(item => item.value === selectedOption.value)) {
            setFrequentCurrencies(prev => [selectedOption, ...prev]);
        }
        onChange(selectedOption.value);
    }, [frequentCurrencies, onChange]);

    const handleAmountChange = useCallback((e) => {
        let value = e.target.value.trim();
        if (value === '0' || value === '0.') {
            onAmountChange('0');
        } else {
            value = value.replace(',', '.');
            onAmountChange(value);
        }
    }, [onAmountChange]);

    const shouldRenderSelect = frequentCurrencies.length > 0 || otherCurrencies.length > 0;
    const shouldRenderLabel = label && shouldRenderSelect;

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
                                const lower = inputValue.toLowerCase();
                                return (label && label.toLowerCase().includes(lower)) ||
                                    (code && code.toLowerCase().includes(lower)) ||
                                    (name && name.toLowerCase().includes(lower));
                            }}
                            classNamePrefix="currency-select"
                            noOptionsMessage={() => 'Нет вариантов'}
                        />

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
