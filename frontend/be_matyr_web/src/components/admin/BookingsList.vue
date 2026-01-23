<template>
    <div class="bookings-list">
      <!-- Фильтры и поиск -->
      <div class="filters-bar">
        <div class="search-box">
          <input type="text" 
                 v-model="searchQuery" 
                 placeholder="Поиск по имени, телефону или услуге..."
                 class="search-input">
          <button class="search-btn">
            <i class="icon icon-search">🔍</i>
          </button>
        </div>
        
        <div class="filter-actions">
          <select v-model="statusFilter" class="filter-select">
            <option value="">Все статусы</option>
            <option value="pending">Ожидание</option>
            <option value="confirmed">Подтверждено</option>
            <option value="completed">Выполнено</option>
            <option value="cancelled">Отменено</option>
          </select>
          
          <select v-model="dateFilter" class="filter-select">
            <option value="all">Все дни</option>
            <option value="today">Сегодня</option>
            <option value="tomorrow">Завтра</option>
            <option value="week">Эта неделя</option>
          </select>
          
          <button class="btn btn-primary" @click="refreshData">
            Обновить
          </button>
          
          <button class="btn btn-outline" @click="exportData('csv')">
            Экспорт CSV
          </button>
        </div>
      </div>
  
      <!-- Статистика -->
      <div class="stats-grid">
        <div class="stat-card" v-for="stat in quickStats" :key="stat.label">
          <div class="stat-icon" :style="{ background: stat.color }">
            <span>{{ stat.icon }}</span>
          </div>
          <div class="stat-info">
            <h3>{{ stat.value }}</h3>
            <p>{{ stat.label }}</p>
          </div>
        </div>
      </div>
  
      <!-- Таблица записей -->
      <div class="bookings-table-container">
        <table class="bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Услуга</th>
              <th>Мастер</th>
              <th>Дата и время</th>
              <th>Статус</th>
              <th>Цена</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in filteredBookings" :key="booking.id">
              <td class="booking-id">#{{ booking.id }}</td>
              <td>
                <div class="client-info">
                  <p class="client-name">{{ booking.clientName }}</p>
                  <p class="client-phone">{{ booking.clientPhone }}</p>
                </div>
              </td>
              <td>{{ booking.serviceName }}</td>
              <td>{{ booking.masterName }}</td>
              <td>
                <div class="datetime">
                  <span class="date">{{ formatDate(booking.date) }}</span>
                  <span class="time">{{ booking.time }}</span>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="`status-${booking.status}`">
                  {{ getStatusLabel(booking.status) }}
                </span>
              </td>
              <td class="price">{{ booking.price }} ₽</td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon" @click="$emit('update-booking', booking)" title="Редактировать">
                    <i class="icon icon-edit">✏️</i>
                  </button>
                  <button class="btn-icon" @click="confirmBooking(booking.id)" title="Подтвердить">
                    <i class="icon icon-check">✅</i>
                  </button>
                  <button class="btn-icon btn-danger" 
                          @click="$emit('delete-booking', booking.id)"
                          title="Удалить">
                    <i class="icon icon-delete">🗑️</i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredBookings.length === 0" class="no-data">
          <p>Записи не найдены</p>
        </div>
      </div>
  
      <!-- Пагинация -->
      <div class="pagination" v-if="totalPages > 1">
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
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue'
  
  export default {
    name: 'BookingsList',
    props: {
      bookings: Array,
      stats: Object
    },
    emits: ['update-booking', 'delete-booking', 'export-data'],
    
    setup(props, { emit }) {
      const searchQuery = ref('')
      const statusFilter = ref('')
      const dateFilter = ref('all')
      const currentPage = ref(1)
      const itemsPerPage = 10
  
      // Быстрая статистика
      const quickStats = computed(() => [
        {
          label: 'Сегодня',
          value: props.stats.todayBookings,
          icon: '📅',
          color: '#3b82f6'
        },
        {
          label: 'Новые',
          value: props.stats.newBookings,
          icon: '🆕',
          color: '#10b981'
        },
        {
          label: 'Выполнено',
          value: Math.round(props.stats.totalBookings * 0.75),
          icon: '✅',
          color: '#8b5cf6'
        },
        {
          label: 'Выручка',
          value: `${(props.stats.totalRevenue / 1000).toFixed(0)}K ₽`,
          icon: '💰',
          color: '#f59e0b'
        }
      ])
  
      // Фильтрация записей
      const filteredBookings = computed(() => {
        let filtered = [...props.bookings]
  
        // Поиск
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase()
          filtered = filtered.filter(booking =>
            booking.clientName.toLowerCase().includes(query) ||
            booking.clientPhone.includes(query) ||
            booking.serviceName.toLowerCase().includes(query)
          )
        }
  
        // Фильтр по статусу
        if (statusFilter.value) {
          filtered = filtered.filter(booking => booking.status === statusFilter.value)
        }
  
        // Фильтр по дате
        if (dateFilter.value !== 'all') {
          const today = new Date()
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.date)
            switch (dateFilter.value) {
              case 'today':
                return bookingDate.toDateString() === today.toDateString()
              case 'tomorrow':
                const tomorrow = new Date(today)
                tomorrow.setDate(tomorrow.getDate() + 1)
                return bookingDate.toDateString() === tomorrow.toDateString()
              case 'week':
                const weekEnd = new Date(today)
                weekEnd.setDate(weekEnd.getDate() + 7)
                return bookingDate >= today && bookingDate <= weekEnd
              default:
                return true
            }
          })
        }
  
        // Пагинация
        const start = (currentPage.value - 1) * itemsPerPage
        const end = start + itemsPerPage
        return filtered.slice(start, end)
      })
  
      const totalPages = computed(() => {
        return Math.ceil(props.bookings.length / itemsPerPage)
      })
  
      // Методы
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit'
        })
      }
  
      const getStatusLabel = (status) => {
        const statuses = {
          pending: 'Ожидание',
          confirmed: 'Подтверждено',
          completed: 'Выполнено',
          cancelled: 'Отменено',
          'no-show': 'Не пришел'
        }
        return statuses[status] || status
      }
  
      const confirmBooking = (id) => {
        // Здесь будет API запрос для подтверждения
        console.log('Подтверждение записи:', id)
      }
  
      const refreshData = () => {
        // Здесь будет обновление данных
        console.log('Обновление данных')
      }
  
      const exportData = (format) => {
        emit('export-data', format)
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
  
      return {
        searchQuery,
        statusFilter,
        dateFilter,
        currentPage,
        quickStats,
        filteredBookings,
        totalPages,
        formatDate,
        getStatusLabel,
        confirmBooking,
        refreshData,
        exportData,
        prevPage,
        nextPage
      }
    }
  }
  </script>
  
  <style scoped>
  .bookings-list {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .filters-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .search-box {
    display: flex;
    flex: 1;
    min-width: 300px;
    max-width: 400px;
  }
  
  .search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-right: none;
    border-radius: 8px 0 0 8px;
    font-size: 0.875rem;
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
  
  .filter-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .filter-select {
    padding: 0.625rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
  }
  
  .filter-select:focus {
    outline: none;
    border-color: var(--primary-green);
  }
  
  /* Статистика */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: #f8fafc;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    border: 1px solid #e2e8f0;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
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
    color: #64748b;
    font-size: 0.875rem;
  }
  
  /* Таблица */
  .bookings-table-container {
    overflow-x: auto;
    margin-bottom: 2rem;
  }
  
  .bookings-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .bookings-table thead {
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
  }
  
  .bookings-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #475569;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .bookings-table td {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
  }
  
  .bookings-table tbody tr:hover {
    background: #f8fafc;
  }
  
  .booking-id {
    font-family: 'Monaco', 'Courier New', monospace;
    font-weight: 600;
    color: #64748b;
  }
  
  .client-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .client-name {
    font-weight: 500;
    color: var(--text-dark);
  }
  
  .client-phone {
    font-size: 0.875rem;
    color: #64748b;
  }
  
  .datetime {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .date {
    font-weight: 500;
  }
  
  .time {
    font-size: 0.875rem;
    color: #64748b;
  }
  
  .status-badge {
    display: inline-block;
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  .status-pending { background: #fffbeb; color: #d97706; }
  .status-confirmed { background: #eff6ff; color: #2563eb; }
  .status-completed { background: #f0fdf4; color: #16a34a; }
  .status-cancelled { background: #fef2f2; color: #dc2626; }
  .status-no-show { background: #f1f5f9; color: #475569; }
  
  .price {
    font-weight: 600;
    color: var(--primary-dark);
  }
  
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
  
  .no-data {
    text-align: center;
    padding: 3rem;
    color: #64748b;
    font-size: 1rem;
  }
  
  /* Пагинация */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 1rem;
    border-top: 1px solid #e2e8f0;
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
    .filters-bar {
      flex-direction: column;
      align-items: stretch;
    }
    
    .search-box {
      max-width: 100%;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .filter-actions {
      flex-direction: column;
    }
    
    .bookings-table {
      font-size: 0.875rem;
    }
    
    .bookings-table th,
    .bookings-table td {
      padding: 0.75rem;
    }
    
    .action-buttons {
      flex-direction: column;
    }
  }
  </style>