const Flag = ({currencyCode}) => {
    const countryCode = currencyCode.slice(0, 2).toLowerCase();
    const flagUrl = `https://flagcdn.com/w320/${countryCode}.png`;

    return (
        <img
            src={flagUrl}
            alt={`${currencyCode} flag`}
            className="w-12 h-8 rounded-lg shadow-lg"
            onError={(e) => (e.target.src = '/white.jpg')}
        />
    );
};

export default Flag;
