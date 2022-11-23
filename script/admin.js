const admin_form = document.getElementById('admin_form');
const admin_usn_element = document.getElementById('usn')
const admin_pwd_element = document.getElementById('pwd')
const error_message = document.querySelector('.error_message')

var usn;
var pwd;

admin_form.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch(`${api}adminPanel`)
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
            if(admin_usn_element.value === usn) {
                if(admin_pwd_element.value === pwd){
                    error_message.innerHTML = 'logged in'
                    
                    login('admin');
                }
                else {
                    error_message.innerHTML = 'wrong password'
                    console.log('wrong password')
                }
            }
            else {
                error_message.innerHTML = 'wrong username'
                console.log('wrong username')
            }
        }, 50)
    }
})


const input = document.getElementsByTagName('input')

const validation = () => {
    // Array.from(input).forEach(e => {
    //     if(e.value === '') {
    //         error_message.innerHTML = 'error login';
    
    //         return false;
    //     }
    //     else {
    //         return true;
    //     }
    // });
    return true;
}