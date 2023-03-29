import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Change from '../views/Change.vue'
import Subreddits from '../views/Subreddits.vue'
import Posts from '../views/Posts.vue'

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Subreddits,
      children: [
        {
          path: 'subreddit/:name',
          component: Posts,
        },
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/change',
      name: 'Change',
      component: Change
    }
  ]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
