const atm_form = document.getElementById('atm_form');
const atm_card_numInput = document.getElementById('card_num')
const atm_card_pinInput = document.getElementById('card_pin')

atm_form.addEventListener('submit', (e) => {
    e.preventDefault();

    user_login();
})

const user_login = async () => {
    const res = await fetch(`${api}userAccounts`)
    const data = await res.json()
    console.log(data)

    if(atm_card_numInput.value === data[0].card.num) {
        if(atm_card_pinInput.value === data[0].card.pin){
            error_message.innerHTML = 'logged in'
            console.log('it works')
            
            login('user')
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