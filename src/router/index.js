import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/cadastro',
    name: 'cadastro',
    component: () => import('../views/Cadastro.vue')
  },
  {
    path: '/afiliado',
    name: 'afiliado',
    component: () => import('../views/Afiliados.vue'),
  },
  {
    path: '/cadastro-afiliado',
    name: 'cadastro-afiliado',
    component: () => import('../views/CadastroAfiliado.vue')
  },
  {
    path: '/pix',
    name: 'pix',
    component: () => import('@/components/Pix.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
