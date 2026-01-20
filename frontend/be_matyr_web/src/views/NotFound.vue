<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Страница не найдена</h2>
        <p>Запрошенная страница не существует или была перемещена.</p>
        <router-link to="/" class="btn btn-primary">
          Вернуться на главную
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.not-found-content h1 {
  font-size: 8rem;
  color: var(--primary-green);
  font-weight: 700;
  line-height: 1;
  margin-bottom: 1rem;
}

.not-found-content h2 {
  font-size: 2rem;
  color: var(--primary-dark);
  margin-bottom: 1rem;
}

.not-found-content p {
  color: var(--text-light);
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
</style>