import { createRouter, createWebHistory } from 'vue-router'
const Layout = () => import('../views/layout/index.vue')
const Home = () => import('../views/home/index.vue')
const Service = () => import('../views/service/service.vue')
const Actions = () => import('../views/actions/actions.vue')
const Policies = () => import('../views/policies/policies.vue')

const routes = [
    {
        path: '/',
        component: Layout,
        meta: { title: 'devops' },
        children: [
            { meta: { title: '首页' }, path: '', name: 'home', component: Home },
            { meta: { title: '服务管理' }, path: '/service', name: 'service', component: Service },
            { meta: { title: '服务管理' }, path: '/actions', name: 'actions', component: Actions },
            { meta: { title: '服务管理' }, path: '/policies', name: 'policies', component: Policies },
        ]
      }
]

const router = createRouter({
    history: createWebHistory('/uias-devops/'),
    // base: '/uias-devops/',
    routes,
})

export default router
