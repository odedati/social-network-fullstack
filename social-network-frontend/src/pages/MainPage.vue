<template>
  <div class="main-container">
    <!-- Title with solid color text -->
    <div class="wrapper">
      <h1>Main Page</h1>
    </div>

    <!-- Recipe Lists and Auth Section -->
    <div class="recipes-section">
      <!-- RecipePreviewList with refresh button shown -->
      <RecipePreviewList title="Explore these Recipes" class="recipe-card" source="explore" />

      <!-- Blurred Section with Login form for unauthenticated users -->
      <div class="blur-container">
        <RecipePreviewList
          title="Last watched recipes"
          :class="{ 'recipe-card': true, blur: !isAuthenticated }"
          :refreshButton="false"
          source="watched"
        />

        <!-- Show login form if user is not authenticated -->
        <div v-if="!isAuthenticated" class="auth-form">
          <b-card class="login-card shadow-sm p-4">
            <h1 class="login-prompt text-center mb-4">You need to Login to view this:</h1>
            <b-form @submit.prevent="onLogin">
              <b-form-group label="Username:" label-for="Username" label-cols-sm="3">
                <b-form-input
                  id="Username"
                  v-model="$v.form.username.$model"
                  type="text"
                  :state="validateState('username')"
                  placeholder="Enter your username"
                  class="rounded-pill"
                  required
                ></b-form-input>
                <b-form-invalid-feedback v-if="!$v.form.username.required">
                  Username is required
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group label="Password:" label-for="Password" label-cols-sm="3">
                <b-form-input
                  id="Password"
                  type="password"
                  v-model="$v.form.password.$model"
                  :state="validateState('password')"
                  placeholder="Enter your password"
                  class="rounded-pill"
                  required
                ></b-form-input>
                <b-form-invalid-feedback v-if="!$v.form.password.required">
                  Password is required
                </b-form-invalid-feedback>
              </b-form-group>

              <div class="d-flex justify-content-center">
                <b-button type="submit" variant="primary" class="rounded-pill px-4">Login</b-button>
              </div>

              <div class="text-center mt-3">
                Don't have an account yet?
                <router-link to="/register" class="text-primary font-weight-bold">Register here</router-link>
              </div>
            </b-form>
          </b-card>

          <b-alert v-if="form.submitError" variant="danger" dismissible class="mt-3">
            Login failed: {{ form.submitError }}
          </b-alert>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from "../components/RecipePreviewList";
import { required } from "vuelidate/lib/validators";

export default {
  components: {
    RecipePreviewList,
  },
  data() {
    return {
      form: {
        username: "",
        password: "",
        submitError: undefined,
      },
    };
  },
  validations: {
    form: {
      username: { required },
      password: { required },
    },
  },
  computed: {
    isAuthenticated() {
      return !!this.$root.store.username;
    },
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async Login() {
      try {
        const response = await this.axios.post(
          `${this.$root.store.server_domain}/Login`,
          {
            username: this.form.username,
            password: this.form.password,
          },
          { withCredentials: true }
        );
        // Update store with logged-in user
        this.$root.store.login(this.form.username);
        
        // Emit events to update the meal plan count and refresh data
        this.$root.$emit('user-logged-in');
        this.$root.$emit('update-meal-count');

        // Redirect to the home page after successful login
        this.$router.push("/");
      } catch (err) {
        this.form.submitError = err.response
          ? err.response.data.message
          : "Unknown error";
      }
    },
    onLogin() {
      this.form.submitError = undefined;
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.Login();
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@700&display=swap");

$avatar-size: 32px;
$body-background: #f0f4f8;
$primary-color: #007bff; // Blue color for Login button
$secondary-color: #28a745; // Green color for Register button

body {
  height: 100vh;
  margin: 0;
  background-color: $body-background;
  font-family: "Open Sans", Arial, sans-serif;
  overflow-x: hidden;
  display: grid;
  place-items: center;
}

a {
  text-decoration: none;
  color: #9ca0b1;
}

.main-container {
  font-family: "Open Sans", sans-serif;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

.wrapper {
  text-align: center;
}

.wrapper h1 {
  font-size: 72px;
  text-transform: uppercase;
  font-weight: 700;
  font-family: "Josefin Sans", sans-serif;
  color: #2c3e50; /* Dark blue */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 128, 255, 0.7); /* Shadow and glow */
}

.recipes-section {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  position: relative;
}

.recipe-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.auth-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 500px;
}

.blur-container {
  position: relative;
  width: 100%;
}

.blur {
  filter: blur(7px);
  pointer-events: none;
}

.login-prompt {
  font-size: 1.2rem; /* Smaller font size */
  color: #333;
  margin-bottom: 20px;
}

.b-form-input {
  border-radius: 50px;
  padding: 10px 15px;
}

.b-button {
  border-radius: 50px;
}

.text-primary {
  color: #007bff !important;
}

.font-weight-bold {
  font-weight: bold;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

@media (max-width: 768px) {
  .wrapper h1 {
    font-size: 70px;
  }

  .recipes-section {
    gap: 20px;
  }

  .recipe-card {
    width: 95%;
  }

  .b-form-input,
  .b-button {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .wrapper h1 {
    font-size: 50px;
  }

  .recipes-section {
    gap: 20px;
  }

  .recipe-card {
    width: 100%;
  }

  .b-form-input,
  .b-button {
    font-size: 0.8rem;
  }
}
</style>
