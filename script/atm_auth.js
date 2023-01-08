const atm_form = document.getElementById('atm_form');
const atm_card_numInput = document.getElementById('card_num')
const atm_card_pinInput = document.getElementById('card_pin')
const atm_qr_card_pinInput = document.getElementById('qr-card_pin');

atm_form.addEventListener('submit', (e) => {
    e.preventDefault();

    user_login();
})

const user_login = async (el) => {
    const res = await fetch(`${api}userAccounts`)
    const data = await res.json()
    // console.log(data[0])

    data.forEach(e => {
        if (!atm_card_numInput.value && !atm_card_pinInput.value) {
            atm_card_numInput.style.outline = 'solid 3px red'
            atm_card_pinInput.style.outline = 'solid 3px red'
            error_message.innerText = 'Please input fields!'
        }
        else if(atm_card_pinInput.value != e.card.pin) {
            atm_card_pinInput.style.outline = 'solid 3px red'
            console.log('wrong pin')
        }
        else if(atm_card_numInput.value === e.card.num && atm_card_pinInput.value === e.card.pin) {
            atm_card_numInput.style.outline = 'none'
            atm_card_pinInput.style.outline = 'none'
            error_message.innerText = 'Logged in'

            login('user', e)
        }

        
    });
}

const qr_user_login = async (qr) => {
    const res = await fetch(`${api}userAccounts`)
    const data = await res.json()

    data.forEach( e => {
        if (qr === e.qrpin && atm_qr_card_pinInput.value === e.card.pin) {
            login('user', e)
        }
        else if(atm_qr_card_pinInput.value != e.card.pin) {
            atm_qr_card_pinInput.style.outline = 'solid 3px red'
        }
    })
}

atm_form.addEventListener('input', () => {
    error_message.innerText = ''
    if(atm_card_numInput.value){
        atm_card_numInput.style.outline = 'none'
        if(atm_card_pinInput.value){
            atm_card_pinInput.style.outline = 'none'
        }
    }

    if(atm_qr_card_pinInput.value){
        console.log('test')
        atm_qr_card_pinInput.style.outline = 'none'
    }
})

const atm_auth_VALIDATION = () => {
    
}