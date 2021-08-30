import axios from "axios";
import HttpError from "./HttpError";

const envVariables = process.env;
const {
    API_SERVICE_URL
} = envVariables;

class Api {

    constructor() {
    }

    getToken() {
        return localStorage.getItem("token");
    }

    getUserId() {
        return localStorage.getItem("userId");
    }

    setToken(token) {
        localStorage.setItem('token', token);
        return this;
    }

    setUserId(userId) {
        localStorage.setItem('userId', userId);
        return this;
    }

    checkToken() {
        const token = this.getToken();

        if (!token || token === undefined) {
            return false;
        }
        return true;
    }

    getUrl(url) {
        return API_SERVICE_URL + url;
    }

    getAxiosConfig() {
        const config = {
            headers: {}
        };

        if (this.checkToken()) {
            const token = this.getToken();
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    }

    get(url) {
        return new Promise((resolve, reject) => {
            axios.get(this.getUrl(url), this.getAxiosConfig())
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    const e = this.handleAxiosError(error);
                    if (e.getCode() == 403) {

                        this.refreshToken()
                            .then(response => {
                                this.post(url, data);
                            })
                            .catch(error => {
                                location.href = '/login';
                            });
                    }
                    if (e.getCode() == 401) {
                        this.setToken('');
                        this.setUserId('');
                        location.href = '/login';
                    }
                    reject(e);
                });
        });
    }

    post(url, data) {
        return new Promise((resolve, reject) => {
            axios.post(this.getUrl(url), data, this.getAxiosConfig())
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {

                    const e = this.handleAxiosError(error);

                    if (e.getCode() == 403) {

                        this.refreshToken()
                            .then(response => {
                                this.post(url, data);
                            })
                            .catch(error => {
                                location.href = '/login';
                            });
                    }

                    if (e.getCode() == 401) {
                        this.setToken('');
                        this.setUserId('');
                        location.href = '/login';
                    }

                    reject(e);

                });
        });
    }

    refreshToken() {
        return new Promise((resolve, reject) => {
            axios.get('/api/user/refresh_token')
                .then(response => {
                    this.setToken(response.token);
                    this.setUserId(response.id);
                    resolve(response);
                })
                .catch(reject);
        });
        //403
    }

    handleAxiosError(error) {
        let code = null;
        let message = null;
        if( error.response ){
            code = error.response.status;
            if (error.response.data) {
                if (error.response.data.error) {
                    message = error.response.data.error.message;
                }
            }
        }

        return new HttpError(message, code);
    }

    /**
     *
     * @param email
     * @param password
     * @returns {Promise<unknown>}
     */
    login(email, password) {
        return new Promise((resolve, reject) => {
            this.post('/api/user/login/', {
                email,
                password
            })
                .then(response => {
                    this.setToken(response.token);
                    this.setUserId(response.id);
                    resolve(response);
                }).catch(reject)
        });
    }

    /**
     * @param inn
     * @param email
     * @param password
     * @returns {Promise<unknown>}
     */
    register(inn, email, password) {
        return new Promise((resolve, reject) => {
            this.post('/api/user/register/', {
                email,
                inn,
                password
            })
                .then(response => {
                    this.setToken(response.token);
                    this.setUserId(response.id);
                    resolve(response);
                }).catch(reject)
        });
    }


    getCurrentUser() {

        return new Promise((resolve, reject) => {
            const userId = this.getUserId();
            if (!userId || !this.checkToken()) {
                reject(new HttpError("Not Authorized", 401));
            }

            this.get(`/api/user/detail/${userId}/`)
                .then(resolve)
                .catch(reject);
        });
    }

    logout() {
        this.setToken('');
        this.setUserId('');
        return new Promise((resolve, reject) => {
            this.get('/api/user/logout')
                .then(response => {
                    resolve(response);
                }).catch(reject);

            location.href = '/login';
        });
    }


    newOrder(amount, term) {
        return this.post('/api/orders/new/', {
            amount,
            term
        })
    }

    listOrders() {
        return this.get('/api/orders/list/');
    }

    detailOrder(orderId) {
        return this.get(`/api/orders/details/${orderId}/`);
    }
}

const api = new Api();
export default api;
