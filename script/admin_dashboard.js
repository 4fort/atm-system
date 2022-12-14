const logout_element = document.getElementById('logout')
const admin_account_list_element = document.getElementById('accounts')

logout_element.addEventListener('click', () => logout('admin'))


const admin_displayAccountsList = async () => {
    const res = await fetch(`${api}userAccounts`)
    const data = await res.json()

    data.forEach(e => {
        admin_account_list_element.innerHTML += `
            <div id="${e.id}" class="account_container" style="height: 10rem;">
                <div class="account_id">${e.id}</div>
                <div class="account_name">${e.card.owner}</div>
                <div>${e.card.num.match(/.{1,3}/g).join('-')}</div>
                <div>${e.card.pin}</div>
                <div>${e.qrpin}<br>
                    <div class="qrcode" style="height: 100px; width: 100px;"></div>
                </div>
                <div>
                    <span class="currency">${e.balance}</span>
                </div>
                <div class="account_actionButtons">
                    <i class="bi bi-pencil-square" onclick="admin_editAccount(this)"></i>
                    <i class="bi bi-trash-fill" onclick="admin_deleteAccount(this)"></i>
                </div>
            </div>
        `
        // console.log(e.card.owner)
    });
    qrCodeGenerator();

    account_deleteButton = document.querySelectorAll('.account_delete')
}

let SESSION_TOKEN_ADMIN = localStorage.getItem("SESSION_TOKEN_ADMIN")
if(SESSION_TOKEN_ADMIN) {
    admin_displayAccountsList()
}
else {
    location.assign('../pages/unauthorized.html')
}

let control_panel_form = document.getElementById('control_panel_form');
let control_panel_owner = document.getElementById('control_panel_owner');
let control_panel_amount = document.getElementById('control_panel_amount');
let random_card_num_element = document.getElementById('control_panel_randomCardNum')
let control_panel_pin = document.getElementById('control_panel_pin');


let random_card_num
const card_numGenerator = async () => {
    const res = await fetch(`${api}userAccounts/`);
    const data = await res.json();

    random_card_num = '456' + Math.floor(Math.random() * (999 - 100 + 1) + 100) + (data[data.length -1].id + 1)
    console.log(random_card_num)
    
    random_card_num_element.innerText = random_card_num.match(/.{1,3}/g).join('-')

}
card_numGenerator()


control_panel_form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(validate_inputs()) {
        admin_addAccount(control_panel_owner.value, control_panel_amount.value, control_panel_pin.value)

        isEdit = false
        console.log(isEdit)
    }
})

let isEdit = false;
let selectedElement;
let qrdata;

const admin_addAccount = async (owner, amount, pin) => {
    isEdit ? qrdata = qrdata : qrdata = tokenator();

    const res = await fetch(`${api}userAccounts/${isEdit ? selectedElement : ''}`, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            card: {
                owner: owner,
                num: random_card_num,
                pin: pin
            },
            qrpin: qrdata,
            balance: amount
        })
    });
    const data = await res.json();

    qrCodeGenerator()
}

let account_deleteButton = ''

const admin_deleteAccount = async (e) => {
    const res = await fetch(`${api}userAccounts/${e.parentElement.parentElement.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
    const data = await res.json();
    console.log(e.parentElement.parentElement.id)
}

const admin_editAccount = async (e) => {
    isEdit = true;
    selectedElement = e.parentElement.parentElement.id
    

    const res = await fetch(`${api}userAccounts/${e.parentElement.parentElement.id}`);
    const data = await res.json();

    control_panel_owner.value = data.card.owner
    control_panel_amount.value = data.balance
    random_card_num = data.card.num
    qrdata = data.qrdata
    control_panel_pin.value = data.card.pin

    random_card_num_element.innerText = random_card_num.match(/.{1,3}/g).join('-')
}


const validate_inputs = () => {
    if(control_panel_owner.value != '' && control_panel_amount.value != '' && control_panel_pin.value != ''){
        return true;
    }
    else if(control_panel_owner.value === '') {
        error_message.innerText = 'Please input name';
        return false;
    }
    else if(control_panel_amount.value === '') {
        error_message.innerText = 'Please input amount'
        return false;
    }
    else if(control_panel_pin.value === '') {
        error_message.innerText = 'Please input pin'
        return false;
    }
    
}

// import QRCode from 'qrcode'
// var QRCode = require('qrcode')
const qrCodeGenerator = async () => {
    const res = await fetch(`${api}userAccounts`)
    const data = await res.json()

    let canvas = document.querySelectorAll('.qrcode')
    data.forEach(e => {
        QRCode.toString(e.qrpin, {
            margin: 3
        }, function (err, string) {
            if (err) throw err

            canvas.forEach(el => {
                // console.log(el.parentElement.parentElement.id)
                if(el.parentElement.parentElement.id == e.id) {
                    el.innerHTML = string;
                    el.addEventListener('click', e => {
                        printIt(string);
                    })
                }

            })
            
        })
    })
    
}
// qrCodeGenerator()

function printIt(e) {
    let win = window.open();
    self.focus();
    win.document.open();
    win.document.write(e)
    win.document.close();
    win.print();
    win.close();
}