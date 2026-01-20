import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: 'Главная | be MATYR' }
  },
//   {
//     path: '/services',
//     name: 'Services',
//     component: () => import('../views/Services.vue'),
//     meta: { title: 'Услуги | be MATYR' }
//   },
//   {
//     path: '/masters',
//     name: 'Masters',
//     component: () => import('../views/Masters.vue'),
//     meta: { title: 'Мастера | be MATYR' }
//   },
  {
    path: '/booking',
    name: 'Booking',
    component: () => import('../views/Booking.vue'),
    meta: { title: 'Запись | be MATYR' }
  },
//   {
//     path: '/contacts',
//     name: 'Contacts',
//     component: () => import('../views/Contacts.vue'),
//     meta: { title: 'Контакты | be MATYR' }
//   },
//   {
//     path: '/about',
//     name: 'About',
//     component: () => import('../views/About.vue'),
//     meta: { title: 'О нас | be MATYR' }
//   },
//   {
//     path: '/gallery',
//     name: 'Gallery',
//     component: () => import('../views/Gallery.vue'),
//     meta: { title: 'Галерея | be MATYR' }
//   },
//   {
//     path: '/admin',
//     name: 'Admin',
//     component: () => import('../views/Admin.vue'),
//     meta: { title: 'Админ-панель', requiresAuth: true }
//   },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'be MATYR | Семейные парикмахерские в Уфе'
  next()
})

export default router