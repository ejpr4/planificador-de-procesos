import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import fifo from '../views/fifo.vue'
import Slow from '../views/slowJobFirst.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/fifo',
    name: 'fifo',
    component: fifo
  },
  {
    path: '/slow-job-first',
    name: 'slow-job-first',
    component: Slow
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
