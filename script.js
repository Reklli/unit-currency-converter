let exchangeRates = {
    USD: 1
};

const API_URL = 'https://api.frankfurter.dev/v1/latest?from=USD&to=EUR,PLN,GBP,JPY';

const conversionHistory = [];

const listContainer = document.querySelector('#rates-list');
const ratesCount = document.querySelector('#rates-count');
const ratesInfo = document.querySelector('#rates-info');
const loadingStatus = document.querySelector('#loading-status');
const errorMessage = document.querySelector('#error-message');


const converterForm = document.querySelector('#converter-form');
const amountInput = document.querySelector('#amount-input');
const fromSelect = document.querySelector('#from-select');
const toSelect = document.querySelector('#to-select');
const historyList = document.querySelector('#history-list');
const conversionResult = document.querySelector('#conversion-result');
const refreshBtn = document.querySelector('#refresh-btn');
// Видаляємо статичну заглушку з розмітки
const placeholderItem = document.querySelector('#rates-list .placeholder');
if (placeholderItem) {
    placeholderItem.remove();
}

loadExchangeRates();

// Обробка відправки форми без перезавантаження сторінки, додає новий запис
// в історію конвертацій, перемальовує список та очищає форму
converterForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Зчитання полів і приведення суми до типу Number
    const amount = Number(amountInput.value);
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;

    const convertedAmount = calculateConversion(amount, fromCurrency, toCurrency);

    const newRecord = {
        amount: amount,
        from: fromCurrency,
        to: toCurrency,
        result: Number(convertedAmount.toFixed(2))
    };

    conversionHistory.push(newRecord);
    renderHistory(conversionHistory);

    converterForm.reset();
});

// Миттєво перераховує результат конвертації при зміні початкової або цільової валюти
fromSelect.addEventListener('change', updateInstantResult);
toSelect.addEventListener('change', updateInstantResult);

if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        loadExchangeRates();
    });
}

// Валідація суми в реальному часі під час введення: блокує нуль або від'ємні числа
amountInput.addEventListener('input', () => {
    if (amountInput.value !== '' && Number(amountInput.value) <= 0) {
        amountInput.setCustomValidity('Сума має бути додатною');
    } else {
        amountInput.setCustomValidity('');
    }
});


function showLoading(isLoading) {
    if (loadingStatus) {
        loadingStatus.hidden = !isLoading;
    }

    if (refreshBtn) {
        refreshBtn.disabled = isLoading;
    }
}

function showError(message) {
    if (!errorMessage) {
        return;
    }

    if (message) {
        errorMessage.textContent = message;
        errorMessage.hidden = false;
    } else {
        errorMessage.textContent = '';
        errorMessage.hidden = true;
    }
}

// Завантажує актуальні курси валют із Frankfurter API (https://api.frankfurter.dev)
async function loadExchangeRates() {
    showError('');
    showLoading(true);

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            if (response.status === 422) {
                throw new Error('Перевірте код валюти');
            }
            throw new Error(`Помилка HTTP: ${response.status}`);
        }

        const data = await response.json();

        exchangeRates = {
            [data.base]: 1,
            ...data.rates
        };

        renderRates(exchangeRates);

        if (ratesInfo) {
            ratesInfo.textContent = `Базова валюта: ${data.base} | Дата курсу ЄЦБ: ${data.date}`;
        }

        updateInstantResult();
    } catch (error) {
        if (error.message === 'Перевірте код валюти') {
            showError(error.message);
        } else {
            showError('Не вдалося завантажити курси валют. Перевірте підключення до інтернету.');
        }
        console.error('Деталі помилки завантаження курсів:', error);
    } finally {
        showLoading(false);
    }
}

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

function calculateConversion(amount, from, to) {
    const amountInUsd = amount / exchangeRates[from];
    return amountInUsd * exchangeRates[to];
}

// Рендерить список історії конвертацій у DOM
function renderHistory(history) {
    historyList.innerHTML = '';

    for (const record of history) {
        const listItem = document.createElement('li');
        listItem.textContent = `${record.amount} ${record.from} = ${record.result} ${record.to}`;
        listItem.dataset.result = record.result;

        historyList.append(listItem);
    }
}

// Перерахунок суми при зміні валюти без сабміту форми
function updateInstantResult() {
    const amount = Number(amountInput.value);

    if (amountInput.value === '' || amount <= 0) {
        conversionResult.textContent = 'Результат: —';
        return;
    }

    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;
    const result = calculateConversion(amount, fromCurrency, toCurrency);

    conversionResult.textContent = `Результат: ${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
}