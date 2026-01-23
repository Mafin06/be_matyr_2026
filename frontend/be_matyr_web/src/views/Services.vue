<template>
    <div class="services-page">
      <!-- Hero Banner -->
      <section class="services-hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">Наши услуги</h1>
            <p class="hero-subtitle">
              Профессиональный уход за волосами для всей семьи. 
              Используем только качественные материалы и современные технологии.
            </p>
            <div class="hero-stats">
              <div class="stat">
                <span class="stat-number">1000+</span>
                <span class="stat-label">Довольных клиентов</span>
              </div>
              <div class="stat">
                <span class="stat-number">15+</span>
                <span class="stat-label">Лет опыта</span>
              </div>
              <div class="stat">
                <span class="stat-number">50+</span>
                <span class="stat-label">Профессиональных средств</span>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Services Navigation -->
      <section class="services-nav-section">
        <div class="container">
          <div class="services-nav">
            <button 
              v-for="category in categories" 
              :key="category.id"
              :class="['nav-btn', { active: activeCategory === category.id }]"
              @click="setActiveCategory(category.id)"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </section>
  
      <!-- Services Grid -->
      <section class="services-grid-section">
        <div class="container">
          <div class="services-container">
            <!-- Category Header -->
            <div class="category-header">
              <h2 class="category-title">
                {{ getCategoryTitle(activeCategory) }}
                <span class="category-count">({{ filteredServices.length }})</span>
              </h2>
              <div class="category-filters">
                <button 
                  class="filter-btn"
                  :class="{ active: sortBy === 'popular' }"
                  @click="sortBy = 'popular'"
                >
                  Популярные
                </button>
                <button 
                  class="filter-btn"
                  :class="{ active: sortBy === 'price-low' }"
                  @click="sortBy = 'price-low'"
                >
                  Сначала дешевле
                </button>
                <button 
                  class="filter-btn"
                  :class="{ active: sortBy === 'price-high' }"
                  @click="sortBy = 'price-high'"
                >
                  Сначала дороже
                </button>
              </div>
            </div>
  
            <!-- Services Grid -->
            <div class="services-grid">
              <div 
                class="service-card"
                v-for="service in sortedServices"
                :key="service.id"
                :class="{ popular: service.popular }"
              >
                <div class="service-card-header">
                  <div class="service-badge" v-if="service.popular">
                    <span class="badge-icon">🔥</span>
                    <span class="badge-text">Популярно</span>
                  </div>
                  <div class="service-badge new" v-if="service.new">
                    <span class="badge-text">Новинка</span>
                  </div>
                </div>
                
                <div class="service-card-body">
                  <div class="service-icon">
                    <span :class="service.icon" class="icon-emoji"></span>
                  </div>
                  <h3 class="service-name">{{ service.name }}</h3>
                  <p class="service-description">{{ service.description }}</p>
                  
                  <div class="service-details">
                    <div class="detail">
                      <span class="detail-icon">⏱️</span>
                      <span class="detail-text">{{ service.duration }} мин</span>
                    </div>
                    <div class="detail">
                      <span class="detail-icon">👤</span>
                      <span class="detail-text">{{ service.gender }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="service-card-footer">
                  <div class="price-section">
                    <span class="price">{{ service.price }} ₽</span>
                    <span class="old-price" v-if="service.oldPrice">{{ service.oldPrice }} ₽</span>
                  </div>
                  <div class="action-buttons">
                    <button 
                      class="btn-details"
                      @click="openServiceDetails(service)"
                    >
                      Подробнее
                    </button>
                    <button 
                      class="btn-book"
                      @click="bookService(service)"
                    >
                      Записаться
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Price Packages -->
      <section class="packages-section">
        <div class="container">
          <h2 class="section-title">Выгодные пакеты услуг</h2>
          <div class="packages-grid">
            <div 
              class="package-card"
              v-for="packageItem in packages"
              :key="packageItem.id"
              :class="{ recommended: packageItem.recommended }"
            >
              <div class="package-badge" v-if="packageItem.recommended">
                Выбор стилистов
              </div>
              <div class="package-header">
                <h3 class="package-name">{{ packageItem.name }}</h3>
                <div class="package-price">
                  <span class="price">{{ packageItem.price }} ₽</span>
                  <span class="save">Экономия {{ packageItem.savings }} ₽</span>
                </div>
              </div>
              <ul class="package-features">
                <li v-for="feature in packageItem.features" :key="feature">
                  <span class="check-icon">✓</span>
                  {{ feature }}
                </li>
              </ul>
              <button class="btn-package" @click="bookPackage(packageItem)">
                Выбрать пакет
              </button>
            </div>
          </div>
        </div>
      </section>
  
      <!-- FAQ Section -->
      <section class="faq-section">
        <div class="container">
          <h2 class="section-title">Частые вопросы</h2>
          <div class="faq-grid">
            <div 
              class="faq-item"
              v-for="faq in faqs"
              :key="faq.id"
              @click="toggleFaq(faq.id)"
            >
              <div class="faq-question">
                <h3>{{ faq.question }}</h3>
                <span class="faq-icon">{{ activeFaq === faq.id ? '−' : '+' }}</span>
              </div>
              <div class="faq-answer" :class="{ active: activeFaq === faq.id }">
                <p>{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA Section -->
      <section class="services-cta">
        <div class="container">
          <div class="cta-content">
            <div class="cta-text">
              <h2>Не нашли нужную услугу?</h2>
              <p>Позвоните нам для индивидуальной консультации. Наши стилисты подберут услугу, которая подойдет именно вам.</p>
              <div class="cta-contacts">
                <a href="tel:+79171234567" class="contact-link">
                  <span class="contact-icon">📞</span>
                  +7 (917) 123-45-67
                </a>
                <a href="https://wa.me/79171234567" class="contact-link">
                  <span class="contact-icon">💬</span>
                  Написать в WhatsApp
                </a>
              </div>
            </div>
            <div class="cta-image">
              <div class="image-placeholder">
                <span class="image-text">Консультация стилиста</span>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Service Details Modal -->
      <div class="modal-overlay" v-if="selectedService" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeModal">×</button>
          
          <div class="modal-body">
            <div class="modal-header">
              <div class="service-icon-large">
                <span :class="selectedService.icon" class="icon-emoji"></span>
              </div>
              <div class="service-info">
                <h2>{{ selectedService.name }}</h2>
                <div class="service-tags">
                  <span class="tag">{{ selectedService.gender }}</span>
                  <span class="tag">{{ selectedService.duration }} мин</span>
                  <span class="tag popular-tag" v-if="selectedService.popular">Популярно</span>
                </div>
              </div>
            </div>
            
            <div class="modal-description">
              <h3>Описание услуги</h3>
              <p>{{ selectedService.fullDescription || selectedService.description }}</p>
              
              <div class="service-process" v-if="selectedService.process">
                <h4>Процесс выполнения:</h4>
                <ul>
                  <li v-for="step in selectedService.process" :key="step">{{ step }}</li>
                </ul>
              </div>
              
              <div class="service-benefits" v-if="selectedService.benefits">
                <h4>Преимущества:</h4>
                <div class="benefits-grid">
                  <div class="benefit" v-for="benefit in selectedService.benefits" :key="benefit">
                    <span class="benefit-icon">✓</span>
                    <span>{{ benefit }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="modal-footer">
              <div class="price-section">
                <div class="price-main">
                  <span class="price">{{ selectedService.price }} ₽</span>
                  <span class="price-note">за процедуру</span>
                </div>
                <div class="price-discount" v-if="selectedService.oldPrice">
                  <span class="old-price">{{ selectedService.oldPrice }} ₽</span>
                  <span class="discount">Скидка {{ calculateDiscount(selectedService) }}%</span>
                </div>
              </div>
              <div class="modal-actions">
                <button class="btn-outline" @click="closeModal">Назад к услугам</button>
                <button class="btn-primary" @click="bookService(selectedService)">
                  Записаться онлайн
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'Services',
    setup() {
      const router = useRouter()
      const activeCategory = ref('all')
      const sortBy = ref('popular')
      const selectedService = ref(null)
      const activeFaq = ref(null)
  
      // Категории услуг
      const categories = ref([
        { id: 'all', name: 'Все услуги' },
        { id: 'mens', name: 'Для мужчин' },
        { id: 'womens', name: 'Для женщин' },
        { id: 'kids', name: 'Для детей' },
        { id: 'coloring', name: 'Окрашивание' },
        { id: 'care', name: 'Уход' },
        { id: 'styling', name: 'Укладки' }
      ])
  
      // Список услуг
      const services = ref([
        {
          id: 1,
          name: 'Мужская стрижка',
          category: 'mens',
          price: 800,
          oldPrice: 1000,
          duration: 45,
          gender: 'Мужская',
          icon: '✂️',
          description: 'Стрижка с учетом формы лица и типа волос',
          fullDescription: 'Профессиональная мужская стрижка с учетом индивидуальных особенностей. Мастер подберет оптимальную форму, учитывая структуру волос, форму лица и ваши пожелания. Включает мытье головы, стрижку машинкой и ножницами, оформление бороды и усов.',
          popular: true,
          new: false,
          process: [
            'Консультация и анализ волос',
            'Мытье головы профессиональным шампунем',
            'Стрижка машинкой и ножницами',
            'Оформление контуров',
            'Укладка и фиксация'
          ],
          benefits: [
            'Бесплатная консультация',
            'Используем профессиональную косметику',
            'Индивидуальный подход',
            'Гарантия качества'
          ]
        },
        {
          id: 2,
          name: 'Женская стрижка',
          category: 'womens',
          price: 1500,
          oldPrice: 1800,
          duration: 60,
          gender: 'Женская',
          icon: '💇‍♀️',
          description: 'Стрижка и укладка с учетом модных тенденций',
          popular: true,
          new: false
        },
        {
          id: 3,
          name: 'Детская стрижка',
          category: 'kids',
          price: 600,
          duration: 30,
          gender: 'Детская',
          icon: '👶',
          description: 'Безопасная и быстрая стрижка для детей',
          popular: true,
          new: false
        },
        {
          id: 4,
          name: 'Окрашивание волос',
          category: 'coloring',
          price: 2500,
          oldPrice: 3000,
          duration: 120,
          gender: 'Универсальная',
          icon: '🎨',
          description: 'Профессиональное окрашивание с консультацией',
          popular: true,
          new: false
        },
        {
          id: 5,
          name: 'Стрижка + борода',
          category: 'mens',
          price: 1200,
          duration: 60,
          gender: 'Мужская',
          icon: '🧔',
          description: 'Комплексная услуга для идеального образа',
          popular: true,
          new: true
        },
        {
          id: 6,
          name: 'Укладка с вечеринки',
          category: 'styling',
          price: 900,
          duration: 45,
          gender: 'Женская',
          icon: '💃',
          description: 'Вечерняя укладка для особого случая',
          popular: false,
          new: true
        },
        {
          id: 7,
          name: 'Кератиновое выпрямление',
          category: 'care',
          price: 3500,
          duration: 150,
          gender: 'Универсальная',
          icon: '✨',
          description: 'Процедура для гладких и блестящих волос',
          popular: false,
          new: false
        },
        {
          id: 8,
          name: 'Мелирование',
          category: 'coloring',
          price: 2800,
          duration: 90,
          gender: 'Женская',
          icon: '🌟',
          description: 'Модное мелирование по современной технике',
          popular: true,
          new: false
        },
        {
          id: 9,
          name: 'Стрижка для мальчика',
          category: 'kids',
          price: 500,
          duration: 25,
          gender: 'Детская',
          icon: '👦',
          description: 'Стильная и аккуратная стрижка для мальчиков',
          popular: false,
          new: false
        },
        {
          id: 10,
          name: 'SPA для волос',
          category: 'care',
          price: 1200,
          duration: 60,
          gender: 'Универсальная',
          icon: '💆‍♀️',
          description: 'Восстановительная процедура для волос',
          popular: true,
          new: true
        }
      ])
  
      // Пакеты услуг
      const packages = ref([
        {
          id: 1,
          name: 'Семейный пакет',
          price: 2500,
          savings: 700,
          recommended: true,
          features: [
            '2 взрослые стрижки',
            '1 детская стрижка',
            'Бесплатный кофе/чай',
            'Фотосессия'
          ]
        },
        {
          id: 2,
          name: 'Мужской уход',
          price: 2000,
          savings: 400,
          recommended: false,
          features: [
            'Стрижка + борода',
            'Уход за кожей лица',
            'Стрижка носа/ушей',
            'Моделирование бровей'
          ]
        },
        {
          id: 3,
          name: 'Преображение',
          price: 4500,
          savings: 1000,
          recommended: false,
          features: [
            'Консультация стилиста',
            'Стрижка + окрашивание',
            'SPA для волос',
            'Профессиональная укладка'
          ]
        }
      ])
  
      // Частые вопросы
      const faqs = ref([
        {
          id: 1,
          question: 'Нужно ли записываться заранее?',
          answer: 'Да, рекомендуем записываться заранее, особенно на выходные. Вы можете сделать это онлайн через наш сайт или по телефону.'
        },
        {
          id: 2,
          question: 'Какие средства вы используете?',
          answer: 'Мы работаем только с профессиональной косметикой премиум-класса: L\'Oréal Professionnel, Schwarzkopf Professional, Keune.'
        },
        {
          id: 3,
          question: 'Есть ли скидки для детей?',
          answer: 'Да, для детей до 12 лет действует специальная цена. Также есть семейные пакеты со скидкой до 20%.'
        },
        {
          id: 4,
          question: 'Можно ли прийти с ребенком?',
          answer: 'Конечно! У нас есть детская зона с игрушками и развлечениями. Также можно записаться на одновременную стрижку для родителей и детей.'
        }
      ])
  
      // Фильтрованные услуги
      const filteredServices = computed(() => {
        if (activeCategory.value === 'all') {
          return services.value
        }
        return services.value.filter(service => service.category === activeCategory.value)
      })
  
      // Отсортированные услуги
      const sortedServices = computed(() => {
        const services = [...filteredServices.value]
        
        switch (sortBy.value) {
          case 'price-low':
            return services.sort((a, b) => a.price - b.price)
          case 'price-high':
            return services.sort((a, b) => b.price - a.price)
          case 'popular':
          default:
            return services.sort((a, b) => {
              if (a.popular && !b.popular) return -1
              if (!a.popular && b.popular) return 1
              return 0
            })
        }
      })
  
      // Название активной категории
      const getCategoryTitle = (categoryId) => {
        const category = categories.value.find(c => c.id === categoryId)
        return category ? category.name : 'Все услуги'
      }
  
      // Расчет скидки
      const calculateDiscount = (service) => {
        if (!service.oldPrice) return 0
        return Math.round((1 - service.price / service.oldPrice) * 100)
      }
  
      // Методы
      const setActiveCategory = (categoryId) => {
        activeCategory.value = categoryId
        // Прокрутка к услугам
        document.querySelector('.services-container')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
  
      const openServiceDetails = (service) => {
        selectedService.value = service
        document.body.style.overflow = 'hidden'
      }
  
      const closeModal = () => {
        selectedService.value = null
        document.body.style.overflow = 'auto'
      }
  
      const bookService = (service) => {
        router.push({
          path: '/booking',
          query: { service: service.id }
        })
        closeModal()
      }
  
      const bookPackage = (packageItem) => {
        router.push({
          path: '/booking',
          query: { package: packageItem.id }
        })
      }
  
      const toggleFaq = (faqId) => {
        activeFaq.value = activeFaq.value === faqId ? null : faqId
      }
  
      // Закрытие модального окна по ESC
      onMounted(() => {
        const handleEsc = (e) => {
          if (e.key === 'Escape' && selectedService.value) {
            closeModal()
          }
        }
        window.addEventListener('keydown', handleEsc)
        
        return () => {
          window.removeEventListener('keydown', handleEsc)
        }
      })
  
      return {
        activeCategory,
        sortBy,
        selectedService,
        activeFaq,
        categories,
        services,
        packages,
        faqs,
        filteredServices,
        sortedServices,
        getCategoryTitle,
        calculateDiscount,
        setActiveCategory,
        openServiceDetails,
        closeModal,
        bookService,
        bookPackage,
        toggleFaq
      }
    }
  }
  </script>
  
  <style scoped>
  
  /* Hero Section */
  .services-hero {
    background: #292929;
    color: white;
    padding: 6rem 0 4rem;
    position: relative;
    overflow: hidden;
  }
  
  .services-hero::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30%, -30%);
  }
  
  .hero-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 3rem;
    line-height: 1.6;
  }
  
  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 4rem;
    margin-top: 4rem;
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--accent-gold);
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
  }
  
  /* Services Navigation */
  .services-nav-section {
    background: white;
    box-shadow: var(--shadow-sm);
    position: sticky;
    top: 80px;
    z-index: 100;
  }
  
  .services-nav {
    display: flex;
    overflow-x: auto;
    padding: 1rem 0;
    gap: 1rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .services-nav::-webkit-scrollbar {
    display: none;
  }
  
  .nav-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--bg-light);
    background: none;
    border-radius: 50px;
    font-weight: 500;
    color: var(--text-light);
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s ease;
  }
  
  .nav-btn:hover {
    border-color: var(--primary-light);
    color: var(--primary-green);
  }
  
  .nav-btn.active {
    background: var(--primary-green);
    border-color: var(--primary-green);
    color: white;
  }
  
  /* Services Grid Section */
  .services-grid-section {
    padding: 5rem 0;
  }
  
  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .category-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    color: var(--primary-dark);
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }
  
  .category-count {
    color: var(--text-light);
    font-size: 1rem;
    font-weight: normal;
  }
  
  .category-filters {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .filter-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--bg-light);
    background: white;
    border-radius: var(--radius-sm);
    color: var(--text-light);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .filter-btn:hover,
  .filter-btn.active {
    border-color: var(--primary-green);
    color: var(--primary-green);
    background: rgba(46, 125, 50, 0.05);
  }
  
  /* Services Grid */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }
  
  .service-card {
    background: white;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: all 0.4s ease;
    border: 1px solid rgba(46, 125, 50, 0.1);
    display: flex;
    flex-direction: column;
  }
  
  .service-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary-light);
  }
  
  .service-card.popular {
    border: 2px solid var(--primary-green);
    position: relative;
  }
  
  .service-card-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--bg-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .service-badge {
    background: var(--primary-green);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .service-badge.new {
    background: var(--accent-gold);
    color: var(--text-dark);
  }
  
  .badge-icon {
    font-size: 0.8rem;
  }
  
  .service-card-body {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .service-icon {
    width: 60px;
    height: 60px;
    background: rgba(46, 125, 50, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  .icon-emoji {
    font-size: 2rem;
  }
  
  .service-name {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--primary-dark);
    margin-bottom: 1rem;
  }
  
  .service-description {
    color: var(--text-light);
    line-height: 1.5;
    margin-bottom: 1.5rem;
    flex: 1;
  }
  
  .service-details {
    display: flex;
    gap: 1.5rem;
    margin-top: auto;
  }
  
  .detail {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-light);
    font-size: 0.9rem;
  }
  
  .detail-icon {
    opacity: 0.7;
  }
  
  .service-card-footer {
    padding: 1.5rem;
    border-top: 1px solid var(--bg-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  
  .price-section {
    display: flex;
    flex-direction: column;
  }
  
  .price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-green);
  }
  
  .old-price {
    font-size: 0.9rem;
    color: var(--text-light);
    text-decoration: line-through;
  }
  
  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn-details,
  .btn-book {
    padding: 0.6rem 1.2rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    font-family: 'Montserrat', sans-serif;
  }
  
  .btn-details {
    background: transparent;
    color: var(--primary-green);
    border: 1px solid var(--primary-green);
  }
  
  .btn-details:hover {
    background: rgba(46, 125, 50, 0.1);
  }
  
  .btn-book {
    background: var(--primary-green);
    color: white;
  }
  
  .btn-book:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }
  
  /* Packages Section */
  .packages-section {
    background: linear-gradient(to bottom, var(--bg-light) 0%, white 100%);
    padding: 5rem 0;
  }
  
  .packages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }
  
  .package-card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow-sm);
    border: 2px solid transparent;
    position: relative;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  
  .package-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
  
  .package-card.recommended {
    border-color: var(--primary-green);
    transform: scale(1.05);
  }
  
  .package-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary-green);
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .package-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .package-name {
    font-size: 1.5rem;
    color: var(--primary-dark);
    margin-bottom: 1rem;
  }
  
  .package-price {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }
  
  .package-price .price {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-green);
  }
  
  .save {
    color: var(--text-light);
    font-size: 0.9rem;
  }
  
  .package-features {
    list-style: none;
    margin: 2rem 0;
    flex: 1;
  }
  
  .package-features li {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-dark);
  }
  
  .check-icon {
    color: var(--primary-green);
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .btn-package {
    background: var(--primary-green);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100;
    margin-top: auto;
  }
  
  .btn-package:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }
  
  /* FAQ Section */
  .faq-section {
    padding: 5rem 0;
    background: white;
  }
  
  .faq-grid {
    max-width: 800px;
    margin: 3rem auto 0;
  }
  
  .faq-item {
    border: 1px solid var(--bg-light);
    border-radius: var(--radius-md);
    margin-bottom: 1rem;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .faq-item:hover {
    border-color: var(--primary-light);
  }
  
  .faq-question {
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-light);
  }
  
  .faq-question h3 {
    font-size: 1.1rem;
    color: var(--primary-dark);
    margin: 0;
    flex: 1;
  }
  
  .faq-icon {
    font-size: 1.5rem;
    color: var(--primary-green);
    font-weight: 300;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .faq-answer {
    padding: 0 1.5rem;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .faq-answer.active {
    padding: 1.5rem;
    max-height: 500px;
  }
  
  .faq-answer p {
    color: var(--text-light);
    line-height: 1.6;
    margin: 0;
  }
  
  /* CTA Section */
  .services-cta {
    background: linear-gradient(to right, var(--primary-dark), var(--primary-green));
    color: white;
    padding: 5rem 0;
  }
  
  .cta-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }
  
  .cta-text h2 {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    color: white;
  }
  
  .cta-text p {
    opacity: 0.9;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  .cta-contacts {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .contact-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-md);
    transition: all 0.3s ease;
  }
  
  .contact-link:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(10px);
  }
  
  .contact-icon {
    font-size: 1.2rem;
  }
  
  .cta-image {
    display: flex;
    justify-content: center;
  }
  
  .image-placeholder {
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px dashed rgba(255, 255, 255, 0.3);
  }
  
  .image-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
    text-align: center;
    padding: 2rem;
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 2rem;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .modal-content {
    background: white;
    border-radius: var(--radius-lg);
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: slideUp 0.3s ease;
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(50px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--text-light);
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    z-index: 100;
  }
  
  .modal-close:hover {
    background: var(--bg-light);
    color: var(--primary-green);
  }
  
  .modal-body {
    padding: 3rem;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid var(--bg-light);
  }
  
  .service-icon-large {
    width: 80px;
    height: 80px;
    background: rgba(46, 125, 50, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .service-icon-large .icon-emoji {
    font-size: 3rem;
  }
  
  .service-info h2 {
    font-size: 1.8rem;
    color: var(--primary-dark);
    margin-bottom: 1rem;
  }
  
  .service-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .tag {
    padding: 0.25rem 0.75rem;
    background: var(--bg-light);
    border-radius: 20px;
    font-size: 0.8rem;
    color: var(--text-light);
  }
  
  .popular-tag {
    background: var(--primary-green);
    color: white;
  }
  
  .modal-description h3 {
    font-size: 1.3rem;
    color: var(--primary-dark);
    margin-bottom: 1rem;
  }
  
  .modal-description p {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  
  .service-process,
  .service-benefits {
    margin-top: 2rem;
  }
  
  .service-process h4,
  .service-benefits h4 {
    font-size: 1.1rem;
    color: var(--primary-dark);
    margin-bottom: 1rem;
  }
  
  .service-process ul {
    list-style: none;
    padding-left: 1.5rem;
  }
  
  .service-process li {
    color: var(--text-light);
    margin-bottom: 0.5rem;
    position: relative;
  }
  
  .service-process li::before {
    content: '→';
    position: absolute;
    left: -1.5rem;
    color: var(--primary-green);
  }
  
  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .benefit {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-dark);
  }
  
  .benefit-icon {
    color: var(--primary-green);
    font-weight: bold;
  }
  
  .modal-footer {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid var(--bg-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .price-main {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }
  
  .price-main .price {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-green);
  }
  
  .price-note {
    color: var(--text-light);
    font-size: 0.9rem;
  }
  
  .price-discount {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .old-price {
    color: var(--text-light);
    text-decoration: line-through;
  }
  
  .discount {
    color: var(--primary-green);
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .modal-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .modal-actions .btn-outline,
  .modal-actions .btn-primary {
    padding: 0.75rem 1.5rem;
  }
  
  /* Responsive Design */
  @media (max-width: 992px) {
    .hero-stats {
      gap: 2rem;
    }
    
    .cta-content {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 3rem;
    }
    
    .image-placeholder {
      width: 250px;
      height: 250px;
    }
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }
    
    .hero-stats {
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .category-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .services-grid {
      grid-template-columns: 1fr;
    }
    
    .package-card.recommended {
      transform: none;
    }
    
    .modal-body {
      padding: 2rem 1.5rem;
    }
    
    .modal-header {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
    
    .modal-footer {
      flex-direction: column;
      align-items: stretch;
    }
    
    .service-details {
      flex-wrap: wrap;
    }
  }
  
  @media (max-width: 576px) {
    .services-nav {
      padding-bottom: 0.5rem;
    }
    
    .nav-btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
    
    .action-buttons {
      flex-direction: column;
      width: 100%;
    }
    
    .btn-details,
    .btn-book {
      width: 100%;
    }
    
    .modal-actions {
      flex-direction: column;
    }
    
    .modal-actions .btn-outline,
    .modal-actions .btn-primary {
      width: 100%;
    }
  }
  </style>