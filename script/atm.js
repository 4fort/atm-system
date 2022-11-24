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

    let deposit_element = document.querySelector('.deposit');
    let withdraw_element = document.querySelector('.withdraw');
    let transfer_element = document.querySelector('.transfer');
    

    user_element.innerHTML = `<i class="bi bi-person-fill"></i>${data.card.owner}`;
    balance_element.innerText = data.bank.balance

    let transac_paths = [
        '../pages/transactions/deposit.html',
        '../pages/transactions/withdraw.html',
        '../pages/transactions/transfer.html'
    ]
    deposit_element.addEventListener('click', () => {
        console.log('test')
    })
}
display_bankData()