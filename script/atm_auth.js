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
        // console.log(e.card.num == atm_card_numInput)
        if(atm_card_numInput.value === e.card.num || el === e.qrpin) {
            atm_card_numInput.style.outline = 'none'

            if(atm_card_pinInput.value === e.card.pin || atm_qr_card_pinInput.value === e.card.pin){
                error_message.innerHTML = 'logged in'

                atm_card_numInput.style.outline = 'none'
                atm_card_pinInput.style.outline = 'none'
                atm_qr_card_pinInput.style.outline = 'none'
                console.log('it works')
                
                login('user', e)
            }
            else {
                atm_card_pinInput.style.outline = 'solid 3px red'
                atm_qr_card_pinInput.style.outline = 'solid 3px red'
                error_message.innerHTML = 'wrong pin'
                console.log('wrong password')
            }
        }
        else {
            atm_card_numInput.style.outline = 'solid 3px red';
            error_message.innerHTML = 'wrong credentials'
            console.log('wrong number')
        }

        
    });

    
}

atm_form.addEventListener('input', () => {
    if(atm_card_numInput.value != null){
        atm_card_numInput.style.outline = 'none'
        if(atm_card_pinInput.value != null){
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