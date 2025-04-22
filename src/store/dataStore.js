import { makeObservable, observable, action } from "mobx";


class DataStore {
    isLogin = false;
    isMeeting = true;
    services = [];
    meetings = [];
    businessData = null;


    constructor() {
        makeObservable(this, {
            isLogin: observable,
            setIsLogin: action,
            services: observable,
          
        })
    }

    setIsLogin(status) {
        this.isLogin = status;
    }
 

   
};
export default new DataStore();