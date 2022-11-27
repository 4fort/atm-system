let loggedInID = Number(localStorage.getItem('loggedInUser'))


let modal_form = document.querySelector('.modal_form')
let modal_input = document.querySelector('.modal_input')
let modal_input_id = document.querySelector('.modal_input_id')
let transaction_type;


const display_bankData = async () => {
    const res = await fetch(`${api}userAccounts/${loggedInID}?_embed=history`)
    const data = await res.json()

    console.log(data)
    let user_element = document.querySelector('.user')
    let balance_element = document.querySelector('.balance');


    user_element.innerHTML = `<i class="bi bi-person-fill"></i>${data.card.owner}`;
    balance_element.innerText = data.balance


    // MODAL
    let modal_element = document.querySelector('.modal')
    let modal_title = document.querySelector('.title');

    let transaction_action = document.querySelectorAll('.transaction_action')
    transaction_action.forEach(el => {
        el.addEventListener('click', () => {
            if(el.dataset.transaction == 'deposit') {
                modal_element.style.display = 'flex'
                modal_input_id.style.display = 'none'
                modal_title.innerText = 'Deposit'

                transaction_type = el.dataset.transaction
            }
            else if(el.dataset.transaction == 'withdraw') {
                modal_element.style.display = 'flex'
                modal_input_id.style.display = 'none'
                modal_title.innerText = 'Withdraw'

                transaction_type = el.dataset.transaction
            }
            else if(el.dataset.transaction == 'transfer') {
                modal_element.style.display = 'flex'
                modal_input_id.style.display = 'block'
                modal_title.innerText = 'Transfer'

                transaction_type = el.dataset.transaction
            }
        })
    })

    let close_modal = document.querySelector('.return')
        close_modal.addEventListener('click', () => {
            modal_element.style.display = 'none'
    })

    modal_form.addEventListener('submit', (e) => {
        e.preventDefault()

        if(transaction_type === 'deposit'){
            transaction_deposit(loggedInID, data.balance, modal_input.value)
        }
        else if(transaction_type === 'withdraw'){
            transaction_withdraw(loggedInID, data.balance, modal_input.value)
        }
        else if(transaction_type === 'transfer'){
            transaction_transfer(loggedInID, data.balance, modal_input.value)
        }
    })

    // HISTORY
    let transaction_history = document.querySelector('.transaction_history');

    Array.from(data.history).forEach((e) => {
        transaction_history.innerHTML += `
            <div class="">
                <span class="transaction_type">${e.type}</span>
                <span class="transaction_amount currency">${e.amount}</span>
                <span class="transaction_date">${e.date}</span>
            </div>
            `
    })
    
}

if(authenticator()) {
    display_bankData()
}
else {
    location.assign('../pages/unauthorized.html')
}

const transaction_deposit = async (userID, balance, amount) => {
    let currentBalance = Number(balance);
    let depositAmount = Number(amount)
    let totalAmount = currentBalance + depositAmount

    const res = await fetch(`${api}userAccounts/${userID}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            balance: totalAmount
        })
    });

    await transaction_historyHandler();
}

const transaction_withdraw = async (userID, balance, amount) => {
    let currentBalance = Number(balance);
    let withdrawAmount = Number(amount)
    let totalAmount;
    if(currentBalance < withdrawAmount) {
        console.log('insuficient balance')
    } 
    else {
        totalAmount = currentBalance - withdrawAmount
    }

    const res = await fetch(`${api}userAccounts/${userID}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            balance: totalAmount,
        })
    });

    await transaction_historyHandler()
}

const transaction_transfer = async (userID, balance, amount) => {
    let currentBalance = Number(balance);
    let transferAmount = Number(amount)
    let totalAmount
    if(currentBalance < transferAmount) {
        console.log('insuficient balance')
    } 
    else {
        totalAmount = currentBalance - transferAmount
    }

    const res = await fetch(`${api}userAccounts/${userID}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            balance: totalAmount,
        })
    });
    const data = await res.json()

    transferFetcher(modal_input_id)
    
}

const transferFetcher = async (userID) => {
    const res = await fetch(`${api}userAccounts/${userID}`)
    const data = await res.json()
    
    console.log(data)
}

const transaction_historyHandler = async () => {
    let currentDate = `
    ${new Date().getMonth() + 1} -
    ${new Date().getDate()} -
    ${new Date().getFullYear()} 
    (${new Date().getHours() > 12 ? new Date().getHours() - 12 : new Date().getHours() === 00 && 12}:
    ${new Date().getMinutes()}
    ${new Date().getHours() >= 12  ? 'PM' : 'AM'})`

    const res = await fetch(`${api}history`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: transaction_type,
            amount: modal_input.value,
            date: currentDate,
            userAccountId: loggedInID
        })
    });
}
