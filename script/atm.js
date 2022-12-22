let loggedInID = Number(localStorage.getItem('loggedInUser'))


let modal_form = document.querySelector('.modal_form')
let modal_input = document.querySelector('.modal_input')
let modal_input_id = document.querySelector('.modal_input_id')
let transaction_type;


const display_bankData = async () => {
    const res = await fetch(`${api}userAccounts/${loggedInID}?_embed=history`)
    const data = await res.json()

    console.log(data)
    let user_element = document.querySelectorAll('.user')
    let balance_element = document.querySelector('.balance');


    user_element.forEach(e => {
        e.innerHTML = data.card.owner;
    }) 
    balance_element.innerText = data.balance.toLocaleString('en-US')

    // CARD DISPLAY
    let atm_cardNum_Element = document.querySelector('.atm_cardNum');
    let atm_cardHolder_Element = document.querySelector('#atm_cardHolder');
    let atm_cardId_Element = document.querySelector('#atm_cardId');

    atm_cardNum_Element.innerText = data.card.num.match(/.{1,3}/g).join('-');
    atm_cardHolder_Element.innerText = data.card.owner;
    let atm_cardPin_showHide = true;

    atm_cardId_Element.addEventListener('click', () => {
        console.log(atm_cardPin_showHide)

        if(atm_cardPin_showHide) {
            atm_cardId_Element.innerText = '****';
            atm_cardPin_showHide = false;
        }
        else {
            atm_cardId_Element.innerText = data.card.pin;
            atm_cardPin_showHide = true;
        }
    })


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
        transaction_history.insertAdjacentHTML("afterbegin", `
        <div class="cell hsc">
            <span class="transaction_type">${e.type}</span>
            <span class="transaction_date hsd">${e.date}</span>
            <span class="transaction_balance">
                <div class="transaction_previousAmount currency">${e.previousAmount}</div>
                <div class="transaction_amount currency" style="color:${e.type == 'withdraw' ? 'red' : 'green'};">${e.type == 'withdraw' ? '-' : '+'} ${e.amount}</div>
            </span>
        </div>
        `);
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

    await transaction_historyHandler(currentBalance);
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

        await transaction_historyHandler(currentBalance)
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

const transaction_historyHandler = async (currentBalance) => {
    let currentDate = `
    ${new Date().getMonth() + 1} -
    ${new Date().getDate()} -
    ${new Date().getFullYear()} 
    (${new Date().getHours() > 12 ? new Date().getHours() - 12 : new Date().getHours() === 00 ? 12 : new Date().getHours()}:
    ${new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()}
    ${new Date().getHours() >= 12  ? 'PM' : 'AM'})`

    const res = await fetch(`${api}history`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: transaction_type,
            date: currentDate,
            amount: modal_input.value,
            previousAmount: currentBalance,
            userAccountId: loggedInID
        })
    });
}
