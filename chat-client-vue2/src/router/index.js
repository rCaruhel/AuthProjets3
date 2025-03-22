import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '../components/Layout.vue';
import ChatView from '../views/ChatView.vue';
import UserRegister from '../views/UserRegisterView.vue';
import UserLogin from "@/views/UserLogin.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'home',
        component: ChatView
      },
      {
        path: '/userRegister',
        name: 'userRegister',
        component: UserRegister
      },
      {
        path : "/userLogin",
        name : "userLogin",
        component : UserLogin
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
