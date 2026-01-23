<template>
    <div class="dashboard">
      <!-- Статистика сверху -->
      <div class="dashboard-header">
        <h1>Дашборд</h1>
        <p>Обзорная панель администратора</p>
      </div>
  
      <!-- Ключевые метрики -->
      <div class="metrics-grid">
        <div class="metric-card" v-for="metric in metrics" :key="metric.label">
          <div class="metric-icon" :style="{ background: metric.color }">
            <span>{{ metric.icon }}</span>
          </div>
          <div class="metric-content">
            <h3>{{ metric.value }}</h3>
            <p>{{ metric.label }}</p>
            <span class="metric-trend" :class="metric.trendClass">
              {{ metric.trend }}%
            </span>
          </div>
        </div>
      </div>
  
      <!-- Графики и статистика -->
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h3>Записи по дням</h3>
            <select v-model="chartPeriod" class="period-select">
              <option value="7d">7 дней</option>
              <option value="30d">30 дней</option>
              <option value="90d">90 дней</option>
            </select>
          </div>
          <div class="chart-container">
            <!-- Здесь будет график -->
            <div class="chart-placeholder">
              <div class="bar-chart">
                <div v-for="(bar, index) in bookingChartData" 
                     :key="index" 
                     class="bar"
                     :style="{ height: bar.height + '%' }"
                     :title="`${bar.day}: ${bar.value} записей`">
                  <span class="bar-label">{{ bar.day }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="chart-card">
          <div class="chart-header">
            <h3>Статусы записей</h3>
          </div>
          <div class="chart-container">
            <div class="pie-chart">
              <div class="pie-chart-visual">
                <div class="pie-segment" 
                     v-for="segment in statusSegments" 
                     :key="segment.status"
                     :style="{
                       '--segment-size': segment.percentage + '%',
                       '--segment-color': segment.color
                     }">
                </div>
              </div>
              <div class="pie-legend">
                <div v-for="segment in statusSegments" 
                     :key="segment.status" 
                     class="legend-item">
                  <span class="legend-color" :style="{ background: segment.color }"></span>
                  <span class="legend-label">{{ segment.label }}</span>
                  <span class="legend-value">{{ segment.value }} ({{ segment.percentage }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Последние записи -->
      <div class="recent-section">
        <div class="section-header">
          <h3>Последние записи</h3>
          <router-link to="/admin/bookings" class="view-all">
            Все записи →
          </router-link>
        </div>
        <div class="recent-bookings">
          <div v-for="booking in recentBookings" :key="booking.id" class="booking-item">
            <div class="booking-info">
              <div class="booking-header">
                <span class="booking-id">#{{ booking.id }}</span>
                <span class="booking-status" :class="`status-${booking.status}`">
                  {{ getStatusLabel(booking.status) }}
                </span>
              </div>
              <div class="booking-details">
                <div class="detail">
                  <span class="detail-label">Клиент:</span>
                  <span class="detail-value">{{ booking.clientName }}</span>
                </div>
                <div class="detail">
                  <span class="detail-label">Услуга:</span>
                  <span class="detail-value">{{ booking.serviceName }}</span>
                </div>
                <div class="detail">
                  <span class="detail-label">Время:</span>
                  <span class="detail-value">{{ formatTime(booking.date, booking.time) }}</span>
                </div>
              </div>
            </div>
            <div class="booking-actions">
              <button class="btn-action" @click="confirmBooking(booking.id)" title="Подтвердить">
                ✓
              </button>
              <button class="btn-action" @click="callClient(booking.clientPhone)" title="Позвонить">
                📞
              </button>
              <router-link :to="`/admin/bookings?edit=${booking.id}`" class="btn-action" title="Редактировать">
                ✎
              </router-link>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Ближайшие записи -->
      <div class="upcoming-section">
        <div class="section-header">
          <h3>Ближайшие записи сегодня</h3>
          <span class="today-date">{{ todayDate }}</span>
        </div>
        <div class="timeline">
          <div v-for="appointment in upcomingAppointments" 
               :key="appointment.id" 
               class="timeline-item"
               :class="`status-${appointment.status}`">
            <div class="timeline-time">{{ appointment.time }}</div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="client-name">{{ appointment.clientName }}</span>
                <span class="service-name">{{ appointment.serviceName }}</span>
              </div>
              <div class="timeline-footer">
                <span class="master-name">Мастер: {{ appointment.masterName }}</span>
                <span class="duration">{{ appointment.duration }} мин</span>
              </div>
            </div>
            <div class="timeline-actions">
              <button class="btn-sm" @click="notifyClient(appointment.id)">
                Напомнить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  
  export default {
    name: 'Dashboard',
    
    setup() {
      const chartPeriod = ref('7d')
      
      // Метрики
      const metrics = ref([
        {
          label: 'Сегодня',
          value: '12',
          icon: '📅',
          color: '#3b82f6',
          trend: '+15',
          trendClass: 'positive'
        },
        {
          label: 'Новые записи',
          value: '8',
          icon: '🆕',
          color: '#10b981',
          trend: '+23',
          trendClass: 'positive'
        },
        {
          label: 'Выручка сегодня',
          value: '24,800 ₽',
          icon: '💰',
          color: '#f59e0b',
          trend: '+18',
          trendClass: 'positive'
        },
        {
          label: 'Средний чек',
          value: '2,067 ₽',
          icon: '📊',
          color: '#8b5cf6',
          trend: '+5',
          trendClass: 'positive'
        }
      ])
  
      // Данные для графика
      const bookingChartData = ref([
        { day: 'Пн', value: 8, height: 80 },
        { day: 'Вт', value: 12, height: 100 },
        { day: 'Ср', value: 10, height: 90 },
        { day: 'Чт', value: 15, height: 100 },
        { day: 'Пт', value: 18, height: 100 },
        { day: 'Сб', value: 20, height: 100 },
        { day: 'Вс', value: 16, height: 95 }
      ])
  
      // Статусы записей
      const statusSegments = ref([
        { status: 'confirmed', label: 'Подтверждено', value: 45, percentage: 45, color: '#3b82f6' },
        { status: 'pending', label: 'Ожидание', value: 25, percentage: 25, color: '#f59e0b' },
        { status: 'completed', label: 'Выполнено', value: 20, percentage: 20, color: '#10b981' },
        { status: 'cancelled', label: 'Отменено', value: 10, percentage: 10, color: '#ef4444' }
      ])
  
      // Последние записи
      const recentBookings = ref([
        {
          id: 156,
          clientName: 'Иванов Иван',
          serviceName: 'Мужская стрижка',
          date: '2024-12-15',
          time: '14:00',
          status: 'confirmed',
          clientPhone: '+79171234567'
        },
        {
          id: 155,
          clientName: 'Петрова Анна',
          serviceName: 'Окрашивание',
          date: '2024-12-15',
          time: '16:30',
          status: 'pending',
          clientPhone: '+79177654321'
        },
        {
          id: 154,
          clientName: 'Сидоров Петр',
          serviceName: 'Стрижка + борода',
          date: '2024-12-14',
          time: '11:00',
          status: 'completed',
          clientPhone: '+79179876543'
        }
      ])
  
      // Ближайшие записи
      const upcomingAppointments = ref([
        {
          id: 1,
          time: '10:00',
          clientName: 'Смирнова Екатерина',
          serviceName: 'Женская стрижка',
          masterName: 'Мария Сидорова',
          duration: 60,
          status: 'confirmed'
        },
        {
          id: 2,
          time: '11:30',
          clientName: 'Козлов Алексей',
          serviceName: 'Мужская стрижка',
          masterName: 'Алексей Петров',
          duration: 45,
          status: 'confirmed'
        },
        {
          id: 3,
          time: '13:00',
          clientName: 'Волкова Ольга',
          serviceName: 'Окрашивание',
          masterName: 'Екатерина Волкова',
          duration: 90,
          status: 'pending'
        }
      ])
  
      // Вычисляемые свойства
      const todayDate = computed(() => {
        return new Date().toLocaleDateString('ru-RU', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        })
      })
  
      // Методы
      const getStatusLabel = (status) => {
        const statuses = {
          pending: 'Ожидание',
          confirmed: 'Подтверждено',
          completed: 'Выполнено',
          cancelled: 'Отменено'
        }
        return statuses[status] || status
      }
  
      const formatTime = (date, time) => {
        const d = new Date(date)
        return `${d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })} в ${time}`
      }
  
      const confirmBooking = (id) => {
        console.log('Подтверждение записи:', id)
        // Здесь будет логика подтверждения
      }
  
      const callClient = (phone) => {
        window.location.href = `tel:${phone}`
      }
  
      const notifyClient = (id) => {
        console.log('Напоминание клиенту:', id)
        // Здесь будет логика отправки напоминания
      }
  
      // Имитация загрузки данных
      onMounted(() => {
        console.log('Dashboard загружен')
      })
  
      return {
        chartPeriod,
        metrics,
        bookingChartData,
        statusSegments,
        recentBookings,
        upcomingAppointments,
        todayDate,
        getStatusLabel,
        formatTime,
        confirmBooking,
        callClient,
        notifyClient
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard {
    padding: 1rem;
  }
  
  .dashboard-header {
    margin-bottom: 2rem;
  }
  
  .dashboard-header h1 {
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }
  
  .dashboard-header p {
    color: var(--text-light);
    font-size: 1rem;
  }
  
  /* Метрики */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .metric-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
  }
  
  .metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  .metric-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }
  
  .metric-content h3 {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: var(--text-dark);
  }
  
  .metric-content p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .metric-trend {
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: 4px;
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
  }
  
  .metric-trend.positive {
    background: #d1fae5;
    color: #065f46;
  }
  
  .metric-trend.negative {
    background: #fee2e2;
    color: #991b1b;
  }
  
  /* Графики */
  .charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .chart-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .chart-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0;
  }
  
  .period-select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
  }
  
  .period-select:focus {
    outline: none;
    border-color: var(--primary-green);
  }
  
  .chart-container {
    height: 250px;
  }
  
  .chart-placeholder {
    height: 100%;
    display: flex;
    align-items: flex-end;
    padding: 1rem 0;
  }
  
  .bar-chart {
    display: flex;
    align-items: flex-end;
    height: 100%;
    width: 100%;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .bar {
    flex: 1;
    background: var(--primary-green);
    border-radius: 4px 4px 0 0;
    min-height: 10px;
    position: relative;
    transition: height 0.3s ease;
  }
  
  .bar:hover {
    opacity: 0.8;
  }
  
  .bar-label {
    position: absolute;
    bottom: -25px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .pie-chart {
    display: flex;
    align-items: center;
    gap: 2rem;
    height: 100%;
  }
  
  .pie-chart-visual {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: conic-gradient(
      var(--segment-color) var(--segment-size),
      transparent var(--segment-size)
    );
    position: relative;
  }
  
  .pie-legend {
    flex: 1;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }
  
  .legend-label {
    flex: 1;
    color: var(--text-dark);
  }
  
  .legend-value {
    color: #6b7280;
    font-weight: 500;
  }
  
  /* Последние записи */
  .recent-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .section-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0;
  }
  
  .view-all {
    color: var(--primary-green);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.3s ease;
  }
  
  .view-all:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }
  
  .recent-bookings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .booking-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .booking-item:hover {
    border-color: var(--primary-green);
    background: #f9fafb;
  }
  
  .booking-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .booking-id {
    font-family: 'Monaco', 'Courier New', monospace;
    font-weight: 600;
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .booking-status {
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 600;
  }
  
  .status-pending { background: #fffbeb; color: #d97706; }
  .status-confirmed { background: #eff6ff; color: #2563eb; }
  .status-completed { background: #f0fdf4; color: #16a34a; }
  
  .booking-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
  }
  
  .detail {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .detail-label {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .detail-value {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-dark);
  }
  
  .booking-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn-action {
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
  
  .btn-action:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }
  
  /* Ближайшие записи */
  .upcoming-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .today-date {
    font-size: 0.875rem;
    color: var(--primary-green);
    font-weight: 500;
  }
  
  .timeline {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .timeline-item {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .timeline-item:hover {
    border-color: var(--primary-green);
    background: #f9fafb;
  }
  
  .timeline-item.status-pending {
    border-left: 4px solid #f59e0b;
  }
  
  .timeline-item.status-confirmed {
    border-left: 4px solid #3b82f6;
  }
  
  .timeline-time {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-dark);
    min-width: 60px;
  }
  
  .timeline-content {
    flex: 1;
  }
  
  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .client-name {
    font-weight: 500;
    color: var(--text-dark);
  }
  
  .service-name {
    font-size: 0.875rem;
    color: #6b7280;
    background: #f3f4f6;
    padding: 2px 8px;
    border-radius: 12px;
  }
  
  .timeline-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .duration {
    font-weight: 500;
    color: var(--primary-green);
  }
  
  .btn-sm {
    padding: 0.375rem 0.75rem;
    background: var(--primary-green);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-sm:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
  
  /* Адаптивность */
  @media (max-width: 1200px) {
    .charts-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    
    .booking-details {
      grid-template-columns: 1fr;
    }
    
    .timeline-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .timeline-actions {
      align-self: flex-end;
    }
  }
  </style>