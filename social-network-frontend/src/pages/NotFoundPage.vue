<!-- <template>
  <div class="container">
    <h1>Four Oh Four you didn't</h1>
    <router-link to="/" exact>ET Go Home</router-link>
  </div>
</template> -->


<template>
  <div class="not-found-container">
    <div class="error-content">
      <h1 class="error-title">404</h1>
      <p class="error-message">Oops! The page you're looking for doesn't exist.</p>
      <router-link to="/" class="home-link">Take Me Home</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFoundPage",
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");

.not-found-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: linear-gradient(135deg, #f8cdda, #1e3a8a); Gradient background */
  font-family: "Poppins", sans-serif;
}

.error-content {
  text-align: center;
  color: #fff;
  max-width: 600px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.error-title {
  font-size: 6rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.error-message {
  font-size: 1.5rem;
  font-weight: 400;
  margin: 20px 0;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 1rem;
  font-weight: 600;
  color: #1e3a8a;
  background-color: #f8cdda;
  border-radius: 50px;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;
}

.home-link:hover {
  background-color: #fff;
  color: #1e3a8a;
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .error-title {
    font-size: 4rem;
  }

  .error-message {
    font-size: 1.2rem;
  }

  .home-link {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}
</style>
