const form = document.getElementById('admin_form');
const usn_element = document.getElementById('usn')
const pwd_element = document.getElementById('pwd')
const error_message = document.querySelector('.error_message')

var usn;
var pwd;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let api = 'http://localhost:3000/adminPanel'

    fetch(api)
    .then((res) => {
        let data = res.json();
        return data;
    })
    .then((data) => {
        usn = data.usn;
        pwd = data.password;
    })

    if(validation()){
        setTimeout(() => {
            if(usn_element.value === usn) {
                if(pwd_element.value === pwd){
                    console.log('it works')
                    return true;
                }
            }
            else {
                error_message.innerHTML = 'wrong credetials'
            }
        }, 50)
    }
})

const validation = () => {
    if(usn_element.value === '') {
        error_message.innerHTML = 'error login';

        return false;
    }
    else {
        return true;
    }
}