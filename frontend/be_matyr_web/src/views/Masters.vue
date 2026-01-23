<template>
    <div class="masters-page">
      <!-- Hero Section -->
      <section class="masters-hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">
              Наши <span class="hero-accent">мастера</span>
            </h1>
            <p class="hero-subtitle">
              Профессионалы с художественным вкусом и многолетним опытом. 
              Каждый мастер be MATYR – настоящий художник, создающий ваш уникальный стиль.
            </p>
          </div>
        </div>
      </section>
  
      <!-- Masters Filter -->
      <section class="masters-filter">
        <div class="container">
          <div class="filter-content">
            <div class="filter-tags">
              <button 
                v-for="category in categories" 
                :key="category.id"
                :class="['filter-tag', { 'active': activeCategory === category.id }]"
                @click="filterMasters(category.id)"
              >
                {{ category.name }}
              </button>
            </div>
            
            <div class="search-box">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Найти мастера по имени..."
                class="search-input"
              >
              <span class="search-icon">🔍</span>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Masters Grid -->
      <section class="masters-section">
        <div class="container">
          <div class="masters-grid">
            <div 
              class="master-card"
              v-for="master in filteredMasters"
              :key="master.id"
              @mouseenter="() => hoveredMaster = master.id"
              @mouseleave="() => hoveredMaster = null"
              @click="selectMaster(master)"
            >
              <div class="master-image-container">
                <img 
                  :src="master.image" 
                  :alt="master.name"
                  class="master-image"
                  :class="{ 'zoomed': hoveredMaster === master.id }"
                >
                <div class="master-badge" v-if="master.isAvailable">
                  Свободен сегодня
                </div>
                <div class="master-experience">
                  <span class="experience-icon">⭐</span>
                  {{ master.experience }} лет
                </div>
              </div>
              
              <div class="master-info">
                <h3 class="master-name">{{ master.name }}</h3>
                <p class="master-specialty">{{ master.specialty }}</p>
                
                <div class="master-tags">
                  <span 
                    v-for="tag in master.tags" 
                    :key="tag"
                    class="master-tag"
                  >
                    {{ tag }}
                  </span>
                </div>
                
                <div class="master-rating">
                  <div class="stars">
                    <span 
                      v-for="n in 5" 
                      :key="n"
                      :class="['star', { 'filled': n <= master.rating }]"
                    >
                      ★
                    </span>
                  </div>
                  <span class="rating-value">{{ master.rating }}/5</span>
                  <span class="reviews-count">({{ master.reviews }} отзывов)</span>
                </div>
                
                <div class="master-description">
                  {{ master.description }}
                </div>
                
                <div class="master-actions">
                  <button 
                    class="btn-book"
                    @click.stop="bookWithMaster(master)"
                  >
                    Записаться к мастеру
                  </button>
                  <button 
                    class="btn-portfolio"
                    @click.stop="openPortfolio(master)"
                  >
                    Портфолио
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- No Results -->
          <div v-if="filteredMasters.length === 0" class="no-results">
            <div class="no-results-icon">👨‍🎨</div>
            <h3>Мастера не найдены</h3>
            <p>Попробуйте изменить параметры поиска</p>
            <button class="btn btn-outline" @click="resetFilters">
              Сбросить фильтры
            </button>
          </div>
        </div>
      </section>
  
      <!-- Featured Master -->
      <section class="featured-master" v-if="featuredMaster">
        <div class="container">
          <div class="featured-header">
            <h2 class="section-title">
              <span class="featured-badge">Выбор месяца</span>
              Мастер месяца
            </h2>
          </div>
          
          <div class="featured-content">
            <div class="featured-image">
              <img :src="featuredMaster.image" :alt="featuredMaster.name">
              <div class="featured-stats">
                <div class="stat">
                  <span class="stat-number">{{ featuredMaster.clients }}+</span>
                  <span class="stat-label">клиентов</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{ featuredMaster.courses }}</span>
                  <span class="stat-label">курсы пройдены</span>
                </div>
              </div>
            </div>
            
            <div class="featured-info">
              <div class="featured-bio">
                <h3>{{ featuredMaster.name }}</h3>
                <p class="featured-quote">"{{ featuredMaster.quote }}"</p>
                <div class="featured-achievements">
                  <h4>Достижения:</h4>
                  <ul>
                    <li v-for="achievement in featuredMaster.achievements" :key="achievement">
                      ✓ {{ achievement }}
                    </li>
                  </ul>
                </div>
                
                <div class="featured-schedule">
                  <h4>Ближайшие слоты:</h4>
                  <div class="time-slots">
                    <button 
                      v-for="slot in featuredMaster.availableSlots"
                      :key="slot"
                      class="time-slot"
                      @click="bookSlot(featuredMaster, slot)"
                    >
                      {{ slot }}
                    </button>
                  </div>
                </div>
                
                <button class="btn btn-primary" @click="bookWithMaster(featuredMaster)">
                  Записаться у мастера месяца
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Master Modal -->
      <div class="master-modal" v-if="selectedMaster" @click.self="selectedMaster = null">
        <div class="modal-content">
          <button class="modal-close" @click="selectedMaster = null">×</button>
          
          <div class="modal-master">
            <div class="modal-image">
              <img :src="selectedMaster.image" :alt="selectedMaster.name">
            </div>
            
            <div class="modal-info">
              <h2>{{ selectedMaster.name }}</h2>
              <p class="modal-specialty">{{ selectedMaster.specialty }}</p>
              
              <div class="modal-details">
                <div class="detail-item">
                  <span class="detail-label">Опыт:</span>
                  <span class="detail-value">{{ selectedMaster.experience }} лет</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Рейтинг:</span>
                  <div class="detail-rating">
                    <span 
                      v-for="n in 5" 
                      :key="n"
                      :class="['star', { 'filled': n <= selectedMaster.rating }]"
                    >
                      ★
                    </span>
                  </div>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Образование:</span>
                  <span class="detail-value">{{ selectedMaster.education }}</span>
                </div>
              </div>
              
              <div class="modal-description">
                <h4>О мастере</h4>
                <p>{{ selectedMaster.fullDescription }}</p>
              </div>
              
              <div class="modal-services">
                <h4>Специализация</h4>
                <div class="services-list">
                  <div 
                    v-for="service in selectedMaster.services" 
                    :key="service"
                    class="service-item"
                  >
                    <span class="service-check">✓</span>
                    <span class="service-name">{{ service }}</span>
                  </div>
                </div>
              </div>
              
              <div class="modal-actions">
                <button class="btn btn-primary" @click="bookWithMaster(selectedMaster)">
                  Записаться
                </button>
                <button class="btn btn-outline" @click="selectedMaster = null">
                  Закрыть
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
    name: 'Masters',
    setup() {
      const router = useRouter()
      const masters = ref([])
      const featuredMaster = ref(null)
      const activeCategory = ref('all')
      const searchQuery = ref('')
      const hoveredMaster = ref(null)
      const selectedMaster = ref(null)
      
      const categories = ref([
        { id: 'all', name: 'Все мастера' },
        { id: 'men', name: 'Мужские стрижки' },
        { id: 'women', name: 'Женские стрижки' },
        { id: 'color', name: 'Колористы' },
        { id: 'kids', name: 'Детские мастера' },
        { id: 'barber', name: 'Барберы' }
      ])
  
      // Инициализация данных мастеров
      onMounted(() => {
        masters.value = [
          {
            id: 1,
            name: 'Александр Волков',
            specialty: 'Топ-стилист, барбер',
            image: 'https://images.unsplash.com/photo-1562788869-4ed32648eb72?auto=format&fit=crop&w=800',
            experience: 8,
            rating: 4.9,
            reviews: 124,
            tags: ['Барберинг', 'Мужские стрижки', 'Укладка'],
            description: 'Специалист по современным мужским стрижкам и уходу за бородой.',
            fullDescription: 'Эксперт в области мужских стрижек и барберинга с 8-летним опытом. Прошел обучение в Лондоне и Милане. Участник российских чемпионатов по парикмахерскому искусству. Создает индивидуальный стиль для каждого клиента.',
            education: 'Академия красоты "Лондон", курсы в Милане',
            services: ['Мужская стрижка', 'Стрижка бороды', 'Укладка', 'Королевское бритье'],
            category: ['men', 'barber'],
            isAvailable: true,
            clients: 850,
            courses: 12,
            quote: 'Стрижка — это не просто услуга, это искусство создания образа',
            achievements: ['Победитель Barber Cup 2022', 'Сертифицированный педагог', 'Эксперт бренда American Crew'],
            availableSlots: ['10:00', '14:30', '17:00', '19:30']
          },
          {
            id: 2,
            name: 'Екатерина Смирнова',
            specialty: 'Колорист-стилист',
            image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800',
            experience: 6,
            rating: 4.8,
            reviews: 98,
            tags: ['Окрашивание', 'Сложные техники', 'Уход'],
            description: 'Мастер сложного окрашивания и современных техник блонда.',
            fullDescription: 'Специалист по современным техникам окрашивания: балийяж, шатуш, омбре. Работает с профессиональной косметикой L\'Oreal и Wella. Регулярно повышает квалификацию на международных семинарах.',
            education: 'Школа колористики "Эстель", Париж',
            services: ['Сложное окрашивание', 'Блондирование', 'Тонирование', 'Уходовые процедуры'],
            category: ['women', 'color'],
            isAvailable: true,
            clients: 720,
            courses: 8,
            quote: 'Цвет должен подчеркивать индивидуальность, а не скрывать ее',
            achievements: ['Сертификат L\'Oreal Color Expert', 'Участник Color Zoom', 'Стилист журнала "Vogue"'],
            availableSlots: ['11:00', '15:00', '18:00']
          },
          {
            id: 3,
            name: 'Мария Иванова',
            specialty: 'Детский мастер',
            image: 'https://images.unsplash.com/photo-1595475693921-7111b5d1e4d2?auto=format&fit=crop&w-800',
            experience: 5,
            rating: 4.9,
            reviews: 156,
            tags: ['Дети', 'Анимация', 'Безопасность'],
            description: 'Специалист по детским стрижкам, создает комфортную атмосферу.',
            fullDescription: 'Любит работать с детьми всех возрастов. Создает игровую атмосферу, чтобы ребенок чувствовал себя комфортно. Использует только безопасные инструменты и гипоаллергенные средства.',
            education: 'Курсы детской психологии, специализация "Детский парикмахер"',
            services: ['Детские стрижки', 'Стрижка для малышей', 'Прически на праздник'],
            category: ['kids'],
            isAvailable: true,
            clients: 950,
            courses: 6,
            quote: 'Каждый ребенок — маленькая личность со своим характером',
            achievements: ['Сертификат "Детский парикмахер"', 'Курсы детской психологии'],
            availableSlots: ['09:00', '13:00', '16:00']
          },
          {
            id: 4,
            name: 'Дмитрий Петров',
            specialty: 'Барбер, визажист',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800',
            experience: 7,
            rating: 4.7,
            reviews: 87,
            tags: ['Классика', 'Бритье', 'Уход'],
            description: 'Эксперт в классических стрижках и традиционном бритье.',
            fullDescription: 'Специализируется на классических мужских стрижках и традиционном опасном бритье. Работает с инструментами премиум-класса. Создает стиль, который сочетает традиции и современность.',
            education: 'Барбершкола "Old Boy", Москва',
            services: ['Классическая стрижка', 'Опасное бритье', 'Уход за кожей', 'Укладка'],
            category: ['men', 'barber'],
            isAvailable: false,
            clients: 680,
            courses: 10,
            quote: 'Классика всегда в моде, если она выполнена идеально',
            achievements: ['Мастер традиционного бритья', 'Сертификат "The Art of Shaving"'],
            availableSlots: ['12:00', '16:30']
          },
          {
            id: 5,
            name: 'Анна Козлова',
            specialty: 'Стилист-универсал',
            image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
            experience: 4,
            rating: 4.6,
            reviews: 67,
            tags: ['Универсал', 'Вечерние прически', 'Стрижки'],
            description: 'Мастер женских стрижек и создания вечерних причесок.',
            fullDescription: 'Создает как повседневные, так и вечерние образы. Специализируется на стрижках средней длины и создании объемных укладок. Работает с разными типами волос.',
            education: 'Академия "Персона", Санкт-Петербург',
            services: ['Женские стрижки', 'Вечерние прически', 'Укладка', 'Наращивание'],
            category: ['women'],
            isAvailable: true,
            clients: 520,
            courses: 5,
            quote: 'Прическа должна дополнять образ, а не быть его центром',
            achievements: ['Стилист Недели моды в Москве'],
            availableSlots: ['10:30', '14:00', '17:30']
          },
          {
            id: 6,
            name: 'Ирина Морозова',
            specialty: 'Мастер по плетению',
            image: 'https://images.unsplash.com/photo-1551836026-d5c2c0b4d4ff?auto=format&fit=crop&w=800',
            experience: 3,
            rating: 4.8,
            reviews: 92,
            tags: ['Плетение', 'Афрокосы', 'Творчество'],
            description: 'Эксперт по сложному плетению и афрокосам.',
            fullDescription: 'Специализируется на сложных техниках плетения, включая афрокосы, брейды и косы с лентами. Работает с разной длиной и структурой волос. Создает уникальные образы для особых случаев.',
            education: 'Курсы афропричесок, Нью-Йорк',
            services: ['Афрокосы', 'Плетение кос', 'Прически с плетением', 'Укладка'],
            category: ['women'],
            isAvailable: true,
            clients: 410,
            courses: 4,
            quote: 'Каждая коса — это произведение искусства',
            achievements: ['Победитель конкурса "Braids Master 2023"'],
            availableSlots: ['11:30', '15:30', '19:00']
          }
        ]
  
        // Устанавливаем мастера месяца
        featuredMaster.value = masters.value[0]
      })
  
      // Фильтрация мастеров
      const filteredMasters = computed(() => {
        return masters.value.filter(master => {
          // Фильтр по категории
          const categoryMatch = activeCategory.value === 'all' || 
            master.category.includes(activeCategory.value)
          
          // Фильтр по поиску
          const searchMatch = searchQuery.value === '' || 
            master.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            master.specialty.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            master.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
          
          return categoryMatch && searchMatch
        })
      })
  
      // Методы
      const filterMasters = (categoryId) => {
        activeCategory.value = categoryId
      }
  
      const resetFilters = () => {
        activeCategory.value = 'all'
        searchQuery.value = ''
      }
  
      const selectMaster = (master) => {
        selectedMaster.value = master
      }
  
      const bookWithMaster = (master) => {
        router.push({
          path: '/booking',
          query: { master: master.id, name: master.name }
        })
      }
  
      const bookSlot = (master, slot) => {
        router.push({
          path: '/booking',
          query: { 
            master: master.id, 
            name: master.name,
            time: slot
          }
        })
      }
  
      const openPortfolio = (master) => {
        // В реальном проекте здесь будет переход в галерею работ мастера
        alert(`Открывается портфолио мастера ${master.name}`)
      }
  
      return {
        masters,
        featuredMaster,
        categories,
        activeCategory,
        searchQuery,
        hoveredMaster,
        selectedMaster,
        filteredMasters,
        filterMasters,
        resetFilters,
        selectMaster,
        bookWithMaster,
        bookSlot,
        openPortfolio
      }
    }
  }
  </script>
  
  <style scoped>
  .masters-page {
    background: var(--bg-light);
  }
  
  .masters-hero {
    background: #292929;
    color: white;
    padding: 6rem 0;
    text-align: center;
  }
  
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
  
  .hero-accent {
    color: #FFD700;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
    max-width: 700px;
    margin: 0 auto;
    opacity: 0.9;
    line-height: 1.6;
  }
  
  .masters-filter {
    background: white;
    padding: 2rem 0;
    box-shadow: var(--shadow-sm);
    position: sticky;
    top: 80px;
    z-index: 100;
  }
  
  .filter-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .filter-tags {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .filter-tag {
    padding: 0.5rem 1.5rem;
    border: 2px solid var(--bg-light);
    border-radius: 50px;
    background: white;
    color: var(--text-light);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .filter-tag:hover {
    border-color: var(--primary-light);
    color: var(--primary-green);
  }
  
  .filter-tag.active {
    background: var(--primary-green);
    border-color: var(--primary-green);
    color: white;
  }
  
  .search-box {
    position: relative;
    min-width: 300px;
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 2px solid var(--bg-light);
    border-radius: var(--radius-sm);
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--primary-green);
  }
  
  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-light);
  }
  
  .masters-section {
    padding: 5rem 0;
  }
  
  .masters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2.5rem;
    margin-bottom: 4rem;
  }
  
  .master-card {
    background: white;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: all 0.4s ease;
    cursor: pointer;
    position: relative;
  }
  
  .master-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-md);
  }
  
  .master-image-container {
    position: relative;
    height: 300px;
    overflow: hidden;
  }
  
  .master-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  .master-image.zoomed {
    transform: scale(1.05);
  }
  
  .master-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--primary-green);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 600;
    z-index: 2;
  }
  
  .master-experience {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    background: rgba(255, 215, 0, 0.95);
    color: var(--text-dark);
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 2;
  }
  
  .experience-icon {
    font-size: 1.2rem;
  }
  
  .master-info {
    padding: 2rem;
  }
  
  .master-name {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-dark);
    margin-bottom: 0.5rem;
  }
  
  .master-specialty {
    color: var(--primary-green);
    font-weight: 500;
    margin-bottom: 1rem;
  }
  
  .master-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .master-tag {
    background: var(--bg-light);
    color: var(--text-light);
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.85rem;
  }
  
  .master-rating {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .stars {
    display: flex;
    gap: 0.1rem;
  }
  
  .star {
    color: #ddd;
    font-size: 1.2rem;
  }
  
  .star.filled {
    color: #FFD700;
  }
  
  .rating-value {
    font-weight: 600;
    color: var(--text-dark);
  }
  
  .reviews-count {
    color: var(--text-light);
    font-size: 0.9rem;
  }
  
  .master-description {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }
  
  .master-actions {
    display: flex;
    gap: 1rem;
  }
  
  .btn-book {
    flex: 1;
    background: var(--primary-green);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-book:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }
  
  .btn-portfolio {
    flex: 1;
    background: transparent;
    color: var(--primary-green);
    border: 2px solid var(--primary-green);
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-portfolio:hover {
    background: var(--primary-green);
    color: white;
  }
  
  .no-results {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }
  
  .no-results-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
  
  .no-results h3 {
    color: var(--primary-dark);
    margin-bottom: 0.5rem;
  }
  
  .no-results p {
    color: var(--text-light);
    margin-bottom: 2rem;
  }
  
  .featured-master {
    background: white;
    padding: 5rem 0;
    margin-top: 3rem;
    border-top: 3px solid var(--primary-green);
  }
  
  .featured-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .featured-badge {
    display: block;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: var(--text-dark);
    padding: 0.5rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 1rem;
    width: fit-content;
    margin: 0 auto 1rem;
  }
  
  .featured-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 4rem;
    align-items: center;
  }
  
  .featured-image {
    position: relative;
  }
  
  .featured-image img {
    width: 100%;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }
  
  .featured-stats {
    position: absolute;
    bottom: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 2rem;
    background: white;
    padding: 1rem 2rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
  }
  
  .stat {
    text-align: center;
  }
  
  .stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-green);
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: var(--text-light);
  }
  
  .featured-quote {
    font-style: italic;
    color: var(--primary-dark);
    font-size: 1.1rem;
    padding: 1.5rem;
    background: var(--bg-light);
    border-radius: var(--radius-md);
    margin: 1.5rem 0;
    border-left: 4px solid var(--primary-green);
  }
  
  .featured-achievements h4 {
    color: var(--primary-dark);
    margin-bottom: 1rem;
  }
  
  .featured-achievements ul {
    list-style: none;
    padding-left: 0;
  }
  
  .featured-achievements li {
    padding: 0.5rem 0;
    color: var(--text-light);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .featured-schedule {
    margin: 2rem 0;
  }
  
  .time-slots {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }
  
  .time-slot {
    padding: 0.5rem 1.25rem;
    background: var(--bg-light);
    border: 2px solid transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
  }
  
  .time-slot:hover {
    background: var(--primary-green);
    color: white;
    border-color: var(--primary-green);
  }
  
  .master-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 2rem;
  }
  
  .modal-content {
    background: white;
    border-radius: var(--radius-lg);
    max-width: 1000px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }
  
  .modal-close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: var(--text-light);
    transition: color 0.3s ease;
    z-index: 2;
  }
  
  .modal-close:hover {
    color: var(--primary-green);
  }
  
  .modal-master {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3rem;
    padding: 3rem;
  }
  
  .modal-image {
    position: sticky;
    top: 0;
  }
  
  .modal-image img {
    width: 100%;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
  }
  
  .modal-info h2 {
    color: var(--primary-dark);
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .modal-specialty {
    color: var(--primary-green);
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 2rem;
  }
  
  .modal-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--bg-light);
    border-radius: var(--radius-md);
  }
  
  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .detail-label {
    font-weight: 600;
    color: var(--text-dark);
  }
  
  .detail-value {
    color: var(--text-light);
  }
  
  .detail-rating {
    display: flex;
    gap: 0.1rem;
  }
  
  .modal-description h4,
  .modal-services h4 {
    color: var(--primary-dark);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
  
  .modal-description p {
    color: var(--text-light);
    line-height: 1.7;
    margin-bottom: 2rem;
  }
  
  .services-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .service-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--bg-light);
    border-radius: var(--radius-sm);
  }
  
  .service-check {
    color: var(--primary-green);
    font-weight: bold;
  }
  
  .service-name {
    color: var(--text-dark);
  }
  
  .modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  @media (max-width: 1200px) {
    .featured-content {
      grid-template-columns: 1fr;
      text-align: center;
    }
    
    .featured-stats {
      position: relative;
      bottom: 0;
      margin-top: 2rem;
      justify-content: center;
    }
  }
  
  @media (max-width: 992px) {
    .modal-master {
      grid-template-columns: 1fr;
      padding: 2rem;
    }
    
    .modal-image {
      position: static;
    }
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }
    
    .filter-content {
      flex-direction: column;
      align-items: stretch;
    }
    
    .search-box {
      min-width: 100%;
    }
    
    .masters-grid {
      grid-template-columns: 1fr;
    }
    
    .master-actions {
      flex-direction: column;
    }
    
    .featured-content {
      gap: 2rem;
    }
    
    .featured-stats {
      flex-direction: column;
      gap: 1rem;
    }
    
    .modal-content {
      padding: 1rem;
    }
    
    .modal-master {
      gap: 2rem;
    }
  }
  
  @media (max-width: 576px) {
    .filter-tags {
      justify-content: center;
    }
    
    .master-modal {
      padding: 1rem;
    }
    
    .modal-actions {
      flex-direction: column;
    }
  }
  </style>