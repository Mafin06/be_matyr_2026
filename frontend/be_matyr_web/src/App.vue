<template>
  <div id="app">
    <Navigation />
    <main>
      <router-view />
    </main>
    <Footer/>
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  components: {
    Navigation,
    Footer
  },
  // setup() {
  //   const route = useRoute()
  //   const showNav = ref(true)
  //   const showFoot = ref(true)
  //   // Проверяем, находимся ли мы в админке
  //   const isAdminRoute = computed(() => {
  //     return route.path.startsWith('/admin')
  //   })
  //   watch(() => route.path, (path) => {
  //     // Скрываем навигацию на некоторых страницах (например, админка)
  //     showNav.value = !path.includes('/admin')
  //     showFoot.value = !path.includes('/admin')
  //   })
  //   return { showNav, showFoot }
  //   // return { showNav, isAdminRoute }
  // }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap');

:root {
  --primary-green: #2E7D32;
  --primary-light: #4CAF50;
  --primary-dark: #1B5E20;
  --accent-gold: #FFD700;
  --text-dark: #333333;
  --text-light: #666666;
  --bg-light: #F8F9FA;
  --bg-white: #FFFFFF;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Montserrat', sans-serif;
  color: var(--text-dark);
  line-height: 1.6;
  background-color: var(--bg-light);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding-top: 80px; /* Для фиксированной навигации */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section {
  padding: 80px 0;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--primary-dark);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--primary-green);
}

.btn {
  display: inline-block;
  padding: 12px 32px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-family: 'Montserrat', sans-serif;
}

.btn-primary {
  background: var(--primary-green);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background: transparent;
  color: var(--primary-green);
  border: 2px solid var(--primary-green);
}

.btn-outline:hover {
  background: var(--primary-green);
  color: white;
}

.text-center {
  text-align: center;
}

.mt-1 { margin-top: 1rem; }
.mt-2 { margin-top: 2rem; }
.mt-3 { margin-top: 3rem; }
.mb-1 { margin-bottom: 1rem; }
.mb-2 { margin-bottom: 2rem; }
.mb-3 { margin-bottom: 3rem; }
</style>