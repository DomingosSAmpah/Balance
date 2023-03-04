// ===== Custom JS =======
const transactionUl = document.querySelector('#transactions')
const icomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

// localStorage
const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

// remoção da transação
const removeTransaction = ID => {
    transactions = transactions.filter(transaction =>
         transaction.id !== ID)
    updateLocalStorage()
    init()
}

// ---- Script da função transação ----
const addTransactionIntoDOM = ({amount, name, id}) =>{
    const operator = amount < 0 ? '-' : '+'
    const CSSClass = amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
        ${name} 
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onclick="removeTransaction(${id})">x</button>
    `
    transactionUl.append(li)
}

// valor do saldo atual
const getTotal = transactionsAmounts => transactionsAmounts
.reduce((accumulator, transaction) => accumulator + transaction, 0)
.toFixed(2)

// valor das receitas
const getIcome = transactionsAmounts => transactionsAmounts
.filter(value => value > 0)
.reduce((accumulator, value) => accumulator + value, 0)
.toFixed(2)

// valor das despesas
const getExpense = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)


// ---- Script da função das receita, despesa e saldo atual ----
const updateBalanceValues = () =>{
    const transactionsAmounts = transactions.map(({amount}) => amount)
    const total =  getTotal(transactionsAmounts)
    const icome = getIcome(transactionsAmounts)
    const expense = getExpense(transactionsAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    icomeDisplay.textContent = `R$ ${icome}`
    expenseDisplay.textContent = `R$ ${expense}`
}

// ---- Script para carregar as funções ----
const init = () =>{
    transactionUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}
init()
const generateID = () => Math.round(Math.random() * 1000)

// script para adicionar a transação ao localStorage
const updateLocalStorage = () =>{
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

// script da transação do array
const addToTransactionArray = (transactionName, transactionAmount) =>{
    transactions.push({
        id: generateID(), 
        name: transactionName, 
        amount: Number(transactionAmount) //+transactionAmount
    })
}

// script para limpar o nome e o valor da transação
const cleanInput = ()=>{
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

// script form
const handleFormSubmit = event =>{
    event.preventDefault()
    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if (isSomeInputEmpty) {
        alert('Por favor, preencha o nome e o valor da operação!')
        return
    }
    addToTransactionArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInput()
}
form.addEventListener('submit',  handleFormSubmit)


