<template>
    <div class="services-admin">
      <!-- Заголовок и кнопки -->
      <div class="admin-header">
        <div class="header-left">
          <h1>Управление услугами</h1>
          <p>Создание и редактирование услуг парикмахерской</p>
        </div>
        <div class="header-right">
          <button class="btn btn-primary" @click="openAddModal">
            <span>+</span> Добавить услугу
          </button>
          <button class="btn btn-outline" @click="exportServices">
            📊 Экспорт
          </button>
        </div>
      </div>
  
      <!-- Фильтры -->
      <div class="filters">
        <div class="search-box">
          <input type="text" 
                 v-model="searchQuery" 
                 placeholder="Поиск услуг..."
                 class="search-input">
          <button class="search-btn">
            🔍
          </button>
        </div>
        <div class="filter-tags">
          <button class="tag" 
                  :class="{ active: activeCategory === null }"
                  @click="activeCategory = null">
            Все
          </button>
          <button class="tag"
                  v-for="category in categories"
                  :key="category"
                  :class="{ active: activeCategory === category }"
                  @click="activeCategory = category">
            {{ category }}
          </button>
        </div>
      </div>
  
      <!-- Таблица услуг -->
      <div class="services-table">
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Длительность</th>
              <th>Популярность</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in filteredServices" :key="service.id">
              <td>
                <div class="service-info">
                  <div class="service-icon">{{ service.icon }}</div>
                  <div class="service-details">
                    <h4>{{ service.name }}</h4>
                    <p class="service-desc">{{ service.description }}</p>
                  </div>
                </div>
              </td>
              <td>
                <span class="category-badge">{{ service.category }}</span>
              </td>
              <td class="price-cell">{{ service.price }} ₽</td>
              <td>{{ service.duration }} мин</td>
              <td>
                <div class="popularity">
                  <div class="popularity-bar">
                    <div class="popularity-fill" :style="{ width: service.popularity + '%' }"></div>
                  </div>
                  <span class="popularity-text">{{ service.popularity }}%</span>
                </div>
              </td>
              <td>
                <label class="switch">
                  <input type="checkbox" v-model="service.active" @change="toggleService(service.id)">
                  <span class="slider"></span>
                </label>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon" @click="editService(service)" title="Редактировать">
                    ✏️
                  </button>
                  <button class="btn-icon" @click="duplicateService(service)" title="Дублировать">
                    📋
                  </button>
                  <button class="btn-icon btn-danger" 
                          @click="deleteService(service.id)" 
                          title="Удалить">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Модальное окно добавления/редактирования -->
      <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ editingService ? 'Редактирование услуги' : 'Новая услуга' }}</h3>
            <button class="modal-close" @click="closeModal">×</button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="saveService">
              <div class="form-grid">
                <div class="form-group">
                  <label>Название услуги *</label>
                  <input type="text" v-model="formData.name" required class="form-input">
                </div>
                
                <div class="form-group">
                  <label>Иконка</label>
                  <div class="icon-selector">
                    <button type="button"
                            v-for="icon in availableIcons"
                            :key="icon"
                            class="icon-option"
                            :class="{ selected: formData.icon === icon }"
                            @click="formData.icon = icon">
                      {{ icon }}
                    </button>
                  </div>
                </div>
              </div>
  
              <div class="form-group">
                <label>Категория *</label>
                <select v-model="formData.category" required class="form-select">
                  <option value="">Выберите категорию</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
  
              <div class="form-grid">
                <div class="form-group">
                  <label>Цена (₽) *</label>
                  <input type="number" v-model.number="formData.price" required min="0" class="form-input">
                </div>
                
                <div class="form-group">
                  <label>Длительность (мин) *</label>
                  <input type="number" v-model.number="formData.duration" required min="5" step="5" class="form-input">
                </div>
              </div>
  
              <div class="form-group">
                <label>Описание</label>
                <textarea v-model="formData.description" 
                          class="form-textarea"
                          rows="3"
                          placeholder="Краткое описание услуги..."></textarea>
              </div>
  
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="formData.active">
                  <span class="checkmark"></span>
                  Активная услуга (отображается для записи)
                </label>
              </div>
  
              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" @click="closeModal">
                  Отмена
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ editingService ? 'Сохранить' : 'Создать' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  
  export default {
    name: 'ServicesAdmin',
    
    setup() {
      const searchQuery = ref('')
      const activeCategory = ref(null)
      const showModal = ref(false)
      const editingService = ref(null)
      
      const formData = ref({
        name: '',
        icon: '✂️',
        category: '',
        price: 0,
        duration: 30,
        description: '',
        active: true
      })
      
      const categories = ref(['Мужские', 'Женские', 'Детские', 'Окрашивание', 'Уход'])
      
      const availableIcons = ref(['✂️', '💇‍♀️', '💇‍♂️', '👶', '🎨', '🧔', '💆‍♀️', '🧖‍♀️', '💅', '🪒'])
      
      const services = ref([
        {
          id: 1,
          name: 'Мужская стрижка',
          icon: '💇‍♂️',
          category: 'Мужские',
          price: 800,
          duration: 45,
          description: 'Современная мужская стрижка с учетом особенностей волос',
          popularity: 85,
          active: true
        },
        {
          id: 2,
          name: 'Женская стрижка',
          icon: '💇‍♀️',
          category: 'Женские',
          price: 1500,
          duration: 60,
          description: 'Стильная женская стрижка с укладкой',
          popularity: 90,
          active: true
        },
        {
          id: 3,
          name: 'Детская стрижка',
          icon: '👶',
          category: 'Детские',
          price: 600,
          duration: 30,
          description: 'Безопасная стрижка для детей любого возраста',
          popularity: 75,
          active: true
        },
        {
          id: 4,
          name: 'Окрашивание',
          icon: '🎨',
          category: 'Окрашивание',
          price: 2500,
          duration: 90,
          description: 'Профессиональное окрашивание волос',
          popularity: 65,
          active: true
        }
      ])
      
      // Фильтрация услуг
      const filteredServices = computed(() => {
        let filtered = services.value
        
        // Поиск
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase()
          filtered = filtered.filter(service =>
            service.name.toLowerCase().includes(query) ||
            service.description.toLowerCase().includes(query)
          )
        }
        
        // Фильтр по категории
        if (activeCategory.value) {
          filtered = filtered.filter(service => service.category === activeCategory.value)
        }
        
        return filtered
      })
      
      // Методы
      const openAddModal = () => {
        formData.value = {
          name: '',
          icon: '✂️',
          category: '',
          price: 0,
          duration: 30,
          description: '',
          active: true
        }
        editingService.value = null
        showModal.value = true
      }
      
      const editService = (service) => {
        formData.value = { ...service }
        editingService.value = service.id
        showModal.value = true
      }
      
      const closeModal = () => {
        showModal.value = false
        editingService.value = null
      }
      
      const saveService = () => {
        if (editingService.value) {
          // Редактирование существующей услуги
          const index = services.value.findIndex(s => s.id === editingService.value)
          if (index !== -1) {
            services.value[index] = {
              ...services.value[index],
              ...formData.value
            }
          }
        } else {
          // Добавление новой услуги
          const newService = {
            id: Math.max(...services.value.map(s => s.id)) + 1,
            ...formData.value,
            popularity: Math.floor(Math.random() * 30) + 50 // Генерация популярности
          }
          services.value.push(newService)
        }
        
        closeModal()
      }
      
      const deleteService = (id) => {
        if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
          services.value = services.value.filter(service => service.id !== id)
        }
      }
      
      const duplicateService = (service) => {
        const duplicated = {
          ...service,
          id: Math.max(...services.value.map(s => s.id)) + 1,
          name: `${service.name} (копия)`,
          popularity: 50
        }
        services.value.push(duplicated)
      }
      
      const toggleService = (id) => {
        const service = services.value.find(s => s.id === id)
        if (service) {
          service.active = !service.active
        }
      }
      
      const exportServices = () => {
        // Здесь будет логика экспорта
        console.log('Экспорт услуг')
      }
      
      onMounted(() => {
        console.log('ServicesAdmin загружен')
      })
      
      return {
        searchQuery,
        activeCategory,
        showModal,
        editingService,
        formData,
        categories,
        availableIcons,
        services,
        filteredServices,
        openAddModal,
        editService,
        closeModal,
        saveService,
        deleteService,
        duplicateService,
        toggleService,
        exportServices
      }
    }
  }
  </script>
  
  <style scoped>
  .services-admin {
    padding: 1rem;
  }
  
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .header-left h1 {
    font-size: 1.75rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }
  
  .header-left p {
    color: var(--text-light);
    font-size: 0.9rem;
  }
  
  .header-right {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }
  
  .btn-primary {
    background: var(--primary-green);
    color: white;
  }
  
  .btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
  }
  
  .btn-outline {
    background: white;
    color: var(--primary-green);
    border: 2px solid var(--primary-green);
  }
  
  .btn-outline:hover {
    background: var(--primary-green);
    color: white;
  }
  
  /* Фильтры */
  .filters {
    margin-bottom: 2rem;
  }
  
  .search-box {
    display: flex;
    max-width: 400px;
    margin-bottom: 1rem;
  }
  
  .search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-right: none;
    border-radius: 8px 0 0 8px;
    font-size: 0.9rem;
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--primary-green);
  }
  
  .search-btn {
    background: var(--primary-green);
    color: white;
    border: none;
    padding: 0 1.25rem;
    border-radius: 0 8px 8px 0;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .search-btn:hover {
    background: var(--primary-dark);
  }
  
  .filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tag {
    padding: 0.5rem 1rem;
    background: #f3f4f6;
    border: 2px solid #e5e7eb;
    border-radius: 20px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .tag:hover {
    background: #e5e7eb;
  }
  
  .tag.active {
    background: var(--primary-green);
    color: white;
    border-color: var(--primary-green);
  }
  
  /* Таблица */
  .services-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .services-table table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .services-table th {
    background: #f8fafc;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #475569;
    font-size: 0.875rem;
    border-bottom: 2px solid #e2e8f0;
  }
  
  .services-table td {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
  }
  
  .services-table tbody tr:hover {
    background: #f8fafc;
  }
  
  .service-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .service-icon {
    font-size: 1.5rem;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0fdf4;
    border-radius: 10px;
    color: var(--primary-green);
  }
  
  .service-details h4 {
    margin: 0 0 4px 0;
    font-size: 1rem;
    color: var(--text-dark);
  }
  
  .service-desc {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.4;
  }
  
  .category-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: #eff6ff;
    color: #2563eb;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .price-cell {
    font-weight: 600;
    color: var(--primary-green);
    font-size: 1.125rem;
  }
  
  .popularity {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .popularity-bar {
    flex: 1;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .popularity-fill {
    height: 100%;
    background: var(--primary-green);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  .popularity-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    min-width: 40px;
  }
  
  /* Switch */
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
  }
  
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: var(--primary-green);
  }
  
  input:checked + .slider:before {
    transform: translateX(26px);
  }
  
  /* Кнопки действий */
  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 0.875rem;
  }
  
  .btn-icon:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }
  
  .btn-icon.btn-danger:hover {
    background: #fef2f2;
    border-color: #fca5a5;
    color: #dc2626;
  }
  
  /* Модальное окно */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  
  .modal {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
  }
  
  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--text-dark);
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.3s ease;
  }
  
  .modal-close:hover {
    background: #f3f4f6;
    color: var(--text-dark);
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  /* Форма */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-dark);
    font-size: 0.9rem;
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    background: white;
  }
  
  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
  
  .icon-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .icon-option {
    width: 40px;
    height: 40px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    transition: all 0.3s ease;
  }
  
  .icon-option:hover {
    border-color: var(--primary-green);
    background: #f0fdf4;
  }
  
  .icon-option.selected {
    border-color: var(--primary-green);
    background: var(--primary-green);
    color: white;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--text-dark);
  }
  
  .checkbox-label input {
    display: none;
  }
  
  .checkmark {
    width: 18px;
    height: 18px;
    border: 2px solid #ddd;
    border-radius: 4px;
    margin-right: 8px;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .checkbox-label input:checked + .checkmark {
    background: var(--primary-green);
    border-color: var(--primary-green);
  }
  
  .checkbox-label input:checked + .checkmark::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 0.8rem;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .btn-secondary {
    background: #f3f4f6;
    color: var(--text-dark);
    border: none;
  }
  
  .btn-secondary:hover {
    background: #e5e7eb;
  }
  
  /* Анимации */
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Адаптивность */
  @media (max-width: 768px) {
    .admin-header {
      flex-direction: column;
    }
    
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .services-table {
      overflow-x: auto;
    }
    
    .services-table table {
      min-width: 800px;
    }
  }
  </style>