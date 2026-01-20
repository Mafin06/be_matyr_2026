<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-content">
        <router-link to="/" class="logo">
          <span class="logo-text">be</span>
          <span class="logo-accent">MATYR</span>
        </router-link>
        
        <div class="nav-links" :class="{ 'active': menuOpen }">
          <router-link to="/" @click="closeMenu">Главная</router-link>
          <router-link to="/services" @click="closeMenu">Услуги</router-link>
          <router-link to="/masters" @click="closeMenu">Мастера</router-link>
          <router-link to="/gallery" @click="closeMenu">Галерея</router-link>
          <router-link to="/about" @click="closeMenu">О нас</router-link>
          <router-link to="/contacts" @click="closeMenu">Контакты</router-link>
        </div>
        
        <div class="nav-actions">
          <router-link to="/booking" class="btn btn-primary">
            Онлайн-запись
          </router-link>
          <button class="menu-toggle" @click="toggleMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Navigation',
  setup() {
    const menuOpen = ref(false)
    
    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
    }
    
    const closeMenu = () => {
      menuOpen.value = false
    }
    
    return { menuOpen, toggleMenu, closeMenu }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--bg-white);
  box-shadow: var(--shadow-sm);
  z-index: 1000;
  padding: 1rem 0;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 600;
  text-decoration: none;
  color: var(--text-dark);
}

.logo-accent {
  color: var(--primary-green);
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-light);
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-links a:hover {
  color: var(--primary-green);
}

.nav-links a.router-link-active {
  color: var(--primary-green);
}

.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary-green);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.menu-toggle span {
  width: 25px;
  height: 2px;
  background: var(--primary-green);
  transition: 0.3s;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }
  
  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--bg-white);
    flex-direction: column;
    padding: 2rem;
    box-shadow: var(--shadow-md);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .nav-links.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
}
</style>