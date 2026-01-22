<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <router-link to="/" class="logo">
            <span class="logo-text">be</span>
            <span class="logo-accent">MATYR</span>
          </router-link>
          <p class="footer-description">
            Семейные парикмахерские в Уфе. 
            Профессиональные услуги для всей семьи.
          </p>
          <div class="social-links">
            <a href="#" class="social-link">Instagram</a>
            <a href="#" class="social-link">VK</a>
            <a href="#" class="social-link">Telegram</a>
          </div>
        </div>
        
        <div class="footer-section">
          <h3>Услуги</h3>
          <router-link to="/services" class="footer-link">Мужские стрижки</router-link>
          <router-link to="/services" class="footer-link">Женские стрижки</router-link>
          <router-link to="/services" class="footer-link">Детские стрижки</router-link>
          <router-link to="/services" class="footer-link">Окрашивание</router-link>
        </div>
        
        <div class="footer-section">
          <h3>Контакты</h3>
          <div class="contact-info">
            <p>📍 Уфа, пр. Октября, 1</p>
            <p>📞 +7 (917) 123-45-67</p>
            <p>✉️ info@bematyr.ru</p>
          </div>
        </div>
        
        <div class="footer-section">
          <h3>Часы работы</h3>
          <div class="working-hours">
            <p>Пн-Пт: 9:00 - 21:00</p>
            <p>Сб-Вс: 10:00 - 20:00</p>
          </div>
          <router-link to="/booking" class="btn btn-primary mt-2">
            Записаться онлайн
          </router-link>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} be MATYR. Все права защищены.</p>
        <div class="footer-bottom-links">
          <router-link to="/privacy">Политика конфиденциальности</router-link>
          <router-link to="/terms">Пользовательское соглашение</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Footer',
  setup() {
    const currentYear = computed(() => new Date().getFullYear())
    
    return { currentYear }
  }
}
</script>

<style scoped>
.footer {
  background: #292929;
  color: white;
  padding: 4rem 0 2rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: white;
}

.footer-description {
  color: rgba(255,255,255,0.8);
  margin: 1rem 0;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-link {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: var(--accent-gold);
}

.footer-link {
  display: block;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--accent-gold);
}

.contact-info p,
.working-hours p {
  color: rgba(255,255,255,0.8);
  margin-bottom: 0.5rem;
}

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-bottom p {
  color: rgba(255,255,255,0.6);
}

.footer-bottom-links {
  display: flex;
  gap: 2rem;
}

.footer-bottom-links a {
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-bottom-links a:hover {
  color: var(--accent-gold);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>