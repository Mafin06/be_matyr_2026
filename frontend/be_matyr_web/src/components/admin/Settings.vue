<template>
    <div class="settings-admin">
      <!-- Заголовок -->
      <div class="admin-header">
        <div class="header-left">
          <h1>Настройки</h1>
          <p>Управление настройками парикмахерской</p>
        </div>
        <div class="header-right">
          <button class="btn btn-primary" @click="saveAllSettings" :disabled="saving">
            <span v-if="saving">
              <span class="spinner"></span> Сохранение...
            </span>
            <span v-else>💾 Сохранить все изменения</span>
          </button>
        </div>
      </div>
  
      <!-- Основные настройки -->
      <div class="settings-grid">
        <!-- Основные настройки -->
        <div class="settings-section">
          <div class="section-header">
            <h2>Основные настройки</h2>
            <span class="section-badge">Обязательно</span>
          </div>
          
          <div class="settings-group">
            <div class="setting-item">
              <label class="setting-label">
                <span class="label-text">Название парикмахерской</span>
                <span class="label-required">*</span>
              </label>
              <input type="text" v-model="settings.general.salonName" class="setting-input">
              <span class="setting-hint">Отображается в шапке сайта и чеках</span>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">
                <span class="label-text">Адрес</span>
                <span class="label-required">*</span>
              </label>
              <input type="text" v-model="settings.general.address" class="setting-input">
              <span class="setting-hint">Полный адрес с индексом</span>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">
                <span class="label-text">Контактный телефон</span>
                <span class="label-required">*</span>
              </label>
              <input type="tel" v-model="settings.general.phone" class="setting-input">
              <span class="setting-hint">Основной телефон для связи</span>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">
                <span class="label-text">Email</span>
                <span class="label-required">*</span>
              </label>
              <input type="email" v-model="settings.general.email" class="setting-input">
              <span class="setting-hint">Для уведомлений и обратной связи</span>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">
                <span class="label-text">Основной цвет</span>
              </label>
              <div class="color-picker">
                <input type="color" v-model="settings.general.primaryColor" class="color-input">
                <span class="color-value">{{ settings.general.primaryColor }}</span>
              </div>
              <span class="setting-hint">Цвет бренда для сайта и интерфейса</span>
            </div>
          </div>
        </div>
  
        <!-- Расписание работы -->
        <div class="settings-section">
          <div class="section-header">
            <h2>Расписание работы</h2>
          </div>
          
          <div class="schedule-settings">
            <div v-for="day in scheduleDays" :key="day.key" class="schedule-day">
              <div class="day-header">
                <span class="day-name">{{ day.name }}</span>
                <label class="switch">
                  <input type="checkbox" v-model="settings.schedule[day.key].working">
                  <span class="slider"></span>
                </label>
              </div>
              
              <div class="day-times" v-if="settings.schedule[day.key].working">
                <div class="time-inputs">
                  <div class="time-group">
                    <label>Открытие</label>
                    <input type="time" v-model="settings.schedule[day.key].open" class="time-input">
                  </div>
                  <div class="time-group">
                    <label>Закрытие</label>
                    <input type="time" v-model="settings.schedule[day.key].close" class="time-input">
                  </div>
                </div>
              </div>
              
              <div class="day-off" v-else>
                Выходной
              </div>
            </div>
          </div>
          
          <div class="setting-item">
            <label class="setting-label">Продолжительность слота записи (мин)</label>
            <select v-model="settings.schedule.slotDuration" class="setting-select">
              <option value="15">15 минут</option>
              <option value="30">30 минут</option>
              <option value="45">45 минут</option>
              <option value="60">60 минут</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label class="setting-label">Бронирование онлайн</label>
            <div class="toggle-group">
              <label class="switch large">
                <input type="checkbox" v-model="settings.schedule.onlineBooking">
                <span class="slider"></span>
              </label>
              <span class="toggle-label">
                {{ settings.schedule.onlineBooking ? 'Включено' : 'Выключено' }}
              </span>
            </div>
            <span class="setting-hint">Разрешить клиентам записываться онлайн</span>
          </div>
        </div>
  
        <!-- Уведомления -->
        <div class="settings-section">
          <div class="section-header">
            <h2>Уведомления</h2>
          </div>
          
          <div class="settings-group">
            <div class="setting-item">
              <label class="setting-label">Email уведомления</label>
              <div class="toggle-group">
                <label class="switch">
                  <input type="checkbox" v-model="settings.notifications.email.enabled">
                  <span class="slider"></span>
                </label>
                <span class="toggle-label">
                  {{ settings.notifications.email.enabled ? 'Включены' : 'Выключены' }}
                </span>
              </div>
            </div>
            
            <div class="setting-item" v-if="settings.notifications.email.enabled">
              <label class="setting-label">Email для уведомлений</label>
              <input type="email" v-model="settings.notifications.email.address" class="setting-input">
              <span class="setting-hint">На этот адрес будут приходить уведомления</span>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">SMS уведомления</label>
              <div class="toggle-group">
                <label class="switch">
                  <input type="checkbox" v-model="settings.notifications.sms.enabled">
                  <span class="slider"></span>
                </label>
                <span class="toggle-label">
                  {{ settings.notifications.sms.enabled ? 'Включены' : 'Выключены' }}
                </span>
              </div>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">Напоминание о записи</label>
              <div class="reminder-settings">
                <select v-model="settings.notifications.reminder.time" class="setting-select">
                  <option value="1">За 1 час</option>
                  <option value="3">За 3 часа</option>
                  <option value="24">За 24 часа</option>
                  <option value="48">За 48 часов</option>
                </select>
                <select v-model="settings.notifications.reminder.channel" class="setting-select">
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="both">Email и SMS</option>
                </select>
              </div>
              <span class="setting-hint">Когда отправлять напоминание клиентам</span>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">Шаблоны уведомлений</label>
              <button class="btn btn-outline" @click="openTemplatesModal">
                📝 Управление шаблонами
              </button>
            </div>
          </div>
        </div>
  
        <!-- Платежи -->
        <div class="settings-section">
          <div class="section-header">
            <h2>Платежи</h2>
          </div>
          
          <div class="settings-group">
            <div class="setting-item">
              <label class="setting-label">Валюта</label>
              <select v-model="settings.payments.currency" class="setting-select">
                <option value="RUB">Рубли (₽)</option>
                <option value="USD">Доллары ($)</option>
                <option value="EUR">Евро (€)</option>
              </select>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">Налог (НДС)</label>
              <div class="tax-settings">
                <select v-model="settings.payments.tax.type" class="setting-select">
                  <option value="none">Без налога</option>
                  <option value="percent">Процент</option>
                  <option value="fixed">Фиксированная сумма</option>
                </select>
                <input v-if="settings.payments.tax.type !== 'none'" 
                       type="number" 
                       v-model.number="settings.payments.tax.value"
                       class="setting-input small"
                       :placeholder="settings.payments.tax.type === 'percent' ? '%' : '₽'">
              </div>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">Способы оплаты</label>
              <div class="payment-methods">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="settings.payments.methods.cash">
                  <span class="checkmark"></span>
                  Наличные
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="settings.payments.methods.card">
                  <span class="checkmark"></span>
                  Банковская карта
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="settings.payments.methods.online">
                  <span class="checkmark"></span>
                  Онлайн оплата
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">Предоплата</label>
              <div class="toggle-group">
                <label class="switch">
                  <input type="checkbox" v-model="settings.payments.deposit.enabled">
                  <span class="slider"></span>
                </label>
                <span class="toggle-label">
                  {{ settings.payments.deposit.enabled ? 'Требуется' : 'Не требуется' }}
                </span>
              </div>
            </div>
            
            <div class="setting-item" v-if="settings.payments.deposit.enabled">
              <label class="setting-label">Размер предоплаты</label>
              <div class="deposit-settings">
                <select v-model="settings.payments.deposit.type" class="setting-select">
                  <option value="percent">Процент от суммы</option>
                  <option value="fixed">Фиксированная сумма</option>
                </select>
                <input type="number" 
                       v-model.number="settings.payments.deposit.value"
                       class="setting-input small"
                       :placeholder="settings.payments.deposit.type === 'percent' ? '%' : '₽'">
              </div>
            </div>
          </div>
        </div>
  
        <!-- Интеграции -->
        <div class="settings-section">
          <div class="section-header">
            <h2>Интеграции</h2>
          </div>
          
          <div class="settings-group">
            <div class="setting-item">
              <label class="setting-label">YCLIENTS API</label>
              <div class="integration-status" :class="`status-${yclientsStatus}`">
                <span class="status-dot"></span>
                {{ yclientsStatus === 'connected' ? 'Подключено' : 'Не подключено' }}
              </div>
              <button class="btn btn-outline" @click="openYclientsModal">
                ⚙️ Настроить интеграцию
              </button>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">Telegram бот</label>
              <div class="toggle-group">
                <label class="switch">
                  <input type="checkbox" v-model="settings.integrations.telegram.enabled">
                  <span class="slider"></span>
                </label>
                <span class="toggle-label">
                  {{ settings.integrations.telegram.enabled ? 'Включен' : 'Выключен' }}
                </span>
              </div>
              <span class="setting-hint" v-if="settings.integrations.telegram.enabled">
                Бот: @bematyr_bot
              </span>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">Социальные сети</label>
              <div class="social-inputs">
                <div class="social-input">
                  <span class="social-icon">📷</span>
                  <input type="text" v-model="settings.integrations.social.instagram" 
                         placeholder="Instagram ссылка" class="setting-input">
                </div>
                <div class="social-input">
                  <span class="social-icon">📘</span>
                  <input type="text" v-model="settings.integrations.social.vk" 
                         placeholder="ВКонтакте ссылка" class="setting-input">
                </div>
                <div class="social-input">
                  <span class="social-icon">💬</span>
                  <input type="text" v-model="settings.integrations.social.telegram" 
                         placeholder="Telegram канал" class="setting-input">
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Безопасность -->
        <div class="settings-section">
          <div class="section-header">
            <h2>Безопасность</h2>
          </div>
          
          <div class="settings-group">
            <div class="setting-item">
              <label class="setting-label">Двухфакторная аутентификация</label>
              <div class="toggle-group">
                <label class="switch">
                  <input type="checkbox" v-model="settings.security.twoFactorAuth">
                  <span class="slider"></span>
                </label>
                <span class="toggle-label">
                  {{ settings.security.twoFactorAuth ? 'Включена' : 'Выключена' }}
                </span>
              </div>
              <span class="setting-hint">Требуется подтверждение по SMS при входе</span>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">Автоматический выход</label>
              <select v-model="settings.security.autoLogout" class="setting-select">
                <option value="15">15 минут</option>
                <option value="30">30 минут</option>
                <option value="60">1 час</option>
                <option value="180">3 часа</option>
                <option value="0">Никогда</option>
              </select>
              <span class="setting-hint">Время бездействия до автоматического выхода</span>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">Резервное копирование</label>
              <div class="backup-settings">
                <button class="btn btn-outline" @click="createBackup">
                  💾 Создать backup
                </button>
                <button class="btn btn-outline" @click="restoreBackup">
                  🔄 Восстановить
                </button>
              </div>
              <span class="setting-hint">Последнее резервное копирование: {{ lastBackup }}</span>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">Очистка данных</label>
              <button class="btn btn-danger" @click="confirmDataClearing">
                🗑️ Очистить старые данные
              </button>
              <span class="setting-hint">Удаление записей старше 2 лет</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Дополнительные настройки -->
      <div class="advanced-settings">
        <div class="section-header" @click="showAdvanced = !showAdvanced">
          <h2>Дополнительные настройки</h2>
          <span class="toggle-arrow" :class="{ 'rotated': showAdvanced }">▼</span>
        </div>
        
        <div class="advanced-content" v-if="showAdvanced">
          <div class="settings-group">
            <div class="setting-item">
              <label class="setting-label">Логирование</label>
              <div class="toggle-group">
                <label class="switch">
                  <input type="checkbox" v-model="settings.advanced.logging">
                  <span class="slider"></span>
                </label>
                <span class="toggle-label">
                  {{ settings.advanced.logging ? 'Включено' : 'Выключено' }}
                </span>
              </div>
              <span class="setting-hint">Запись действий в системе</span>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">Режим отладки</label>
              <div class="toggle-group">
                <label class="switch">
                  <input type="checkbox" v-model="settings.advanced.debugMode">
                  <span class="slider"></span>
                </label>
                <span class="toggle-label">
                  {{ settings.advanced.debugMode ? 'Включен' : 'Выключен' }}
                </span>
              </div>
              <span class="setting-hint">Для разработчиков</span>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">API ключ</label>
              <div class="api-key">
                <input type="text" :value="maskedApiKey" readonly class="setting-input">
                <button class="btn-icon" @click="copyApiKey" title="Копировать">
                  📋
                </button>
                <button class="btn-icon" @click="regenerateApiKey" title="Сгенерировать новый">
                  🔄
                </button>
              </div>
              <span class="setting-hint">Используется для интеграций</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Системная информация -->
      <div class="system-info">
        <h3>Системная информация</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Версия системы:</span>
            <span class="info-value">1.0.0</span>
          </div>
          <div class="info-item">
            <span class="info-label">Последнее обновление:</span>
            <span class="info-value">{{ systemInfo.lastUpdate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">База данных:</span>
            <span class="info-value">{{ systemInfo.databaseSize }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Свободное место:</span>
            <span class="info-value">{{ systemInfo.freeSpace }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Активные сессии:</span>
            <span class="info-value">{{ systemInfo.activeSessions }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Время работы:</span>
            <span class="info-value">{{ systemInfo.uptime }}</span>
          </div>
        </div>
      </div>
  
      <!-- Модальные окна -->
      <div class="modal-overlay" v-if="showTemplatesModal" @click.self="closeTemplatesModal">
        <div class="modal">
          <div class="modal-header">
            <h3>Шаблоны уведомлений</h3>
            <button class="modal-close" @click="closeTemplatesModal">×</button>
          </div>
          <div class="modal-body">
            <!-- Здесь будут шаблоны уведомлений -->
          </div>
        </div>
      </div>
      
      <div class="modal-overlay" v-if="showYclientsModal" @click.self="closeYclientsModal">
        <div class="modal">
          <div class="modal-header">
            <h3>Настройка YCLIENTS API</h3>
            <button class="modal-close" @click="closeYclientsModal">×</button>
          </div>
          <div class="modal-body">
            <div class="api-settings">
              <div class="setting-item">
                <label class="setting-label">API ключ</label>
                <input type="password" v-model="yclientsApiKey" class="setting-input" placeholder="Введите API ключ">
              </div>
              <div class="setting-item">
                <label class="setting-label">ID компании</label>
                <input type="text" v-model="yclientsCompanyId" class="setting-input" placeholder="Введите ID компании">
              </div>
              <div class="modal-actions">
                <button class="btn btn-primary" @click="saveYclientsSettings">
                  Сохранить настройки
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
  
  export default {
    name: 'SettingsAdmin',
    
    setup() {
      const saving = ref(false)
      const showAdvanced = ref(false)
      const showTemplatesModal = ref(false)
      const showYclientsModal = ref(false)
      
      const yclientsApiKey = ref('')
      const yclientsCompanyId = ref('')
      
      const scheduleDays = ref([
        { key: 'monday', name: 'Понедельник' },
        { key: 'tuesday', name: 'Вторник' },
        { key: 'wednesday', name: 'Среда' },
        { key: 'thursday', name: 'Четверг' },
        { key: 'friday', name: 'Пятница' },
        { key: 'saturday', name: 'Суббота' },
        { key: 'sunday', name: 'Воскресенье' }
      ])
      
      // Настройки по умолчанию
      const settings = ref({
        general: {
          salonName: 'be MATYR',
          address: 'Уфа, пр. Октября, 1',
          phone: '+7 (917) 123-45-67',
          email: 'info@bematyr.ru',
          primaryColor: '#2E7D32'
        },
        schedule: {
          monday: { working: true, open: '09:00', close: '19:00' },
          tuesday: { working: true, open: '09:00', close: '19:00' },
          wednesday: { working: true, open: '09:00', close: '19:00' },
          thursday: { working: true, open: '09:00', close: '19:00' },
          friday: { working: true, open: '09:00', close: '19:00' },
          saturday: { working: true, open: '10:00', close: '18:00' },
          sunday: { working: false, open: '10:00', close: '17:00' },
          slotDuration: '30',
          onlineBooking: true
        },
        notifications: {
          email: {
            enabled: true,
            address: 'notifications@bematyr.ru'
          },
          sms: {
            enabled: false
          },
          reminder: {
            time: '24',
            channel: 'email'
          }
        },
        payments: {
          currency: 'RUB',
          tax: {
            type: 'none',
            value: 0
          },
          methods: {
            cash: true,
            card: true,
            online: false
          },
          deposit: {
            enabled: false,
            type: 'percent',
            value: 50
          }
        },
        integrations: {
          telegram: {
            enabled: true
          },
          social: {
            instagram: 'https://instagram.com/bematyr',
            vk: 'https://vk.com/bematyr',
            telegram: 'https://t.me/bematyr'
          }
        },
        security: {
          twoFactorAuth: false,
          autoLogout: '30'
        },
        advanced: {
          logging: true,
          debugMode: false,
          apiKey: 'sk_live_abc123xyz789'
        }
      })
      
      const systemInfo = ref({
        lastUpdate: '15.12.2024',
        databaseSize: '45.2 MB',
        freeSpace: '15.8 GB',
        activeSessions: 3,
        uptime: '7 дней 3 часа'
      })
      
      const lastBackup = ref('14.12.2024 23:45')
      
      // Вычисляемые свойства
      const yclientsStatus = computed(() => {
        return yclientsApiKey.value && yclientsCompanyId.value ? 'connected' : 'disconnected'
      })
      
      const maskedApiKey = computed(() => {
        const key = settings.value.advanced.apiKey
        return key.substring(0, 10) + '...' + key.substring(key.length - 4)
      })
      
      // Методы
      const saveAllSettings = async () => {
        saving.value = true
        
        // Имитация сохранения
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Сохранение в localStorage (в реальном проекте - API запрос)
        localStorage.setItem('bematyr_settings', JSON.stringify(settings.value))
        
        saving.value = false
        alert('Настройки успешно сохранены!')
      }
      
      const openTemplatesModal = () => {
        showTemplatesModal.value = true
      }
      
      const closeTemplatesModal = () => {
        showTemplatesModal.value = false
      }
      
      const openYclientsModal = () => {
        showYclientsModal.value = true
      }
      
      const closeYclientsModal = () => {
        showYclientsModal.value = false
      }
      
      const saveYclientsSettings = () => {
        // Здесь будет сохранение настроек YCLIENTS API
        console.log('Сохранение настроек YCLIENTS:', {
          apiKey: yclientsApiKey.value,
          companyId: yclientsCompanyId.value
        })
        
        closeYclientsModal()
        alert('Настройки YCLIENTS API сохранены!')
      }
      
      const createBackup = () => {
        console.log('Создание резервной копии')
        lastBackup.value = new Date().toLocaleString('ru-RU')
        alert('Резервная копия успешно создана!')
      }
      
      const restoreBackup = () => {
        if (confirm('Вы уверены, что хотите восстановить данные из резервной копии?')) {
          console.log('Восстановление из резервной копии')
          alert('Данные успешно восстановлены!')
        }
      }
      
      const confirmDataClearing = () => {
        if (confirm('Вы уверены, что хотите удалить старые данные? Это действие нельзя отменить.')) {
          console.log('Очистка старых данных')
          alert('Старые данные успешно удалены!')
        }
      }
      
      const copyApiKey = () => {
        navigator.clipboard.writeText(settings.value.advanced.apiKey)
        alert('API ключ скопирован в буфер обмена!')
      }
      
      const regenerateApiKey = () => {
        if (confirm('Вы уверены, что хотите сгенерировать новый API ключ? Старый ключ перестанет работать.')) {
          // Генерация нового ключа
          const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15)
          settings.value.advanced.apiKey = newKey
          alert('Новый API ключ сгенерирован!')
        }
      }
      
      // Загрузка настроек при монтировании
      onMounted(() => {
        const savedSettings = localStorage.getItem('bematyr_settings')
        if (savedSettings) {
          settings.value = JSON.parse(savedSettings)
        }
      })
      
      return {
        saving,
        showAdvanced,
        showTemplatesModal,
        showYclientsModal,
        yclientsApiKey,
        yclientsCompanyId,
        scheduleDays,
        settings,
        systemInfo,
        lastBackup,
        yclientsStatus,
        maskedApiKey,
        saveAllSettings,
        openTemplatesModal,
        closeTemplatesModal,
        openYclientsModal,
        closeYclientsModal,
        saveYclientsSettings,
        createBackup,
        restoreBackup,
        confirmDataClearing,
        copyApiKey,
        regenerateApiKey
      }
    }
  }
  </script>
  
  <style scoped>
  .settings-admin {
    padding: 1rem;
  }
  
  /* Общие стили */
  .admin-header,
  .btn,
  .modal-overlay,
  .modal,
  .modal-header,
  .modal-close,
  .modal-body,
  .modal-actions,
  .btn-outline,
  .btn-primary,
  .btn-danger {
    /* Аналогично предыдущим компонентам */
  }
  
  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
    vertical-align: middle;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Сетка настроек */
  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .settings-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e5e7eb;
  }
  
  .section-header h2 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  .section-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background: #fef3c7;
    color: #92400e;
    border-radius: 12px;
    font-weight: 600;
  }
  
  /* Группы настроек */
  .settings-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .setting-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .setting-label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-weight: 500;
    color: var(--text-dark);
    font-size: 0.9rem;
  }
  
  .label-required {
    color: #ef4444;
  }
  
  .setting-hint {
    font-size: 0.75rem;
    color: #6b7280;
    line-height: 1.4;
  }
  
  .setting-input {
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    background: white;
  }
  
  .setting-input:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
  
  .setting-input.small {
    width: 100px;
  }
  
  .setting-select {
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    background: white;
    cursor: pointer;
  }
  
  .setting-select:focus {
    outline: none;
    border-color: var(--primary-green);
  }
  
  /* Расписание */
  .schedule-settings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .schedule-day {
    background: #f8fafc;
    border-radius: 8px;
    padding: 1rem;
  }
  
  .day-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  
  .day-name {
    font-weight: 500;
    color: var(--text-dark);
  }
  
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
  
  .switch.large {
    width: 60px;
    height: 30px;
  }
  
  .switch.large .slider:before {
    height: 20px;
    width: 20px;
    left: 5px;
    bottom: 5px;
  }
  
  .day-times {
    padding-top: 0.75rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .time-inputs {
    display: flex;
    gap: 1rem;
  }
  
  .time-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .time-group label {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .time-input {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
  }
  
  .day-off {
    font-size: 0.875rem;
    color: #6b7280;
    font-style: italic;
    padding-top: 0.75rem;
    border-top: 1px solid #e5e7eb;
  }
  
  /* Переключатели */
  .toggle-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .toggle-label {
    font-size: 0.875rem;
    color: var(--text-dark);
  }
  
  /* Напоминания */
  .reminder-settings {
    display: flex;
    gap: 1rem;
  }
  
  /* Платежи */
  .tax-settings,
  .deposit-settings {
    display: flex;
    gap: 1rem;
  }
  
  .payment-methods {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--text-dark);
  }
  
  .checkbox-label input {
    display: none;
  }
  
  .checkmark {
    width: 18px;
    height: 18px;
    border: 2px solid #d1d5db;
    border-radius: 4px;
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
    font-size: 0.75rem;
  }
  
  /* Интеграции */
  .integration-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  
  .status-connected .status-dot {
    background: #10b981;
  }
  
  .status-disconnected .status-dot {
    background: #ef4444;
  }
  
  .social-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .social-input {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .social-icon {
    font-size: 1.25rem;
    width: 24px;
  }
  
  /* Безопасность */
  .backup-settings {
    display: flex;
    gap: 0.75rem;
  }
  
  /* Дополнительные настройки */
  .advanced-settings {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .advanced-settings .section-header {
    cursor: pointer;
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
  
  .toggle-arrow {
    transition: transform 0.3s ease;
    font-size: 0.75rem;
  }
  
  .toggle-arrow.rotated {
    transform: rotate(180deg);
  }
  
  .advanced-content {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .api-key {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn-icon {
    width: 36px;
    height: 36px;
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
  }
  
  /* Системная информация */
  .system-info {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .system-info h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 8px;
  }
  
  .info-label {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .info-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  /* Модальные окна */
  .api-settings {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  /* Адаптивность */
  @media (max-width: 1024px) {
    .settings-grid {
      grid-template-columns: 1fr;
    }
    
    .reminder-settings,
    .tax-settings,
    .deposit-settings {
      flex-direction: column;
    }
  }
  
  @media (max-width: 768px) {
    .admin-header {
      flex-direction: column;
      align-items: stretch;
    }
    
    .time-inputs {
      flex-direction: column;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }
    
    .api-key {
      flex-direction: column;
    }
    
    .btn-icon {
      width: 100%;
    }
  }
  </style>