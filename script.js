const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    UAH: 41.5
};

// Обчислює сконвертовану суму
const convert = (amount, rate) => amount * rate;

showExchangeRates(exchangeRates);


classifyAmount(30000 * exchangeRates.UAH);
classifyAmount(10000 * exchangeRates.UAH);

let convertedUah = convert(250, exchangeRates.UAH);
console.log(`250 USD у гривнях: ${convertedUah} UAH`);


// Виводить у консоль загальну кількість доступних валют та курс кожної відносно USD
function showExchangeRates(rates) {
    const currencies = Object.keys(rates);
    console.log(`Усього доступно валют: ${currencies.length}`);

    for (const currency of currencies) {
        console.log(`1 USD = ${rates[currency]} ${currency}`);
    }
}

// Класифікує суму конвертації: визначає, чи перевищує вона заданий поріг
function classifyAmount(result, threshold = 1000000) {
    if (result > threshold) {
        console.log(`Сума ${result} — велика сума (перевищує поріг ${threshold})`);
    } else {
        console.log(`Сума ${result} — звичайна сума (в межах порогу ${threshold})`);
    }
}
