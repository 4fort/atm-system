const admin_form = document.getElementById('admin_form');
const admin_usn_element = document.getElementById('usn')
const admin_pwd_element = document.getElementById('pwd')

admin_form.addEventListener('submit', (e) => {
    e.preventDefault();

    admin_login()
})

const admin_login = async () => {
    const res = await fetch(`${api}adminPanel`)
    const data = await res.json()

    if(admin_usn_element.value === data.usn) {
        if(admin_pwd_element.value === data.password){
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
}
