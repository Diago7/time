const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');

// LocalStorage වෙතින් ගනුදෙනු ලබා ගැනීම
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// ගනුදෙනුවක් එක් කිරීමේ ශ්‍රිතය
function addTransaction(e) {
    e.preventDefault(); // Form එක submit වීම නවත්වනවා

    if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('කරුණාකර විස්තරය සහ මුදල ඇතුලත් කරන්න');
    } else {
        const transaction = {
            id: generateID(),
            text: textInput.value,
            amount: +amountInput.value // String එක number එකක් කරනවා
        };

        transactions.push(transaction);

        addTransactionDOM(transaction); // DOM එකට එකතු කරනවා
        updateValues(); // අගයන් යාවත්කාලීන කරනවා
        updateLocalStorage(); // LocalStorage එක යාවත්කාලීන කරනවා

        textInput.value = ''; // Input ක්ෂේත්‍ර හිස් කරනවා
        amountInput.value = '';
    }
}

// සුවිශේෂී ID එකක් ජනනය කිරීම
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// ගනුදෙනුව DOM (HTML ලැයිස්තුව) වෙත එක් කිරීම
function addTransactionDOM(transaction) {
    // ලකුණ (+ හෝ -) ලබා ගැනීම
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    // මුදල අනුව class එකක් එකතු කිරීම (plus හෝ minus)
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}රු ${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// ශේෂය, ආදායම, සහ වියදම යාවත්කාලීන කිරීම
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    // මුළු ශේෂය
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    // මුළු ආදායම
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    // මුළු වියදම
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `රු ${total}`;
    money_plus.innerText = `+රු ${income}`;
    money_minus.innerText = `-රු ${expense}`;
}

// ID එක අනුව ගනුදෙනුවක් ඉවත් කිරීම
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();
    init(); // ලැයිස්තුව නැවත සකසනවා
}

// LocalStorage යාවත්කාලීන කිරීම
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ආරම්භක ශ්‍රිතය
function init() {
    list.innerHTML = ''; // ලැයිස්තුව හිස් කරනවා
    transactions.forEach(addTransactionDOM); // සියලු ගනුදෙනු DOM එකට එකතු කරනවා
    updateValues(); // අගයන් යාවත්කාලීන කරනවා
}

// App එක ආරම්භ කිරීම
init();

// Event Listeners
form.addEventListener('submit', addTransaction);
