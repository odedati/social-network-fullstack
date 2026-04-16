<template>
  <div class="recipe-page">
    <div v-if="recipe" class="recipe-content">
      <div class="recipe-header">
        <img :src="recipe.image" class="recipe-image" />
        <div class="recipe-info-header">
          <h1 class="recipe-title">{{ recipe.title }}</h1>
          <hr class="title-divider" />
          <div class="recipe-meta">
            <div class="dietary-buttons">
              <div v-if="recipe.glutenFree" class="dietary-item">
                <img src="https://github.com/WED-2023/assignment2-1-315071910_311394365_31655631/blob/main/photos/gluten-free2.png?raw=true" alt="Gluten-Free" class="dietary-icon" />
                <span>Gluten-Free</span>
              </div>
              <div v-if="recipe.vegetarian" class="dietary-item">
                <img src="https://github.com/WED-2023/assignment2-1-315071910_311394365_31655631/blob/main/photos/vegetable.png?raw=true" alt="Vegetarian" class="dietary-icon" />
                <span>Vegetarian</span>
              </div>
              <div v-if="recipe.vegan" class="dietary-item">
                <img src="https://github.com/WED-2023/assignment2-1-315071910_311394365_31655631/blob/main/photos/vegan.png?raw=true" alt="Vegan" class="dietary-icon" />
                <span>Vegan</span>
              </div>
            </div>
            <div class="time-likes">
              <div class="item time">
                <i class="fas fa-clock"></i>
                {{ recipe.readyInMinutes }} minutes
              </div>
              <div class="item likes">
                <i class="fas fa-thumbs-up"></i>
                {{ recipe.popularity }} likes
              </div>
              <div class="item servings">
                <i class="fas fa-utensils"></i>
                {{ recipe.servings }} servings
              </div>
            </div>
            <button v-if="$root.store.username" @click.stop.prevent="toggleFavorite" class="favorite-btn" aria-label="Toggle favorite">
              <i :class="favorite ? 'fas fa-heart active' : 'far fa-heart'"></i>
              {{ favorite ? 'Remove from My Favorite' : 'Add to My Favorite' }}
            </button>
          </div>
        </div>
      </div>
      <div class="recipe-details">
        <div class="recipe-body">
          <div class="ingredients">
            <h3>Ingredients</h3>
            <hr class="title-divider" />
            <ul>
              <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
                {{ ingredient.amount }} {{ ingredient.unit }} {{ ingredient.name }}
              </li>
            </ul>
          </div>
          <div class="instructions">
            <h3>Instructions</h3>
            <hr class="title-divider" />
            <ol>
              <li v-for="(step, index) in recipe.instructions" :key="index">
                {{ step.step }}
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div class="recipe-actions">
        <button v-if="$root.store.username" :class="['add-to-meal', { 'added': addedToMeal }]" @click="addToMeal">
          <i :class="[addedToMeal ? 'fas fa-check' : 'fas fa-plus-circle']"></i>
          {{ addedToMeal ? 'Added to Meal Plan' : 'Add to Meal Plan' }}
        </button>
        <button v-if="$root.store.username" @click="startPreparation" class="start-preparation">
          <i class="fas fa-play-circle"></i> Start Preparation
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      recipe: null,
      favorite: false,
      addedToMeal: false,
      watched: false,  // State to track if the recipe is marked as watched
    };
  },
  async created() {
    try {
      const id = this.$route.params.recipeId;
      console.log("Fetching recipe with ID:", id); // Debugging line

      axios.defaults.withCredentials = true;

      const config = {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      };

      let response;
      if (Number.isInteger(parseInt(id))) {
        response = await axios.get(`${this.$root.store.server_domain}/recipes/${id}`, config);
      } else {
        if (id.substring(0, 6) === "FAMILY") {
          response = await axios.get(`${this.$root.store.server_domain}/recipes/FAMILY/${id}`, config);
        } else {
          response = await axios.get(`${this.$root.store.server_domain}/users/my_recipes/${id}`, config);
        }
      }

      console.log("Response status:", response.status);  // Debugging line

      if (response.status !== 200 && response.status !== 304) {
        this.$router.replace("/NotFound");
        return;
      }

      const recipeData = response.status === 304 ? this.recipe : response.data;
      console.log("Fetched recipe data:", recipeData);  // Debugging line

      const { title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree, ingredients, instructions, servings, isFavorite, inMyMeal } = recipeData;

      const formattedInstructions = instructions.length > 0 && instructions[0].steps
        ? instructions[0].steps.map(step => ({ number: step.number, step: step.step }))
        : [];

      this.recipe = { title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree, ingredients, instructions: formattedInstructions, servings, isFavorite, id, inMyMeal };
      this.favorite = isFavorite;
      this.addedToMeal = this.recipe.inMyMeal;

      // Replace mockAddWatchedRecipe with actual markAsWatched method
      await this.markAsWatched();

      axios.defaults.withCredentials = false;
    } catch (error) {
      console.error("Error fetching recipe:", error);  // Debugging line
      this.$router.replace("/NotFound");
    }
  },
  methods: {
    async toggleFavorite() {
      axios.defaults.withCredentials = true;
      this.favorite = !this.favorite;
      const url = `${this.$root.store.server_domain}/users/favorites`;
      try {
        if (this.favorite) {
          await axios.post(url, { recipeId: this.recipe.id });
        } else {
          await axios.delete(url, { data: { recipeId: this.recipe.id } });
        }
      } catch (error) {
        this.favorite = !this.favorite;
        console.error("Error toggling favorite:", error);
      } finally {
        axios.defaults.withCredentials = false;
      }
    },
    async addToMeal() {
      this.addedToMeal = !this.addedToMeal;
      const url = `${this.$root.store.server_domain}/users/meal_plan`;
      axios.defaults.withCredentials = true;
      try {
        if (this.addedToMeal) {
          await axios.post(url, { recipeId: this.recipe.id });
        } else {
          await axios.delete(url, { data: { recipeId: String(this.recipe.id) } });
        }
        this.$root.$emit('update-meal-count');
      } catch (error) {
        this.addedToMeal = !this.addedToMeal;
        console.error("Error updating meal plan:", error);
      } finally {
        axios.defaults.withCredentials = false;
      }
    },
    async startPreparation() {
      if (!this.addedToMeal) {
        await this.addToMeal();
      }
      this.$router.push({ name: 'RecipePreparation', params: { recipeId: this.recipe.id } });
    },
    // Mark the recipe as watched when the page is opened
    async markAsWatched() {
      if (!this.$root.store.username) {
        console.log("User not logged in, cannot mark as watched");
        return;
      }
      
      try {
        console.log(`Marking recipe ${this.recipe.id} as watched...`);  // Log the request
        const response = await axios.post(`${this.$root.store.server_domain}/users/markwatched/${this.recipe.id}`);
        
        if (response.status === 200) {
          this.watched = true;
          console.log(`Recipe ${this.recipe.id} marked as watched`);
        } else {
          console.error(`Failed to mark recipe as watched: ${response.status}`);
        }
      } catch (error) {
        console.error("Error marking recipe as watched:", error);
      }
    }
  }
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Lora:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");

body {
  font-family: "Roboto", sans-serif;
}

.recipe-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40px;
  box-sizing: border-box;
}

.recipe-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.recipe-header {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background: rgba(0, 0, 0, 0.05);
}

.recipe-image {
  width: 100%;
  max-width: 558px; /* Adjust the max width as needed */
  height: 400px; /* Fixed height */
  object-fit: cover; /* Maintain aspect ratio, cover the area */
  border-radius: 8px;
  margin-right: 20px;
}

.recipe-info-header {
  flex: 1;
}

.recipe-title {
  font-family: 'Lora', serif;
  font-size: 2rem;
  margin-bottom: 20px;
}

.title-divider {
  border: 0;
  height: 1px;
  background: #ccc;
  margin: 10px 0;
}

.recipe-meta {
  display: flex;
  flex-direction: column;
}

.dietary-buttons {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.dietary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.dietary-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dietary-icon {
  width: 24px;
  height: 24px;
}

.favorite-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 260px;
  height: 50px;
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.favorite-btn:active i {
  animation: spin 0.5s ease;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.favorite-btn:hover {
  background-color: #c0392b;
}

.favorite-btn i {
  font-size: 1.2rem;
  margin-right: 8px;
}

.favorite-btn .active {
  color: #fff;
}

.time-likes {
  display: flex;
  gap: 20px;
  font-size: 1.1em;
  color: #333;
  margin-bottom: 20px;
}

.time-likes .item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background-color: #f1f1f1;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.time-likes .item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.time-likes i {
  font-size: 1.5rem;
  color: #555;
  transition: transform 0.3s ease;
}

.time-likes .item:hover i {
  animation: spin 0.5s ease;
}

.recipe-details {
  padding: 20px;
}

.recipe-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.ingredients,
.instructions {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.ingredients h3,
.instructions h3 {
  margin-bottom: 20px;
  color: #555;
}

.ingredients ul,
.instructions ol {
  padding-left: 20px;
}

.ingredients li,
.instructions li {
  margin-bottom: 10px;
  font-size: 1.1em;
}

.recipe-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background: #f8f8f8;
  border-top: 1px solid #eee;
}

.add-to-meal,
.start-preparation {
  padding: 12px 24px;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
}

.add-to-meal {
  background-color: #76c7c0; /* Teal */
}

.add-to-meal i {
  margin-right: 8px;
}

.add-to-meal:hover {
  background-color: #5ca3a0;
  transform: translateY(-3px);
}

.add-to-meal:active {
  background-color: #4a9081;
  transform: translateY(0);
}

.add-to-meal.added {
  background-color: #4CAF50; /* Green */
}

.add-to-meal.added:hover {
  background-color: #45A049;
}

.start-preparation {
  background-color: #0e9a5b; /* Green */
}

.start-preparation i {
  margin-right: 8px;
}

.start-preparation:hover {
  background-color: #109b3c;
  transform: translateY(-3px);
}

.start-preparation:active {
  background-color: #0d7a3a;
  transform: translateY(0);
}
</style>
