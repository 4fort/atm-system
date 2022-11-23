const logout_element = document.getElementById('logout')
const admin_account_list_element = document.getElementById('accounts')

logout_element.addEventListener('click', () => logout('admin'))



const admin_displayAccountsList = () => {
    let accounts

    setTimeout(() => {
        fetch(`${api}userAccounts`)
        .then(res => res.json())
        .then(data => {
            data.forEach(e => {
                admin_account_list_element.innerHTML += `
                    <div class="account_container">
                        <div class="account_name">${e.card.owner}</div>
                        <div  class="account_card">
                            <span>${e.card.num}</span>
                            <span>${e.card.pin}</span>
                        </div>
                        <i class="bi bi-pencil-square" id="account_edit"></i>
                    </div>
                `
                console.log(e.card.owner)
            });
        })
    },50)
    

    admin_account_list_element.innerHTML = `
        
    `
}
admin_displayAccountsList()