export const fetchRates = async (date, amount, from, to) => {
    try {
        const res = await fetch(`https://api.frankfurter.app/${date}?amount=${amount}&from=${from}&to=${to}`);
        if (!res.ok) throw new Error('Conversion failed');
        return res.json();
    } catch (error) {
        throw new Error('Ошибка при конвертации валют');
    }
};
