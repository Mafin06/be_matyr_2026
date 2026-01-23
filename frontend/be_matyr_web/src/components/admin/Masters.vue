<template>
    <div class="masters-admin">
      <!-- Заголовок и кнопки -->
      <div class="admin-header">
        <div class="header-left">
          <h1>Мастера</h1>
          <p>Управление мастерами парикмахерской</p>
        </div>
        <div class="header-right">
          <button class="btn btn-primary" @click="openAddModal">
            <span>+</span> Добавить мастера
          </button>
          <button class="btn btn-outline" @click="exportSchedule">
            📅 Расписание
          </button>
        </div>
      </div>
  
      <!-- Фильтры -->
      <div class="filters">
        <div class="search-box">
          <input type="text" 
                 v-model="searchQuery" 
                 placeholder="Поиск по имени или специализации..."
                 class="search-input">
          <button class="search-btn">
            🔍
          </button>
        </div>
        <div class="status-filter">
          <label class="checkbox-label">
            <input type="checkbox" v-model="showActiveOnly">
            <span class="checkmark"></span>
            Только активные мастера
          </label>
        </div>
      </div>
  
      <!-- Карточки мастеров -->
      <div class="masters-grid">
        <div v-for="master in filteredMasters" :key="master.id" class="master-card">
          <div class="master-header">
            <div class="master-avatar" :style="{ background: master.avatarColor }">
              <span>{{ master.initials }}</span>
            </div>
            <div class="master-info">
              <h3>{{ master.name }}</h3>
              <p class="master-specialization">{{ master.specialization }}</p>
            </div>
            <div class="master-status">
              <span class="status-dot" :class="{ active: master.active }"></span>
              {{ master.active ? 'Активен' : 'Неактивен' }}
            </div>
          </div>
          
          <div class="master-stats">
            <div class="stat">
              <span class="stat-label">Рейтинг</span>
              <div class="rating">
                <span class="stars">★★★★★</span>
                <span class="rating-value">{{ master.rating }}</span>
              </div>
            </div>
            <div class="stat">
              <span class="stat-label">Записей</span>
              <span class="stat-value">{{ master.bookingsCount }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Выручка</span>
              <span class="stat-value">{{ master.revenue }}K ₽</span>
            </div>
          </div>
          
          <div class="master-services">
            <span class="services-label">Специализация:</span>
            <div class="service-tags">
              <span class="service-tag" v-for="service in master.services" :key="service">
                {{ service }}
              </span>
            </div>
          </div>
          
          <div class="master-schedule">
            <span class="schedule-label">Расписание:</span>
            <div class="schedule-days">
              <span v-for="day in master.schedule" 
                    :key="day.day"
                    class="day-indicator"
                    :class="{ working: day.working }"
                    :title="day.working ? `${day.day}: ${day.hours}` : `${day.day}: выходной`">
                {{ day.day.charAt(0) }}
              </span>
            </div>
          </div>
          
          <div class="master-actions">
            <button class="btn-action" @click="editMaster(master)" title="Редактировать">
              ✏️
            </button>
            <button class="btn-action" @click="viewSchedule(master.id)" title="Расписание">
              📅
            </button>
            <button class="btn-action" @click="toggleMasterStatus(master.id)" 
                    :title="master.active ? 'Деактивировать' : 'Активировать'">
              {{ master.active ? '👁️' : '👁️‍🗨️' }}
            </button>
            <button class="btn-action btn-danger" 
                    @click="deleteMaster(master.id)" 
                    title="Удалить">
              🗑️
            </button>
          </div>
        </div>
      </div>
  
      <!-- Модальное окно мастера -->
      <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ editingMaster ? 'Редактирование мастера' : 'Новый мастер' }}</h3>
            <button class="modal-close" @click="closeModal">×</button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="saveMaster">
              <div class="form-grid">
                <div class="form-group">
                  <label>Имя и фамилия *</label>
                  <input type="text" v-model="formData.name" required class="form-input">
                </div>
                
                <div class="form-group">
                  <label>Специализация *</label>
                  <input type="text" v-model="formData.specialization" required class="form-input"
                         placeholder="Мужские стрижки, Окрашивание...">
                </div>
              </div>
  
              <div class="form-group">
                <label>Цвет аватара</label>
                <div class="color-selector">
                  <button type="button"
                          v-for="color in avatarColors"
                          :key="color"
                          class="color-option"
                          :class="{ selected: formData.avatarColor === color }"
                          :style="{ background: color }"
                          @click="formData.avatarColor = color">
                    <span v-if="formData.avatarColor === color">✓</span>
                  </button>
                </div>
              </div>
  
              <div class="form-group">
                <label>Услуги</label>
                <div class="services-selector">
                  <label class="service-checkbox" v-for="service in availableServices" :key="service">
                    <input type="checkbox" 
                           :value="service" 
                           v-model="formData.services">
                    <span class="checkbox-custom"></span>
                    {{ service }}
                  </label>
                </div>
              </div>
  
              <div class="form-group">
                <label>Расписание работы</label>
                <div class="schedule-editor">
                  <div v-for="day in scheduleDays" :key="day.day" class="schedule-day">
                    <label class="day-label">{{ day.label }}</label>
                    <div class="day-controls">
                      <label class="checkbox-label small">
                        <input type="checkbox" 
                               v-model="day.working"
                               @change="updateSchedule(day)">
                        <span class="checkmark"></span>
                        Работает
                      </label>
                      <div class="time-inputs" v-if="day.working">
                        <input type="time" v-model="day.startTime" class="time-input">
                        <span>—</span>
                        <input type="time" v-model="day.endTime" class="time-input">
                      </div>
                      <span v-else class="day-off">Выходной</span>
                    </div>
                  </div>
                </div>
              </div>
  
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="formData.active">
                  <span class="checkmark"></span>
                  Активный мастер (доступен для записи)
                </label>
              </div>
  
              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" @click="closeModal">
                  Отмена
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ editingMaster ? 'Сохранить' : 'Создать' }}
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
    name: 'MastersAdmin',
    
    setup() {
      const searchQuery = ref('')
      const showActiveOnly = ref(true)
      const showModal = ref(false)
      const editingMaster = ref(null)
      
      const formData = ref({
        name: '',
        specialization: '',
        avatarColor: '#3b82f6',
        services: [],
        active: true,
        schedule: []
      })
      
      const avatarColors = ref([
        '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'
      ])
      
      const availableServices = ref([
        'Мужские стрижки', 'Женские стрижки', 'Детские стрижки',
        'Окрашивание', 'Укладка', 'Стрижка бороды', 'Кератин'
      ])
      
      const scheduleDays = ref([
        { day: 'monday', label: 'Понедельник', working: true, startTime: '09:00', endTime: '19:00' },
        { day: 'tuesday', label: 'Вторник', working: true, startTime: '09:00', endTime: '19:00' },
        { day: 'wednesday', label: 'Среда', working: true, startTime: '09:00', endTime: '19:00' },
        { day: 'thursday', label: 'Четверг', working: true, startTime: '09:00', endTime: '19:00' },
        { day: 'friday', label: 'Пятница', working: true, startTime: '09:00', endTime: '19:00' },
        { day: 'saturday', label: 'Суббота', working: true, startTime: '10:00', endTime: '18:00' },
        { day: 'sunday', label: 'Воскресенье', working: false, startTime: '10:00', endTime: '17:00' }
      ])
      
      const masters = ref([
        {
          id: 1,
          name: 'Алексей Петров',
          specialization: 'Мужской стилист',
          initials: 'АП',
          avatarColor: '#3b82f6',
          rating: 4.9,
          bookingsCount: 156,
          revenue: 124.8,
          services: ['Мужские стрижки', 'Стрижка бороды'],
          schedule: [
            { day: 'Пн', working: true, hours: '09:00-19:00' },
            { day: 'Вт', working: true, hours: '09:00-19:00' },
            { day: 'Ср', working: true, hours: '09:00-19:00' },
            { day: 'Чт', working: true, hours: '09:00-19:00' },
            { day: 'Пт', working: true, hours: '09:00-19:00' },
            { day: 'Сб', working: true, hours: '10:00-18:00' },
            { day: 'Вс', working: false, hours: 'Выходной' }
          ],
          active: true
        },
        {
          id: 2,
          name: 'Мария Сидорова',
          specialization: 'Женский стилист',
          initials: 'МС',
          avatarColor: '#10b981',
          rating: 4.8,
          bookingsCount: 142,
          revenue: 213,
          services: ['Женские стрижки', 'Окрашивание', 'Укладка'],
          schedule: [
            { day: 'Пн', working: true, hours: '10:00-20:00' },
            { day: 'Вт', working: true, hours: '10:00-20:00' },
            { day: 'Ср', working: true, hours: '10:00-20:00' },
            { day: 'Чт', working: true, hours: '10:00-20:00' },
            { day: 'Пт', working: true, hours: '10:00-20:00' },
            { day: 'Сб', working: true, hours: '10:00-18:00' },
            { day: 'Вс', working: false, hours: 'Выходной' }
          ],
          active: true
        }
      ])
      
      // Фильтрация мастеров
      const filteredMasters = computed(() => {
        let filtered = masters.value
        
        // Поиск
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase()
          filtered = filtered.filter(master =>
            master.name.toLowerCase().includes(query) ||
            master.specialization.toLowerCase().includes(query)
          )
        }
        
        // Фильтр по активности
        if (showActiveOnly.value) {
          filtered = filtered.filter(master => master.active)
        }
        
        return filtered
      })
      
      // Методы
      const getInitials = (name) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase()
      }
      
      const openAddModal = () => {
        formData.value = {
          name: '',
          specialization: '',
          avatarColor: '#3b82f6',
          services: [],
          active: true,
          schedule: [...scheduleDays.value]
        }
        editingMaster.value = null
        showModal.value = true
      }
      
      const editMaster = (master) => {
        formData.value = {
          name: master.name,
          specialization: master.specialization,
          avatarColor: master.avatarColor,
          services: [...master.services],
          active: master.active,
          schedule: [...master.schedule]
        }
        editingMaster.value = master.id
        showModal.value = true
      }
      
      const closeModal = () => {
        showModal.value = false
        editingMaster.value = null
      }
      
      const updateSchedule = (day) => {
        if (!day.working) {
          day.startTime = '09:00'
          day.endTime = '19:00'
        }
      }
      
      const saveMaster = () => {
        const schedule = scheduleDays.value.map(day => ({
          day: day.day.charAt(0).toUpperCase() + day.day.slice(1, 3),
          working: day.working,
          hours: day.working ? `${day.startTime}-${day.endTime}` : 'Выходной'
        }))
        
        if (editingMaster.value) {
          // Редактирование существующего мастера
          const index = masters.value.findIndex(m => m.id === editingMaster.value)
          if (index !== -1) {
            masters.value[index] = {
              ...masters.value[index],
              ...formData.value,
              schedule,
              initials: getInitials(formData.value.name)
            }
          }
        } else {
          // Добавление нового мастера
          const newMaster = {
            id: Math.max(...masters.value.map(m => m.id)) + 1,
            ...formData.value,
            schedule,
            initials: getInitials(formData.value.name),
            rating: (Math.random() * 0.5 + 4.5).toFixed(1),
            bookingsCount: Math.floor(Math.random() * 100) + 50,
            revenue: Math.floor(Math.random() * 100) + 100
          }
          masters.value.push(newMaster)
        }
        
        closeModal()
      }
      
      const deleteMaster = (id) => {
        if (confirm('Вы уверены, что хотите удалить этого мастера?')) {
          masters.value = masters.value.filter(master => master.id !== id)
        }
      }
      
      const toggleMasterStatus = (id) => {
        const master = masters.value.find(m => m.id === id)
        if (master) {
          master.active = !master.active
        }
      }
      
      const viewSchedule = (id) => {
        console.log('Просмотр расписания мастера:', id)
        // Здесь будет переход к расписанию
      }
      
      const exportSchedule = () => {
        console.log('Экспорт расписания')
      }
      
      onMounted(() => {
        console.log('MastersAdmin загружен')
      })
      
      return {
        searchQuery,
        showActiveOnly,
        showModal,
        editingMaster,
        formData,
        avatarColors,
        availableServices,
        scheduleDays,
        masters,
        filteredMasters,
        openAddModal,
        editMaster,
        closeModal,
        updateSchedule,
        saveMaster,
        deleteMaster,
        toggleMasterStatus,
        viewSchedule,
        exportSchedule
      }
    }
  }
  </script>
  
  <style scoped>
  .masters-admin {
    padding: 1rem;
  }
  
  /* Общие стили (копируем из Services) */
  .admin-header,
  .btn,
  .search-box,
  .search-input,
  .search-btn,
  .modal-overlay,
  .modal,
  .modal-header,
  .modal-close,
  .modal-body,
  .form-group,
  .form-input,
  .form-select,
  .form-textarea,
  .modal-actions,
  .btn-secondary,
  .btn-primary {
    /* Копируем стили из Services.vue */
  }
  
  /* Сетка мастеров */
  .masters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  
  .master-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
  }
  
  .master-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  .master-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .master-avatar {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    flex-shrink: 0;
  }
  
  .master-info {
    flex: 1;
  }
  
  .master-info h3 {
    margin: 0 0 4px 0;
    font-size: 1.125rem;
    color: var(--text-dark);
  }
  
  .master-specialization {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .master-status {
    font-size: 0.75rem;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #d1d5db;
  }
  
  .status-dot.active {
    background: #10b981;
  }
  
  /* Статистика */
  .master-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem 0;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  .rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }
  
  .stars {
    color: #fbbf24;
    font-size: 0.875rem;
    letter-spacing: 2px;
  }
  
  .rating-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  /* Услуги */
  .master-services {
    margin-bottom: 1rem;
  }
  
  .services-label {
    display: block;
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }
  
  .service-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .service-tag {
    padding: 0.25rem 0.5rem;
    background: #eff6ff;
    color: #2563eb;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  /* Расписание */
  .master-schedule {
    margin-bottom: 1.5rem;
  }
  
  .schedule-label {
    display: block;
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }
  
  .schedule-days {
    display: flex;
    gap: 0.5rem;
  }
  
  .day-indicator {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    background: #f3f4f6;
    color: #6b7280;
    cursor: help;
  }
  
  .day-indicator.working {
    background: #10b981;
    color: white;
  }
  
  /* Действия */
  .master-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .btn-action {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 1rem;
  }
  
  .btn-action:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }
  
  .btn-action.btn-danger:hover {
    background: #fef2f2;
    border-color: #fca5a5;
    color: #dc2626;
  }
  
  /* Форма в модальном окне */
  .color-selector {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .color-option {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 2px solid #e5e7eb;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .color-option:hover {
    border-color: #9ca3af;
  }
  
  .color-option.selected {
    border-color: var(--primary-green);
    transform: scale(1.1);
  }
  
  .services-selector {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .service-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    color: var(--text-dark);
  }
  
  .service-checkbox input {
    display: none;
  }
  
  .checkbox-custom {
    width: 18px;
    height: 18px;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .service-checkbox input:checked + .checkbox-custom {
    background: var(--primary-green);
    border-color: var(--primary-green);
  }
  
  .service-checkbox input:checked + .checkbox-custom::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 0.75rem;
  }
  
  .schedule-editor {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 0.5rem;
  }
  
  .schedule-day {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .schedule-day:last-child {
    border-bottom: none;
  }
  
  .day-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-dark);
    min-width: 120px;
  }
  
  .day-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .checkbox-label.small {
    font-size: 0.875rem;
  }
  
  .time-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .time-input {
    padding: 0.25rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 0.875rem;
    width: 80px;
  }
  
  .day-off {
    font-size: 0.875rem;
    color: #6b7280;
    font-style: italic;
  }
  
  /* Адаптивность */
  @media (max-width: 768px) {
    .masters-grid {
      grid-template-columns: 1fr;
    }
    
    .master-stats {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .services-selector {
      grid-template-columns: 1fr;
    }
    
    .schedule-day {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .day-controls {
      width: 100%;
      justify-content: space-between;
    }
  }
  </style>