<template>
    <div class="schedule-admin">
      <!-- Заголовок и управление -->
      <div class="admin-header">
        <div class="header-left">
          <h1>Расписание</h1>
          <p>Управление расписанием мастеров</p>
        </div>
        <div class="header-right">
          <div class="date-navigation">
            <button class="btn-nav" @click="prevWeek">
              ←
            </button>
            <h2 class="current-week">{{ weekRange }}</h2>
            <button class="btn-nav" @click="nextWeek">
              →
            </button>
          </div>
          <button class="btn btn-primary" @click="openBulkEdit">
            📅 Массовое редактирование
          </button>
        </div>
      </div>
  
      <!-- Фильтры и представления -->
      <div class="controls">
        <div class="view-controls">
          <button class="view-btn" :class="{ active: view === 'day' }" @click="view = 'day'">
            День
          </button>
          <button class="view-btn" :class="{ active: view === 'week' }" @click="view = 'week'">
            Неделя
          </button>
          <button class="view-btn" :class="{ active: view === 'month' }" @click="view = 'month'">
            Месяц
          </button>
        </div>
        
        <div class="filter-controls">
          <select v-model="selectedMaster" class="filter-select">
            <option value="all">Все мастера</option>
            <option v-for="master in masters" :key="master.id" :value="master.id">
              {{ master.name }}
            </option>
          </select>
          
          <button class="btn-filter" @click="toggleDayOff">
            🏖️ Выходной
          </button>
          
          <button class="btn-print" @click="printSchedule">
            🖨️ Печать
          </button>
        </div>
      </div>
  
      <!-- Расписание на день -->
      <div v-if="view === 'day'" class="day-schedule">
        <div class="day-header">
          <h3>{{ formatDate(currentDate) }}</h3>
          <div class="day-stats">
            <span class="stat">Записей: {{ dayStats.bookings }}</span>
            <span class="stat">Занято: {{ dayStats.occupied }} ч</span>
            <span class="stat">Свободно: {{ dayStats.free }} ч</span>
          </div>
        </div>
        
        <div class="timeline">
          <div class="time-slots">
            <div v-for="hour in hours" :key="hour" class="time-slot">
              {{ hour }}:00
            </div>
          </div>
          
          <div class="master-columns">
            <div v-for="master in filteredMasters" :key="master.id" class="master-column">
              <div class="master-header">
                <div class="master-info">
                  <div class="master-avatar" :style="{ background: master.avatarColor }">
                    {{ master.initials }}
                  </div>
                  <div>
                    <h4>{{ master.name }}</h4>
                    <p class="specialization">{{ master.specialization }}</p>
                  </div>
                </div>
                <div class="master-day-stats">
                  <span class="stat">{{ master.dayStats.bookings }} зап.</span>
                  <span class="stat">{{ master.dayStats.hours }} ч</span>
                </div>
              </div>
              
              <div class="time-cells">
                <div v-for="hour in hours" 
                     :key="hour" 
                     class="time-cell"
                     :class="getCellClass(master.id, hour)"
                     @click="openTimeSlot(master.id, hour)"
                     @dragover.prevent
                     @drop="handleDrop($event, master.id, hour)">
                  <div v-for="booking in getBookingsForSlot(master.id, hour)" 
                       :key="booking.id"
                       class="booking-event"
                       :style="{ background: booking.color }"
                       @click.stop="viewBooking(booking)"
                       draggable="true"
                       @dragstart="handleDragStart($event, booking)">
                    <div class="booking-content">
                      <span class="booking-time">{{ booking.time }}</span>
                      <span class="booking-client">{{ booking.clientName }}</span>
                      <span class="booking-service">{{ booking.serviceName }}</span>
                    </div>
                    <span class="booking-status" :class="`status-${booking.status}`">
                      {{ getStatusIcon(booking.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Расписание на неделю -->
      <div v-else-if="view === 'week'" class="week-schedule">
        <div class="week-header">
          <div class="corner"></div>
          <div v-for="day in weekDays" :key="day.date" class="day-header">
            <div class="day-name">{{ day.name }}</div>
            <div class="day-date">{{ day.date }}</div>
          </div>
        </div>
        
        <div class="week-body">
          <div class="time-column">
            <div v-for="hour in hours" :key="hour" class="hour-label">
              {{ hour }}:00
            </div>
          </div>
          
          <div v-for="master in filteredMasters" :key="master.id" class="master-week">
            <div class="master-row-header">
              <div class="master-info">
                <div class="master-avatar" :style="{ background: master.avatarColor }">
                  {{ master.initials }}
                </div>
                <div>
                  <h4>{{ master.name }}</h4>
                  <p class="specialization">{{ master.specialization }}</p>
                </div>
              </div>
            </div>
            
            <div class="day-columns">
              <div v-for="day in weekDays" :key="day.date" class="day-column">
                <div v-for="hour in hours" 
                     :key="hour" 
                     class="time-cell"
                     :class="getCellClass(master.id, hour, day.date)"
                     @click="openTimeSlot(master.id, hour, day.date)">
                  <div v-for="booking in getBookingsForSlot(master.id, hour, day.date)" 
                       :key="booking.id"
                       class="booking-event"
                       :style="{ background: booking.color }"
                       @click.stop="viewBooking(booking)">
                    <div class="booking-content">
                      <span class="booking-client">{{ booking.clientName }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Месячное расписание -->
      <div v-else class="month-schedule">
        <div class="month-header">
          <div class="month-name">{{ monthName }}</div>
          <div class="month-stats">
            <span class="stat">Записей: {{ monthStats.bookings }}</span>
            <span class="stat">Выручка: {{ monthStats.revenue }}K ₽</span>
          </div>
        </div>
        
        <div class="calendar">
          <div class="weekdays">
            <div v-for="day in ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']" :key="day" class="weekday">
              {{ day }}
            </div>
          </div>
          
          <div class="days-grid">
            <div v-for="day in calendarDays" :key="day.date" class="day-cell"
                 :class="{ 'current-month': day.currentMonth, 'today': day.isToday }">
              <div class="day-header">
                <span class="day-number">{{ day.number }}</span>
                <span class="day-name">{{ day.name }}</span>
              </div>
              
              <div class="day-bookings">
                <div v-for="booking in getDayBookings(day.date)" 
                     :key="booking.id"
                     class="booking-preview"
                     :style="{ borderLeftColor: booking.color }"
                     @click="viewBooking(booking)">
                  <span class="booking-time">{{ booking.time }}</span>
                  <span class="booking-client">{{ booking.clientName }}</span>
                </div>
              </div>
              
              <div class="day-stats">
                <span class="stat">{{ getDayStats(day.date).bookings }} зап.</span>
                <span class="stat">{{ getDayStats(day.date).hours }} ч</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Модальное окно записи -->
      <div class="modal-overlay" v-if="showBookingModal" @click.self="closeBookingModal">
        <div class="modal">
          <div class="modal-header">
            <h3>Запись</h3>
            <button class="modal-close" @click="closeBookingModal">×</button>
          </div>
          
          <div class="modal-body">
            <div v-if="selectedBooking" class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Клиент:</span>
                <span class="detail-value">{{ selectedBooking.clientName }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Телефон:</span>
                <a :href="`tel:${selectedBooking.clientPhone}`" class="detail-value link">
                  {{ selectedBooking.clientPhone }}
                </a>
              </div>
              <div class="detail-row">
                <span class="detail-label">Услуга:</span>
                <span class="detail-value">{{ selectedBooking.serviceName }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Мастер:</span>
                <span class="detail-value">{{ selectedBooking.masterName }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Время:</span>
                <span class="detail-value">{{ selectedBooking.date }} в {{ selectedBooking.time }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Длительность:</span>
                <span class="detail-value">{{ selectedBooking.duration }} минут</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Статус:</span>
                <span class="detail-value">
                  <select v-model="selectedBooking.status" class="status-select">
                    <option value="pending">Ожидание</option>
                    <option value="confirmed">Подтверждено</option>
                    <option value="completed">Выполнено</option>
                    <option value="cancelled">Отменено</option>
                  </select>
                </span>
              </div>
              <div class="detail-row" v-if="selectedBooking.comment">
                <span class="detail-label">Комментарий:</span>
                <span class="detail-value">{{ selectedBooking.comment }}</span>
              </div>
            </div>
            
            <div class="modal-actions">
              <button class="btn btn-secondary" @click="closeBookingModal">
                Закрыть
              </button>
              <button class="btn btn-primary" @click="saveBookingChanges">
                Сохранить
              </button>
              <button class="btn btn-danger" @click="cancelBooking">
                Отменить запись
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Модальное окно слота времени -->
      <div class="modal-overlay" v-if="showSlotModal" @click.self="closeSlotModal">
        <div class="modal">
          <div class="modal-header">
            <h3>Добавить запись</h3>
            <button class="modal-close" @click="closeSlotModal">×</button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="addBookingToSlot">
              <div class="form-group">
                <label>Мастер</label>
                <select v-model="slotData.masterId" required class="form-select">
                  <option v-for="master in masters" :key="master.id" :value="master.id">
                    {{ master.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label>Дата</label>
                  <input type="date" v-model="slotData.date" required class="form-input">
                </div>
                
                <div class="form-group">
                  <label>Время</label>
                  <select v-model="slotData.time" required class="form-select">
                    <option v-for="time in timeOptions" :key="time" :value="time">
                      {{ time }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label>Клиент</label>
                <div class="client-selector">
                  <select v-model="slotData.clientId" class="form-select">
                    <option value="">Новый клиент</option>
                    <option v-for="client in clients" :key="client.id" :value="client.id">
                      {{ client.name }} ({{ client.phone }})
                    </option>
                  </select>
                  <button type="button" class="btn-icon" @click="openAddClient">
                    +
                  </button>
                </div>
              </div>
              
              <div v-if="slotData.clientId === ''" class="new-client-form">
                <div class="form-group">
                  <label>Имя клиента *</label>
                  <input type="text" v-model="newClient.name" required class="form-input">
                </div>
                
                <div class="form-group">
                  <label>Телефон *</label>
                  <input type="tel" v-model="newClient.phone" required class="form-input">
                </div>
              </div>
              
              <div class="form-group">
                <label>Услуга</label>
                <select v-model="slotData.serviceId" required class="form-select">
                  <option v-for="service in services" :key="service.id" :value="service.id">
                    {{ service.name }} ({{ service.duration }} мин)
                  </option>
                </select>
              </div>
              
              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" @click="closeSlotModal">
                  Отмена
                </button>
                <button type="submit" class="btn btn-primary">
                  Создать запись
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
    name: 'ScheduleAdmin',
    
    setup() {
      const view = ref('week')
      const currentDate = ref(new Date())
      const selectedMaster = ref('all')
      const showBookingModal = ref(false)
      const showSlotModal = ref(false)
      
      const selectedBooking = ref(null)
      const slotData = ref({
        masterId: '',
        date: '',
        time: '10:00',
        clientId: '',
        serviceId: ''
      })
      
      const newClient = ref({
        name: '',
        phone: ''
      })
      
      const draggingBooking = ref(null)
      
      // Часы работы
      const hours = ref([9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
      const timeOptions = ref([
        '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
      ])
      
      // Мастера
      const masters = ref([
        {
          id: 1,
          name: 'Алексей Петров',
          specialization: 'Мужской стилист',
          initials: 'АП',
          avatarColor: '#3b82f6',
          schedule: {
            monday: { start: '09:00', end: '19:00', working: true },
            tuesday: { start: '09:00', end: '19:00', working: true },
            wednesday: { start: '09:00', end: '19:00', working: true },
            thursday: { start: '09:00', end: '19:00', working: true },
            friday: { start: '09:00', end: '19:00', working: true },
            saturday: { start: '10:00', end: '18:00', working: true },
            sunday: { start: '10:00', end: '17:00', working: false }
          }
        },
        {
          id: 2,
          name: 'Мария Сидорова',
          specialization: 'Женский стилист',
          initials: 'МС',
          avatarColor: '#10b981',
          schedule: {
            monday: { start: '10:00', end: '20:00', working: true },
            tuesday: { start: '10:00', end: '20:00', working: true },
            wednesday: { start: '10:00', end: '20:00', working: true },
            thursday: { start: '10:00', end: '20:00', working: true },
            friday: { start: '10:00', end: '20:00', working: true },
            saturday: { start: '10:00', end: '18:00', working: true },
            sunday: { start: '10:00', end: '17:00', working: false }
          }
        }
      ])
      
      // Записи
      const bookings = ref([
        {
          id: 1,
          masterId: 1,
          masterName: 'Алексей Петров',
          clientId: 1,
          clientName: 'Иванов Иван',
          clientPhone: '+79171234567',
          serviceId: 1,
          serviceName: 'Мужская стрижка',
          date: '2024-12-16',
          time: '14:00',
          duration: 45,
          status: 'confirmed',
          color: '#3b82f6',
          comment: ''
        },
        {
          id: 2,
          masterId: 2,
          masterName: 'Мария Сидорова',
          clientId: 2,
          clientName: 'Смирнова Анна',
          clientPhone: '+79177654321',
          serviceId: 2,
          serviceName: 'Женская стрижка',
          date: '2024-12-16',
          time: '16:30',
          duration: 60,
          status: 'pending',
          color: '#10b981',
          comment: ''
        }
      ])
      
      // Услуги и клиенты
      const services = ref([
        { id: 1, name: 'Мужская стрижка', duration: 45, price: 800 },
        { id: 2, name: 'Женская стрижка', duration: 60, price: 1500 }
      ])
      
      const clients = ref([
        { id: 1, name: 'Иванов Иван', phone: '+79171234567' },
        { id: 2, name: 'Смирнова Анна', phone: '+79177654321' }
      ])
      
      // Вычисляемые свойства
      const filteredMasters = computed(() => {
        if (selectedMaster.value === 'all') {
          return masters.value
        }
        return masters.value.filter(master => master.id == selectedMaster.value)
      })
      
      const weekDays = computed(() => {
        const days = []
        const start = new Date(currentDate.value)
        start.setDate(start.getDate() - start.getDay() + 1) // Начало недели с понедельника
        
        for (let i = 0; i < 7; i++) {
          const date = new Date(start)
          date.setDate(start.getDate() + i)
          
          days.push({
            name: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
            date: date.toISOString().split('T')[0],
            fullDate: date
          })
        }
        
        return days
      })
      
      const weekRange = computed(() => {
        const start = weekDays.value[0].fullDate
        const end = weekDays.value[6].fullDate
        
        return `${start.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })}`
      })
      
      const monthName = computed(() => {
        return currentDate.value.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
      })
      
      const calendarDays = computed(() => {
        const year = currentDate.value.getFullYear()
        const month = currentDate.value.getMonth()
        
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        
        const days = []
        
        // Дни предыдущего месяца
        const firstDayOfWeek = firstDay.getDay() || 7 // 1 = понедельник, 7 = воскресенье
        for (let i = firstDayOfWeek - 1; i > 0; i--) {
          const date = new Date(firstDay)
          date.setDate(firstDay.getDate() - i)
          days.push({
            date: date.toISOString().split('T')[0],
            number: date.getDate(),
            name: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
            currentMonth: false,
            isToday: false
          })
        }
        
        // Дни текущего месяца
        const today = new Date().toISOString().split('T')[0]
        for (let i = 1; i <= lastDay.getDate(); i++) {
          const date = new Date(year, month, i)
          const dateStr = date.toISOString().split('T')[0]
          days.push({
            date: dateStr,
            number: i,
            name: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
            currentMonth: true,
            isToday: dateStr === today
          })
        }
        
        // Дни следующего месяца
        const totalCells = 42 // 6 недель * 7 дней
        const remaining = totalCells - days.length
        for (let i = 1; i <= remaining; i++) {
          const date = new Date(lastDay)
          date.setDate(lastDay.getDate() + i)
          days.push({
            date: date.toISOString().split('T')[0],
            number: date.getDate(),
            name: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
            currentMonth: false,
            isToday: false
          })
        }
        
        return days
      })
      
      const dayStats = computed(() => {
        const dateStr = currentDate.value.toISOString().split('T')[0]
        const dayBookings = bookings.value.filter(b => b.date === dateStr)
        
        const totalHours = 10 // 9:00-19:00
        const occupiedHours = dayBookings.reduce((total, booking) => {
          return total + (booking.duration / 60)
        }, 0)
        
        return {
          bookings: dayBookings.length,
          occupied: occupiedHours.toFixed(1),
          free: (totalHours - occupiedHours).toFixed(1)
        }
      })
      
      const monthStats = computed(() => {
        const monthStart = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1)
        const monthEnd = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)
        
        const monthBookings = bookings.value.filter(b => {
          const bookingDate = new Date(b.date)
          return bookingDate >= monthStart && bookingDate <= monthEnd
        })
        
        const revenue = monthBookings.reduce((total, booking) => {
          const service = services.value.find(s => s.id === booking.serviceId)
          return total + (service ? service.price : 0)
        }, 0)
        
        return {
          bookings: monthBookings.length,
          revenue: (revenue / 1000).toFixed(1)
        }
      })
      
      // Методы
      const formatDate = (date) => {
        return date.toLocaleDateString('ru-RU', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        })
      }
      
      const getCellClass = (masterId, hour, date = null) => {
        const dateStr = date || currentDate.value.toISOString().split('T')[0]
        const dayName = new Date(dateStr).toLocaleDateString('ru-RU', { weekday: 'long' }).toLowerCase()
        
        const master = masters.value.find(m => m.id === masterId)
        if (!master || !master.schedule[dayName] || !master.schedule[dayName].working) {
          return 'unavailable'
        }
        
        const schedule = master.schedule[dayName]
        const startHour = parseInt(schedule.start.split(':')[0])
        const endHour = parseInt(schedule.end.split(':')[0])
        
        if (hour < startHour || hour >= endHour) {
          return 'unavailable'
        }
        
        const hasBooking = bookings.value.some(b => 
          b.masterId === masterId && 
          b.date === dateStr &&
          parseInt(b.time.split(':')[0]) === hour
        )
        
        return hasBooking ? 'booked' : 'available'
      }
      
      const getBookingsForSlot = (masterId, hour, date = null) => {
        const dateStr = date || currentDate.value.toISOString().split('T')[0]
        return bookings.value.filter(b => 
          b.masterId === masterId && 
          b.date === dateStr &&
          parseInt(b.time.split(':')[0]) === hour
        )
      }
      
      const getDayBookings = (date) => {
        return bookings.value.filter(b => b.date === date)
          .sort((a, b) => a.time.localeCompare(b.time))
      }
      
      const getDayStats = (date) => {
        const dayBookings = getDayBookings(date)
        const hours = dayBookings.reduce((total, booking) => {
          return total + (booking.duration / 60)
        }, 0)
        
        return {
          bookings: dayBookings.length,
          hours: hours.toFixed(1)
        }
      }
      
      const getStatusIcon = (status) => {
        const icons = {
          pending: '⏳',
          confirmed: '✅',
          completed: '✓',
          cancelled: '❌'
        }
        return icons[status] || '⏳'
      }
      
      const prevWeek = () => {
        const date = new Date(currentDate.value)
        date.setDate(date.getDate() - 7)
        currentDate.value = date
      }
      
      const nextWeek = () => {
        const date = new Date(currentDate.value)
        date.setDate(date.getDate() + 7)
        currentDate.value = date
      }
      
      const toggleDayOff = () => {
        console.log('Переключение выходного дня')
      }
      
      const printSchedule = () => {
        window.print()
      }
      
      const openBulkEdit = () => {
        console.log('Массовое редактирование')
      }
      
      const openTimeSlot = (masterId, hour, date = null) => {
        const dateStr = date || currentDate.value.toISOString().split('T')[0]
        slotData.value = {
          masterId: masterId,
          date: dateStr,
          time: `${hour}:00`,
          clientId: '',
          serviceId: services.value[0]?.id || ''
        }
        showSlotModal.value = true
      }
      
      const closeSlotModal = () => {
        showSlotModal.value = false
        slotData.value = {
          masterId: '',
          date: '',
          time: '10:00',
          clientId: '',
          serviceId: ''
        }
        newClient.value = { name: '', phone: '' }
      }
      
      const openAddClient = () => {
        slotData.value.clientId = ''
      }
      
      const addBookingToSlot = () => {
        const service = services.value.find(s => s.id === slotData.value.serviceId)
        const master = masters.value.find(m => m.id === slotData.value.masterId)
        
        if (!service || !master) return
        
        let clientId = slotData.value.clientId
        let clientName = ''
        let clientPhone = ''
        
        if (clientId === '') {
          // Создание нового клиента
          const newClientId = Math.max(...clients.value.map(c => c.id)) + 1
          clientId = newClientId
          clientName = newClient.value.name
          clientPhone = newClient.value.phone
          
          clients.value.push({
            id: newClientId,
            name: clientName,
            phone: clientPhone
          })
        } else {
          // Использование существующего клиента
          const client = clients.value.find(c => c.id == clientId)
          if (client) {
            clientName = client.name
            clientPhone = client.phone
          }
        }
        
        // Проверка на конфликты времени
        const conflictingBooking = bookings.value.find(b =>
          b.masterId === slotData.value.masterId &&
          b.date === slotData.value.date &&
          b.time === slotData.value.time
        )
        
        if (conflictingBooking) {
          alert('Это время уже занято!')
          return
        }
        
        const newBooking = {
          id: Math.max(...bookings.value.map(b => b.id)) + 1,
          masterId: slotData.value.masterId,
          masterName: master.name,
          clientId: clientId,
          clientName: clientName,
          clientPhone: clientPhone,
          serviceId: service.id,
          serviceName: service.name,
          date: slotData.value.date,
          time: slotData.value.time,
          duration: service.duration,
          status: 'pending',
          color: master.avatarColor,
          comment: ''
        }
        
        bookings.value.push(newBooking)
        closeSlotModal()
      }
      
      const viewBooking = (booking) => {
        selectedBooking.value = { ...booking }
        showBookingModal.value = true
      }
      
      const closeBookingModal = () => {
        showBookingModal.value = false
        selectedBooking.value = null
      }
      
      const saveBookingChanges = () => {
        if (selectedBooking.value) {
          const index = bookings.value.findIndex(b => b.id === selectedBooking.value.id)
          if (index !== -1) {
            bookings.value[index] = selectedBooking.value
          }
        }
        closeBookingModal()
      }
      
      const cancelBooking = () => {
        if (selectedBooking.value && confirm('Вы уверены, что хотите отменить эту запись?')) {
          selectedBooking.value.status = 'cancelled'
          saveBookingChanges()
        }
      }
      
      const handleDragStart = (event, booking) => {
        draggingBooking.value = booking
        event.dataTransfer.setData('text/plain', booking.id.toString())
      }
      
      const handleDrop = (event, masterId, hour) => {
        event.preventDefault()
        if (!draggingBooking.value) return
        
        const dateStr = currentDate.value.toISOString().split('T')[0]
        
        // Проверка на конфликты
        const conflictingBooking = bookings.value.find(b =>
          b.masterId === masterId &&
          b.date === dateStr &&
          b.time === `${hour}:00` &&
          b.id !== draggingBooking.value.id
        )
        
        if (conflictingBooking) {
          alert('Это время уже занято!')
          return
        }
        
        // Обновление записи
        const index = bookings.value.findIndex(b => b.id === draggingBooking.value.id)
        if (index !== -1) {
          bookings.value[index] = {
            ...bookings.value[index],
            masterId: masterId,
            date: dateStr,
            time: `${hour}:00`
          }
        }
        
        draggingBooking.value = null
      }
      
      onMounted(() => {
        // Установка текущей даты для форм
        slotData.value.date = currentDate.value.toISOString().split('T')[0]
      })
      
      return {
        view,
        currentDate,
        selectedMaster,
        showBookingModal,
        showSlotModal,
        selectedBooking,
        slotData,
        newClient,
        hours,
        timeOptions,
        masters,
        bookings,
        services,
        clients,
        filteredMasters,
        weekDays,
        weekRange,
        monthName,
        calendarDays,
        dayStats,
        monthStats,
        formatDate,
        getCellClass,
        getBookingsForSlot,
        getDayBookings,
        getDayStats,
        getStatusIcon,
        prevWeek,
        nextWeek,
        toggleDayOff,
        printSchedule,
        openBulkEdit,
        openTimeSlot,
        closeSlotModal,
        openAddClient,
        addBookingToSlot,
        viewBooking,
        closeBookingModal,
        saveBookingChanges,
        cancelBooking,
        handleDragStart,
        handleDrop
      }
    }
  }
  </script>
  
  <style scoped>
  .schedule-admin {
    padding: 1rem;
  }
  
  /* Общие стили (аналогично предыдущим) */
  .admin-header,
  .btn,
  .modal-overlay,
  .modal,
  .modal-header,
  .modal-close,
  .modal-body,
  .modal-actions,
  .btn-secondary,
  .btn-primary,
  .btn-danger {
    /* Аналогично предыдущим компонентам */
  }
  
  /* Навигация по датам */
  .date-navigation {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .btn-nav {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    transition: all 0.3s ease;
  }
  
  .btn-nav:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
  
  .current-week {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0;
    min-width: 200px;
    text-align: center;
  }
  
  /* Управление представлениями */
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
    background: white;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .view-controls {
    display: flex;
    gap: 0.5rem;
  }
  
  .view-btn {
    padding: 0.5rem 1rem;
    background: #f3f4f6;
    color: var(--text-dark);
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .view-btn:hover {
    background: #e5e7eb;
  }
  
  .view-btn.active {
    background: var(--primary-green);
    color: white;
    border-color: var(--primary-green);
  }
  
  .filter-controls {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
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
  
  .btn-filter,
  .btn-print {
    padding: 0.5rem 1rem;
    background: #f3f4f6;
    color: var(--text-dark);
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-filter:hover,
  .btn-print:hover {
    background: #e5e7eb;
  }
  
  /* Расписание на день */
  .day-schedule {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .day-header {
    padding: 1rem 1.5rem;
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .day-header h3 {
    margin: 0;
    font-size: 1.125rem;
    color: var(--text-dark);
  }
  
  .day-stats {
    display: flex;
    gap: 1rem;
  }
  
  .stat {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .timeline {
    display: flex;
    min-height: 500px;
  }
  
  .time-slots {
    width: 80px;
    border-right: 1px solid #e5e7eb;
    background: #f8fafc;
  }
  
  .time-slot {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .master-columns {
    flex: 1;
    display: flex;
    overflow-x: auto;
  }
  
  .master-column {
    flex: 1;
    min-width: 200px;
    border-right: 1px solid #e5e7eb;
  }
  
  .master-column:last-child {
    border-right: none;
  }
  
  .master-header {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f8fafc;
  }
  
  .master-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }
  
  .master-avatar {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: white;
    font-size: 0.875rem;
  }
  
  .master-info h4 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  .specialization {
    margin: 0;
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .master-day-stats {
    display: flex;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .time-cells {
    height: calc(60px * 11); /* 11 часов * 60px */
    position: relative;
  }
  
  .time-cell {
    height: 60px;
    border-bottom: 1px solid #e5e7eb;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .time-cell:hover {
    background: #f0fdf4;
  }
  
  .time-cell.available {
    background: white;
  }
  
  .time-cell.booked {
    background: #f8fafc;
  }
  
  .time-cell.unavailable {
    background: #f3f4f6;
    cursor: not-allowed;
  }
  
  .booking-event {
    position: absolute;
    left: 2px;
    right: 2px;
    top: 2px;
    bottom: 2px;
    border-radius: 6px;
    padding: 0.5rem;
    color: white;
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .booking-event:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .booking-content {
    flex: 1;
    overflow: hidden;
  }
  
  .booking-time {
    font-weight: 600;
    margin-bottom: 2px;
    display: block;
  }
  
  .booking-client {
    font-weight: 500;
    margin-bottom: 2px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .booking-service {
    font-size: 0.7rem;
    opacity: 0.9;
    display: block;
  }
  
  .booking-status {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 0.75rem;
  }
  
  .status-pending { color: #fbbf24; }
  .status-confirmed { color: #10b981; }
  .status-completed { color: #60a5fa; }
  .status-cancelled { color: #ef4444; }
  
  /* Расписание на неделю */
  .week-schedule {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .week-header {
    display: flex;
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
  }
  
  .corner {
    width: 80px;
    min-width: 80px;
    border-right: 1px solid #e5e7eb;
  }
  
  .day-header {
    flex: 1;
    text-align: center;
    padding: 0.75rem;
    border-right: 1px solid #e5e7eb;
  }
  
  .day-header:last-child {
    border-right: none;
  }
  
  .day-name {
    font-weight: 600;
    color: var(--text-dark);
    font-size: 0.875rem;
  }
  
  .day-date {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .week-body {
    display: flex;
    flex-direction: column;
  }
  
  .time-column {
    width: 80px;
    min-width: 80px;
    background: #f8fafc;
    border-right: 1px solid #e5e7eb;
  }
  
  .hour-label {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .master-week {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .master-week:last-child {
    border-bottom: none;
  }
  
  .master-row-header {
    width: 200px;
    min-width: 200px;
    padding: 1rem;
    background: #f8fafc;
    border-right: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
  }
  
  .day-columns {
    flex: 1;
    display: flex;
  }
  
  .day-column {
    flex: 1;
    border-right: 1px solid #e5e7eb;
    position: relative;
  }
  
  .day-column:last-child {
    border-right: none;
  }
  
  .day-column .time-cell {
    height: 40px;
    border-bottom: 1px solid #e5e7eb;
    position: relative;
    cursor: pointer;
  }
  
  .day-column .booking-event {
    padding: 2px 4px;
    font-size: 0.7rem;
  }
  
  .day-column .booking-client {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Месячное расписание */
  .month-schedule {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .month-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .month-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  .calendar {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .weekday {
    text-align: center;
    padding: 0.75rem;
    font-weight: 600;
    color: var(--text-dark);
    font-size: 0.875rem;
    border-right: 1px solid #e5e7eb;
  }
  
  .weekday:last-child {
    border-right: none;
  }
  
  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
  
  .day-cell {
    min-height: 120px;
    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
    padding: 0.5rem;
    background: white;
  }
  
  .day-cell:nth-child(7n) {
    border-right: none;
  }
  
  .day-cell:not(.current-month) {
    background: #f9fafb;
    color: #9ca3af;
  }
  
  .day-cell.today {
    background: #f0f9ff;
  }
  
  .day-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .day-number {
    font-weight: 600;
    font-size: 1.125rem;
  }
  
  .day-name {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .day-bookings {
    max-height: 80px;
    overflow-y: auto;
    margin-bottom: 0.5rem;
  }
  
  .booking-preview {
    background: white;
    border-left: 3px solid;
    padding: 0.25rem 0.5rem;
    margin-bottom: 0.25rem;
    border-radius: 0 4px 4px 0;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .booking-preview:hover {
    background: #f3f4f6;
  }
  
  .booking-time {
    font-weight: 500;
    margin-right: 0.5rem;
    color: var(--text-dark);
  }
  
  .booking-client {
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .day-stats {
    font-size: 0.75rem;
    color: #6b7280;
    display: flex;
    justify-content: space-between;
  }
  
  /* Модальные окна */
  .detail-row {
    display: flex;
    margin-bottom: 1rem;
    align-items: flex-start;
  }
  
  .detail-label {
    font-weight: 500;
    color: var(--text-dark);
    width: 120px;
    flex-shrink: 0;
  }
  
  .detail-value {
    flex: 1;
    color: #6b7280;
  }
  
  .detail-value.link {
    color: var(--primary-green);
    text-decoration: none;
  }
  
  .detail-value.link:hover {
    text-decoration: underline;
  }
  
  .status-select {
    padding: 0.25rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  
  .client-selector {
    display: flex;
    gap: 0.5rem;
  }
  
  .new-client-form {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  /* Адаптивность */
  @media (max-width: 1200px) {
    .admin-header {
      flex-direction: column;
      align-items: stretch;
    }
    
    .timeline {
      overflow-x: auto;
    }
    
    .master-columns {
      min-width: 800px;
    }
  }
  
  @media (max-width: 768px) {
    .controls {
      flex-direction: column;
      align-items: stretch;
    }
    
    .view-controls,
    .filter-controls {
      width: 100%;
      justify-content: center;
    }
    
    .week-body {
      overflow-x: auto;
    }
    
    .master-week {
      min-width: 800px;
    }
    
    .days-grid {
      grid-template-columns: repeat(1, 1fr);
    }
    
    .day-cell {
      min-height: auto;
    }
  }
  
  @media print {
    .admin-header,
    .controls,
    .modal-overlay {
      display: none !important;
    }
    
    .schedule-admin {
      padding: 0;
    }
    
    .day-schedule,
    .week-schedule,
    .month-schedule {
      box-shadow: none;
      border: 1px solid #000;
    }
  }
  </style>