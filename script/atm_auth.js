const atm_form = document.getElementById('atm_form');
const atm_card_numInput = document.getElementById('card_num')
const atm_card_pinInput = document.getElementById('card_pin')

atm_form.addEventListener('submit', (e) => {
    e.preventDefault();

    user_login();
})

const user_login = async () => {
    const res = await fetch(`${api}userCredentials`)
    const data = await res.json()

    if(atm_card_numInput.value === data[0].card_num) {
        if(atm_card_pinInput.value === data[0].card_pin){
            error_message.innerHTML = 'logged in'
            console.log('it works')
            return true;
        }
        else {
            error_message.innerHTML = 'wrong pin'
            console.log('wrong password')
        }
    }
    else {
        error_message.innerHTML = 'wrong num'
        console.log('wrong username')
    }
}