<template>
    <div class="login-page">
      <div class="login-container">
        <div class="login-header">
          <div class="logo">
            <span class="logo-text">be</span>
            <span class="logo-accent">MATYR</span>
            <span class="logo-sub">Admin</span>
          </div>
          <h1>Панель администратора</h1>
          <p>Войдите в систему управления</p>
        </div>
  
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required
              placeholder="admin@bematyr.ru"
              class="form-input"
              :class="{ 'error': errors.email }"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
  
          <div class="form-group">
            <label for="password">Пароль</label>
            <div class="password-input">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password" 
                required
                placeholder="Введите пароль"
                class="form-input"
                :class="{ 'error': errors.password }"
              />
              <button 
                type="button" 
                class="toggle-password"
                @click="togglePasswordVisibility"
              >
                <span v-if="showPassword">👁️</span>
                <span v-else>👁️‍🗨️</span>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
  
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe">
              <span class="checkmark"></span>
              Запомнить меня
            </label>
            <a href="#" class="forgot-password">Забыли пароль?</a>
          </div>
  
          <button type="submit" class="btn-login" :disabled="loading">
            <span v-if="loading">
              <span class="spinner"></span> Вход...
            </span>
            <span v-else>Войти</span>
          </button>
  
          <div v-if="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>
  
          <div class="demo-credentials">
            <p>Демо доступ:</p>
            <p>Email: <strong>admin@bematyr.ru</strong></p>
            <p>Пароль: <strong>admin123</strong></p>
          </div>
        </form>
  
        <div class="login-footer">
          <p>© {{ currentYear }} be MATYR. Все права защищены.</p>
          <p>Только для авторизованного персонала</p>
        </div>
      </div>
  
      <!-- Background animation -->
      <div class="background-animation">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'AdminLogin',
    
    setup() {
      const router = useRouter()
      
      const email = ref('')
      const password = ref('')
      const rememberMe = ref(false)
      const showPassword = ref(false)
      const loading = ref(false)
      const errorMessage = ref('')
      
      const errors = ref({
        email: '',
        password: ''
      })
      
      const currentYear = computed(() => new Date().getFullYear())
      
      // Демо учетные данные
      const demoCredentials = {
        email: 'admin@bematyr.ru',
        password: 'admin123'
      }
      
      const validateForm = () => {
        let isValid = true
        errors.value = { email: '', password: '' }
        
        if (!email.value) {
          errors.value.email = 'Email обязателен'
          isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          errors.value.email = 'Неверный формат email'
          isValid = false
        }
        
        if (!password.value) {
          errors.value.password = 'Пароль обязателен'
          isValid = false
        } else if (password.value.length < 6) {
          errors.value.password = 'Пароль должен быть не менее 6 символов'
          isValid = false
        }
        
        return isValid
      }
      
      const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value
      }
      
      const handleLogin = async () => {
        if (!validateForm()) return
        
        loading.value = true
        errorMessage.value = ''
        
        // Имитация задержки API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Проверка демо учетных данных
        if (email.value === demoCredentials.email && password.value === demoCredentials.password) {
          // Сохраняем в localStorage если выбрано "Запомнить меня"
          if (rememberMe.value) {
            localStorage.setItem('adminToken', 'demo-token-12345')
            localStorage.setItem('adminEmail', email.value)
          } else {
            sessionStorage.setItem('adminToken', 'demo-token-12345')
          }
          
          // Перенаправляем в админ панель
          router.push('/admin/dashboard')
        } else {
          errorMessage.value = 'Неверный email или пароль'
        }
        
        loading.value = false
      }
      
      // Проверка авторизации при загрузке
      onMounted(() => {
        const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')
        if (token) {
          router.push('/admin/dashboard')
        }
      })
      
      return {
        email,
        password,
        rememberMe,
        showPassword,
        loading,
        errorMessage,
        errors,
        currentYear,
        togglePasswordVisibility,
        handleLogin
      }
    }
  }
  </script>
  
  <style scoped>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }
  
  .login-container {
    background: white;
    border-radius: 20px;
    padding: 3rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 2;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .logo {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
    margin-bottom: 1rem;
  }
  
  .logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 600;
    color: #333;
  }
  
  .logo-accent {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 600;
    color: var(--primary-green);
  }
  
  .logo-sub {
    font-size: 0.9rem;
    color: #666;
    margin-left: 4px;
  }
  
  .login-header h1 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .login-header p {
    color: #666;
    font-size: 0.9rem;
  }
  
  .login-form {
    margin-bottom: 2rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
  }
  
  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f8f9fa;
  }
  
  .form-input:focus {
    outline: none;
    border-color: var(--primary-green);
    background: white;
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
  
  .form-input.error {
    border-color: #ef4444;
  }
  
  .password-input {
    position: relative;
  }
  
  .toggle-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.25rem;
    color: #666;
  }
  
  .error-message {
    color: #ef4444;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    display: block;
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.9rem;
    color: #666;
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
  
  .forgot-password {
    color: var(--primary-green);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
  }
  
  .forgot-password:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }
  
  .btn-login {
    width: 100%;
    padding: 1rem;
    background: var(--primary-green);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 1rem;
  }
  
  .btn-login:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(46, 125, 50, 0.3);
  }
  
  .btn-login:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
  
  .alert {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
  
  .alert-error {
    background: #fef2f2;
    color: #ef4444;
    border: 1px solid #fecaca;
  }
  
  .demo-credentials {
    background: #f8f9fa;
    border: 1px dashed #ddd;
    border-radius: 10px;
    padding: 1rem;
    margin-top: 1.5rem;
    font-size: 0.85rem;
    color: #666;
  }
  
  .demo-credentials p {
    margin: 0.25rem 0;
  }
  
  .demo-credentials strong {
    color: var(--primary-green);
  }
  
  .login-footer {
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
    color: #666;
    font-size: 0.8rem;
  }
  
  .login-footer p {
    margin: 0.25rem 0;
  }
  
  /* Background animation */
  .background-animation {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 1;
  }
  
  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 20s infinite linear;
  }
  
  .circle-1 {
    width: 300px;
    height: 300px;
    top: -150px;
    right: -150px;
    animation-delay: 0s;
  }
  
  .circle-2 {
    width: 200px;
    height: 200px;
    bottom: -100px;
    left: -100px;
    animation-delay: 5s;
    animation-duration: 15s;
  }
  
  .circle-3 {
    width: 150px;
    height: 150px;
    top: 50%;
    right: 10%;
    animation-delay: 10s;
    animation-duration: 25s;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    25% {
      transform: translateY(-20px) rotate(90deg);
    }
    50% {
      transform: translateY(0) rotate(180deg);
    }
    75% {
      transform: translateY(20px) rotate(270deg);
    }
  }
  
  /* Responsive */
  @media (max-width: 480px) {
    .login-container {
      padding: 2rem;
    }
    
    .login-page {
      padding: 1rem;
    }
  }
  </style>