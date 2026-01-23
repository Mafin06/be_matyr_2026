<template>
    <div class="clients-admin">
      <!-- Заголовок и кнопки -->
      <div class="admin-header">
        <div class="header-left">
          <h1>Клиенты</h1>
          <p>Управление клиентской базой</p>
        </div>
        <div class="header-right">
          <button class="btn btn-primary" @click="openAddModal">
            <span>+</span> Добавить клиента
          </button>
          <button class="btn btn-outline" @click="exportClients">
            📄 Экспорт
          </button>
        </div>
      </div>
  
      <!-- Фильтры и поиск -->
      <div class="filters-section">
        <div class="search-box">
          <input type="text" 
                 v-model="searchQuery" 
                 placeholder="Поиск по имени, телефону или email..."
                 class="search-input">
          <button class="search-btn">
            🔍
          </button>
        </div>
        
        <div class="filters-row">
          <select v-model="sortBy" class="filter-select">
            <option value="name">По имени</option>
            <option value="visits">По количеству визитов</option>
            <option value="recent">По последнему визиту</option>
            <option value="spent">По потраченной сумме</option>
          </select>
          
          <select v-model="loyaltyFilter" class="filter-select">
            <option value="all">Все клиенты</option>
            <option value="regular">Постоянные</option>
            <option value="new">Новые</option>
            <option value="inactive">Неактивные</option>
          </select>
          
          <button class="btn-filter" @click="showAdvancedFilters = !showAdvancedFilters">
            🔧 Расширенные фильтры
          </button>
        </div>
  
        <!-- Расширенные фильтры -->
        <div class="advanced-filters" v-if="showAdvancedFilters">
          <div class="filter-group">
            <label>Дата первого визита:</label>
            <div class="date-range">
              <input type="date" v-model="dateFrom" class="date-input">
              <span>—</span>
              <input type="date" v-model="dateTo" class="date-input">
            </div>
          </div>
          
          <div class="filter-group">
            <label>Количество визитов:</label>
            <div class="range-inputs">
              <input type="number" v-model.number="visitsMin" placeholder="От" class="range-input">
              <span>—</span>
              <input type="number" v-model.number="visitsMax" placeholder="До" class="range-input">
            </div>
          </div>
          
          <div class="filter-group">
            <label>Потраченная сумма:</label>
            <div class="range-inputs">
              <input type="number" v-model.number="spentMin" placeholder="От" class="range-input">
              <span>—</span>
              <input type="number" v-model.number="spentMax" placeholder="До" class="range-input">
            </div>
          </div>
          
          <button class="btn-apply" @click="applyFilters">
            Применить фильтры
          </button>
          <button class="btn-reset" @click="resetFilters">
            Сбросить
          </button>
        </div>
      </div>
  
      <!-- Статистика клиентов -->
      <div class="client-stats">
        <div class="stat-card" v-for="stat in clientStats" :key="stat.label">
          <div class="stat-icon" :style="{ background: stat.color }">
            <span>{{ stat.icon }}</span>
          </div>
          <div class="stat-info">
            <h3>{{ stat.value }}</h3>
            <p>{{ stat.label }}</p>
            <span class="stat-change" :class="stat.changeClass">
              {{ stat.change }}
            </span>
          </div>
        </div>
      </div>
  
      <!-- Таблица клиентов -->
      <div class="clients-table">
        <table>
          <thead>
            <tr>
              <th>Клиент</th>
              <th>Контакты</th>
              <th>Визиты</th>
              <th>Последний визит</th>
              <th>Потрачено</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in filteredClients" :key="client.id">
              <td>
                <div class="client-info">
                  <div class="client-avatar" :style="{ background: client.avatarColor }">
                    <span>{{ client.initials }}</span>
                  </div>
                  <div class="client-details">
                    <h4>{{ client.name }}</h4>
                    <p class="client-note">{{ client.note || 'Нет заметок' }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="client-contacts">
                  <a :href="`tel:${client.phone}`" class="contact-link">
                    📞 {{ formatPhone(client.phone) }}
                  </a>
                  <a v-if="client.email" :href="`mailto:${client.email}`" class="contact-link">
                    ✉️ {{ client.email }}
                  </a>
                </div>
              </td>
              <td>
                <div class="visits-info">
                  <span class="visits-count">{{ client.visits }}</span>
                  <div class="visits-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: getVisitProgress(client.visits) }"></div>
                    </div>
                    <span class="progress-text">{{ getLoyaltyLevel(client.visits) }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="last-visit">
                  <span class="visit-date">{{ formatDate(client.lastVisit) }}</span>
                  <span class="visit-service">{{ client.lastService || '—' }}</span>
                </div>
              </td>
              <td>
                <div class="spent-amount">
                  <span class="amount">{{ client.totalSpent.toLocaleString() }} ₽</span>
                  <span class="avg-spent">~{{ client.avgSpent }} ₽/визит</span>
                </div>
              </td>
              <td>
                <span class="client-status" :class="`status-${client.status}`">
                  {{ getStatusLabel(client.status) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon" @click="viewClient(client.id)" title="Просмотр">
                    👁️
                  </button>
                  <button class="btn-icon" @click="editClient(client)" title="Редактировать">
                    ✏️
                  </button>
                  <button class="btn-icon" @click="sendNotification(client.id)" title="Отправить уведомление">
                    📢
                  </button>
                  <button class="btn-icon btn-danger" 
                          @click="deleteClient(client.id)" 
                          title="Удалить">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredClients.length === 0" class="no-clients">
          <p>Клиенты не найдены</p>
          <button class="btn btn-primary" @click="resetFilters">
            Сбросить фильтры
          </button>
        </div>
      </div>
  
      <!-- Пагинация -->
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="prevPage">
          ← Назад
        </button>
        <span class="page-info">
          Страница {{ currentPage }} из {{ totalPages }}
        </span>
        <button :disabled="currentPage === totalPages" @click="nextPage">
          Вперед →
        </button>
      </div>
  
      <!-- Модальное окно клиента -->
      <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ editingClient ? 'Редактирование клиента' : 'Новый клиент' }}</h3>
            <button class="modal-close" @click="closeModal">×</button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="saveClient">
              <div class="form-grid">
                <div class="form-group">
                  <label>Имя и фамилия *</label>
                  <input type="text" v-model="formData.name" required class="form-input">
                </div>
                
                <div class="form-group">
                  <label>Телефон *</label>
                  <input type="tel" v-model="formData.phone" required class="form-input"
                         placeholder="+7 (___) ___-__-__">
                </div>
              </div>
  
              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="formData.email" class="form-input">
              </div>
  
              <div class="form-group">
                <label>Дата рождения</label>
                <input type="date" v-model="formData.birthday" class="form-input">
              </div>
  
              <div class="form-group">
                <label>Источник привлечения</label>
                <select v-model="formData.source" class="form-select">
                  <option value="">Не указано</option>
                  <option value="website">Сайт</option>
                  <option value="instagram">Instagram</option>
                  <option value="vk">ВКонтакте</option>
                  <option value="recommendation">По рекомендации</option>
                  <option value="walk-in">Проходящий мимо</option>
                </select>
              </div>
  
              <div class="form-group">
                <label>Заметки о клиенте</label>
                <textarea v-model="formData.note" 
                          class="form-textarea"
                          rows="3"
                          placeholder="Предпочтения, аллергии, особенности..."></textarea>
              </div>
  
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="formData.subscribed">
                  <span class="checkmark"></span>
                  Подписан на рассылку
                </label>
              </div>
  
              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" @click="closeModal">
                  Отмена
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ editingClient ? 'Сохранить' : 'Создать' }}
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
    name: 'ClientsAdmin',
    
    setup() {
      const searchQuery = ref('')
      const sortBy = ref('recent')
      const loyaltyFilter = ref('all')
      const showAdvancedFilters = ref(false)
      const currentPage = ref(1)
      const itemsPerPage = 10
      
      // Фильтры
      const dateFrom = ref('')
      const dateTo = ref('')
      const visitsMin = ref('')
      const visitsMax = ref('')
      const spentMin = ref('')
      const spentMax = ref('')
      
      // Модальное окно
      const showModal = ref(false)
      const editingClient = ref(null)
      
      const formData = ref({
        name: '',
        phone: '',
        email: '',
        birthday: '',
        source: '',
        note: '',
        subscribed: true
      })
      
      // Статистика
      const clientStats = ref([
        {
          label: 'Всего клиентов',
          value: '156',
          icon: '👥',
          color: '#3b82f6',
          change: '+12',
          changeClass: 'positive'
        },
        {
          label: 'Новых за месяц',
          value: '24',
          icon: '🆕',
          color: '#10b981',
          change: '+15%',
          changeClass: 'positive'
        },
        {
          label: 'Средний чек',
          value: '2,450 ₽',
          icon: '💰',
          color: '#f59e0b',
          change: '+8%',
          changeClass: 'positive'
        },
        {
          label: 'Удержание',
          value: '78%',
          icon: '📊',
          color: '#8b5cf6',
          change: '+5%',
          changeClass: 'positive'
        }
      ])
      
      // Данные клиентов
      const clients = ref([
        {
          id: 1,
          name: 'Иванов Иван',
          initials: 'ИИ',
          avatarColor: '#3b82f6',
          phone: '+79171234567',
          email: 'ivanov@example.com',
          visits: 12,
          lastVisit: '2024-12-15',
          lastService: 'Мужская стрижка',
          totalSpent: 9600,
          avgSpent: 800,
          status: 'regular',
          note: 'Постоянный клиент, предпочитает fade стрижку',
          source: 'website',
          subscribed: true,
          birthday: '1990-05-15',
          createdAt: '2024-01-10'
        },
        {
          id: 2,
          name: 'Смирнова Анна',
          initials: 'СА',
          avatarColor: '#10b981',
          phone: '+79177654321',
          email: 'smirnova@example.com',
          visits: 5,
          lastVisit: '2024-12-14',
          lastService: 'Окрашивание',
          totalSpent: 12500,
          avgSpent: 2500,
          status: 'regular',
          note: '',
          source: 'instagram',
          subscribed: true,
          birthday: '1988-11-22',
          createdAt: '2024-08-15'
        },
        {
          id: 3,
          name: 'Петров Петр',
          initials: 'ПП',
          avatarColor: '#f59e0b',
          phone: '+79179876543',
          email: '',
          visits: 1,
          lastVisit: '2024-12-10',
          lastService: 'Детская стрижка',
          totalSpent: 600,
          avgSpent: 600,
          status: 'new',
          note: 'Новый клиент, привел ребенка',
          source: 'recommendation',
          subscribed: false,
          birthday: '',
          createdAt: '2024-12-10'
        }
      ])
      
      // Вычисляемые свойства
      const filteredClients = computed(() => {
        let filtered = [...clients.value]
        
        // Поиск
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase()
          filtered = filtered.filter(client =>
            client.name.toLowerCase().includes(query) ||
            client.phone.includes(query) ||
            (client.email && client.email.toLowerCase().includes(query))
          )
        }
        
        // Фильтр по лояльности
        if (loyaltyFilter.value !== 'all') {
          filtered = filtered.filter(client => {
            if (loyaltyFilter.value === 'regular') return client.status === 'regular'
            if (loyaltyFilter.value === 'new') return client.status === 'new'
            if (loyaltyFilter.value === 'inactive') return client.status === 'inactive'
            return true
          })
        }
        
        // Расширенные фильтры
        if (visitsMin.value !== '') {
          filtered = filtered.filter(client => client.visits >= visitsMin.value)
        }
        if (visitsMax.value !== '') {
          filtered = filtered.filter(client => client.visits <= visitsMax.value)
        }
        if (spentMin.value !== '') {
          filtered = filtered.filter(client => client.totalSpent >= spentMin.value)
        }
        if (spentMax.value !== '') {
          filtered = filtered.filter(client => client.totalSpent <= spentMax.value)
        }
        if (dateFrom.value) {
          const fromDate = new Date(dateFrom.value)
          filtered = filtered.filter(client => new Date(client.createdAt) >= fromDate)
        }
        if (dateTo.value) {
          const toDate = new Date(dateTo.value)
          filtered = filtered.filter(client => new Date(client.createdAt) <= toDate)
        }
        
        // Сортировка
        filtered.sort((a, b) => {
          switch (sortBy.value) {
            case 'name':
              return a.name.localeCompare(b.name)
            case 'visits':
              return b.visits - a.visits
            case 'recent':
              return new Date(b.lastVisit) - new Date(a.lastVisit)
            case 'spent':
              return b.totalSpent - a.totalSpent
            default:
              return 0
          }
        })
        
        // Пагинация
        const start = (currentPage.value - 1) * itemsPerPage
        const end = start + itemsPerPage
        return filtered.slice(start, end)
      })
      
      const totalPages = computed(() => {
        return Math.ceil(clients.value.length / itemsPerPage)
      })
      
      // Методы
      const formatPhone = (phone) => {
        return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5')
      }
      
      const formatDate = (dateString) => {
        if (!dateString) return '—'
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        })
      }
      
      const getVisitProgress = (visits) => {
        if (visits >= 10) return '100%'
        return `${visits * 10}%`
      }
      
      const getLoyaltyLevel = (visits) => {
        if (visits >= 10) return 'VIP'
        if (visits >= 5) return 'Постоянный'
        if (visits >= 2) return 'Новый'
        return 'Первый раз'
      }
      
      const getStatusLabel = (status) => {
        const statuses = {
          regular: 'Постоянный',
          new: 'Новый',
          inactive: 'Неактивный'
        }
        return statuses[status] || status
      }
      
      const getInitials = (name) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase()
      }
      
      const openAddModal = () => {
        formData.value = {
          name: '',
          phone: '',
          email: '',
          birthday: '',
          source: '',
          note: '',
          subscribed: true
        }
        editingClient.value = null
        showModal.value = true
      }
      
      const editClient = (client) => {
        formData.value = {
          name: client.name,
          phone: client.phone,
          email: client.email,
          birthday: client.birthday,
          source: client.source,
          note: client.note,
          subscribed: client.subscribed
        }
        editingClient.value = client.id
        showModal.value = true
      }
      
      const closeModal = () => {
        showModal.value = false
        editingClient.value = null
      }
      
      const saveClient = () => {
        if (editingClient.value) {
          // Редактирование существующего клиента
          const index = clients.value.findIndex(c => c.id === editingClient.value)
          if (index !== -1) {
            clients.value[index] = {
              ...clients.value[index],
              ...formData.value,
              initials: getInitials(formData.value.name)
            }
          }
        } else {
          // Добавление нового клиента
          const newClient = {
            id: Math.max(...clients.value.map(c => c.id)) + 1,
            ...formData.value,
            initials: getInitials(formData.value.name),
            avatarColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][Math.floor(Math.random() * 5)],
            visits: 1,
            lastVisit: new Date().toISOString().split('T')[0],
            lastService: '',
            totalSpent: 0,
            avgSpent: 0,
            status: 'new',
            createdAt: new Date().toISOString().split('T')[0]
          }
          clients.value.push(newClient)
        }
        
        closeModal()
      }
      
      const viewClient = (id) => {
        console.log('Просмотр клиента:', id)
        // Здесь будет открытие подробной информации
      }
      
      const sendNotification = (id) => {
        console.log('Отправка уведомления клиенту:', id)
        // Здесь будет логика отправки
      }
      
      const deleteClient = (id) => {
        if (confirm('Вы уверены, что хотите удалить этого клиента?')) {
          clients.value = clients.value.filter(client => client.id !== id)
        }
      }
      
      const applyFilters = () => {
        currentPage.value = 1
      }
      
      const resetFilters = () => {
        searchQuery.value = ''
        loyaltyFilter.value = 'all'
        dateFrom.value = ''
        dateTo.value = ''
        visitsMin.value = ''
        visitsMax.value = ''
        spentMin.value = ''
        spentMax.value = ''
        showAdvancedFilters.value = false
        currentPage.value = 1
      }
      
      const exportClients = () => {
        console.log('Экспорт клиентов')
      }
      
      const prevPage = () => {
        if (currentPage.value > 1) {
          currentPage.value--
        }
      }
      
      const nextPage = () => {
        if (currentPage.value < totalPages.value) {
          currentPage.value++
        }
      }
      
      onMounted(() => {
        console.log('ClientsAdmin загружен')
      })
      
      return {
        searchQuery,
        sortBy,
        loyaltyFilter,
        showAdvancedFilters,
        currentPage,
        dateFrom,
        dateTo,
        visitsMin,
        visitsMax,
        spentMin,
        spentMax,
        showModal,
        editingClient,
        formData,
        clientStats,
        clients,
        filteredClients,
        totalPages,
        formatPhone,
        formatDate,
        getVisitProgress,
        getLoyaltyLevel,
        getStatusLabel,
        openAddModal,
        editClient,
        closeModal,
        saveClient,
        viewClient,
        sendNotification,
        deleteClient,
        applyFilters,
        resetFilters,
        exportClients,
        prevPage,
        nextPage
      }
    }
  }
  </script>
  
  <style scoped>
  .clients-admin {
    padding: 1rem;
  }
  
  /* Общие стили (аналогично предыдущим) */
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
    /* Аналогично предыдущим компонентам */
  }
  
  /* Секция фильтров */
  .filters-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .filters-row {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .filter-select {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
    min-width: 150px;
  }
  
  .btn-filter {
    padding: 0.5rem 1rem;
    background: #f3f4f6;
    color: var(--text-dark);
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-filter:hover {
    background: #e5e7eb;
  }
  
  /* Расширенные фильтры */
  .advanced-filters {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .filter-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-dark);
  }
  
  .date-range,
  .range-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .date-input,
  .range-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
  }
  
  .btn-apply,
  .btn-reset {
    align-self: flex-end;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-apply {
    background: var(--primary-green);
    color: white;
    border: none;
  }
  
  .btn-apply:hover {
    background: var(--primary-dark);
  }
  
  .btn-reset {
    background: #f3f4f6;
    color: var(--text-dark);
    border: 1px solid #d1d5db;
  }
  
  .btn-reset:hover {
    background: #e5e7eb;
  }
  
  /* Статистика */
  .client-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }
  
  .stat-info h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: var(--text-dark);
  }
  
  .stat-info p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .stat-change {
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: 4px;
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
  }
  
  .stat-change.positive {
    background: #d1fae5;
    color: #065f46;
  }
  
  .stat-change.negative {
    background: #fee2e2;
    color: #991b1b;
  }
  
  /* Таблица клиентов */
  .clients-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    margin-bottom: 1.5rem;
  }
  
  .clients-table table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .clients-table th {
    background: #f8fafc;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #475569;
    font-size: 0.875rem;
    border-bottom: 2px solid #e2e8f0;
  }
  
  .clients-table td {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
  }
  
  .clients-table tbody tr:hover {
    background: #f8fafc;
  }
  
  /* Информация о клиенте */
  .client-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .client-avatar {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: white;
    flex-shrink: 0;
  }
  
  .client-details h4 {
    margin: 0 0 4px 0;
    font-size: 1rem;
    color: var(--text-dark);
  }
  
  .client-note {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.4;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Контакты */
  .client-contacts {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .contact-link {
    color: var(--primary-green);
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.3s ease;
  }
  
  .contact-link:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }
  
  /* Визиты */
  .visits-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .visits-count {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-dark);
    min-width: 30px;
  }
  
  .visits-progress {
    flex: 1;
  }
  
  .progress-bar {
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 4px;
  }
  
  .progress-fill {
    height: 100%;
    background: var(--primary-green);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  /* Последний визит */
  .last-visit {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .visit-date {
    font-weight: 500;
    color: var(--text-dark);
  }
  
  .visit-service {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  /* Потраченная сумма */
  .spent-amount {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .amount {
    font-weight: 600;
    color: var(--primary-green);
    font-size: 1.125rem;
  }
  
  .avg-spent {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  /* Статус клиента */
  .client-status {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  .status-regular {
    background: #dbeafe;
    color: #1e40af;
  }
  
  .status-new {
    background: #fef3c7;
    color: #92400e;
  }
  
  .status-inactive {
    background: #f3f4f6;
    color: #6b7280;
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
  
  /* Нет клиентов */
  .no-clients {
    text-align: center;
    padding: 3rem;
    color: #64748b;
  }
  
  .no-clients p {
    margin-bottom: 1rem;
    font-size: 1rem;
  }
  
  /* Пагинация */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 1rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .pagination button {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
  }
  
  .pagination button:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
  
  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .page-info {
    font-size: 0.875rem;
    color: #64748b;
  }
  
  /* Адаптивность */
  @media (max-width: 1024px) {
    .clients-table {
      overflow-x: auto;
    }
    
    .clients-table table {
      min-width: 1000px;
    }
    
    .advanced-filters {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .filters-row {
      flex-direction: column;
      align-items: stretch;
    }
    
    .filter-select {
      width: 100%;
    }
    
    .client-stats {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .pagination {
      flex-direction: column;
      gap: 1rem;
    }
  }
  </style>