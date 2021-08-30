import Vue from "vue";
import VueRouter from "vue-router";
import api from "../library/Api";

Vue.use(VueRouter);

const ifAuthenticated = (to, from, next) => {

    if (
        api.checkToken()
    ) {
        next();
        return;
    }
    next("/login");
};

const routes = [
    {
        path: "/",
        name: "Index",
        component: () => import("../views/Index"),
        beforeEnter: ifAuthenticated,
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/Login"),
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../views/Register"),
    },
];

const router = new VueRouter({
    routes,
    mode: "history",
});

export default router;
