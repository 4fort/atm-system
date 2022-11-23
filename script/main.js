const error_message = document.querySelector('.error_message')

let api = 'http://localhost:3000/'


const authorization = () => {
    if(!authenticator()){
        console.log('unauthorized')
    }
    else {
        console.log('authorized')
    }
}
authorization()