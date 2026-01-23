import { createRouter, createWebHistory } from 'vue-router'

// Функция проверки авторизации
// const isAuthenticated = () => {
//   return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')
// }

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: 'Главная | be MATYR' }
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('../views/Services.vue'),
    meta: { title: 'Услуги | be MATYR' }
  },
  {
    path: '/masters',
    name: 'Masters',
    component: () => import('../views/Masters.vue'),
    meta: { title: 'Мастера | be MATYR' }
  },
  {
    path: '/booking',
    name: 'Booking',
    component: () => import('../views/Booking.vue'),
    meta: { title: 'Запись | be MATYR' }
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: () => import('../views/Contacts.vue'),
    meta: { title: 'Контакты | be MATYR' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { title: 'О нас | be MATYR' }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('../views/Gallery.vue'),
    meta: { title: 'Галерея | be MATYR' }
  },
  // {
  //   path: '/admin/login',
  //   name: 'AdminLogin',
  //   component: AdminLogin,
  //   meta: { title: 'Вход в админку' }
  // },
  {
    path: '/admin',
    component: () => import('../views/Admin.vue'),
    meta: { title: 'Админ-панель' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../components/admin/Dashboard.vue'),
        meta: { title: 'Дашборд | Админ-панель' }
      },
      {
        path: 'bookings',
        name: 'admin-bookings',
        component: () => import('../components/admin/BookingsList.vue'),
        meta: { title: 'Записи | Админ-панель' }
      },
      {
        path: 'services',
        name: 'admin-services',
        component: () => import('../components/admin/Services.vue'),
        meta: { title: 'Услуги | Админ-панель' }
      },
      {
        path: 'masters',
        name: 'admin-masters',
        component: () => import('../components/admin/Masters.vue'),
        meta: { title: 'Мастера | Админ-панель' }
      },
      {
        path: 'clients',
        name: 'admin-clients',
        component: () => import('../components/admin/Clients.vue'),
        meta: { title: 'Клиенты | Админ-панель' }
      },
      {
        path: 'schedule',
        name: 'admin-schedule',
        component: () => import('../components/admin/Schedule.vue'),
        meta: { title: 'Расписание | Админ-панель' }
      },
      {
        path: 'analytics',
        name: 'admin-analytics',
        component: () => import('../components/admin/Analytics.vue'),
        meta: { title: 'Аналитика | Админ-панель' }
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('../components/admin/Settings.vue'),
        meta: { title: 'Настройки | Админ-панель' }
      }
    ]
  },
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

// // Проверка авторизации для защищенных маршрутов
// if (to.meta.requiresAuth && !isAuthenticated()) {
//   next('/admin/login')
// } 
// // Если пользователь уже авторизован и пытается попасть на страницу логина
// else if (to.meta.guestOnly && isAuthenticated()) {
//   next('/admin/dashboard')
// } 
// else {
//   next()
// }


export default router