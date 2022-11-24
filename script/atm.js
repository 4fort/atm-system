if(!authenticator()) {
    location.assign('../pages/unauthorized.html')
}

const display_bankData = async () => {
    let loggedInID = localStorage.getItem('loggedInUser')
    const res = await fetch(`${api}userAccounts/${loggedInID}`)
    const data = await res.json()

    console.log(data)
    let user_element = document.querySelector('.user')
    let balance_element = document.querySelector('.balance');


    user_element.innerHTML = `<i class="bi bi-person-fill"></i>${data.card.owner}`;
    balance_element.innerText = data.bank.balance


    // MODAL
    let transaction_type;

    let modal_element = document.querySelector('.modal')
    let modal_title = document.querySelector('.title');

    let transaction_action = document.querySelectorAll('.transaction_action')
    transaction_action.forEach(el => {
        el.addEventListener('click', () => {
            if(el.dataset.transaction == 'deposit') {
                modal_element.style.display = 'flex'
                modal_title.innerText = 'Deposit'

                transaction_type = el.dataset.transaction
            }
            else if(el.dataset.transaction == 'withdraw') {
                modal_element.style.display = 'flex'
                modal_title.innerText = 'Withdraw'

                transaction_type = el.dataset.transaction
            }
            else if(el.dataset.transaction == 'transfer') {
                modal_element.style.display = 'flex'
                modal_title.innerText = 'Transfer'

                transaction_type = el.dataset.transaction
            }
        })
    })

    let close_modal = document.querySelector('.return')
        close_modal.addEventListener('click', () => {
            modal_element.style.display = 'none'
    })

    let modal_form = document.querySelector('.modal_form')
    let modal_input = document.querySelector('.modal_input')
    modal_form.addEventListener('submit', (e) => {
        e.preventDefault()

        if(transaction_type == 'deposit'){
            transaction_deposit(loggedInID, modal_input.value)
        }
    })
}
display_bankData()

const transaction_deposit = async (userID, amount) => {
    
}