<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            Семейная парикмахерская<br>
            <span class="hero-accent">be MATYR</span> в Уфе
          </h1>
          <p class="hero-subtitle">
            Профессиональный уход для всей семьи. 
            Создаем стиль, который подчеркивает вашу индивидуальность.
          </p>
          <div class="hero-actions">
            <router-link to="/booking" class="btn btn-primary">
              Записаться онлайн
            </router-link>
            <router-link to="/services" class="btn btn-outline">
              Наши услуги
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Preview -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Наши услуги</h2>
        <div class="services-grid">
          <div class="service-card" v-for="service in previewServices" :key="service.id">
            <div class="service-icon">
              <span :class="service.icon"></span>
            </div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <router-link :to="`/services#${service.id}`" class="service-link">
              Подробнее →
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="section bg-light">
      <div class="container">
        <h2 class="section-title">Почему выбирают нас</h2>
        <div class="features-grid">
          <div class="feature">
            <div class="feature-icon">✨</div>
            <h3>Профессионалы</h3>
            <p>Опытные мастера с профильным образованием</p>
          </div>
          <div class="feature">
            <div class="feature-icon">👨‍👩‍👧‍👦</div>
            <h3>Для всей семьи</h3>
            <p>Услуги для взрослых и детей любого возраста</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🌿</div>
            <h3>Экологично</h3>
            <p>Используем профессиональную косметику</p>
          </div>
          <div class="feature">
            <div class="feature-icon">💎</div>
            <h3>Доступные цены</h3>
            <p>Качество премиум-класса по разумной цене</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Готовы преобразиться?</h2>
          <p>Запишитесь на стрижку прямо сейчас и получите консультацию стилиста</p>
          <router-link to="/booking" class="btn btn-primary">
            Записаться онлайн
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Home',
  setup() {
    const previewServices = ref([
      {
        id: 'mens',
        title: 'Мужские стрижки',
        description: 'Современные и классические мужские стрижки от 800₽',
        icon: '✂️'
      },
      {
        id: 'womens',
        title: 'Женские стрижки',
        description: 'Стильные женские стрижки и укладки от 1500₽',
        icon: '💇‍♀️'
      },
      {
        id: 'kids',
        title: 'Детские стрижки',
        description: 'Безопасные стрижки для детей от 600₽',
        icon: '👶'
      },
      {
        id: 'coloring',
        title: 'Окрашивание',
        description: 'Профессиональное окрашивание от 2500₽',
        icon: '🎨'
      }
    ])
    
    return { previewServices }
  }
}
</script>

<style scoped>
.hero {
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
              url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600') center/cover;
  color: white;
  padding: 8rem 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-accent {
  color: var(--primary-light);
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.service-card {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.service-card h3 {
  color: var(--primary-dark);
  margin-bottom: 1rem;
}

.service-card p {
  color: var(--text-light);
  margin-bottom: 1.5rem;
}

.service-link {
  color: var(--primary-green);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.service-link:hover {
  color: var(--primary-dark);
}

.bg-light {
  background-color: var(--bg-light);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
}

.feature {
  text-align: center;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature h3 {
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
}

.feature p {
  color: var(--text-light);
}

.cta-section {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary-green));
  color: white;
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-actions .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>