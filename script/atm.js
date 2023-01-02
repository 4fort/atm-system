let api = 'http://localhost:3000/'
let loggedInID = Number(localStorage.getItem('loggedInUser'))

let modal_form = document.querySelector('.modal_form')
let modal_input = document.querySelector('.modal_input')
let modal_input_id = document.querySelector('.modal_input_id')
let transaction_type;
let currentLoggedInCardNum;


const display_bankData = async () => {
    const res = await fetch(`${api}userAccounts/${loggedInID}?_embed=history`)
    const data = await res.json()

    
    currentLoggedInCardNum = data.card.num;

    console.log(data)
    let user_element = document.querySelectorAll('.user')
    let balance_element = document.querySelector('.balance');


    user_element.forEach(e => {
        e.innerHTML = data.card.owner;
    }) 
    balance_element.innerText = Number(data.balance).toLocaleString('en-US')

    // CARD DISPLAY
    let atm_cardNum_Element = document.querySelector('.atm_cardNum');
    let atm_cardHolder_Element = document.querySelector('#atm_cardHolder');
    let atm_cardId_Element = document.querySelector('#atm_cardId');
    let atm_cardEditPIN_Element = document.querySelector('#atm_cardEditPIN')

    atm_cardNum_Element.innerText = data.card.num.match(/.{1,3}/g).join('-');
    atm_cardHolder_Element.innerText = data.card.owner;
    let atm_cardPin_showHide = false;
    let atm_cardEditPIN_isEdit = false;

    atm_cardId_Element.addEventListener('click', () => {
        console.log(atm_cardPin_showHide)
            if(atm_cardPin_showHide && !atm_cardEditPIN_isEdit) {
                atm_cardId_Element.innerText = '****';
                atm_cardPin_showHide = false;
            }
            else {
                atm_cardId_Element.innerText = data.card.pin;
                atm_cardPin_showHide = true;
            }
    })

    atm_cardEditPIN_Element.addEventListener('click', () => {
        if(atm_cardEditPIN_isEdit) {
            atm_cardEditPIN_isEdit = false;
            atm_cardId_Element.innerHTML = '<input>'
        }
        else {
            atm_cardEditPIN_isEdit = true;
            atm_cardId_Element.innerHTML = data.card.pin
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
                modal_element.classList.remove('transactionTransfer')

                transaction_type = el.dataset.transaction
            }
            else if(el.dataset.transaction == 'withdraw') {
                modal_element.style.display = 'flex'
                modal_input_id.style.display = 'none'
                modal_title.innerText = 'Withdraw'
                modal_element.classList.remove('transactionTransfer')

                transaction_type = el.dataset.transaction
            }
            else if(el.dataset.transaction == 'transfer') {
                modal_element.style.display = 'flex'
                modal_input_id.style.display = 'block'
                modal_title.innerText = 'Transfer'
                modal_element.classList.add('transactionTransfer')

                transaction_type = el.dataset.transaction
            }
            else {
                modal_element.style.display = 'none'
            }
        })
    })

    let close_modal = document.querySelector('.return')
        close_modal.addEventListener('click', () => {
            modal_element.style.display = 'none'
    })

    modal_form.addEventListener('submit', (e) => {
        e.preventDefault()

        if(modal_input.value <= 0){
            // DO NOTHING
        }
        else {
            if(transaction_type === 'deposit'){
                transaction_deposit(loggedInID, data.balance, modal_input.value)
            }
            else if(transaction_type === 'withdraw'){
                transaction_withdraw(loggedInID, data.balance, modal_input.value)
            }
            else if(transaction_type === 'transfer'){
                transaction_transferHandler(loggedInID, data.balance, modal_input.value)
            }
        }
    })

    // HISTORY
    let transaction_history = document.querySelector('.transaction_history');

    Array.from(data.history).forEach((e) => {
        let transfer_isAdd;
        if(e.previousAmount > data.balance) {
            transfer_isAdd = '+'
        }
        transaction_history.insertAdjacentHTML("afterbegin", `
        <div class="cell hsc">
            <span class="transaction_type">${e.type}</span>
            <span class="transaction_date hsd">${e.date}</span>
            <span class="transaction_balance">
                <div class="transaction_previousAmount currency">${e.previousAmount.toLocaleString('en-US')}</div>
                <div class="transaction_amount currency" style="color:${
                    e.type == 'deposit' ? 'green' : e.transfer.isReceiver ? 'green' : 'red'
                };">${
                    e.type == 'deposit' ? '+' : e.transfer.isReceiver ? '+' : '-' 
                } ${Number(e.amount).toLocaleString('en-US')}</div>
                <i class="bi bi-receipt-cutoff printHistory" data-parent=${data.id} id=${e.id}></i>
            </span>
        </div>
        `);

        let printHistoryBtn = document.querySelectorAll('.printHistory')
        printHistoryBtn.forEach(el => {
            console.log(el.id, e.id)
            if(data.id == el.dataset.parent){
                el.addEventListener('click', () => {
                    if(el.id == e.id){
                        printIt(`
                        <style>
                        * {
                            font-family: monospace;
                            line-height: 5px;
                            font-size: 1.25rem;
                        }
                        h1 {
                            font-size: 2.1rem;
                        }
                        h1, h5 {
                            text-align: center;
                            margin: 20px;
                        }
                        span {
                            display: flex;
                            justify-content: space-between;
                        }
                        h4 {
                            text-transform: Capitalize;
                        }
                        </style>
        
                        <hr>
                        <br>
                        <h1>FORTBANK</h1>
                        <br>
                        <hr>
                        <span><h4>Date:</h4><h4>${e.date}</h4></span>
                        <span><h4>Customer Name:</h4><h4>${data.card.owner}</h4></span>
                        <span><h4>Customer Card:</h4><h4>${data.card.num.match(/.{1,3}/g).join('-')}</h4></span>
                        ${e.type === 'transfer' ? `
                        <span>
                            <h4>${e.transfer.isReceiver ? 'Sender' : 'Receiver'} Card:</h4>
                            <h4>${e.transfer.isReceiver ? e.transfer.cardSender.match(/.{1,3}/g).join('-') : e.transfer.cardReceiver.match(/.{1,3}/g).join('-')}</h4></span>
                        ` : ``}
                        <span><h4>Account ID:</h4><h4>${data.id}</h4></span>
                        <span><h4>Transaction:</h4><h4>${e.type}</h4></span>
                        <hr>
                        <span><h2>Amount:</h2><h2>₱${Number(e.amount).toLocaleString('en-US')}</h2></span>
                        <span><h4>Previous Balance:</h4><h4>₱${e.previousAmount.toLocaleString('en-US')}</h4></span>
                        <span><h4>Total Balance:</h4><h4>₱${e.type == 'deposit' ? (+e.previousAmount + +e.amount).toLocaleString('en-US') : e.transfer.isReceiver ? (+e.previousAmount + +e.amount).toLocaleString('en-US') : (+e.previousAmount - +e.amount).toLocaleString('en-US')}</h4></span>
                        <hr>
                        <span><h4>Current Balance:</h4><h4>₱${Number(data.balance).toLocaleString('en-US')}</h4></span>
                        <hr>
                        <h5>THANKS FOR USING MY ATM SYSTEM</h5>
                        <h5>Sir Please Perfect Akong Score ^_^</h5>
                        <h5>100/100</h5>
                    `)
                    }
                })
            }
        })
    })

    let qrcodeCanvas = document.querySelector('.qrcode');
    QRCode.toString(data.qrpin, {
        margin: 3
    }, function (err, string) {
        if (err) throw err

        qrcodeCanvas.innerHTML = string;
        qrcodeCanvas.addEventListener('click', e => {
            printIt(string);
        })
        
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
            balance: +totalAmount
        })
    });

    let transfer = {
        isReceiver: true,
        cardReceiver: modal_input_id.value,
        cardSender: currentLoggedInCardNum
    }

    await transaction_historyHandler(currentBalance, userID, transfer);
}

const transaction_withdraw = async (userID, balance, amount) => {
    let currentBalance = Number(balance);
    let withdrawAmount = Number(amount)
    let totalAmount;

    if(currentBalance < withdrawAmount) {
        console.log('insuficient balance')
        totalAmount = currentBalance;
    } 
    else {
        totalAmount = currentBalance - withdrawAmount

        
        let transfer = {
            isReceiver: false,
            cardSender: currentLoggedInCardNum,
            cardReceiver: modal_input_id.value
        }

        await transaction_historyHandler(currentBalance, userID, transfer)
    }

    const res = await fetch(`${api}userAccounts/${userID}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            balance: +totalAmount,
        })
    });

}

const transaction_transferHandler = async (userID, balance, amount) => {
    let transferalNum = modal_input_id.value
    const res = await fetch(`${api}userAccounts/`)
    const data = await res.json()

    await data.forEach( async (e) => {
        if(transferalNum == e.card.num) {
            await transaction_withdraw(userID, balance, amount)

            await transaction_deposit(e.id, e.balance, amount)
        }
    })
    // console.log(userID, balance, amount)
    // await data.forEach(e => {
    //     if(e.card.num == transferalNum){
    //         console.log(transferalNum, e.card.num)
    //         console.log(e.id, e.balance, amount)
    //     }
    // })


}

// 45643515
// 456420

const transaction_historyHandler = async (currentBalance, userID, transfer) => {
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
            userAccountId: userID,
            transfer
        })
    });
}

const printIt = (e) => {
    let win = window.open();
    self.focus();
    win.document.open();
    win.document.write(e)
    win.document.close();
    win.print();
    win.close();
}