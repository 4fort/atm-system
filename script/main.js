const error_message = document.querySelector('.error_message')

let api = 'http://localhost:3000/'


const authorization = () => {
    if(!authenticator()){
        console.log('unauthorized')
    }
    else if(window.location.pathname == '/admin.html' || window.location.pathname == '/pages/adminDashboard.html'){

    }
    else {
        console.log('authorized')
        location.assign('../pages/atm.html')
    }
}
authorization()