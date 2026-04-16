<template>
  <div class="container d-flex align-items-center justify-content-center">
    <b-card class="login-card shadow-sm p-4">
      <h1 class="title text-center mb-4">Login</h1>
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
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { mockLogin } from "../services/auth.js";

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
        submitError: undefined
      }
    };
  },
  validations: {
    form: {
      username: { required },
      password: { required }
    }
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async Login() {
      try {
        // Perform the login request to the backend
        const response = await this.axios.post(
          this.$root.store.server_domain + "/Login", 
          {
            username: this.form.username,
            password: this.form.password
          },
          { withCredentials: true }
        );

        // Update the root store with the logged-in user's username
        this.$root.store.login(this.form.username);

        // Directly call updateMealCount after successful login
        this.$root.$emit('user-logged-in'); // Trigger event if necessary
        this.$root.$emit('update-meal-count'); // Emit event to update meal count

        // Redirect to the home page after successful login
        this.$router.push("/");
      } catch (err) {
        // Handle errors and set an error message to display
        this.form.submitError = err.response ? err.response.data.message : "Unknown error";
      }
    },
    onLogin() {
      // Clear any previous error messages
      this.form.submitError = undefined;

      // Trigger validation
      this.$v.form.$touch();

      // If validation passes, proceed with the login
      if (!this.$v.form.$anyError) {
        this.Login();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  max-width: 500px;
  width: 100%;
  border-radius: 20px;
  border: none;
  background: #ffffff;
}

.title {
  font-size: 2rem;
  color: #333333;
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
  box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075) !important;
}
</style>
