import { extendObservable } from 'mobx';

// Criando a classe para usuário (poderia ser no App.js)
// Mas, é para ficar mais organizado
class UserStore {
    constructor() {
        extendObservable(this, {

            loading: true,
            isLoggedIn: false,
            username: ''

        })
    }
}

export default new UserStore();  