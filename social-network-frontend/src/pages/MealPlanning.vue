<template>
  <div>
    <br>
    <h1 class="title">Meal Planning</h1>
    <div class="meal-planning-container">
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading...</div>
      </div>
      <div v-else>
        <div v-if="mealRecipes.length" class="meal-recipes">
          <div
            v-for="(recipe, index) in mealRecipes"
            :key="recipe.id"
            class="meal-recipe"
            :class="{ 'dragging': draggingIndex === index }"
            draggable="true"
            @dragstart="onDragStart(index, $event)"
            @dragover="onDragOver($event)"
            @drop="onDrop(index)"
            @dragend="onDragEnd"
          >
            <div class="meal-recipe-content">
              <div class="meal-recipe-image-container">
                <img :src="recipe.image" alt="Recipe Photo" class="meal-recipe-photo" />
              </div>
              <div class="meal-recipe-details">
                <div class="meal-recipe-header">
                  <span class="meal-recipe-number">{{ index + 1 }}. {{ recipe.title }}</span>
                  <button class="remove-btn" @click="removeRecipeFromMeal(recipe.id)">&times;</button>
                </div>
                <span class="meal-recipe-time"><i class="fas fa-clock"></i> {{ recipe.readyInMinutes }} Minutes</span>
                <div class="meal-recipe-status" :class="getStatusClass(recipe.progress)">
                  <span>{{ getRecipeStatusText(recipe.progress) }}</span>
                  <i :class="getStatusIcon(recipe.progress)"></i>
                </div>
                <div class="progress-bar-container">
                  <progress-bar :progress="Math.floor(recipe.progress * 100)" />
                </div>

                <!-- Conditionally render the button or a blank space -->
                <div v-if="recipe.progress < 1">
                  <router-link
                    :to="{ name: 'RecipePreparation', params: { recipeId: recipe.id } }"
                    class="start-preparation"
                  >
                    <i class="fas fa-play-circle"></i>
                    {{ recipe.progress === 0 ? "Start Preparation" : "Continue Preparation" }}
                  </router-link>
                </div>
                <br v-else /> <!-- Blank line when recipe is complete -->
              </div>
            </div>
          </div>
          <button class="clear-meal-btn" @click="showClearMealModal">Clear All Recipes From Meal Plan</button>
        </div>
        <div v-else class="no-recipes">No recipes added to the meal plan yet.</div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <b-modal id="clear-meal-modal" @ok="clearMeal">
      <template #modal-title>Clear Meal Plan</template>
      Are you sure you want to clear all recipes from the meal plan?
    </b-modal>
  </div>
</template>


<script>
import axios from 'axios';
import ProgressBar from "../components/ProgressBar";

export default {
  name: "MealPlanning",
  components: {
    ProgressBar
  },
  data() {
    return {
      mealRecipes: [],
      draggingIndex: null,
      isLoading: true,
    };
  },
  async mounted() {
    await this.getRecipes();
  },
  methods: {
    async getRecipes() {
      try {
        const response = await axios.get(`${this.$root.store.server_domain}/users/meal_plan`, {
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        this.mealRecipes = response.data.map(recipe => ({
          ...recipe,
          progress: recipe.progress || 0,
        }));
        
        // Restore the saved order if it exists
        const savedOrder = JSON.parse(localStorage.getItem('mealRecipesOrder'));
        if (savedOrder) {
          this.mealRecipes = this.mealRecipes.sort((a, b) => savedOrder.indexOf(a.id) - savedOrder.indexOf(b.id));
        }
      } catch (error) {
        console.error("Error fetching meal recipes:", error);
      } finally {
        this.isLoading = false; // Set isLoading to false after data is fetched
      }
    },
    async removeRecipeFromMeal(recipeId) {
      this.mealRecipes = this.mealRecipes.filter(recipe => recipe.id !== recipeId);
      try {
        await axios.delete(`${this.$root.store.server_domain}/users/meal_plan`, {
          data: { recipeId: String(recipeId) },
          withCredentials: true
        });
        // Emit the event to update meal count
        this.$root.$emit('update-meal-count');
      } catch (error) {
        console.error("Error removing recipe from meal plan:", error);
      }
      
      // Save the new order to localStorage
      const order = this.mealRecipes.map(recipe => recipe.id);
      localStorage.setItem('mealRecipesOrder', JSON.stringify(order));
    },
    async clearMeal() {
      try {
        await axios.delete(`${this.$root.store.server_domain}/users/meal_plan/all`, {
          withCredentials: true
        });
        this.mealRecipes = [];
        localStorage.removeItem('mealRecipesOrder'); // Clear the saved order
        // Emit the event to update meal count
        this.$root.$emit('update-meal-count');
      } catch (error) {
        console.error("Error clearing meal plan:", error);
      }
    },
    showClearMealModal() {
      this.$bvModal.show('clear-meal-modal');
    },
    onDragStart(index, event) {
      this.draggingIndex = index;
      event.dataTransfer.effectAllowed = "move";
    },
    onDragOver(event) {
      event.preventDefault();
    },
    onDrop(index) {
      if (index !== this.draggingIndex) {
        const draggedItem = this.mealRecipes[this.draggingIndex];
        this.mealRecipes.splice(this.draggingIndex, 1);
        this.mealRecipes.splice(index, 0, draggedItem);
        this.draggingIndex = null;

        // Save the new order to localStorage
        const order = this.mealRecipes.map(recipe => recipe.id);
        localStorage.setItem('mealRecipesOrder', JSON.stringify(order));
      }
    },
    onDragEnd() {
      this.draggingIndex = null;
    },
    getStatusClass(progress) {
      if (progress === 0) {
        return "status-wait";
      } else if (progress > 0 && progress < 1) {
        return "status-process";
      } else if (progress === 1) {
        return "status-ready";
      }
      return "";
    },
    getStatusIcon(progress) {
      if (progress === 0) {
        return "fas fa-clock";
      } else if (progress > 0 && progress < 1) {
        return "fas fa-spinner";
      } else if (progress === 1) {
        return "fas fa-check-circle";
      }
      return "";
    },
    getRecipeStatusText(progress) {
      if (progress === 0) {
        return "Wait For Processing";
      } else if (progress > 0 && progress < 1) {
        return "In Process";
      } else if (progress === 1) {
        return "Complete!";
      }
      return "Wait For Processing";
    }
  },
};
</script>


<style scoped>
.meal-planning-container {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.title {
  font-size: 36px;
  text-align: center;
  margin-bottom: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full viewport height */
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 10px;
  font-size: 1.5em;
  color: #555;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.meal-recipes {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.meal-recipe {
  display: flex;
  justify-content: center;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.meal-recipe.dragging {
  opacity: 0.5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.meal-recipe:hover {
  transform: translateY(-5px);
}

.meal-recipe-content {
  display: flex;
  width: 100%;
}

.meal-recipe-image-container {
  flex-shrink: 0;
  margin-right: 20px;
}

.meal-recipe-photo {
  width: 180px;
  height: 180px;
  border-radius: 8px;
  object-fit: cover;
}

.meal-recipe-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.meal-recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meal-recipe-number {
  font-size: 1.2em;
  font-weight: 600;
}

.meal-recipe-time {
  font-size: 1em;
  color: #555;
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.meal-recipe-time i {
  margin-right: 5px;
}

.meal-recipe-status {
  display: flex;
  align-items: center;
  font-size: 1em;
  margin-top: 5px;
}

.meal-recipe-status i {
  margin-left: 5px;
}

.status-wait {
  color: #f39c12; /* Orange for waiting */
}

.status-process {
  color: #3498db; /* Blue for in process */
}

.status-ready {
  color: #2ecc71; /* Green for ready */
}

.progress-bar-container {
  width: 100%;
  margin-top: 10px;
}

.start-preparation {
  background-color: #3498db;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.start-preparation i {
  margin-right: 5px;
}

.start-preparation:hover {
  background-color: #2980b9;
}

.remove-btn {
  padding: 5px 10px;
  background-color: transparent;
  color: #e74c3c;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  transition: color 0.3s ease;
}

.remove-btn:hover {
  color: #c0392b;
}

.clear-meal-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #be0505;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clear-meal-btn:hover {
  background-color: #2980b9;
}

.no-recipes {
  font-size: 1.2em;
  color: #888;
  margin-top: 20px;
}

.title {
  font-size: 72px;
  text-transform: uppercase;
  font-weight: 700;
  font-family: 'Josefin Sans', sans-serif;
  color: #5f5a5a; /* Stone-like grey with light red */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(249, 248, 248, 0.7); /* Shadow and red glow */
  margin-bottom: 30px;
  text-align: center;
}
</style>
