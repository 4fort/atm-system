const atm_form = document.getElementById('atm_form');
const atm_card_numInput = document.getElementById('card_num')
const atm_card_pinInput = document.getElementById('card_pin')

var card_num;
var card_pin;

atm_form.addEventListener('submit', (e) => {
    e.preventDefault();
    let api = 'http://localhost:3000/userCredentials'

    fetch(api)
    .then((res) => {
        let data = res.json();
        return data;
    })
    .then((data) => {
        card_num = data[0].card.num;
        card_pin = data[0].card.pin;
    })


    if(validation()){
        setTimeout(() => {
            if(atm_card_numInput.value === card_num) {
                if(atm_card_pinInput.value === card_pin){
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
        }, 50)
    }
})