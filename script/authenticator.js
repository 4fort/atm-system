const authenticator = () => {
    let SESSION_TOKEN_ADMIN = localStorage.getItem("SESSION_TOKEN_ADMIN")
    let SESSION_TOKEN = localStorage.getItem("SESSION_TOKEN")
    if(SESSION_TOKEN !== null || SESSION_TOKEN_ADMIN !== null){
        // document.write('AUTHORIZED')
        return true
    }
    else {
        // document.write('NOT AUTHORIZED')
        return false
    }
}

const tokenator = () => {
    let token = Math.random().toString(36).substring(2)
    return token
}

const login = (TYPE, user) => {

    if(TYPE === 'admin') {
        localStorage.setItem('SESSION_TOKEN_ADMIN', tokenator())

        if(localStorage.getItem("SESSION_TOKEN_ADMIN")) {
            window.location.assign('../pages/adminDashboard.html')
        }
        else{

        }
    }
    else if(TYPE === 'user') {
        localStorage.setItem('SESSION_TOKEN', tokenator())

        if(localStorage.getItem("SESSION_TOKEN")) {
            localStorage.setItem('loggedInUser', user.id)
            window.location.assign('../pages/atm.html')
        }
    }
    console.log(user)
}

const logout = (TYPE) => {

    if(TYPE === 'admin') {
        localStorage.removeItem('SESSION_TOKEN_ADMIN')
    }
    else if(TYPE === 'user') {
        localStorage.removeItem('SESSION_TOKEN')
        localStorage.removeItem('loggedInUser')
    }

    window.location.assign('../index.html')
}