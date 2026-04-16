<template>
  <!-- Main container for the recipe preview list -->
  <b-container>
    <div class="header">
      <!-- Title of the recipe list -->
      <h3>
        {{ title }}:
        <slot></slot>
      </h3>
      <!-- Conditionally render the refresh button -->
      <button v-if="refreshButton" class="refresh-button" @click="updateRecipes">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>
    <!-- Row to contain recipe preview columns -->
    <b-row>
      <!-- Column for each recipe preview, responsive to screen size -->
      <b-col
        v-for="r in recipes"
        :key="r.id"
        cols="12"    
        md="6"       
        lg="4"       
      >
        <!-- Recipe preview component for each recipe -->
        <RecipePreview class="recipePreview" :recipe="r" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
import { mockGetRecipesPreview } from "../services/recipes.js";
import { mockGetWatchedRecipes } from "../services/user.js";
import { eventBus } from "../services/user.js";

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview
  },
  props: {
    title: {
      type: String,
      required: true
    },
    refreshButton: {
      type: Boolean,
      default: true
    },
    source: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      recipes: [] // Data property to hold the list of recipes
    };
  },

  mounted() {
  this.updateRecipes(); // Fetch initial set of recipes when the component is mounted
  eventBus.$on('recipe-watched', this.updateRecipes); // Listen for watched event
  eventBus.$on('watched-recipes-cleared', this.updateRecipes); // Listen for clear event

  // Listen for the logout event to clear last watched recipes if source is "watched"
  if (this.source === 'watched') {
    this.$root.$on('clear-last-watched-recipes', this.clearRecipes);
  }
},
beforeDestroy() {
  eventBus.$off('recipe-watched', this.updateRecipes); // Clean up event listener
  eventBus.$off('watched-recipes-cleared', this.updateRecipes); // Clean up event listener

  // Remove the event listener when the component is destroyed, if source is "watched"
  if (this.source === 'watched') {
    this.$root.$off('clear-last-watched-recipes', this.clearRecipes);
  }
},

  // mounted() {
  //   this.updateRecipes(); // Fetch initial set of recipes when the component is mounted
  //   eventBus.$on('recipe-watched', this.updateRecipes); // Listen for watched event
  //   eventBus.$on('watched-recipes-cleared', this.updateRecipes); // Listen for clear event
  // },
  // beforeDestroy() {
  //   eventBus.$off('recipe-watched', this.updateRecipes); // Clean up event listener
  //   eventBus.$off('watched-recipes-cleared', this.updateRecipes); // Clean up event listener
  // },

  methods: {
  async updateRecipes() {
    try {
      let response;
      if (this.source === 'watched') {
        response = await fetch(this.$root.store.server_domain + '/users/lastWatchedRecipes'); // Fetch last watched recipes from server
        const data = await response.json();
        this.recipes = data; // Assign fetched recipes to the data property
        // response = await mockGetWatchedRecipes(); // Fetch watched recipes
        // let recipes = response.data.recipes; // Extract recipes from the response
        // console.log(recipes);
        // recipes = recipes.slice(-3); // Only take the last 3 recipes
        // this.recipes = recipes; // Assign fetched recipes to the data property
      } else {
        // const amountToFetch = 3; // Set this to the number of recipes to fetch
        // response = await mockGetRecipesPreview(amountToFetch); // Fetch explore recipes
        // response = await mockGetWatchedRecipes();
        // this.recipes = response.data.recipes; // Assign fetched recipes to the data property
        // Fetch explore recipes from server
        response = await fetch( this.$root.store.server_domain + '/recipes/random');
        const recipes = await response.json();
        this.recipes = recipes; // Assign fetched recipes to the data property
        // this.recipes = response.data.recipes; // Assign fetched recipes to the data property
      }
    } catch (error) {
      console.log(error); // Log any errors that occur during the fetch
    }
  }, 
  clearRecipes() {
    this.recipes = []; // Clear the recipes data
  }
}
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px; // Minimum height for the container
}

.header {
  display: flex; // Use flexbox for layout
  justify-content: space-between; // Space out items in the header
  align-items: center; // Center items vertically
}

.refresh-button {
  background: none; // Remove default button background
  border: none; // Remove default button border
  cursor: pointer; // Change cursor to pointer on hover
  font-size: 1.5rem; // Set font size
  color: #007bff; // Set color
  transition: transform 0.3s ease; // Smooth transition for transform property

  &:hover {
    transform: rotate(360deg); // Rotate icon on hover
  }
}

.recipePreview {
  margin-bottom: 20px; // Add bottom margin to each recipe preview
}
</style>
