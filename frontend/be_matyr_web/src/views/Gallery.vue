<template>
  <div class="gallery">
    <!-- Hero Section -->
    <section class="gallery-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Наши работы</h1>
          <p class="hero-subtitle">
            Посмотрите результаты работы наших мастеров. 
            Каждая стрижка — это искусство, созданное с душой.
          </p>
        </div>
      </div>
    </section>

    <!-- Gallery Controls -->
    <section class="gallery-controls">
      <div class="container">
        <div class="controls-wrapper">
        <div class="filter-tags">
          <button 
            class="filter-tag" 
            :class="{ active: activeFilter === 'all' }"
            @click="setFilter('all')"
          >
            Все работы
          </button>
          <button 
            class="filter-tag" 
            :class="{ active: activeFilter === 'mens' }"
            @click="setFilter('mens')"
          >
            👨 Мужские
          </button>
          <button 
            class="filter-tag" 
            :class="{ active: activeFilter === 'womens' }"
            @click="setFilter('womens')"
          >
            👩 Женские
          </button>
          <button 
            class="filter-tag" 
            :class="{ active: activeFilter === 'kids' }"
            @click="setFilter('kids')"
          >
            👶 Детские
          </button>
          <button 
            class="filter-tag" 
            :class="{ active: activeFilter === 'coloring' }"
            @click="setFilter('coloring')"
          >
            🎨 Окрашивание
          </button>
          <button 
            class="filter-tag" 
            :class="{ active: activeFilter === 'beard' }"
            @click="setFilter('beard')"
          >
            🧔 Уход за бородой
          </button>
        </div>

        <div class="sort-controls">
          <div class="sort-dropdown">
            <label for="sort">Сортировать:</label>
            <select id="sort" v-model="sortBy" @change="sortGallery">
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="popular">Популярные</option>
            </select>
          </div>
          <div class="view-toggle">
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              title="Сетка"
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <rect x="1" y="1" width="8" height="8" rx="1"/>
                <rect x="11" y="1" width="8" height="8" rx="1"/>
                <rect x="1" y="11" width="8" height="8" rx="1"/>
                <rect x="11" y="11" width="8" height="8" rx="1"/>
              </svg>
            </button>
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'masonry' }"
              @click="viewMode = 'masonry'"
              title="Плитка"
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <rect x="1" y="1" width="18" height="8" rx="1"/>
                <rect x="1" y="11" width="8" height="8" rx="1"/>
                <rect x="11" y="11" width="8" height="8" rx="1"/>
              </svg>
            </button>
          </div>
        </div>
        </div>
      </div>
    </section>

    <!-- Gallery Grid -->
    <section class="gallery-section">
      <div class="container">
        <transition-group 
          name="gallery-item" 
          tag="div" 
          :class="['gallery-grid', viewMode]"
        >
          <div 
            v-for="item in filteredItems" 
            :key="item.id"
            class="gallery-item"
            :class="[item.category, `ratio-${item.aspectRatio}`]"
            @click="openModal(item)"
            @mouseenter="hoveredItem = item.id"
            @mouseleave="hoveredItem = null"
          >
            <div class="gallery-item-inner">
              <img 
                :src="item.image" 
                :alt="item.title"
                :class="{ loaded: item.loaded }"
                @load="item.loaded = true"
                loading="lazy"
              />
              
              <div class="item-overlay">
                <div class="item-info">
                  <div class="item-category">{{ getCategoryName(item.category) }}</div>
                  <h3 class="item-title">{{ item.title }}</h3>
                  <div class="item-meta">
                    <span class="item-master">
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      {{ item.master }}
                    </span>
                    <span class="item-date">
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                      </svg>
                      {{ item.date }}
                    </span>
                  </div>
                </div>
                
                <div class="item-actions">
                  <button class="like-btn" @click.stop="toggleLike(item)">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path :fill="item.liked ? '#EF4444' : 'none'" 
                            :stroke="item.liked ? '#EF4444' : 'white'"
                            stroke-width="2"
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>{{ item.likes }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition-group>

        <!-- Loading / Empty States -->
        <div v-if="loading" class="loading-state">
          <div class="loader"></div>
          <p>Загружаем работы...</p>
        </div>
        
        <div v-if="!loading && filteredItems.length === 0" class="empty-state">
          <div class="empty-icon">🎨</div>
          <h3>Работы не найдены</h3>
          <p>Попробуйте выбрать другую категорию</p>
          <button class="btn btn-outline" @click="setFilter('all')">
            Показать все работы
          </button>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreItems && !loading" class="load-more">
          <button class="btn btn-outline" @click="loadMore">
            Показать еще {{ itemsPerPage }} работ
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Modal for Image View -->
    <transition name="modal">
      <div v-if="selectedItem" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeModal">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          
          <div class="modal-body">
            <div class="modal-image">
              <img :src="selectedItem.image" :alt="selectedItem.title" />
            </div>
            
            <div class="modal-info">
              <div class="modal-header">
                <div class="modal-category">{{ getCategoryName(selectedItem.category) }}</div>
                <h2 class="modal-title">{{ selectedItem.title }}</h2>
              </div>
              
              <div class="modal-details">
                <div class="detail-item">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <div>
                    <div class="detail-label">Мастер</div>
                    <div class="detail-value">{{ selectedItem.master }}</div>
                  </div>
                </div>
                
                <div class="detail-item">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <div>
                    <div class="detail-label">Дата</div>
                    <div class="detail-value">{{ selectedItem.date }}</div>
                  </div>
                </div>
                
                <div class="detail-item">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <div>
                    <div class="detail-label">Лайки</div>
                    <div class="detail-value">{{ selectedItem.likes }}</div>
                  </div>
                </div>
              </div>
              
              <div class="modal-description">
                <h3>Описание работы</h3>
                <p>{{ selectedItem.description }}</p>
              </div>
              
              <div class="modal-actions">
                <button class="like-btn large" @click="toggleLike(selectedItem)">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path :fill="selectedItem.liked ? '#EF4444' : 'none'" 
                          :stroke="selectedItem.liked ? '#EF4444' : 'currentColor'"
                          stroke-width="2"
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>{{ selectedItem.liked ? 'Не нравится' : 'Нравится' }}</span>
                </button>
                
                <router-link 
                  :to="`/masters?master=${selectedItem.masterSlug}`" 
                  class="btn btn-primary"
                  @click="closeModal"
                >
                  Записаться к мастеру
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Navigation Arrows -->
          <button class="modal-nav prev" @click="prevImage" v-if="filteredItems.length > 1">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button class="modal-nav next" @click="nextImage" v-if="filteredItems.length > 1">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
// Импорт изображений для галереи
import test from '@/assets/images/test.jpg'
export default {
  name: 'Gallery',
  setup() {
    // State
    const activeFilter = ref('all')
    const sortBy = ref('newest')
    const viewMode = ref('masonry')
    const selectedItem = ref(null)
    const hoveredItem = ref(null)
    const loading = ref(false)
    const displayedCount = ref(12)
    const itemsPerPage = 12
    
    // Mock data - в реальном проекте будет API запрос
    const galleryItems = ref([
      {
        id: 1,
        title: "Модная мужская стрижка",
        category: "mens",
        master: "Алексей Иванов",
        masterSlug: "alexey-ivanov",
        date: "15.12.2023",
        image: test,
        likes: 42,
        liked: false,
        description: "Современная мужская стрижка с градуировкой и текстурой. Мастер создал индивидуальный стиль с учетом структуры волос и формы лица.",
        aspectRatio: "square"
      },
      {
        id: 2,
        title: "Вечерняя укладка",
        category: "womens",
        master: "Елена Смирнова",
        masterSlug: "elena-smirnova",
        date: "10.12.2023",
        image: "https://daviani.ru/upload/malvinka.jpg",
        likes: 56,
        liked: true,
        description: "Элегантная вечерняя укладка для особого случая. Легкие волны и объем у корней создают романтичный образ.",
        aspectRatio: "portrait"
      },
      {
        id: 3,
        title: "Первая детская стрижка",
        category: "kids",
        master: "Мария Петрова",
        masterSlug: "maria-petrova",
        date: "05.12.2023",
        image: "https://daviani.ru/upload/malvinka.jpg",
        likes: 89,
        liked: false,
        description: "Аккуратная детская стрижка в дружественной атмосфере. Ребенок чувствовал себя комфортно на протяжении всей процедуры.",
        aspectRatio: "landscape"
      },
      {
        id: 4,
        title: "Мелирование на темные волосы",
        category: "coloring",
        master: "Анна Козлова",
        masterSlug: "anna-kozlova",
        date: "01.12.2023",
        image: "https://daviani.ru/upload/malvinka.jpg",
        likes: 67,
        liked: false,
        description: "Естественное мелирование на темные волосы с плавными переходами. Использованы щадящие красители премиум-класса.",
        aspectRatio: "portrait"
      },
      {
        id: 5,
        title: "Уход за бородой",
        category: "beard",
        master: "Дмитрий Сидоров",
        masterSlug: "dmitry-sidorov",
        date: "28.11.2023",
        image: "https://daviani.ru/upload/malvinka.jpg",
        likes: 34,
        liked: false,
        description: "Комплексный уход за бородой: стрижка, оформление контура, использование профессиональных средств для ухода.",
        aspectRatio: "square"
      },
      {
        id: 6,
        title: "Короткая стрижка боб",
        category: "womens",
        master: "Елена Смирнова",
        masterSlug: "elena-smirnova",
        date: "25.11.2023",
        image: "https://daviani.ru/upload/malvinka.jpg",
        likes: 78,
        liked: true,
        description: "Современная стрижка боб с асимметричной челкой. Идеально подчеркивает черты лица и добавляет образу легкости.",
        aspectRatio: "portrait"
      },
      {
        id: 7,
        title: "Классическая мужская стрижка",
        category: "mens",
        master: "Алексей Иванов",
        masterSlug: "alexey-ivanov",
        date: "20.11.2023",
        image: "https://daviani.ru/upload/malvinka.jpg",
        likes: 45,
        liked: false,
        description: "Аккуратная классическая стрижка с четкими линиями. Традиционный стиль, который всегда остается в тренде.",
        aspectRatio: "square"
      },
      {
        id: 8,
        title: "Яркое окрашивание",
        category: "coloring",
        master: "Анна Козлова",
        masterSlug: "anna-kozlova",
        date: "15.11.2023",
        image: "https://daviani.ru/upload/malvinka.jpg",
        likes: 92,
        liked: true,
        description: "Смелое окрашивание в ярко-розовый цвет с омбре эффектом. Использованы стойкие красители прямого действия.",
        aspectRatio: "portrait"
      },
      {
        id: 9,
        title: "Стрижка для мальчика",
        category: "kids",
        master: "Мария Петрова",
        masterSlug: "maria-petrova",
        date: "10.11.2023",
        image: "https://daviani.ru/upload/malvinka.jpg",
        likes: 38,
        liked: false,
        description: "Модная стрижка для подростка с текстурированием. Учтены пожелания клиента и современные тенденции.",
        aspectRatio: "landscape"
      },
      {
        id: 10,
        title: "Укладка для свадьбы",
        category: "womens",
        master: "Елена Смирнова",
        masterSlug: "elena-smirnova",
        date: "05.11.2023",
        image: "https://daviani.ru/upload/malvinka.jpg",
        likes: 101,
        liked: true,
        description: "Элегантная свадебная укладка с элементами плетения и нежными цветочными акцентами. Образ сохранился на протяжении всего дня.",
        aspectRatio: "portrait"
      },
      {
        id: 11,
        title: "Бритье опасной бритвой",
        category: "beard",
        master: "Дмитрий Сидоров",
        masterSlug: "dmitry-sidorov",
        date: "01.11.2023",
        image: "https://daviani.ru/upload/malvinka.jpg",
        likes: 29,
        liked: false,
        description: "Традиционное бритье опасной бритвой с горячим полотенцем и профессиональными средствами для бритья.",
        aspectRatio: "square"
      },
      {
        id: 12,
        title: "Балаяж на светлые волосы",
        category: "coloring",
        master: "Анна Козлова",
        masterSlug: "anna-kozlova",
        date: "28.10.2023",
        image: "https://daviani.ru/upload/malvinka.jpg",
        likes: 63,
        liked: false,
        description: "Техника балаяж для создания естественного эффекта выгоревших на солнце волос с плавными переходами.",
        aspectRatio: "portrait"
      }
    ])
    
    // Computed
    const filteredItems = computed(() => {
      let items = [...galleryItems.value]
      
      // Фильтрация по категории
      if (activeFilter.value !== 'all') {
        items = items.filter(item => item.category === activeFilter.value)
      }
      
      // Сортировка
      switch(sortBy.value) {
        case 'newest':
          items.sort((a, b) => new Date(b.date.split('.').reverse().join('-')) - new Date(a.date.split('.').reverse().join('-')))
          break
        case 'oldest':
          items.sort((a, b) => new Date(a.date.split('.').reverse().join('-')) - new Date(b.date.split('.').reverse().join('-')))
          break
        case 'popular':
          items.sort((a, b) => b.likes - a.likes)
          break
      }
      
      // Ограничение количества отображаемых элементов
      return items.slice(0, displayedCount.value)
    })
    
    const hasMoreItems = computed(() => {
      let totalItems = galleryItems.value.length
      if (activeFilter.value !== 'all') {
        totalItems = galleryItems.value.filter(item => item.category === activeFilter.value).length
      }
      return displayedCount.value < totalItems
    })
    
    // Methods
    const setFilter = (filter) => {
      activeFilter.value = filter
      displayedCount.value = itemsPerPage
      scrollToGallery()
    }
    
    const sortGallery = () => {
      // Сортировка уже в computed свойстве
    }
    
    const getCategoryName = (category) => {
      const categories = {
        'all': 'Все работы',
        'mens': 'Мужские стрижки',
        'womens': 'Женские стрижки',
        'kids': 'Детские стрижки',
        'coloring': 'Окрашивание',
        'beard': 'Уход за бородой'
      }
      return categories[category]
    }
    
    const openModal = (item) => {
      selectedItem.value = item
      document.body.style.overflow = 'hidden'
    }
    
    const closeModal = () => {
      selectedItem.value = null
      document.body.style.overflow = 'auto'
    }
    
    const prevImage = () => {
      const currentIndex = filteredItems.value.findIndex(item => item.id === selectedItem.value.id)
      const prevIndex = (currentIndex - 1 + filteredItems.value.length) % filteredItems.value.length
      selectedItem.value = filteredItems.value[prevIndex]
    }
    
    const nextImage = () => {
      const currentIndex = filteredItems.value.findIndex(item => item.id === selectedItem.value.id)
      const nextIndex = (currentIndex + 1) % filteredItems.value.length
      selectedItem.value = filteredItems.value[nextIndex]
    }
    
    const toggleLike = (item) => {
      item.liked = !item.liked
      item.likes += item.liked ? 1 : -1
      
      // Здесь будет API вызов для сохранения лайка
      console.log(`Liked item ${item.id}: ${item.liked}`)
    }
    
    const loadMore = () => {
      loading.value = true
      
      // Имитация загрузки
      setTimeout(() => {
        displayedCount.value += itemsPerPage
        loading.value = false
      }, 800)
    }
    
    const scrollToGallery = () => {
      const gallerySection = document.querySelector('.gallery-section')
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth' })
      }
    }
    
    // Жизненный цикл
    onMounted(() => {
      // Имитация загрузки данных
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 1000)
    })
    
    return {
      activeFilter,
      sortBy,
      viewMode,
      selectedItem,
      hoveredItem,
      loading,
      filteredItems,
      hasMoreItems,
      setFilter,
      sortGallery,
      getCategoryName,
      openModal,
      closeModal,
      prevImage,
      nextImage,
      toggleLike,
      loadMore
    }
  }
}
</script>

<style scoped>
.controls-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}
/* Адаптивность для controls-wrapper */
@media (max-width: 992px) {
  .controls-wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
  
  .filter-tags {
    justify-content: center;
    margin-bottom: 0;
  }
  
  .sort-controls {
    justify-content: space-between;
    width: 100%;
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .gallery-controls {
    top: 70px;
    padding: 1rem 0;
  }
  
  .controls-wrapper {
    gap: 1.5rem;
  }
  
  .filter-tags {
    justify-content: flex-start;
    overflow-x: auto;
    padding: 0.5rem 0 1rem;
    margin: -0.5rem -20px;
    padding-left: 20px;
    padding-right: 20px;
    scrollbar-width: thin;
    scrollbar-color: var(--primary-green) var(--bg-light);
  }
  
  .filter-tags::-webkit-scrollbar {
    height: 4px;
  }
  
  .filter-tags::-webkit-scrollbar-track {
    background: var(--bg-light);
    border-radius: 2px;
  }
  
  .filter-tags::-webkit-scrollbar-thumb {
    background: var(--primary-green);
    border-radius: 2px;
  }
  
  .sort-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 0 0.5rem;
  }
  
  .sort-dropdown {
    justify-content: space-between;
  }
  
  .view-toggle {
    align-self: center;
  }
}

@media (max-width: 576px) {
  .controls-wrapper {
    gap: 1.25rem;
  }
  
  .filter-tags {
    gap: 0.5rem;
  }
  
  .filter-tag {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    white-space: nowrap;
  }
  
  .sort-dropdown {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .sort-dropdown select {
    width: 100%;
  }
  
  .view-toggle {
    width: 100%;
    justify-content: center;
  }
}

/* Для очень маленьких экранов */
@media (max-width: 400px) {
  .filter-tags {
    gap: 0.375rem;
  }
  
  .filter-tag {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }
  
  .sort-dropdown label {
    font-size: 0.875rem;
  }
  
  .sort-dropdown select {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .view-btn {
    padding: 0.375rem;
  }
  
  .view-btn svg {
    width: 18px;
    height: 18px;
  }
}
.gallery-hero {
  background: #292929;
  color: white;
  padding: 6rem 0 4rem;
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
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.gallery-controls {
  padding: 0.7rem 0;
  background: rgba(255, 255, 255);
  border-bottom: 1px solid var(--bg-light);
  position: sticky;
  top: 80px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0.1rem 0;
  justify-content: left;
  min-width: 50%;
}

.filter-tag {
  padding: 0.75rem 1.5rem;
  background: var(--bg-light);
  border: none;
  border-radius: 50px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-light);
}

.filter-tag:hover {
  background: rgba(46, 125, 50, 0.1);
  color: var(--primary-green);
}

.filter-tag.active {
  background: var(--primary-green);
  color: white;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.sort-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  flex-shrink: 0; /* Предотвращает сжатие */
  margin-left: auto;
}

.sort-dropdown {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sort-dropdown label {
  font-weight: 500;
  color: var(--text-dark);
}

.sort-dropdown select {
  padding: 0.5rem 1rem;
  border: 2px solid var(--bg-light);
  border-radius: var(--radius-sm);
  font-family: 'Montserrat', sans-serif;
  background: white;
  color: var(--text-dark);
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.sort-dropdown select:focus {
  outline: none;
  border-color: var(--primary-green);
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-light);
  padding: 0.25rem;
  border-radius: var(--radius-sm);
}

.view-btn {
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn svg {
  fill: none;
  stroke: var(--text-light);
  stroke-width: 1.5;
}

.view-btn:hover {
  background: rgba(255, 255, 255, 0.5);
}

.view-btn.active {
  background: white;
  box-shadow: var(--shadow-sm);
}

.view-btn.active svg {
  stroke: var(--primary-green);
}

.gallery-section {
  padding: 3rem 0 5rem;
}

.gallery-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.gallery-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.gallery-grid.masonry {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: 250px;
  grid-auto-flow: dense;
}

.gallery-item {
  cursor: pointer;
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-item:hover {
  transform: translateY(-8px);
}

.gallery-item-inner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.gallery-item img.loaded {
  opacity: 1;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  padding: 2rem;
  color: white;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
}

.gallery-item:hover .item-overlay {
  opacity: 1;
  transform: translateY(0);
}

.item-info {
  margin-bottom: 1rem;
}

.item-category {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.item-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.item-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  opacity: 0.8;
}

.item-meta span {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.item-meta svg {
  fill: white;
}

.item-actions {
  display: flex;
  justify-content: flex-end;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.like-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.like-btn svg {
  transition: all 0.3s ease;
}

/* Анимации для элементов галереи */
.gallery-item-move {
  transition: transform 0.6s ease;
}

.gallery-item-enter-active,
.gallery-item-leave-active {
  transition: all 0.5s ease;
}

.gallery-item-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.gallery-item-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Состояния загрузки и пустоты */
.loading-state {
  text-align: center;
  padding: 4rem;
}

.loader {
  width: 50px;
  height: 50px;
  border: 3px solid var(--bg-light);
  border-top-color: var(--primary-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.empty-state {
  text-align: center;
  padding: 4rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-light);
  margin-bottom: 2rem;
}

.load-more {
  text-align: center;
  margin-top: 3rem;
}

.load-more .btn {
  padding: 1rem 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.load-more svg {
  fill: currentColor;
  transition: transform 0.3s ease;
}

.load-more .btn:hover svg {
  transform: translateY(2px);
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgb(151, 151, 151);
  transform: rotate(90deg);
}

.modal-close svg {
  fill: var(--text-dark);
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
}

.modal-image {
  height: 100%;
  overflow: hidden;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info {
  padding: 3rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  margin-bottom: 2rem;
}

.modal-category {
  display: inline-block;
  background: var(--primary-green);
  color: white;
  padding: 0.375rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 2rem;
  color: var(--primary-dark);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.modal-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--bg-light);
}

.detail-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.detail-item svg {
  flex-shrink: 0;
  fill: var(--primary-green);
  margin-top: 0.25rem;
}

.detail-label {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 0.25rem;
}

.detail-value {
  font-weight: 500;
  color: var(--text-dark);
}

.modal-description {
  margin-bottom: 2rem;
}

.modal-description h3 {
  color: var(--primary-dark);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.modal-description p {
  color: var(--text-light);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
  flex-wrap: wrap;
}

.modal-actions .like-btn.large {
  padding: 0.875rem 1.5rem;
  border: 2px solid var(--bg-light);
  background: white;
  color: var(--text-dark);
}

.modal-actions .like-btn.large:hover {
  border-color: var(--primary-green);
}

.modal-actions .like-btn.large svg {
  fill: none;
  stroke: currentColor;
}

.modal-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-nav:hover {
  background: var(--primary-green);
}

.modal-nav:hover svg {
  fill: white;
}

.modal-nav.prev {
  left: 1rem;
}

.modal-nav.next {
  right: 1rem;
}

.modal-nav svg {
  fill: var(--text-dark);
  transition: fill 0.3s ease;
}

/* Анимации для модального окна */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Адаптивность */
@media (max-width: 992px) {
  .modal-body {
    grid-template-columns: 1fr;
    grid-template-rows: 300px auto;
  }
  
  .modal-info {
    padding: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .gallery-grid.grid,
  .gallery-grid.masonry {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .gallery-hero {
    padding: 4rem 0 3rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .gallery-controls {
    top: 70px;
  }
  
  .filter-tags {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .sort-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .gallery-grid.grid,
  .gallery-grid.masonry {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    max-height: 95vh;
    padding: 0;
  }
  
  .modal-nav {
    width: 40px;
    height: 40px;
    bottom: 1rem;
    top: auto;
    transform: none;
  }
  
  .modal-nav.prev {
    left: 1rem;
  }
  
  .modal-nav.next {
    right: 1rem;
  }
}

@media (max-width: 576px) {
  .modal-body {
    grid-template-rows: 250px auto;
  }
  
  .modal-info {
    padding: 1.5rem;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-actions .btn {
    width: 100%;
    justify-content: center;
  }
}

/* Особенности для masonry layout */
.gallery-item.ratio-portrait {
  grid-row: span 2;
}

.gallery-item.ratio-landscape {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .gallery-item.ratio-portrait,
  .gallery-item.ratio-landscape {
    grid-row: auto;
    grid-column: auto;
  }
}
</style>