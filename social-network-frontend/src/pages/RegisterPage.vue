<template>
  <div>
    <br>
    <br>
    <div class="container d-flex align-items-center justify-content-center">
      <b-card class="register-card shadow-sm p-4">
        <h1 class="title text-center mb-4">Register</h1>
        <b-form @submit.prevent="onRegister" @reset.prevent="onReset">
          <b-form-group label="Username:" label-for="username" label-cols-sm="3">
            <b-form-input
              id="username"
              v-model="$v.form.username.$model"
              @blur="checkUsername"
              type="text"
              :state="usernameTaken ? false : validateState('username')"
              placeholder="Enter your username"
              class="rounded-pill"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.username.required">
              Username is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.username.length">
              Username must be between 3-8 characters long
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.username.alpha">
              Username must contain only letters
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="usernameTaken">
              Username is already taken
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group label="First Name:" label-for="firstName" label-cols-sm="3">
            <b-form-input
              id="firstName"
              v-model="$v.form.firstName.$model"
              type="text"
              :state="validateState('firstName')"
              placeholder="Enter your first name"
              class="rounded-pill"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.firstName.required">
              First name is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.firstName.alpha">
              First name must contain only letters
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group label="Last Name:" label-for="lastName" label-cols-sm="3">
            <b-form-input
              id="lastName"
              v-model="$v.form.lastName.$model"
              type="text"
              :state="validateState('lastName')"
              placeholder="Enter your last name"
              class="rounded-pill"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.lastName.required">
              Last name is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.lastName.alpha">
              Last name must contain only letters
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group label="Country:" label-for="country" label-cols-sm="3">
            <b-form-select
              id="country"
              v-model="$v.form.country.$model"
              :options="countries"
              :state="validateState('country')"
              class="rounded-pill"
            ></b-form-select>
            <b-form-invalid-feedback v-if="!$v.form.country.required">
              Country is required
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group label="Email Address:" label-for="email" label-cols-sm="3">
            <b-form-input
              id="email"
              v-model="$v.form.email.$model"
              type="email"
              :state="validateState('email')"
              placeholder="Enter your email address"
              class="rounded-pill"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.email.required">
              Email is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.email.email">
              Email must be valid
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group label="Password:" label-for="password" label-cols-sm="3">
            <b-form-input
              id="password"
              type="password"
              v-model="$v.form.password.$model"
              :state="validateState('password')"
              placeholder="Enter your password"
              class="rounded-pill"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.password.required">
              Password is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.password.length">
              Password must be between 5-10 characters long
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.password.hasNumber">
              Password must contain at least one number
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.password.hasSpecial">
              Password must contain at least one special character
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group label="Confirm Password:" label-for="confirmedPassword" label-cols-sm="3">
            <b-form-input
              id="confirmedPassword"
              type="password"
              v-model="$v.form.confirmedPassword.$model"
              :state="validateState('confirmedPassword')"
              placeholder="Confirm your password"
              class="rounded-pill"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.confirmedPassword.required">
              Password confirmation is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.confirmedPassword.sameAsPassword">
              Passwords do not match
            </b-form-invalid-feedback>
          </b-form-group>

          <div class="d-flex justify-content-between">
            <b-button type="reset" variant="outline-danger" class="rounded-pill px-4">Reset</b-button>
            <b-button type="submit" variant="primary" class="rounded-pill px-4">Register</b-button>
          </div>

          <div class="text-center mt-3">
            Already have an account?
            <router-link to="/login" class="text-primary font-weight-bold"> Log in here</router-link>
          </div>
        </b-form>
      </b-card>

      <b-alert v-if="form.submitError" variant="danger" dismissible class="mt-3">
        Registration failed: {{ form.submitError }}
      </b-alert>
    </div>
    <br>
    <br>
  </div>
</template>

<script>
import countries from "../assets/countries";
import {
  required,
  minLength,
  maxLength,
  alpha,
  email,
  sameAs,
  helpers
} from "vuelidate/lib/validators";
import axios from "axios";

const hasNumber = helpers.regex("hasNumber", /\d/);
const hasSpecial = helpers.regex("hasSpecial", /[\W_]/);

export default {
  name: "Register",
  data() {
    return {
      form: {
        username: "",
        firstName: "",
        lastName: "",
        country: null,
        email: "",
        password: "",
        confirmedPassword: "",
        submitError: undefined,
      },
      countries: [{ value: null, text: "Select your country", disabled: true }].concat(countries),
      usernameTaken: false,
    };
  },
  validations: {
    form: {
      username: {
        required,
        length: (u) => minLength(3)(u) && maxLength(8)(u),
        alpha,
      },
      firstName: {
        required,
        alpha,
      },
      lastName: {
        required,
        alpha,
      },
      country: {
        required,
      },
      email: {
        required,
        email,
      },
      password: {
        required,
        length: (p) => minLength(5)(p) && maxLength(10)(p),
        hasNumber,
        hasSpecial,
      },
      confirmedPassword: {
        required,
        sameAsPassword: sameAs("password"),
      },
    },
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async checkUsername() {
      if (!this.form.username) return;

      try {
        // Call the backend API to check if the username exists
        await axios.get("/check-username", { params: { username: this.form.username } });
        this.usernameTaken = false; // Username is available
      } catch (err) {
        if (err.response && err.response.status === 409) {
          this.usernameTaken = true; // Username is taken
        } else {
          console.error(err); // Handle other potential errors
        }
      }
    },
    async Register() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError || this.usernameTaken) {
        return;
      }
      try {
        const response = await axios.post(this.$root.store.server_domain + "/Register", {
          username: this.form.username,
          password: this.form.password,
          firstname: this.form.firstName,
          lastname: this.form.lastName,
          country: this.form.country,
          email: this.form.email,
        });
        this.$router.push("/login"); // Redirect to login page
      } catch (err) {
        this.form.submitError = err.response ? err.response.data.message : "Unknown error";
      }
    },
    onRegister() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError || this.usernameTaken) {
        return;
      }
      this.Register();
    },
    onReset() {
      this.form = {
        username: "",
        firstName: "",
        lastName: "",
        country: null,
        email: "",
        password: "",
        confirmedPassword: "",
        submitError: undefined,
      };
      this.usernameTaken = false;
      this.$v.$reset();
    },
  },
  watch: {
    "form.username": "checkUsername", // Watch for changes in username and check availability
  },
};
</script>
