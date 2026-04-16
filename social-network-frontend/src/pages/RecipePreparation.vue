<template>
  <div>
    <br />
    <!-- Loading Indicator -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p class="loading-text">Loading...</p>
    </div>
    <!-- Recipe Preparation Content -->
    <div v-else>
      <div v-if="recipe.title" class="preparation-container">
        <h1 class="recipe-title">{{ recipe.title }}</h1>
        <img
          :src="recipe.image || defaultImage"
          alt="Recipe Image"
          class="recipe-image"
          @error="handleImageError"
        />
        <div v-html="recipe.summary" class="recipe-summary"></div>
        <br />
        <div class="progress-bar-container">
          <ul class="steps-progress">
            <li
              v-for="(step, index) in steps"
              :key="index"
              :class="{
                active: currentStepIndex === index,
                completed: currentStepIndex > index
              }"
              @click="goToStep(index)"
            >
              <span>
                <template v-if="currentStepIndex > index">✓</template>
                <template v-else>{{ index + 1 }}</template>
              </span>
              <p :class="{ 'current-step': currentStepIndex === index }">Step {{ index + 1 }}</p>
            </li>
          </ul>
        </div>
        <div class="servings-selector">
          <label for="servings">Serving:</label>
          <input
            type="number"
            id="servings"
            v-model.number="servings"
            min="1"
            @change="updateIngredients"
          />
        </div>
        <div class="content-container">
          <div class="ingredients-equipment">
            <div class="ingredients" v-if="currentStep.ingredients && currentStep.ingredients.length">
              <h3>Ingredients:</h3>
              <ul>
                <li v-for="ingredient in mappedIngredients" :key="ingredient.id">
                  <img
                    :src="getIngredientImageUrl(ingredient.image)"
                    alt="Ingredient Image"
                    class="item-image"
                    @error="handleImageError"
                  />
                  <span>{{ ingredient.amount }} {{ ingredient.unit }} {{ ingredient.name }}</span>
                </li>
              </ul>
            </div>
            <div class="equipment" v-if="currentStep.equipment && currentStep.equipment.length">
              <h3>Equipment:</h3>
              <ul>
                <li v-for="equipment in currentStep.equipment" :key="equipment.id">
                  <img
                    :src="equipment.image"
                    alt="Equipment Image"
                    class="item-image"
                    @error="handleImageError"
                  />
                  <span>{{ equipment.name }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="step-details">
            <h3>Step {{ currentStep.number }}:</h3>
            <p>{{ currentStep.step }}</p>
          </div>
          <div class="navigation-buttons">
            <button @click="prevStep" :disabled="currentStepIndex === 0">Prev</button>
            <button v-if="currentStepIndex < steps.length - 1" @click="nextStep">Next</button>
            <button v-else @click="completePreparation">Done</button>
          </div>
        </div>
      </div>

      <!-- No Recipe Found Content -->
      <div v-else>
        <div class="no-recipe-found-container">
          <img class="no-recipe-icon" src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="No Recipe" />
          <h2 class="no-recipe-title">Oops! Recipe Not Found</h2>
          <p class="no-recipe-message">We couldn't find the recipe you're looking for. Try searching for another recipe or check back later.</p>
          <router-link to="/" class="back-home-link">Go Back to Home</router-link>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      recipe: {
        title: "",
        image: "",
        readyInMinutes: 0,
        popularity: 0,
        vegan: false,
        vegetarian: false,
        glutenFree: false,
        ingredients: [],
        instructions: [{ steps: [] }],
        summary: ""
      },
      servings: 1,
      currentStepIndex: 0,
      defaultImage: "https://cdn.icon-icons.com/icons2/2436/PNG/512/recipe_cutlery_spoon_fork_icon_147447.png",
      loading: true,
    };
  },
  async created() {
    if (this.$route.params.recipeId) {
      await this.fetchRecipe(this.$route.params.recipeId);
      await this.fetchCurrentStep(this.$route.params.recipeId);
    }
    this.loading = false;
  },
  methods: {
    async fetchRecipe(recipeId) {
      try {
        let response;
        if (typeof recipeId === 'number') {
          response = await axios.get(`${this.$root.store.server_domain}/recipes/${recipeId}/formatted`);
        } else {
          if (recipeId.substring(0, 6) === "FAMILY") {
            response = await axios.get(`${this.$root.store.server_domain}/recipes/FAMILY/${recipeId}/formatted`);
          } else {
            response = await axios.get(`${this.$root.store.server_domain}/users/my_recipes/${recipeId}`);
          }
        }
        this.recipe = response.data;
        this.servings = this.recipe.servings;
        this.recipe.ingredients.forEach(ingredient => {
          ingredient.originalAmount = ingredient.amount;
        });
        this.updateIngredients();
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    },
    async fetchCurrentStep(recipeId) {
      try {
        const response = await axios.get(`${this.$root.store.server_domain}/users/meal_plan/${recipeId}/step`, {
          withCredentials: true
        });
        this.currentStepIndex = response.data.step || 0;
      } catch (error) {
        console.error("Error fetching current step:", error);
      }
    },
    nextStep() {
      if (this.currentStepIndex < this.steps.length - 1) {
        this.currentStepIndex += 1;
        this.saveCurrentStep();
      }
    },
    prevStep() {
      if (this.currentStepIndex > 0) {
        this.currentStepIndex -= 1;
        this.saveCurrentStep();
      }
    },
    goToStep(index) {
      this.currentStepIndex = index;
      this.saveCurrentStep();
    },
    updateIngredients() {
      const factor = this.servings / this.recipe.servings;
      this.recipe.ingredients = this.recipe.ingredients.map((ingredient) => {
        const adjustedAmount = ingredient.originalAmount * factor;
        return {
          ...ingredient,
          amount: adjustedAmount.toFixed(2),
        };
      });
    },
    async saveCurrentStep() {
      const recipeId = this.$route.params.recipeId;
      if (!recipeId) {
        console.error("Recipe ID is undefined!");
        return;
      }

      try {
        await axios.post(`${this.$root.store.server_domain}/users/meal_plan/${recipeId}/step/${this.currentStepIndex}`, {
          withCredentials: true
        });

        await axios.post(`${this.$root.store.server_domain}/users/meal_plan/${recipeId}/progress/${(this.currentStepIndex / this.steps.length)}`, {
          withCredentials: true
        });
      } catch (error) {
        console.error("Error saving current step and progress:", error);
      }
    },
    async completePreparation() {
      this.currentStepIndex = this.steps.length;
      this.saveCurrentStep();
      alert("Preparation complete!");
      this.$router.push({ name: 'meal-plan' });
    },
    handleImageError(event) {
      event.target.src = this.defaultImage;
    },
    getIngredientImageUrl(image) {
      const baseUrl = "https://spoonacular.com/cdn/ingredients_100x100/";
      return `${baseUrl}${image}`;
    },
  },
  computed: {
    steps() {
      return this.recipe.instructions[0]?.steps || [];
    },
    currentStep() {
      return this.steps[this.currentStepIndex] || {};
    },
    mappedIngredients() {
      if (!this.currentStep.ingredients) return [];
      return this.currentStep.ingredients.map((stepIngredient) => {
        const ingredient = this.recipe.ingredients.find((ing) => ing.name === stepIngredient.name);
        return {
          ...stepIngredient,
          amount: ingredient ? ingredient.amount : '',
          unit: ingredient ? ingredient.unit : ''
        };
      });
    },
  },
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Roboto", sans-serif;
  background-color: #f4f4f4;
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner {
  width: 80px;
  height: 80px;
  border: 6px solid rgba(255, 255, 255, 0.3);
  border-top: 6px solid #ffffff;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #ffffff;
  font-size: 1.5em;
  font-weight: 500;
  text-align: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.preparation-container {
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: auto;
  font-family: "Roboto", sans-serif;
}

.recipe-title {
  font-size: 2.5em;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.recipe-image {
  width: 700px;
  height: 400px;
  border-radius: 12px;
  margin-bottom: 20px;
  margin-left: 30px;
}

.recipe-summary {
  font-size: 1em;
  color: #555;
  line-height: 1.6;
  margin-bottom: 20px;
}

.progress-bar-container {
  margin-bottom: 20px;
}

.steps-progress {
  display: flex;
  list-style: none;
  padding: 0;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.steps-progress li {
  flex: 1;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.steps-progress li:not(:last-child)::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background: #ddd;
  top: 50%;
  left: 50%;
  transform: translateX(50%);
  z-index: -1;
  transition: background 0.3s ease;
}

.steps-progress li.completed:not(:last-child)::after {
  background: linear-gradient(to right, #3498db, #2ecc71);
}

.steps-progress li span {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  background: #ddd;
  color: #fff;
  border-radius: 50%;
  margin-bottom: 5px;
  font-size: 18px;
  transition: background 0.3s ease, transform 0.3s ease;
}

.steps-progress li.completed span {
  background: #2ecc71;
  transform: scale(1.2);
}

.steps-progress li.active span {
  background: #3498db;
  transform: scale(1.2);
}

.steps-progress li p {
  margin: 0;
  font-size: 14px;
  color: #000;
  transition: color 0.3s ease;
}

.steps-progress li .current-step {
  font-weight: bold;
  color: #3498db;
}

.servings-selector {
  text-align: center;
  margin-bottom: 20px;
}

input[type="number"] {
  width: 60px;
  padding: 5px;
  margin-left: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ingredients-equipment {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.ingredients,
.equipment {
  flex: 1;
  background: #f7f7f7;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ingredients ul,
.equipment ul {
  list-style: none;
  padding: 0;
}

.ingredients li,
.equipment li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.ingredients img,
.equipment img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.step-details {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #3498db;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #2980b9;
  transform: scale(1.05);
}

/* No Recipe Found Styles */
.no-recipe-found-container {
  text-align: center;
  padding: 50px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 100px auto;
}

.no-recipe-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  opacity: 0.8;
}

.no-recipe-title {
  font-size: 2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.no-recipe-message {
  font-size: 1.2em;
  color: #777;
  margin-bottom: 20px;
}

.back-home-link {
  font-size: 1em;
  color: #3498db;
  text-decoration: none;
  padding: 10px 20px;
  background-color: #ecf0f1;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.back-home-link:hover {
  background-color: #bdc3c7;
}
</style>
