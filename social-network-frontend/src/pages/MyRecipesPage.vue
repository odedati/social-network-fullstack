<template>
  <div>
    <br>
    <h1 class="title">My Recipes</h1>
    <div class="recipes-container">
      <!-- If loading, display the loading spinner -->
      <div v-if="loading" class="loading-spinner">
        Loading
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
      </div>
      <!-- If there are recipes, display them in a grid -->
      <div v-else-if="recipes.length" class="recipes-grid">
        <RecipePreview v-for="r in recipes" :key="r.id" :recipe="r" />
      </div>
      <!-- If there are no recipes, display a message -->
      <div v-else class="no-recipes">You have no recipes yet.</div>
    </div>
  </div>
</template>

<script>
import RecipePreview from "../components/RecipePreview"; // Import the RecipePreview component
import axios from "axios"; // Import axios for making HTTP requests

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview, // Register the RecipePreview component
  },
  data() {
    return {
      recipes: [], // Initialize an empty array for storing user recipes
      loading: true, // Add a loading state
    };
  },
  mounted() {
    this.updateRecipes(); // Call updateRecipes when the component is mounted
  },
  methods: {
    // Method to fetch user recipes and update the recipes array
    async updateRecipes() {
      this.loading = true; // Set loading to true when fetching starts
      try {
        const response = await axios.get(
          this.$root.store.server_domain + '/users/my_recipes', { withCredentials: true }
        ); // Fetch the user recipes
        this.recipes = response.data;
      } catch (error) {
        console.error("Error fetching user recipes:", error); // Log any errors to the console
      } finally {
        this.loading = false; // Set loading to false when fetching ends
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@700&display=swap');

/* Container for the user recipes section */
.recipes-container {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  max-width: 1200px;
  margin: auto;
}

/* Title styling */
.title {
  font-size: 72px;
  text-transform: uppercase;
  font-weight: 700;
  font-family: 'Josefin Sans', sans-serif;
  color: #54472e; /* Stone-like grey with light orange */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(224, 149, 9, 0.7); /* Shadow and orange glow */
  margin-bottom: 30px;
  text-align: center;
}

/* Grid styling for the user recipes */
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  justify-items: center;
}

/* Styling for individual recipe previews */
.recipe-preview {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  max-width: 300px;
}

/* Image styling within recipe previews */
.recipe-preview img {
  width: 100%;
  height: auto;
  border-bottom: 1px solid #eee;
}

/* Hover effect for recipe previews */
.recipe-preview:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Information section within recipe previews */
.recipe-preview .recipe-info {
  padding: 15px;
}

/* Title styling within recipe previews */
.recipe-preview .recipe-info h3 {
  font-size: 1.5em;
  margin: 0;
  color: #343a40;
}

/* Details section within recipe previews */
.recipe-preview .recipe-info .details {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

/* Detail items styling */
.recipe-preview .recipe-info .details span {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  color: #777;
}

/* Icon styling within detail items */
.recipe-preview .recipe-info .details span i {
  margin-right: 5px;
}

/* Message displayed when there are no user recipes */
.no-recipes {
  font-size: 1.2em;
  color: #888;
  text-align: center;
  margin-top: 20px;
}

/* Loading spinner styling */
.loading-spinner {
  font-size: 1.5em;
  color: #4caf50; /* Green color for the text */
  text-align: center;
  margin-top: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  position: relative;
  margin: 0 auto;
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #4caf50; /* Green color for the spinner */
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  animation-delay: -1s;
}

@keyframes bounce {
  0%, 100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
}

/* Responsive styling for smaller screens */
@media (max-width: 768px) {
  .title {
    font-size: 2em;
  }

  .recipe-preview {
    margin: 10px;
  }
}
</style>
