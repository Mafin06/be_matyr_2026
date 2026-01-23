<template>
    <div class="analytics-admin">
      <!-- Заголовок и период -->
      <div class="admin-header">
        <div class="header-left">
          <h1>Аналитика</h1>
          <p>Статистика и отчетность парикмахерской</p>
        </div>
        <div class="header-right">
          <div class="period-selector">
            <select v-model="period" class="period-select">
              <option value="today">Сегодня</option>
              <option value="week">Эта неделя</option>
              <option value="month">Этот месяц</option>
              <option value="quarter">Этот квартал</option>
              <option value="year">Этот год</option>
              <option value="custom">Произвольный период</option>
            </select>
            
            <div v-if="period === 'custom'" class="custom-period">
              <input type="date" v-model="customStart" class="date-input">
              <span>—</span>
              <input type="date" v-model="customEnd" class="date-input">
            </div>
            
            <button class="btn btn-primary" @click="generateReport">
              📊 Создать отчет
            </button>
          </div>
        </div>
      </div>
  
      <!-- Основные метрики -->
      <div class="main-metrics">
        <div class="metric-card large" v-for="metric in mainMetrics" :key="metric.label">
          <div class="metric-header">
            <div class="metric-title">
              <span class="metric-icon">{{ metric.icon }}</span>
              <h3>{{ metric.label }}</h3>
            </div>
            <span class="metric-trend" :class="metric.trendClass">
              {{ metric.trend }}
            </span>
          </div>
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-chart">
            <div class="chart-mini">
              <div v-for="(point, index) in metric.chartData" 
                   :key="index"
                   class="chart-point"
                   :style="{ height: point + '%' }">
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Графики и диаграммы -->
      <div class="charts-section">
        <div class="chart-row">
          <div class="chart-card">
            <div class="chart-header">
              <h3>Выручка по дням</h3>
              <select v-model="revenueChartType" class="chart-select">
                <option value="line">Линейный</option>
                <option value="bar">Столбчатый</option>
              </select>
            </div>
            <div class="chart-container">
              <div class="revenue-chart">
                <div class="chart-y-axis">
                  <span>30K</span>
                  <span>20K</span>
                  <span>10K</span>
                  <span>0</span>
                </div>
                <div class="chart-content">
                  <div class="chart-grid"></div>
                  <div class="chart-bars" v-if="revenueChartType === 'bar'">
                    <div v-for="(day, index) in revenueData" 
                         :key="index"
                         class="chart-bar"
                         :style="{ height: (day.revenue / 30000 * 100) + '%' }"
                         :title="`${day.day}: ${day.revenue.toLocaleString()} ₽`">
                      <span class="bar-value">{{ day.revenue.toLocaleString() }} ₽</span>
                    </div>
                  </div>
                  <div class="chart-line" v-else>
                    <svg width="100%" height="100%">
                      <polyline 
                        :points="revenueLinePoints" 
                        fill="none" 
                        stroke="var(--primary-green)" 
                        stroke-width="2"
                      />
                    </svg>
                  </div>
                </div>
                <div class="chart-x-axis">
                  <span v-for="day in revenueData" :key="day.day">{{ day.day }}</span>
                </div>
              </div>
            </div>
          </div>
  
          <div class="chart-card">
            <div class="chart-header">
              <h3>Распределение услуг</h3>
            </div>
            <div class="chart-container">
              <div class="services-chart">
                <div class="donut-chart">
                  <div class="donut-segment"
                       v-for="segment in servicesDistribution"
                       :key="segment.name"
                       :style="{
                         '--segment-percent': segment.percentage,
                         '--segment-color': segment.color
                       }">
                  </div>
                </div>
                <div class="chart-legend">
                  <div v-for="segment in servicesDistribution" 
                       :key="segment.name"
                       class="legend-item">
                    <span class="legend-color" :style="{ background: segment.color }"></span>
                    <span class="legend-label">{{ segment.name }}</span>
                    <span class="legend-value">{{ segment.percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="chart-row">
          <div class="chart-card">
            <div class="chart-header">
              <h3>Загрузка мастеров</h3>
            </div>
            <div class="chart-container">
              <div class="masters-chart">
                <div v-for="master in mastersLoad" :key="master.name" class="master-bar">
                  <div class="master-info">
                    <span class="master-name">{{ master.name }}</span>
                    <span class="master-load">{{ master.load }}%</span>
                  </div>
                  <div class="load-bar">
                    <div class="load-fill" :style="{ width: master.load + '%' }"></div>
                  </div>
                  <div class="master-stats">
                    <span>{{ master.bookings }} записей</span>
                    <span>{{ master.revenue }}K ₽</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div class="chart-card">
            <div class="chart-header">
              <h3>Конверсия записей</h3>
            </div>
            <div class="chart-container">
              <div class="conversion-chart">
                <div class="conversion-funnel">
                  <div v-for="step in conversionFunnel" 
                       :key="step.stage"
                       class="funnel-step"
                       :style="{ width: step.width + '%' }">
                    <div class="step-header">
                      <span class="step-label">{{ step.label }}</span>
                      <span class="step-count">{{ step.count }}</span>
                    </div>
                    <div class="step-percentage">{{ step.percentage }}%</div>
                  </div>
                </div>
                <div class="conversion-rate">
                  <div class="rate-value">{{ overallConversion }}%</div>
                  <div class="rate-label">Общая конверсия</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Подробная статистика -->
      <div class="detailed-stats">
        <div class="stats-section">
          <h3>Статистика по мастерам</h3>
          <div class="stats-table">
            <table>
              <thead>
                <tr>
                  <th>Мастер</th>
                  <th>Записей</th>
                  <th>Выручка</th>
                  <th>Средний чек</th>
                  <th>Рейтинг</th>
                  <th>Загрузка</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="master in mastersStats" :key="master.name">
                  <td>
                    <div class="master-cell">
                      <div class="master-avatar" :style="{ background: master.color }">
                        {{ master.initials }}
                      </div>
                      <span>{{ master.name }}</span>
                    </div>
                  </td>
                  <td>{{ master.bookings }}</td>
                  <td>{{ master.revenue.toLocaleString() }} ₽</td>
                  <td>{{ master.avgTicket.toLocaleString() }} ₽</td>
                  <td>
                    <div class="rating-cell">
                      <span class="stars">★★★★★</span>
                      <span class="rating-value">{{ master.rating }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="load-cell">
                      <div class="load-indicator">
                        <div class="load-progress" :style="{ width: master.load + '%' }"></div>
                      </div>
                      <span>{{ master.load }}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <div class="stats-section">
          <h3>Популярные услуги</h3>
          <div class="services-list">
            <div v-for="service in popularServices" :key="service.name" class="service-item">
              <div class="service-header">
                <span class="service-name">{{ service.name }}</span>
                <span class="service-count">{{ service.count }} зап.</span>
              </div>
              <div class="service-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: service.percentage + '%' }"></div>
                </div>
                <span class="progress-text">{{ service.percentage }}%</span>
              </div>
              <div class="service-footer">
                <span>{{ service.revenue.toLocaleString() }} ₽</span>
                <span>Средний чек: {{ service.avgPrice.toLocaleString() }} ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Отчеты -->
      <div class="reports-section">
        <div class="section-header">
          <h3>Готовые отчеты</h3>
          <button class="btn btn-outline" @click="exportAllReports">
            📄 Экспорт всех отчетов
          </button>
        </div>
        
        <div class="reports-grid">
          <div class="report-card" v-for="report in reports" :key="report.name">
            <div class="report-icon">{{ report.icon }}</div>
            <div class="report-info">
              <h4>{{ report.name }}</h4>
              <p>{{ report.description }}</p>
            </div>
            <div class="report-actions">
              <button class="btn-action" @click="viewReport(report.type)" title="Просмотр">
                👁️
              </button>
              <button class="btn-action" @click="downloadReport(report.type)" title="Скачать">
                ⬇️
              </button>
              <button class="btn-action" @click="sendReport(report.type)" title="Отправить">
                📧
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Модальное окно отчета -->
      <div class="modal-overlay" v-if="showReportModal" @click.self="closeReportModal">
        <div class="modal modal-large">
          <div class="modal-header">
            <h3>{{ reportModalTitle }}</h3>
            <div class="modal-actions">
              <button class="btn btn-outline" @click="printReport">
                🖨️ Печать
              </button>
              <button class="btn btn-primary" @click="downloadReport(currentReportType)">
                ⬇️ Скачать PDF
              </button>
              <button class="modal-close" @click="closeReportModal">×</button>
            </div>
          </div>
          
          <div class="modal-body">
            <div class="report-content">
              <!-- Здесь будет содержимое отчета -->
              <div class="report-header">
                <h2>Отчет: {{ reportModalTitle }}</h2>
                <p>Период: {{ reportPeriod }}</p>
                <p>Дата формирования: {{ reportDate }}</p>
              </div>
              
              <div class="report-body">
                <!-- Контент отчета будет генерироваться динамически -->
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
    name: 'AnalyticsAdmin',
    
    setup() {
      const period = ref('month')
      const customStart = ref('')
      const customEnd = ref('')
      const revenueChartType = ref('bar')
      const showReportModal = ref(false)
      const currentReportType = ref('')
      
      // Основные метрики
      const mainMetrics = ref([
        {
          label: 'Общая выручка',
          value: '245,600 ₽',
          icon: '💰',
          trend: '+18%',
          trendClass: 'positive',
          chartData: [30, 45, 25, 60, 40, 75, 50]
        },
        {
          label: 'Количество записей',
          value: '156',
          icon: '📅',
          trend: '+12%',
          trendClass: 'positive',
          chartData: [40, 35, 50, 45, 60, 55, 70]
        },
        {
          label: 'Средний чек',
          value: '1,574 ₽',
          icon: '📊',
          trend: '+5%',
          trendClass: 'positive',
          chartData: [45, 40, 50, 45, 55, 50, 60]
        },
        {
          label: 'Новых клиентов',
          value: '24',
          icon: '🆕',
          trend: '+23%',
          trendClass: 'positive',
          chartData: [20, 25, 30, 35, 40, 45, 50]
        }
      ])
      
      // Данные для графиков
      const revenueData = ref([
        { day: 'Пн', revenue: 18200 },
        { day: 'Вт', revenue: 24500 },
        { day: 'Ср', revenue: 21800 },
        { day: 'Чт', revenue: 27600 },
        { day: 'Пт', revenue: 31200 },
        { day: 'Сб', revenue: 28600 },
        { day: 'Вс', revenue: 22400 }
      ])
      
      const servicesDistribution = ref([
        { name: 'Мужские стрижки', percentage: 35, color: '#3b82f6' },
        { name: 'Женские стрижки', percentage: 25, color: '#10b981' },
        { name: 'Окрашивание', percentage: 20, color: '#f59e0b' },
        { name: 'Детские стрижки', percentage: 12, color: '#8b5cf6' },
        { name: 'Другие услуги', percentage: 8, color: '#ef4444' }
      ])
      
      const mastersLoad = ref([
        { name: 'Алексей Петров', load: 85, bookings: 45, revenue: 36 },
        { name: 'Мария Сидорова', load: 78, bookings: 38, revenue: 57 },
        { name: 'Екатерина Волкова', load: 92, bookings: 32, revenue: 80 },
        { name: 'Дмитрий Соколов', load: 65, bookings: 28, revenue: 22 }
      ])
      
      const conversionFunnel = ref([
        { stage: 'visits', label: 'Посещения сайта', count: 1256, percentage: 100, width: 100 },
        { stage: 'bookings', label: 'Запросы на запись', count: 342, percentage: 27, width: 27 },
        { stage: 'confirmed', label: 'Подтвержденные', count: 256, percentage: 20, width: 20 },
        { stage: 'completed', label: 'Выполненные', count: 228, percentage: 18, width: 18 }
      ])
      
      const mastersStats = ref([
        {
          name: 'Алексей Петров',
          initials: 'АП',
          color: '#3b82f6',
          bookings: 156,
          revenue: 124800,
          avgTicket: 800,
          rating: 4.9,
          load: 85
        },
        {
          name: 'Мария Сидорова',
          initials: 'МС',
          color: '#10b981',
          bookings: 142,
          revenue: 213000,
          avgTicket: 1500,
          rating: 4.8,
          load: 78
        },
        {
          name: 'Екатерина Волкова',
          initials: 'ЕВ',
          color: '#f59e0b',
          bookings: 98,
          revenue: 245000,
          avgTicket: 2500,
          rating: 4.9,
          load: 92
        }
      ])
      
      const popularServices = ref([
        { name: 'Мужская стрижка', count: 156, percentage: 35, revenue: 124800, avgPrice: 800 },
        { name: 'Женская стрижка', count: 142, percentage: 32, revenue: 213000, avgPrice: 1500 },
        { name: 'Окрашивание', count: 98, percentage: 22, revenue: 245000, avgPrice: 2500 },
        { name: 'Детская стрижка', count: 53, percentage: 12, revenue: 31800, avgPrice: 600 }
      ])
      
      const reports = ref([
        {
          name: 'Ежедневный отчет',
          description: 'Статистика за день по всем показателям',
          icon: '📅',
          type: 'daily'
        },
        {
          name: 'Недельный отчет',
          description: 'Сводка за неделю с анализом трендов',
          icon: '📊',
          type: 'weekly'
        },
        {
          name: 'Месячный отчет',
          description: 'Полный отчет за месяц с графиками',
          icon: '📈',
          type: 'monthly'
        },
        {
          name: 'Отчет по мастерам',
          description: 'Эффективность и статистика мастеров',
          icon: '👨‍🎨',
          type: 'masters'
        },
        {
          name: 'Финансовый отчет',
          description: 'Детализация доходов и расходов',
          icon: '💰',
          type: 'financial'
        },
        {
          name: 'Клиентский отчет',
          description: 'Анализ клиентской базы и лояльности',
          icon: '👥',
          type: 'clients'
        }
      ])
      
      // Вычисляемые свойства
      const revenueLinePoints = computed(() => {
        const points = []
        const height = 200 // Высота графика
        const width = revenueData.value.length * 40
        
        revenueData.value.forEach((day, index) => {
          const x = (index * 40) + 20
          const y = height - (day.revenue / 30000 * height)
          points.push(`${x},${y}`)
        })
        
        return points.join(' ')
      })
      
      const overallConversion = computed(() => {
        const lastStep = conversionFunnel.value[conversionFunnel.value.length - 1]
        const firstStep = conversionFunnel.value[0]
        return ((lastStep.count / firstStep.count) * 100).toFixed(1)
      })
      
      const reportModalTitle = computed(() => {
        const titles = {
          daily: 'Ежедневный отчет',
          weekly: 'Недельный отчет',
          monthly: 'Месячный отчет',
          masters: 'Отчет по мастерам',
          financial: 'Финансовый отчет',
          clients: 'Клиентский отчет'
        }
        return titles[currentReportType.value] || 'Отчет'
      })
      
      const reportPeriod = computed(() => {
        const today = new Date()
        const formats = {
          daily: today.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }),
          weekly: 'С ' + new Date(today.setDate(today.getDate() - 7)).toLocaleDateString('ru-RU') + 
                  ' по ' + today.toLocaleDateString('ru-RU'),
          monthly: today.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
        }
        return formats[period.value] || 'Произвольный период'
      })
      
      const reportDate = computed(() => {
        return new Date().toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      })
      
      // Методы
      const generateReport = () => {
        console.log('Генерация отчета за период:', period.value)
        // Здесь будет логика генерации отчета
      }
      
      const viewReport = (type) => {
        currentReportType.value = type
        showReportModal.value = true
      }
      
      const closeReportModal = () => {
        showReportModal.value = false
        currentReportType.value = ''
      }
      
      const downloadReport = (type) => {
        console.log('Скачивание отчета:', type)
        // Здесь будет логика скачивания отчета
      }
      
      const sendReport = (type) => {
        console.log('Отправка отчета:', type)
        // Здесь будет логика отправки отчета
      }
      
      const printReport = () => {
        window.print()
      }
      
      const exportAllReports = () => {
        console.log('Экспорт всех отчетов')
        // Здесь будет логика экспорта всех отчетов
      }
      
      onMounted(() => {
        // Установка дат для произвольного периода
        const today = new Date()
        const weekAgo = new Date(today)
        weekAgo.setDate(today.getDate() - 7)
        
        customStart.value = weekAgo.toISOString().split('T')[0]
        customEnd.value = today.toISOString().split('T')[0]
      })
      
      return {
        period,
        customStart,
        customEnd,
        revenueChartType,
        showReportModal,
        currentReportType,
        mainMetrics,
        revenueData,
        servicesDistribution,
        mastersLoad,
        conversionFunnel,
        mastersStats,
        popularServices,
        reports,
        revenueLinePoints,
        overallConversion,
        reportModalTitle,
        reportPeriod,
        reportDate,
        generateReport,
        viewReport,
        closeReportModal,
        downloadReport,
        sendReport,
        printReport,
        exportAllReports
      }
    }
  }
  </script>
  
  <style scoped>
  .analytics-admin {
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
  .btn-outline,
  .btn-primary {
    /* Аналогично предыдущим компонентам */
  }
  
  .period-selector {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .period-select {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
    min-width: 150px;
  }
  
  .custom-period {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .date-input {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
  }
  
  /* Основные метрики */
  .main-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .metric-card.large {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  
  .metric-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .metric-icon {
    font-size: 1.5rem;
  }
  
  .metric-title h3 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
  }
  
  .metric-trend {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
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
  
  .metric-value {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 1rem;
  }
  
  .metric-chart {
    height: 40px;
  }
  
  .chart-mini {
    display: flex;
    align-items: flex-end;
    height: 100%;
    gap: 2px;
  }
  
  .chart-point {
    flex: 1;
    background: var(--primary-green);
    border-radius: 2px;
    min-height: 1px;
  }
  
  /* Секция графиков */
  .charts-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .chart-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
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
    margin-bottom: 1rem;
  }
  
  .chart-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  .chart-select {
    padding: 0.25rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.75rem;
    background: white;
    cursor: pointer;
  }
  
  .chart-container {
    height: 250px;
  }
  
  /* График выручки */
  .revenue-chart {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .chart-y-axis {
    display: flex;
    justify-content: space-between;
    padding: 0 40px 0 0;
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }
  
  .chart-content {
    flex: 1;
    position: relative;
    padding-bottom: 20px;
  }
  
  .chart-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(to right, #f3f4f6 1px, transparent 1px),
                      linear-gradient(to bottom, #f3f4f6 1px, transparent 1px);
    background-size: 40px 25%;
  }
  
  .chart-bars {
    position: relative;
    display: flex;
    align-items: flex-end;
    height: 100%;
    gap: 4px;
    padding: 0 20px;
  }
  
  .chart-bar {
    flex: 1;
    background: var(--primary-green);
    border-radius: 4px 4px 0 0;
    position: relative;
    transition: height 0.3s ease;
  }
  
  .chart-bar:hover {
    opacity: 0.8;
  }
  
  .bar-value {
    position: absolute;
    top: -25px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0.75rem;
    color: var(--text-dark);
    font-weight: 500;
  }
  
  .chart-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 20px;
  }
  
  .chart-x-axis {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }
  
  /* График услуг */
  .services-chart {
    display: flex;
    align-items: center;
    height: 100%;
    gap: 2rem;
  }
  
  .donut-chart {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: conic-gradient(
      var(--segment-color) 0% var(--segment-percent),
      transparent var(--segment-percent) 100%
    );
    position: relative;
  }
  
  .donut-chart::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    background: white;
    border-radius: 50%;
  }
  
  .chart-legend {
    flex: 1;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }
  
  .legend-label {
    flex: 1;
    font-size: 0.875rem;
    color: var(--text-dark);
  }
  
  .legend-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  /* График загрузки мастеров */
  .masters-chart {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .master-bar {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .master-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .master-name {
    font-weight: 500;
    color: var(--text-dark);
    font-size: 0.875rem;
  }
  
  .master-load {
    font-weight: 600;
    color: var(--primary-green);
    font-size: 0.875rem;
  }
  
  .load-bar {
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .load-fill {
    height: 100%;
    background: var(--primary-green);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .master-stats {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  /* Воронка конверсии */
  .conversion-chart {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  .conversion-funnel {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .funnel-step {
    background: #f3f4f6;
    border-radius: 8px;
    padding: 1rem;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .funnel-step:hover {
    background: #e5e7eb;
  }
  
  .step-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .step-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-dark);
  }
  
  .step-count {
    font-weight: 600;
    color: var(--primary-green);
  }
  
  .step-percentage {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-dark);
    text-align: center;
  }
  
  .conversion-rate {
    text-align: center;
  }
  
  .rate-value {
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--primary-green);
    margin-bottom: 0.5rem;
  }
  
  .rate-label {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  /* Подробная статистика */
  .detailed-stats {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .stats-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .stats-section h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  .stats-table {
    overflow-x: auto;
  }
  
  .stats-table table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .stats-table th {
    background: #f8fafc;
    padding: 0.75rem;
    text-align: left;
    font-weight: 600;
    color: #475569;
    font-size: 0.75rem;
    border-bottom: 2px solid #e2e8f0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .stats-table td {
    padding: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
    font-size: 0.875rem;
  }
  
  .stats-table tbody tr:hover {
    background: #f8fafc;
  }
  
  .master-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .master-avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: white;
    font-size: 0.75rem;
  }
  
  .rating-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .stars {
    color: #fbbf24;
    font-size: 0.75rem;
    letter-spacing: 1px;
  }
  
  .rating-value {
    font-weight: 600;
    color: var(--text-dark);
  }
  
  .load-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .load-indicator {
    flex: 1;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .load-progress {
    height: 100%;
    background: var(--primary-green);
    border-radius: 3px;
  }
  
  /* Список услуг */
  .services-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .service-item {
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .service-item:hover {
    border-color: var(--primary-green);
    background: #f9fafb;
  }
  
  .service-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  
  .service-name {
    font-weight: 500;
    color: var(--text-dark);
  }
  
  .service-count {
    font-weight: 600;
    color: var(--primary-green);
  }
  
  .service-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .progress-bar {
    flex: 1;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: var(--primary-green);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--primary-green);
    min-width: 40px;
  }
  
  .service-footer {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  /* Отчеты */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .section-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  .reports-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .report-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    transition: all 0.3s ease;
  }
  
  .report-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  .report-icon {
    font-size: 2rem;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0fdf4;
    border-radius: 10px;
    color: var(--primary-green);
  }
  
  .report-info {
    flex: 1;
  }
  
  .report-info h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-dark);
  }
  
  .report-info p {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.4;
  }
  
  .report-actions {
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
  }
  
  /* Модальное окно отчета */
  .modal-large {
    width: 90%;
    max-width: 1000px;
  }
  
  .modal-header .modal-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .report-content {
    padding: 2rem;
    background: white;
  }
  
  .report-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid #e5e7eb;
  }
  
  .report-header h2 {
    margin: 0 0 1rem 0;
    color: var(--text-dark);
  }
  
  .report-header p {
    margin: 0.5rem 0;
    color: #6b7280;
  }
  
  /* Адаптивность */
  @media (max-width: 1200px) {
    .chart-row,
    .detailed-stats {
      grid-template-columns: 1fr;
    }
    
    .reports-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .admin-header {
      flex-direction: column;
      align-items: stretch;
    }
    
    .period-selector {
      flex-direction: column;
      align-items: stretch;
    }
    
    .main-metrics {
      grid-template-columns: 1fr;
    }
    
    .reports-grid {
      grid-template-columns: 1fr;
    }
    
    .report-card {
      flex-direction: column;
    }
    
    .modal-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
    
    .modal-header .modal-actions {
      flex-direction: column;
      align-items: stretch;
    }
  }
  
  @media print {
    .admin-header,
    .period-selector,
    .reports-section,
    .modal-overlay .modal-header .modal-actions button:not(.modal-close) {
      display: none !important;
    }
    
    .analytics-admin {
      padding: 0;
    }
    
    .chart-card,
    .stats-section,
    .report-card {
      break-inside: avoid;
      box-shadow: none;
      border: 1px solid #000;
    }
  }
  </style>