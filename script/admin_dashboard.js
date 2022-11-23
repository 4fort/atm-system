const logout_element = document.getElementById('logout')
const admin_account_list_element = document.getElementById('accounts')

logout_element.addEventListener('click', () => logout('admin'))


const admin_displayAccountsList = async () => {
    const res = await fetch(`${api}userAccounts`)
    const data = await res.json()

    data.forEach(e => {
        admin_account_list_element.innerHTML += `
            <div id="${e.id}" class="account_container">
                <div class="account_name">${e.card.owner}</div>
                <div  class="account_card">
                    <span>${e.card.num}</span>
                    <span>${e.card.pin}</span>
                </div>
                <div>
                    <span>${e.bank.balance}</span>
                </div>
                <div class="account_actionButtons">
                    <i class="bi bi-pencil-square account_edit"></i>
                    <i class="bi bi-trash-fill" onclick="admin_deleteAccount(this)"></i>
                </div>
            </div>
        `
        // console.log(e.card.owner)
    });

    account_deleteButton = document.querySelectorAll('.account_delete')
}

if(authenticator()) {
    admin_displayAccountsList()
}
else {
    document.body.innerHTML = `
        unauthorized <a href="../index.html">Go to login page</a>
    `
}

let control_panel_form = document.getElementById('control_panel_form');
let control_panel_owner = document.getElementById('control_panel_owner');
let control_panel_deposit = document.getElementById('control_panel_deposit');
let random_card_num_element = document.getElementById('control_panel_randomCardNum')
let control_panel_pin = document.getElementById('control_panel_pin');


let random_card_num = '456 - ' + Math.floor(Math.random() * (999 - 100 + 1) + 100)
console.log(random_card_num)

random_card_num_element.innerText = random_card_num;

control_panel_form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(validate_inputs()) {
        admin_addAccount(control_panel_owner.value, control_panel_deposit.value, control_panel_pin.value)
    }
})

const admin_addAccount = async (owner, deposit, pin) => {
    const res = await fetch(`${api}userAccounts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            card: {
                owner: owner,
                num: random_card_num,
                pin: pin
            },
            bank: {
                balance: deposit,
                history: {
                    deposit: [{}],
                    withdraw: [{}],
                    transaction: [{}]
                }
            }
        })
    });
    const data = await res.json();
}

let account_deleteButton = ''

const admin_deleteAccount = async (e) => {
    const res = await fetch(`${api}userAccounts${e.parentElement.parentElement.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {}
    });
    const data = await res.json();
    console.log(e.parentElement.parentElement.id)
}

const validate_inputs = () => {
    if(control_panel_owner.value != '' && control_panel_deposit.value != '' && control_panel_pin.value != ''){
        return true;
    }
    else if(control_panel_owner.value === '') {
        error_message.innerText = 'Please input name';
        return false;
    }
    else if(control_panel_deposit.value === '') {
        error_message.innerText = 'Please input amount'
        return false;
    }
    else if(control_panel_pin.value === '') {
        error_message.innerText = 'Please input pin'
        return false;
    }
    
}