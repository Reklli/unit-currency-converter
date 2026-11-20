const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    UAH: 41.5
};

// Вибираємо контейнер списку валют та елемент лічильника
const listContainer = document.querySelector('#rates-list');
const ratesCount = document.querySelector('#rates-count');

// Програмно видаляємо статичну заглушку з розмітки
const placeholderItem = document.querySelector('#rates-list .placeholder');
if (placeholderItem) {
    placeholderItem.remove();
}

// Обчислює сконвертовану суму
const convert = (amount, rate) => amount * rate;

showExchangeRates(exchangeRates);


classifyAmount(30000 * exchangeRates.UAH);
classifyAmount(10000 * exchangeRates.UAH);

let convertedUah = convert(250, exchangeRates.UAH);
console.log(`250 USD у гривнях: ${convertedUah} UAH`);

renderRates(exchangeRates);

// Рендерить список актуальних курсів валют у DOM, додає data-атрибути,
// умовний клас для високих курсів і оновлює загальний лічильник валют
function renderRates(rates) {
    listContainer.innerHTML = '';

    const entries = Object.entries(rates);

    for (const [currency, rate] of entries) {
        const listItem = document.createElement('li');
        listItem.textContent = `${currency}: ${rate}`;
        listItem.dataset.rate = rate;

        if (rate > 10) {
            listItem.classList.add('big-rate');
        }

        listContainer.append(listItem);
    }

    if (ratesCount) {
        ratesCount.textContent = `Усього валют у списку: ${entries.length}`;
    }
}

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
