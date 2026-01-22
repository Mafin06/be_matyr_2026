<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <!-- Контейнер для слайдера -->
      <div class="hero-slider">
        <!-- Слайды -->
        <div 
          class="slide" 
          v-for="(slide, index) in slides" 
          :key="slide.id"
          :class="{ active: currentSlide === index }"
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <div class="slide-overlay"></div>
        </div>
        
        <!-- Навигация -->
        <button class="slider-btn prev" @click="prevSlide">‹</button>
        <button class="slider-btn next" @click="nextSlide">›</button>
        
        <!-- Индикаторы -->
        <div class="slider-indicators">
          <button
            v-for="(slide, index) in slides"
            :key="slide.id"
            class="indicator"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
            :aria-label="`Перейти к слайду ${index + 1}`"
          ></button>
        </div>
      </div>

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
import { ref, onMounted, onUnmounted } from 'vue' // ИСПРАВЛЕНО: добавлены хуки

// Импортируем изображения из assets
import slider1 from '@/assets/images/slider1.jpg'
import slider2 from '@/assets/images/slider2.jpg'
import slider3 from '@/assets/images/slider3.jpg'

export default {
  name: 'Home',
  setup() {
    const currentSlide = ref(0)
    const interval = ref(null)
    
    // Массив слайдов с локальными изображениями
    const slides = ref([
      {
        id: 1,
        image: slider1,
        alt: 'Интерьер парикмахерской be MATYR'
      },
      {
        id: 2,
        image: slider2,
        alt: 'Работа мастера в парикмахерской'
      },
      {
        id: 3,
        image: slider3,
        alt: 'Счастливый клиент после стрижки'
      }
    ])
    
    // Переход к следующему слайду
    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % slides.value.length
    }
    
    // Переход к предыдущему слайду
    const prevSlide = () => {
      currentSlide.value = currentSlide.value === 0 
        ? slides.value.length - 1 
        : currentSlide.value - 1
    }
    
    // Прямой переход к слайду
    const goToSlide = (index) => {
      currentSlide.value = index
    }
    
    // Автопрокрутка слайдов
    const startAutoSlide = () => {
      interval.value = setInterval(nextSlide, 8000)
    }
    
    // Остановка автопрокрутки при наведении
    const stopAutoSlide = () => {
      if (interval.value) {
        clearInterval(interval.value)
        interval.value = null
      }
    }
    
    // Инициализация
    onMounted(() => {
      startAutoSlide()
    })
    
    // Очистка при размонтировании
    onUnmounted(() => {
      stopAutoSlide()
    })

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
    
    return { 
      currentSlide,
      slides,
      nextSlide,
      prevSlide,
      goToSlide,
      startAutoSlide,
      stopAutoSlide,
      previewServices 
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  position: relative;
  color: white; /* ИСПРАВЛЕНО: было красным */
  padding: 8rem 0;
  text-align: center;
  overflow: hidden;
  min-height: 600px;
}

.hero-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.slide.active {
  opacity: 1;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  mix-blend-mode: multiply;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-accent {
  color: var(--primary-light);
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.95;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Кнопки слайдера */
.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 3;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.slider-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.slider-btn.prev {
  left: 20px;
}

.slider-btn.next {
  right: 20px;
}

/* Индикаторы */
.slider-indicators {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 3;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.5);
}

.indicator.active {
  background: var(--primary-light);
  border-color: var(--primary-light);
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Анимация для текста при смене слайда */
.hero-content {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Стили для остальных секций */
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

/* Адаптивность */
@media (max-width: 768px) {
  .hero {
    padding: 6rem 0;
    min-height: 500px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
    padding: 0 1rem;
  }
  
  .slider-btn {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
  
  .slider-btn.prev {
    left: 10px;
  }
  
  .slider-btn.next {
    right: 10px;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-actions .btn {
    width: 100%;
    max-width: 300px;
  }
  
  .section {
    padding: 60px 0;
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 4rem 0;
    min-height: 400px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .slider-indicators {
    bottom: 20px;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>