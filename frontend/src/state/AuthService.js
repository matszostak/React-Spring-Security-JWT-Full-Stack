class AuthService {

    registerSuccessfulLoginForJwt(id, username, token, role){
        localStorage.setItem('ID', id)
        localStorage.setItem('LOGGED_IN_USERNAME', username)
        localStorage.setItem('TOKEN', token)
        localStorage.setItem('ROLE', role)
    }

    logout(){
        localStorage.removeItem('ID')
        localStorage.removeItem('LOGGED_IN_USERNAME')
        localStorage.removeItem('TOKEN')
        localStorage.removeItem('ROLE')
    }

    isUserLoggedIn(){
        let user = localStorage.getItem('LOGGED_IN_USERNAME')
        return user !== null;
    }
    getLoggedInUsername(){
        let user = localStorage.getItem('LOGGED_IN_USERNAME')
        if(user === null) return ''
        return user
    }
}
export default new AuthService()
