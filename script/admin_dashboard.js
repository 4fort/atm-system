const logout_element = document.getElementById('logout')
const admin_account_list_element = document.getElementById('accounts')

logout_element.addEventListener('click', () => logout('admin'))



const admin_displayAccountsList = () => {
    let account_name, account_cardNum, account_cardPin;

    setTimeout(() => {
        fetch(`${api}userAccounts`)
        .then(res => res.json())
        .then(data => {
            data.forEach(e => {
                admin_account_list_element.innerHTML += `
                    <div class="account_container">
                        <div class="account_name">${e.card.owner}</div>
                        <div  class="account_card">
                            <span>${e.card.num}</span>
                            <span>${e.card.pin}</span>
                        </div>
                        <div>
                            <span>${e.bank.balance}</span>
                        </div>
                        <i class="bi bi-pencil-square" id="account_edit"></i>
                    </div>
                `
                // console.log(e.card.owner)
            });
        })
    },50)
    

}
admin_displayAccountsList()

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
    admin_addAccount(control_panel_owner.value, control_panel_deposit.value, control_panel_pin.value)
})

const admin_addAccount = (owner, deposit, pin) => {
    

    fetch(`${api}userAccounts`, {
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
    })
    .then(res => res.json())
    .then()
}