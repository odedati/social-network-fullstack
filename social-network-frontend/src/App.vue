<template>
  <div id="app" class="background">
    <!-- Navbar -->
    <b-navbar toggleable="lg" type="dark" class="navbar-custom navbar-fixed-top">
      <!-- Brand -->
      <b-navbar-brand :to="{ name: 'main' }">Vue Recipes</b-navbar-brand>
      <!-- Navbar Toggle Button for small screens -->
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <!-- Navbar Collapsible Content -->
      <b-collapse id="nav-collapse" is-nav>
        <!-- Navbar Links on the Left -->
        <b-navbar-nav>
          <!-- About Link -->
          <b-nav-item :to="{ name: 'about' }" exact>About</b-nav-item>
          <!-- Search Link with Icon -->
          <b-nav-item :to="{ name: 'search' }" exact>
            <i class="fas fa-search mr-2"></i> Search
          </b-nav-item>
          <!-- Number of Recipes in Meal Plan -->
          <div v-if="$root.store.username" class="separator">|</div>
          <b-nav-item :to="{ name: 'meal-plan' }" class="meal-plan-info" v-if="$root.store.username">
            Recipes in Meal Plan<i class="fas fa-utensils ml-2"></i> :
            <b-badge :class="badgeClass">{{ numOfRecipesInMeal }}</b-badge>
          </b-nav-item>
        </b-navbar-nav>
        <!-- Navbar Links on the Right -->
        <b-navbar-nav class="ml-auto">
          <!-- Conditional Rendering Based on User Authentication -->
          <template v-if="!$root.store.username">
            <div class="user-box-before d-flex align-items-center">
              <span class="d-flex align-items-center">
                <span class="mr-2 text-light">
                  👋 Hello guest:
                </span>
                <!-- Register Button -->
                <b-button variant="outline-light" :to="{ name: 'register' }" class="mr-2 btn-register">Register</b-button>
                <!-- Login Button -->
                <b-button variant="outline-light" :to="{ name: 'login' }" class="btn-login">
                  <i class="fas fa-sign-in-alt mr-2"></i> Login
                </b-button>
              </span>
            </div>
          </template>
          <!-- User Dropdown Menu When Logged In -->
          <template v-else>
            <div class="user-box d-flex align-items-center">
              <span class="mr-2">
                👋 Hello:
              </span>
              <b-dropdown id="dropdown-1" right class="personal-dropdown">
                <template #button-content>
                  <i class="fas fa-user mr-2"></i> {{ $root.store.username }}
                </template>
                <b-dropdown-item :to="{ name: 'favorites' }">
                  My Favorites <i class="fas fa-heart ml-2"></i>
                </b-dropdown-item>
                <b-dropdown-item :to="{ name: 'my-recipes' }">
                  My Recipes <i class="fas fa-book ml-2"></i>
                </b-dropdown-item>
                <b-dropdown-item :to="{ name: 'family-recipes' }">
                  My Family Recipes <i class="fas fa-home ml-2"></i>
                </b-dropdown-item>
                <b-dropdown-item :to="{ name: 'meal-plan' }">
                  My Meal Plan <i class="fas fa-utensils ml-2"></i>
                </b-dropdown-item>
                <b-dropdown-item @click="$bvModal.show('create-recipe-modal')">
                  Create New Recipe <i class="fas fa-plus-circle ml-2"></i>
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item @click="logout" class="logout-item">
                  <span class="logout-text">Logout</span>
                  <i class="fas fa-sign-out-alt logout-icon"></i>
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- Router View for Loading Pages -->
    <router-view />
    <!-- Create Recipe Modal -->
    <CreateRecipeModal />
  </div>
</template>

<script>
import CreateRecipeModal from "./pages/CreateRecipeModal";
import { eventBus2 } from '@/services/user';

export default {
  name: "App",
  components: {
    CreateRecipeModal
  },
  data() {
    return {
      numOfRecipesInMeal: 0
    };
  },
  computed: {
    badgeClass() {
      return this.numOfRecipesInMeal > 0 ? 'badge-red' : 'badge-light';
    }
  },
  methods: {
    async logout() {
      try {
        await this.axios.delete(`${this.$root.store.server_domain}/users/deleteWatchedRecipes`);
        await this.axios.post(`${this.$root.store.server_domain}/users/resetAllMealPlan`);
        this.$root.$emit('clear-last-watched-recipes');
      } catch (err) {
        console.error("Error during the first logout step:", err);
      } finally {
        try {
          await this.axios.post(`${this.$root.store.server_domain}/Logout`);
        } catch (err) {
          console.error("Error during the second logout step:", err);
        }
        this.numOfRecipesInMeal = 0; // Reset the meal count to 0
        this.$root.store.logout();
        this.$root.toast("Logout", "User logged out successfully", "success");
        this.$router.push("/").catch(() => {
          this.$forceUpdate();
        });
      }
    },
    async updateMealCount() {
      try {
        const response = await this.axios.get(`${this.$root.store.server_domain}/users/meal_plan/count`, {
          headers: { 'Cache-Control': 'no-cache' } // Prevent caching issues
        });
        this.numOfRecipesInMeal = response.data.mealPlanCount;
      } catch (error) {
        console.error("Error fetching meal plan count:", error);
      }
    }
  },
  created() {
    this.updateMealCount(); // Fetch meal count on initial load
    this.$root.$on('update-meal-count', this.updateMealCount); // Update when event is emitted
    this.$root.$on('user-logged-in', this.updateMealCount); // Update after login
  },
  beforeDestroy() {
    this.$root.$off('update-meal-count', this.updateMealCount);
  }
};
</script>


<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'); // Import Roboto font

html, body {
  height: 100%; /* Ensure the html and body elements cover the entire viewport */
  margin: 0;
  padding: 0;
}

body {
  background-image: url('https://raw.githubusercontent.com/WED-2023/assignment2-1-315071910_311394365_31655631/main/photos/different-spices-herbs-stone-table-top-view-ingredients-cooking-food-background-different-spices-herbs-black-120232209-transformed.webp');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding-top: 60px; /* Adjust this value according to the height of your navbar */
}

#app {
  font-family: 'Nunito', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100%;
}

/* Navbar Custom Styles */
.navbar-custom.navbar-fixed-top {
  position: fixed; /* Fix the navbar at the top */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* Ensure it stays on top of other content */
  background-color: rgba(55, 50, 50, 0.8) !important; /* Darker background */
  backdrop-filter: blur(5px); /* Blur effect */
  box-shadow: 0 4px 12px rgba(88, 84, 84, 0.1); /* Subtle shadow for depth */
  padding: 10px 20px; /* Extra padding for more space */
  font-family: 'Roboto', sans-serif; /* Use the new font */
}

/* Ensure content does not hide under the fixed navbar */
body {
  padding-top: 60px; /* Adjust this value according to the height of your navbar */
}

/* Brand Name Styles */
.b-navbar-brand {
  font-weight: 700; /* Make the brand name bold */
  color: #ffffff !important; /* Set the brand name color to white */
  font-size: 1.75rem; /* Increase the font size */
  transition: color 0.3s; /* Smooth transition for color */
}

.b-navbar-brand:hover {
  color: #f8cdda !important; /* Change color on hover */
}

/* Navbar Item Styles */
.b-nav-item {
  font-weight: 600; /* Make the navbar items bold */
  color: #ffffff !important; /* Set the navbar items color to white */
  position: relative;
  margin: 0 15px; /* Add margin between the navbar items */
  transition: color 0.3s, transform 0.3s; /* Smooth transition for color and transform */
  background: linear-gradient(45deg, #3b82f6, #1e3a8a); /* Gradient background */
  border-radius: 4px; /* Rounded corners */
  padding: 8px 15px; /* Add padding for spacing */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  overflow: hidden;
}

.b-nav-item:hover,
.b-nav-item:focus,
.b-nav-item.router-link-exact-active {
  color: #ffffff !important; /* Ensure text color remains white on hover, focus, and when active */
  transform: scale(1.1); /* Slightly increase size on hover */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* Slightly larger shadow on hover */
}

.b-nav-item::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: #ffffff; /* White underline */
  transition: all 0.3s ease; /* Smooth transition for width */
  border-radius: 2px; /* Rounded corners */
}

.b-nav-item:hover::before,
.b-nav-item:focus::before,
.b-nav-item.router-link-exact-active::before {
  width: 100%; /* Full width on hover, focus, and when active */
  left: 0;
}

/* Separator Styles */
.separator {
  color: #ffffff;
  font-size: 1.5rem;
  margin: 0 10px;
  align-self: center;
}

/* Hover Effect Styles */
.meal-plan-info {
  position: relative;
  cursor: pointer;
}

.meal-plan-info::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  width: 0;
  height: 2px;
  background: #ffffff;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.meal-plan-info:hover::after,
.meal-plan-info:focus::after {
  width: 100%;
  left: 0;
}

/* Dropdown Item Styles */
.b-dropdown-item {
  color: #ffffff !important; /* Set the dropdown item color to white */
  transition: background-color 0.3s, transform 0.3s; /* Smooth transition for background color and transform */
}

.b-dropdown-item:hover {
  background-color: #f8cdda !important; /* Change background color on hover */
  transform: scale(1.05); /* Slightly increase size on hover */
}

/* Badge Styles */
.badge-light {
  background-color: #ffffff !important;
  color: #000000 !important;
}

.badge-red {
  background-color: #ff0000 !important;
  color: #ffffff !important;
}

/* Button Styles */
.b-button {
  color: #ffffff;
  border-color: #ffffff;
  transition: background-color 0.3s, border-color 0.3s, color 0.3s;
}

.b-button:hover {
  color: #ffffff;
  border-color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1); /* Slight background change on hover */
}

.b-nav-item.router-link-exact-active {
  color: #f8cdda !important;
}

/* Create Recipe Button Styles */
.btn-create-recipe {
  color: #ffffff !important;
  background-color: #f8cdda !important;
  border-radius: 4px;
  padding: 5px 10px;
  transition: background-color 0.3s;
}

.btn-create-recipe:hover {
  background-color: #2c3e50 !important;
}

/* Custom styles for Personal Area dropdown */
.personal-dropdown {
  .dropdown-toggle {
    color: #ffffff !important; /* Set dropdown button text color to white */
    background: none !important; /* Remove background color */
    border: 1px solid #ffffff !important; /* Add white border */
    display: flex;
    align-items: center;
    padding: 5px 20px; /* Add padding for spacing */
    border-radius: 4px; /* Rounded corners */
    transition: background-color 0.3s, border-color 0.3s;
  }

  .dropdown-toggle:hover {
    background-color: rgba(255, 255, 255, 0.1) !important; /* Slight background change on hover */
  }

  .dropdown-menu {
    background: rgba(0, 0, 0, 0.8); /* Set dropdown menu background to a semi-transparent black */
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    right: 0; /* Align dropdown menu to the right */
  }

  .dropdown-item {
    color: #ffffff !important; /* Set dropdown item text color to white */
    font-weight: 600; /* Make dropdown item text bold */
    transition: background-color 0.3s, transform 0.3s; /* Smooth transition for background color and transform */
    position: relative;
    overflow: hidden;
    padding: 10px 20px; /* Increase padding for better spacing */
  }

  .dropdown-item::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #1e3a8a, #3b82f6); /* Gradient background: dark blue to light blue */
    transition: left 0.3s ease;
    z-index: -1;
  }

  .dropdown-item:hover::before {
    left: 0;
  }

  .dropdown-item:hover {
    background-color: transparent !important; /* Make background transparent to show gradient */
    color: #ffffff !important; /* Ensure text color remains white */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Add shadow on hover */
    transform: scale(1.05); /* Slightly increase size on hover */
  }

  .logout-item {
    display: flex;
    align-items: center;
    transition: background-color 0.3s; /* Smooth transition for background color */
  }

  .logout-item .logout-text {
    color: #ff4d4d !important; /* Set the logout text color to red */
  }

  .logout-icon {
    color: #ff4d4d !important; /* Set the logout text color to red */
  }

  .logout-item:hover {
    background-color: rgba(255, 77, 77, 0.1) !important; /* Light red background on hover */
  }
}

.logout-icon {
  width: 16px; /* Set the width of the icon */
  height: 16px; /* Set the height of the icon */
  margin-left: 8px; /* Add margin to the left of the icon */
}

/* Custom styles for user box */
.user-box-before {
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  border-radius: 8px; /* Rounded corners */
  padding: 3.5px 12px; /* Add padding */
  display: flex;
  align-items: center;
  color: #ffffff; /* Set text color to white */
}

.user-box {
  background-color: rgba(11, 172, 73, 0.5); /* Semi-transparent background */
  border-radius: 8px; /* Rounded corners */
  padding: 3.5px 12px; /* Add padding */
  display: flex;
  align-items: center;
  color: #ffffff; /* Set text color to white */
}

.user-box span {
  margin-right: 8px; /* Add margin to the right of the greeting text */
}

/* Add these styles for the login and register buttons */
.btn-login {
  border-color: #0300ab !important;
  color: #ffffff !important;
}

.btn-login:hover {
  background-color: blue !important;
  color: #ffffff !important;
  border-color: blue !important;
}

.btn-register {
  border-color: #018212 !important;
  color: #ffffff !important;
}

.btn-register:hover {
  background-color: green !important;
  color: #ffffff !important;
  border-color: green !important;
}
</style>
