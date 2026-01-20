<template>
  <div class="booking">
    <div class="container">
      <div class="booking-header">
        <h1 class="section-title">Онлайн-запись</h1>
        <p class="subtitle">Выберите услугу, мастера и удобное время</p>
      </div>
      
      <div class="booking-steps">
        <div class="step active">
          <span class="step-number">1</span>
          <span class="step-text">Услуга</span>
        </div>
        <div class="step">
          <span class="step-number">2</span>
          <span class="step-text">Мастер</span>
        </div>
        <div class="step">
          <span class="step-number">3</span>
          <span class="step-text">Время</span>
        </div>
        <div class="step">
          <span class="step-number">4</span>
          <span class="step-text">Данные</span>
        </div>
      </div>
      
      <div class="booking-content">
        <div class="booking-form">
          <form @submit.prevent="handleSubmit">
            <!-- Step 1: Service Selection -->
            <div class="form-step" v-if="currentStep === 1">
              <h3>Выберите услугу</h3>
              <div class="service-options">
                <label class="service-option" 
                       v-for="service in services" 
                       :key="service.id">
                  <input type="radio" 
                         v-model="selectedService" 
                         :value="service.id"
                         name="service">
                  <div class="service-option-content">
                    <span class="service-name">{{ service.name }}</span>
                    <span class="service-price">{{ service.price }} ₽</span>
                    <span class="service-duration">{{ service.duration }} мин</span>
                  </div>
                </label>
              </div>
            </div>
            
            <!-- Navigation Buttons -->
            <div class="form-navigation">
              <button type="button" 
                      class="btn btn-outline"
                      @click="prevStep"
                      v-if="currentStep > 1">
                Назад
              </button>
              <button type="button" 
                      class="btn btn-primary"
                      @click="nextStep"
                      v-if="currentStep < 4">
                Далее
              </button>
              <button type="submit" 
                      class="btn btn-primary"
                      v-if="currentStep === 4">
                Записаться
              </button>
            </div>
          </form>
        </div>
        
        <div class="booking-summary">
          <h3>Ваш выбор</h3>
          <div class="summary-content">
            <div class="summary-item" v-if="selectedService">
              <span>Услуга:</span>
              <span>{{ getServiceName(selectedService) }}</span>
            </div>
            <div class="summary-item">
              <span>Дата:</span>
              <span>{{ selectedDate || 'Не выбрано' }}</span>
            </div>
            <div class="summary-item">
              <span>Время:</span>
              <span>{{ selectedTime || 'Не выбрано' }}</span>
            </div>
            <div class="summary-item total">
              <span>Итого:</span>
              <span>{{ calculateTotal() }} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Booking',
  setup() {
    const currentStep = ref(1)
    const selectedService = ref(null)
    const selectedDate = ref(null)
    const selectedTime = ref(null)
    
    const services = ref([
      { id: 1, name: 'Мужская стрижка', price: 800, duration: 45 },
      { id: 2, name: 'Женская стрижка', price: 1500, duration: 60 },
      { id: 3, name: 'Детская стрижка', price: 600, duration: 30 },
      { id: 4, name: 'Окрашивание', price: 2500, duration: 90 },
      { id: 5, name: 'Стрижка + борода', price: 1200, duration: 60 }
    ])
    
    const getServiceName = (id) => {
      const service = services.value.find(s => s.id === id)
      return service ? service.name : ''
    }
    
    const calculateTotal = () => {
      const service = services.value.find(s => s.id === selectedService.value)
      return service ? service.price : 0
    }
    
    const nextStep = () => {
      if (currentStep.value < 4) {
        currentStep.value++
      }
    }
    
    const prevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--
      }
    }
    
    const handleSubmit = () => {
      // Здесь будет интеграция с YClients API
      console.log('Запись отправлена:', {
        service: selectedService.value,
        date: selectedDate.value,
        time: selectedTime.value
      })
      
      alert('Запись успешно создана! Мы свяжемся с вами для подтверждения.')
    }
    
    return {
      currentStep,
      selectedService,
      selectedDate,
      selectedTime,
      services,
      getServiceName,
      calculateTotal,
      nextStep,
      prevStep,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.booking-header {
  text-align: center;
  margin-bottom: 3rem;
}

.subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
}

.booking-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  position: relative;
}

.booking-steps::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--bg-light);
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-number {
  width: 30px;
  height: 30px;
  background: var(--bg-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: var(--primary-green);
  color: white;
}

.step-text {
  color: var(--text-light);
  font-size: 0.9rem;
}

.step.active .step-text {
  color: var(--primary-green);
  font-weight: 600;
}

.booking-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.booking-form {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.form-step {
  margin-bottom: 2rem;
}

.form-step h3 {
  color: var(--primary-dark);
  margin-bottom: 1.5rem;
}

.service-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-option {
  border: 2px solid var(--bg-light);
  border-radius: var(--radius-sm);
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.service-option:hover {
  border-color: var(--primary-light);
}

.service-option input {
  display: none;
}

.service-option input:checked + .service-option-content {
  color: var(--primary-green);
}

.service-option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-name {
  font-weight: 500;
}

.service-price {
  font-weight: 600;
  color: var(--primary-green);
}

.service-duration {
  color: var(--text-light);
  font-size: 0.9rem;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.booking-summary {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.booking-summary h3 {
  color: var(--primary-dark);
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--bg-light);
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.summary-item:not(.total) {
  border-bottom: 1px solid var(--bg-light);
}

.summary-item.total {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--primary-green);
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid var(--bg-light);
}

@media (max-width: 992px) {
  .booking-content {
    grid-template-columns: 1fr;
  }
  
  .booking-summary {
    position: static;
  }
}

@media (max-width: 576px) {
  .booking-steps {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .booking-steps::before {
    display: none;
  }
}
</style>