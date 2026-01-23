<template>
    <div class="admin-panel">
      <!-- Боковая панель навигации -->
      <aside class="sidebar" :class="{ 'collapsed': sidebarCollapsed }">
        <div class="sidebar-header">
          <div class="logo" @click="toggleSidebar">
            <span class="logo-text">be</span>
            <span class="logo-accent">MATYR</span>
            <span class="logo-sub">Admin</span>
          </div>
          <button class="toggle-sidebar" @click="toggleSidebar">
            <i class="icon" :class="sidebarCollapsed ? 'icon-menu' : 'icon-close'"></i>
          </button>
        </div>
        
        <nav class="sidebar-nav">
          <router-link to="/admin/dashboard" class="nav-item" active-class="active">
            <i class="icon icon-dashboard"></i>
            <span class="nav-text">Дашборд</span>
            <span class="badge" v-if="stats.newBookings > 0">{{ stats.newBookings }}</span>
          </router-link>
          
          <router-link to="/admin/bookings" class="nav-item" active-class="active">
            <i class="icon icon-calendar"></i>
            <span class="nav-text">Записи</span>
            <span class="badge" v-if="stats.todayBookings > 0">{{ stats.todayBookings }}</span>
          </router-link>
          
          <router-link to="/admin/services" class="nav-item" active-class="active">
            <i class="icon icon-services"></i>
            <span class="nav-text">Услуги</span>
          </router-link>
          
          <router-link to="/admin/masters" class="nav-item" active-class="active">
            <i class="icon icon-masters"></i>
            <span class="nav-text">Мастера</span>
          </router-link>
          
          <router-link to="/admin/clients" class="nav-item" active-class="active">
            <i class="icon icon-clients"></i>
            <span class="nav-text">Клиенты</span>
          </router-link>
          
          <router-link to="/admin/schedule" class="nav-item" active-class="active">
            <i class="icon icon-schedule"></i>
            <span class="nav-text">Расписание</span>
          </router-link>
          
          <router-link to="/admin/analytics" class="nav-item" active-class="active">
            <i class="icon icon-analytics"></i>
            <span class="nav-text">Аналитика</span>
          </router-link>
          
          <router-link to="/admin/settings" class="nav-item" active-class="active">
            <i class="icon icon-settings"></i>
            <span class="nav-text">Настройки</span>
          </router-link>
        </nav>
        
        <div class="sidebar-footer">
          <div class="admin-info">
            <div class="admin-avatar">
              <span>{{ userInitials }}</span>
            </div>
            <div class="admin-details" v-if="!sidebarCollapsed">
              <p class="admin-name">{{ currentUser.name }}</p>
              <p class="admin-role">{{ currentUser.role }}</p>
            </div>
          </div>
          <button class="btn-logout" @click="logout" :title="sidebarCollapsed ? 'Выйти' : ''">
            <i class="icon icon-logout"></i>
            <span v-if="!sidebarCollapsed">Выйти</span>
          </button>
        </div>
      </aside>
  
      <!-- Основной контент -->
      <main class="main-content" :class="{ 'expanded': sidebarCollapsed }">
        <!-- Верхняя панель -->
        <header class="top-bar">
          <div class="top-bar-left">
            <h1 class="page-title">{{ pageTitle }}</h1>
            <div class="breadcrumbs">
              <span v-for="(crumb, index) in breadcrumbs" :key="index">
                <router-link :to="crumb.path" v-if="crumb.path">{{ crumb.name }}</router-link>
                <span v-else>{{ crumb.name }}</span>
                <span v-if="index < breadcrumbs.length - 1"> / </span>
              </span>
            </div>
          </div>
          
          <div class="top-bar-right">
            <div class="notifications">
              <button class="notification-btn" @click="toggleNotifications">
                <i class="icon icon-bell"></i>
                <span class="notification-count" v-if="notifications.length > 0">
                  {{ notifications.length }}
                </span>
              </button>
              
              <div class="notification-dropdown" v-if="showNotifications">
                <div class="notification-header">
                  <h3>Уведомления</h3>
                  <button class="mark-all-read" @click="markAllAsRead">
                    Прочитать все
                  </button>
                </div>
                <div class="notification-list">
                  <div v-for="notification in notifications" 
                       :key="notification.id"
                       class="notification-item"
                       :class="{ 'unread': !notification.read }">
                    <div class="notification-icon">
                      <i :class="getNotificationIcon(notification.type)"></i>
                    </div>
                    <div class="notification-content">
                      <p class="notification-text">{{ notification.text }}</p>
                      <span class="notification-time">{{ notification.time }}</span>
                    </div>
                    <button class="notification-dismiss" 
                            @click="dismissNotification(notification.id)">
                      ×
                    </button>
                  </div>
                  <div v-if="notifications.length === 0" class="no-notifications">
                    Нет новых уведомлений
                  </div>
                </div>
              </div>
            </div>
            
            <div class="date-display">
              <span>{{ currentDate }}</span>
              <span class="time">{{ currentTime }}</span>
            </div>
          </div>
        </header>
  
        <!-- Контент страницы -->
        <div class="content-area">
          <router-view 
            :bookings="bookings"
            :stats="stats"
            @update-booking="handleUpdateBooking"
            @delete-booking="handleDeleteBooking"
            @export-data="handleExportData"
          />
        </div>
      </main>
  
      <!-- Модальное окно редактирования записи -->
      <div class="modal-overlay" v-if="showEditModal" @click.self="closeEditModal">
        <div class="modal">
          <div class="modal-header">
            <h3>Редактировать запись #{{ editingBooking.id }}</h3>
            <button class="modal-close" @click="closeEditModal">×</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveBooking">
              <div class="form-group">
                <label>Клиент</label>
                <input type="text" v-model="editingBooking.clientName" class="form-input">
              </div>
              
              <div class="form-group">
                <label>Телефон</label>
                <input type="tel" v-model="editingBooking.clientPhone" class="form-input">
              </div>
              
              <div class="form-group">
                <label>Услуга</label>
                <select v-model="editingBooking.serviceId" class="form-select">
                  <option v-for="service in services" :key="service.id" :value="service.id">
                    {{ service.name }} ({{ service.price }} ₽)
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Мастер</label>
                <select v-model="editingBooking.masterId" class="form-select">
                  <option v-for="master in masters" :key="master.id" :value="master.id">
                    {{ master.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label>Дата</label>
                  <input type="date" v-model="editingBooking.date" class="form-input">
                </div>
                
                <div class="form-group">
                  <label>Время</label>
                  <select v-model="editingBooking.time" class="form-select">
                    <option v-for="time in timeSlots" :key="time" :value="time">
                      {{ time }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label>Статус</label>
                <div class="status-options">
                  <label class="status-option" 
                         v-for="status in bookingStatuses" 
                         :key="status.value">
                    <input type="radio" 
                           v-model="editingBooking.status" 
                           :value="status.value"
                           name="status">
                    <span class="status-badge" :class="`status-${status.value}`">
                      {{ status.label }}
                    </span>
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label>Комментарий</label>
                <textarea v-model="editingBooking.comment" 
                          class="form-textarea"
                          rows="3"
                          placeholder="Комментарий к записи..."></textarea>
              </div>
              
              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" @click="closeEditModal">
                  Отмена
                </button>
                <button type="submit" class="btn btn-primary">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'AdminPanel',
    
    setup() {
      const router = useRouter()
      const sidebarCollapsed = ref(false)
      const showNotifications = ref(false)
      const showEditModal = ref(false)
      const editingBooking = ref(null)
  
      // Данные администратора
      const currentUser = ref({
        name: 'Администратор',
        role: 'Менеджер',
        email: 'admin@bematyr.ru'
      })
  
      // Статистика
      const stats = ref({
        totalBookings: 156,
        newBookings: 12,
        todayBookings: 8,
        totalClients: 89,
        totalRevenue: 245600,
        conversionRate: 78
      })
  
      // Записи
      const bookings = ref([
        {
          id: 1,
          clientName: 'Иванов Иван',
          clientPhone: '+7 (917) 123-45-67',
          serviceId: 1,
          serviceName: 'Мужская стрижка',
          masterId: 1,
          masterName: 'Алексей Петров',
          date: '2024-12-15',
          time: '14:00',
          status: 'confirmed',
          price: 800,
          comment: 'Клиент просит сделать fade стрижку',
          createdAt: '2024-12-14 10:30',
          updatedAt: '2024-12-14 10:30'
        },
        {
          id: 2,
          clientName: 'Смирнова Анна',
          clientPhone: '+7 (917) 765-43-21',
          serviceId: 2,
          serviceName: 'Женская стрижка',
          masterId: 2,
          masterName: 'Мария Сидорова',
          date: '2024-12-15',
          time: '16:30',
          status: 'pending',
          price: 1500,
          comment: '',
          createdAt: '2024-12-14 15:45',
          updatedAt: '2024-12-14 15:45'
        },
        {
          id: 3,
          clientName: 'Петров Петр',
          clientPhone: '+7 (917) 987-65-43',
          serviceId: 4,
          serviceName: 'Окрашивание',
          masterId: 3,
          masterName: 'Екатерина Волкова',
          date: '2024-12-16',
          time: '11:00',
          status: 'completed',
          price: 2500,
          comment: 'Окрашивание в блонд',
          createdAt: '2024-12-13 12:20',
          updatedAt: '2024-12-14 11:15'
        }
      ])
  
      // Услуги
      const services = ref([
        { id: 1, name: 'Мужская стрижка', price: 800, duration: 45, category: 'Мужские' },
        { id: 2, name: 'Женская стрижка', price: 1500, duration: 60, category: 'Женские' },
        { id: 3, name: 'Детская стрижка', price: 600, duration: 30, category: 'Детские' },
        { id: 4, name: 'Окрашивание', price: 2500, duration: 90, category: 'Женские' }
      ])
  
      // Мастера
      const masters = ref([
        { id: 1, name: 'Алексей Петров', specialization: 'Мужские стрижки', rating: 4.9 },
        { id: 2, name: 'Мария Сидорова', specialization: 'Женские стрижки', rating: 4.8 },
        { id: 3, name: 'Екатерина Волкова', specialization: 'Окрашивание', rating: 4.9 }
      ])
  
      // Уведомления
      const notifications = ref([
        { 
          id: 1, 
          type: 'booking', 
          text: 'Новая запись от Иванова Ивана на 14:00', 
          time: '10 мин назад',
          read: false 
        },
        { 
          id: 2, 
          type: 'reminder', 
          text: 'Напоминание: встреча с поставщиком в 15:00', 
          time: '1 час назад',
          read: false 
        },
        { 
          id: 3, 
          type: 'system', 
          text: 'Обновление системы завершено успешно', 
          time: '2 часа назад',
          read: true 
        }
      ])
  
      // Статусы записей
      const bookingStatuses = ref([
        { value: 'pending', label: 'Ожидание', color: '#FFA726' },
        { value: 'confirmed', label: 'Подтверждено', color: '#42A5F5' },
        { value: 'completed', label: 'Выполнено', color: '#66BB6A' },
        { value: 'cancelled', label: 'Отменено', color: '#EF5350' },
        { value: 'no-show', label: 'Не пришел', color: '#78909C' }
      ])
  
      // Временные слоты
      const timeSlots = ref([
        '09:00', '10:00', '11:00', '12:00', '13:00', 
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
      ])
  
      // Вычисляемые свойства
      const userInitials = computed(() => {
        return currentUser.value.name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
      })
  
      const currentDate = computed(() => {
        return new Date().toLocaleDateString('ru-RU', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      })
  
      const currentTime = computed(() => {
        return new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        })
      })
  
      const pageTitle = computed(() => {
        const route = router.currentRoute.value
        const titles = {
          'admin-dashboard': 'Дашборд',
          'admin-bookings': 'Управление записями',
          'admin-services': 'Услуги',
          'admin-masters': 'Мастера',
          'admin-clients': 'Клиенты',
          'admin-schedule': 'Расписание',
          'admin-analytics': 'Аналитика',
          'admin-settings': 'Настройки'
        }
        return titles[route.name] || 'Панель администратора'
      })
  
      const breadcrumbs = computed(() => {
        const route = router.currentRoute.value
        const paths = route.path.split('/').filter(Boolean)
        
        return paths.map((path, index) => {
          const fullPath = '/' + paths.slice(0, index + 1).join('/')
          const names = {
            admin: 'Админ',
            dashboard: 'Дашборд',
            bookings: 'Записи',
            services: 'Услуги',
            masters: 'Мастера',
            clients: 'Клиенты',
            schedule: 'Расписание',
            analytics: 'Аналитика',
            settings: 'Настройки'
          }
          
          return {
            name: names[path] || path.charAt(0).toUpperCase() + path.slice(1),
            path: fullPath
          }
        })
      })
  
      // Методы
      const toggleSidebar = () => {
        sidebarCollapsed.value = !sidebarCollapsed.value
      }
  
      const toggleNotifications = () => {
        showNotifications.value = !showNotifications.value
      }
  
      const markAllAsRead = () => {
        notifications.value = notifications.value.map(notif => ({
          ...notif,
          read: true
        }))
      }
  
      const dismissNotification = (id) => {
        notifications.value = notifications.value.filter(notif => notif.id !== id)
      }
  
      const getNotificationIcon = (type) => {
        const icons = {
          booking: 'icon-calendar',
          reminder: 'icon-bell',
          system: 'icon-settings',
          warning: 'icon-alert'
        }
        return icons[type] || 'icon-bell'
      }
  
      const openEditModal = (booking) => {
        editingBooking.value = { ...booking }
        showEditModal.value = true
      }
  
      const closeEditModal = () => {
        showEditModal.value = false
        editingBooking.value = null
      }
  
      const saveBooking = () => {
        // Здесь будет API запрос для сохранения
        const index = bookings.value.findIndex(b => b.id === editingBooking.value.id)
        if (index !== -1) {
          bookings.value[index] = { ...editingBooking.value }
        }
        closeEditModal()
      }
  
      const handleUpdateBooking = (booking) => {
        openEditModal(booking)
      }
  
      const handleDeleteBooking = (id) => {
        if (confirm('Вы уверены, что хотите удалить эту запись?')) {
          bookings.value = bookings.value.filter(booking => booking.id !== id)
        }
      }
  
      const handleExportData = (type) => {
        // Здесь будет логика экспорта данных
        console.log(`Экспорт данных: ${type}`)
        alert(`Данные экспортированы в формате ${type}`)
      }
  
      const logout = () => {
        // Очистка данных сессии
        localStorage.removeItem('adminToken')
        router.push('/')
      }
  
      // Обновление времени каждую минуту
      let timeInterval
      onMounted(() => {
        timeInterval = setInterval(() => {
          // Триггер для обновления computed свойств
        }, 60000)
      })
  
      onBeforeUnmount(() => {
        if (timeInterval) clearInterval(timeInterval)
      })
  
      return {
        sidebarCollapsed,
        showNotifications,
        showEditModal,
        editingBooking,
        currentUser,
        stats,
        bookings,
        services,
        masters,
        notifications,
        bookingStatuses,
        timeSlots,
        userInitials,
        currentDate,
        currentTime,
        pageTitle,
        breadcrumbs,
        toggleSidebar,
        toggleNotifications,
        markAllAsRead,
        dismissNotification,
        getNotificationIcon,
        openEditModal,
        closeEditModal,
        saveBooking,
        handleUpdateBooking,
        handleDeleteBooking,
        handleExportData,
        logout
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-panel {
    display: flex;
    min-height: 100vh;
    background: #f5f7fa;
  }
  
  /* Боковая панель */
  .sidebar {
    width: 280px;
    background: linear-gradient(180deg, var(--primary-dark) 0%, #1a472a 100%);
    color: white;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
  
  .sidebar.collapsed {
    width: 70px;
  }
  
  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .logo {
    display: flex;
    align-items: baseline;
    cursor: pointer;
    gap: 4px;
  }
  
  .logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 600;
  }
  
  .logo-accent {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 600;
    color: #4ade80;
  }
  
  .logo-sub {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-left: 4px;
  }
  
  .sidebar.collapsed .logo-text,
  .sidebar.collapsed .logo-accent,
  .sidebar.collapsed .logo-sub {
    display: none;
  }
  
  .toggle-sidebar {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .toggle-sidebar:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  /* Навигация */
  .sidebar-nav {
    flex: 1;
    padding: 1rem 0;
    overflow-y: auto;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    padding: 0.875rem 1.5rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    gap: 1rem;
  }
  
  .nav-item:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .nav-item.active {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border-left: 4px solid #4ade80;
  }
  
  .nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #4ade80;
  }
  
  .icon {
    font-size: 1.25rem;
    min-width: 24px;
  }
  
  .icon-dashboard::before { content: '📊'; }
  .icon-calendar::before { content: '📅'; }
  .icon-services::before { content: '✂️'; }
  .icon-masters::before { content: '👨‍🎨'; }
  .icon-clients::before { content: '👥'; }
  .icon-schedule::before { content: '⏰'; }
  .icon-analytics::before { content: '📈'; }
  .icon-settings::before { content: '⚙️'; }
  .icon-bell::before { content: '🔔'; }
  .icon-logout::before { content: '🚪'; }
  .icon-menu::before { content: '☰'; }
  .icon-close::before { content: '✕'; }
  .icon-alert::before { content: '⚠️'; }
  
  .nav-text {
    flex: 1;
    font-weight: 500;
  }
  
  .sidebar.collapsed .nav-text {
    display: none;
  }
  
  .badge {
    background: #ef4444;
    color: white;
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 600;
    min-width: 20px;
    text-align: center;
  }
  
  /* Футер боковой панели */
  .sidebar-footer {
    padding: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .admin-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .admin-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .admin-details {
    flex: 1;
  }
  
  .admin-name {
    font-weight: 600;
    margin-bottom: 2px;
  }
  
  .admin-role {
    font-size: 0.875rem;
    opacity: 0.8;
  }
  
  .sidebar.collapsed .admin-details {
    display: none;
  }
  
  .btn-logout {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
  }
  
  .btn-logout:hover {
    background: rgba(239, 68, 68, 0.3);
  }
  
  .sidebar.collapsed .btn-logout span {
    display: none;
  }
  
  /* Основной контент */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
  }
  
  .main-content.expanded {
    margin-left: 0;
  }
  
  /* Верхняя панель */
  .top-bar {
    background: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 90;
  }
  
  .top-bar-left {
    flex: 1;
  }
  
  .page-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 0.25rem;
  }
  
  .breadcrumbs {
    font-size: 0.875rem;
    color: var(--text-light);
  }
  
  .breadcrumbs a {
    color: var(--primary-green);
    text-decoration: none;
  }
  
  .breadcrumbs a:hover {
    text-decoration: underline;
  }
  
  .top-bar-right {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  /* Уведомления */
  .notifications {
    position: relative;
  }
  
  .notification-btn {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .notification-btn:hover {
    background: #f3f4f6;
  }
  
  .notification-count {
    position: absolute;
    top: -2px;
    right: -2px;
    background: #ef4444;
    color: white;
    font-size: 0.75rem;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }
  
  .notification-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 320px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    margin-top: 0.5rem;
    z-index: 1000;
    overflow: hidden;
  }
  
  .notification-header {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .notification-header h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }
  
  .mark-all-read {
    background: none;
    border: none;
    color: var(--primary-green);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .mark-all-read:hover {
    text-decoration: underline;
  }
  
  .notification-list {
    max-height: 400px;
    overflow-y: auto;
  }
  
  .notification-item {
    display: flex;
    align-items: flex-start;
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
    transition: all 0.3s ease;
    gap: 0.75rem;
  }
  
  .notification-item:hover {
    background: #f9fafb;
  }
  
  .notification-item.unread {
    background: #f0f9ff;
  }
  
  .notification-icon {
    color: var(--primary-green);
    font-size: 1.25rem;
  }
  
  .notification-content {
    flex: 1;
  }
  
  .notification-text {
    margin: 0 0 4px 0;
    font-size: 0.875rem;
    line-height: 1.4;
  }
  
  .notification-time {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .notification-dismiss {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    font-size: 1.25rem;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .notification-dismiss:hover {
    background: #f3f4f6;
    color: #6b7280;
  }
  
  .no-notifications {
    padding: 2rem 1rem;
    text-align: center;
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  /* Дата и время */
  .date-display {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 0.875rem;
    color: var(--text-light);
  }
  
  .time {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  /* Область контента */
  .content-area {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
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
    animation: fadeIn 0.2s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .modal {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
  }
  
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
  
  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-header h3 {
    margin: 0;
    color: var(--text-dark);
    font-size: 1.25rem;
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
  
  /* Формы */
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-dark);
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.875rem;
    transition: all 0.3s ease;
    background: white;
  }
  
  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  /* Статусы */
  .status-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .status-option {
    cursor: pointer;
  }
  
  .status-option input {
    display: none;
  }
  
  .status-badge {
    display: inline-block;
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }
  
  .status-option input:checked + .status-badge {
    border-color: currentColor;
    transform: scale(1.05);
  }
  
  .status-pending { background: #fffbeb; color: #d97706; }
  .status-confirmed { background: #eff6ff; color: #2563eb; }
  .status-completed { background: #f0fdf4; color: #16a34a; }
  .status-cancelled { background: #fef2f2; color: #dc2626; }
  .status-no-show { background: #f1f5f9; color: #475569; }
  
  /* Кнопки действий модального окна */
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
    font-size: 0.875rem;
  }
  
  .btn-primary {
    background: var(--primary-green);
    color: white;
  }
  
  .btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
  }
  
  .btn-secondary {
    background: #f3f4f6;
    color: var(--text-dark);
  }
  
  .btn-secondary:hover {
    background: #e5e7eb;
  }
  
  /* Адаптивность */
  @media (max-width: 1024px) {
    .sidebar:not(.collapsed) {
      position: fixed;
      height: 100vh;
      z-index: 2000;
    }
    
    .main-content:not(.expanded) {
      margin-left: 280px;
    }
    
    .top-bar {
      padding: 1rem;
    }
    
    .content-area {
      padding: 1rem;
    }
  }
  
  @media (max-width: 768px) {
    .sidebar.collapsed {
      width: 60px;
    }
    
    .sidebar-header {
      padding: 1rem;
    }
    
    .nav-item {
      padding: 0.75rem 1rem;
      justify-content: center;
    }
    
    .top-bar {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
    
    .top-bar-right {
      width: 100%;
      justify-content: space-between;
    }
    
    .notification-dropdown {
      width: 280px;
      right: -20px;
    }
    
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .modal {
      width: 95%;
      margin: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .sidebar {
      width: 100%;
      position: fixed;
      height: 100vh;
      z-index: 2000;
    }
    
    .sidebar.collapsed {
      width: 60px;
    }
    
    .notification-dropdown {
      width: 280px;
      right: -80px;
    }
  }
  </style>