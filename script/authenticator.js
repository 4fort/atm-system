const authenticator = () => {
    let SESSION_TOKEN = localStorage.getItem("SESSION_TOKEN_ADMIN")
    if(SESSION_TOKEN !== null){
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

const login = (TYPE) => {

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
            window.location.assign('../pages/atm.html')
        }
    }
}

const logout = (TYPE) => {

    if(TYPE === 'admin') {
        localStorage.removeItem('SESSION_TOKEN_ADMIN')
    }
    else if(TYPE === 'user') {
        localStorage.removeItem('SESSION_TOKEN')
    }

    window.location.assign('../index.html')
}