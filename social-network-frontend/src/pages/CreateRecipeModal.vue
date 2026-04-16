<template>
  <b-modal id="create-recipe-modal" title-class="modal-title-custom" title="Create a New Recipe" hide-footer size="lg" class="wide-modal">
    <div class="add-recipe">
      <form @submit.prevent.stop="submitRecipe">
        <div v-if="currentScreen === 1">
          <!-- Screen 1: Basic Information and Ingredients -->
          <!-- Recipe Title -->
          <div class="form-group">
            <label for="title">Recipe Title</label>
            <input type="text" v-model="recipe.title" id="title" required />
          </div>

          <!-- Recipe Image -->
          <div class="form-group">
            <label>Recipe Image</label>
            <div class="image-input">
              <input type="url" v-model="recipe.image" placeholder="Image URL" required maxlength="300" />
            </div>
          </div>

          <!-- Ready Time, Servings -->
          <div class="form-group">
            <label for="readyInMinutes">Ready Time In Minutes</label>
            <input type="number" v-model="recipe.readyInMinutes" id="readyInMinutes" required />
          </div>
          <div class="form-group">
            <label for="servings">Servings</label>
            <input type="number" v-model="recipe.servings" id="servings" required />
          </div>

          <!-- Dietary Options -->
          <div class="form-group">
            <label>Dietary Options</label>
            <div class="checkbox-group">
              <label><input type="checkbox" v-model="recipe.vegetarian" /> Vegetarian</label>
              <label><input type="checkbox" v-model="recipe.vegan" /> Vegan</label>
              <label><input type="checkbox" v-model="recipe.glutenFree" /> Gluten Free</label>
            </div>
          </div>

          <!-- Ingredients -->
          <div class="form-group">
            <label for="ingredients">Ingredients</label>
            <div v-for="(ingredient, index) in recipe.extendedIngredients" :key="index" class="ingredient framed">
              <div class="ingredient-details">
                <input type="text" v-model="ingredient.name" placeholder="Ingredient Name" required />
                <input type="number" v-model="ingredient.amount" placeholder="Amount" required />
                <input type="text" v-model="ingredient.unit" placeholder="Unit" required />
                <button @click="removeIngredient(index)" type="button" class="remove-btn">X</button>
              </div>

              <!-- Ingredient Image -->
              <div class="form-group">
                <label>Ingredient Image</label>
                <div class="toggle-switch">
                  <input type="radio" :id="'url-' + index" value="url" v-model="ingredient.imageOption" class="toggle-input" />
                  <label :for="'url-' + index" class="toggle-label url">URL</label>
                  <input type="radio" :id="'none-' + index" value="none" v-model="ingredient.imageOption" class="toggle-input" />
                  <label :for="'none-' + index" class="toggle-label none">None</label>
                  <span class="toggle-slider" :class="{'toggle-slider-none': ingredient.imageOption === 'none'}"></span>
                </div>
                <div v-if="ingredient.imageOption === 'url'" class="image-input">
                  <input type="url" v-model="ingredient.image" placeholder="Image URL" maxlength="300" />
                </div>
              </div>
            </div>
            <button @click="addIngredient" type="button" class="add-btn">Add Ingredient</button>
          </div>

          <!-- Equipment -->
          <div class="form-group">
            <label for="equipment">Equipment</label>
            <div v-for="(equip, index) in recipe.equipment" :key="index" class="equipment framed">
              <div class="equipment-details">
                <input type="text" v-model="equip.name" placeholder="Equipment Name" required />
                <button @click="removeEquipment(index)" type="button" class="remove-btn">X</button>
              </div>

              <!-- Equipment Image -->
              <div class="form-group">
                <label>Equipment Image</label>
                <div class="toggle-switch">
                  <input type="radio" :id="'equip-url-' + index" value="url" v-model="equip.imageOption" class="toggle-input" />
                  <label :for="'equip-url-' + index" class="toggle-label url">URL</label>
                  <input type="radio" :id="'equip-none-' + index" value="none" v-model="equip.imageOption" class="toggle-input" />
                  <label :for="'equip-none-' + index" class="toggle-label none">None</label>
                  <span class="toggle-slider" :class="{'toggle-slider-none': equip.imageOption === 'none'}"></span>
                </div>
                <div v-if="equip.imageOption === 'url'" class="image-input">
                  <input type="url" v-model="equip.image" placeholder="Image URL" maxlength="300" />
                </div>
              </div>
            </div>
            <button @click="addEquipment" type="button" class="add-btn">Add Equipment</button>
          </div>

          <!-- Navigation Buttons -->
          <div class="form-actions">
            <button @click="nextScreen" type="button" class="next-btn">Next</button>
          </div>
        </div>

        <div v-if="currentScreen === 2">
          <!-- Screen 2: Steps and Summary -->
          <!-- Steps -->
          <div class="form-group">
            <label for="steps">Steps</label>
            <div v-for="(step, index) in recipe.steps" :key="index" class="step">
              <div class="step-number">Step {{ index + 1 }}:</div>
              <textarea v-model="step.description" placeholder="Step Description" required></textarea>
              
              <!-- Select Ingredients for Step -->
              <div class="form-group">
                <label>Ingredients</label>
                <div class="selection-container">
                  <div class="selection-group">
                    <div 
                      v-for="ingredient in recipe.extendedIngredients" 
                      :key="ingredient.name" 
                      :class="{'selected': step.ingredients.includes(ingredient.name)}" 
                      class="selection-item"
                      @click="toggleSelection(step.ingredients, ingredient.name)"
                    >
                      {{ ingredient.name }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Select Equipment for Step -->
              <div class="form-group">
                <label>Equipment</label>
                <div class="selection-container">
                  <div class="selection-group">
                    <div 
                      v-for="equip in recipe.equipment" 
                      :key="equip.name" 
                      :class="{'selected': step.equipment.includes(equip.name)}" 
                      class="selection-item"
                      @click="toggleSelection(step.equipment, equip.name)"
                    >
                      {{ equip.name }}
                    </div>
                  </div>
                </div>
              </div>
              
              <button @click="removeStep(index)" type="button" class="remove-btn">X</button>
            </div>
            <button @click="addStep" type="button" class="add-btn">Add Step</button>
          </div>

          <!-- Summary -->
          <div class="form-group">
            <label for="summary">Summary</label>
            <textarea v-model="recipe.summary" id="summary" required></textarea>
          </div>

          <!-- Navigation Buttons -->
          <div class="form-actions">
            <button @click="prevScreen" type="button" class="prev-btn">Previous</button>
            <button type="submit" class="submit-btn">Create Recipe</button>
          </div>
        </div>
      </form>
    </div>
  </b-modal>
</template>

<script>
import { BModal, BToast } from 'bootstrap-vue';
import { mockCheckIfIdNumberExist, mockAddRecipeViewToUserList } from "@/services/user";
import axios from 'axios';

export default {
  name: 'CreateRecipeModal',
  components: {
    BModal,
    // BToast
  },
  data() {
    return {
      recipe: this.getInitialRecipe(),
      imageOption: 'url',
      submitted: false,
      currentScreen: 1
    }
  },
  methods: {
    getInitialRecipe() {
      return {
        id: null,
        image: '',
        title: '',
        readyInMinutes: 0,
        aggregateLikes: 0,
        servings: 0,
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        extendedIngredients: [
          {
            name: '',
            amount: 0,
            unit: '',
            image: '',
            imageOption: 'none'
          }
        ],
        steps: [
          {
            description: '',
            ingredients: [],
            equipment: []
          }
        ],
        summary: '',
        equipment: [
          {
            name: '',
            image: '',
            imageOption: 'none'
          }
        ]
      };
    },
    addIngredient() {
      this.recipe.extendedIngredients.push({ name: '', amount: 0, unit: '', image: '', imageOption: 'none' });
    },
    removeIngredient(index) {
      this.recipe.extendedIngredients.splice(index, 1);
    },
    addStep() {
      this.recipe.steps.push({ description: '', ingredients: [], equipment: [] });
    },
    removeStep(index) {
      this.recipe.steps.splice(index, 1);
    },
    addEquipment() {
      this.recipe.equipment.push({ name: '', image: '', imageOption: 'none' });
    },
    removeEquipment(index) {
      this.recipe.equipment.splice(index, 1);
    },
    toggleSelection(list, item) {
      const index = list.indexOf(item);
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(item);
      }
    },
    getRandomId() {
      let random;
      random = Math.floor(10000 + Math.random() * 90000);
      while(mockCheckIfIdNumberExist(random)){
          random = Math.floor(10000 + Math.random * 90000);
      }
      this.recipe.id = random;
    },
    async submitRecipe() {
      try {
        axios.defaults.withCredentials = true;

        const formattedIngredients = this.recipe.extendedIngredients.map(ingredient => ({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit
        }));

        const formattedSteps = this.recipe.steps.map((step, index) => ({
          number: index + 1,
          step: step.description,
          ingredients: step.ingredients.map(name => {
            const ingredient = this.recipe.extendedIngredients.find(ing => ing.name === name);
            return ingredient ? {
              id: ingredient.id || Math.floor(10000 + Math.random() * 90000),
              name: ingredient.name,
              localizedName: ingredient.name,
              image: ingredient.image || ""
            } : {};
          }),
          equipment: step.equipment.map(name => {
            const equip = this.recipe.equipment.find(e => e.name === name);
            return equip ? {
              id: equip.id || Math.floor(10000 + Math.random() * 90000),
              name: equip.name,
              localizedName: equip.name,
              image: equip.image || ""
            } : {};
          })
        }));

        const formattedTopIngredients = this.recipe.extendedIngredients.map(ingredient => ({
          id: ingredient.id || Math.floor(10000 + Math.random() * 90000),
          name: ingredient.name
        }));

        const formattedTopEquipment = this.recipe.equipment.map(equip => ({
          id: equip.id || Math.floor(10000 + Math.random() * 90000),
          name: equip.name
        }));

        const response = await axios.post(this.$root.store.server_domain + '/users/my_recipes', {
          user_id: this.recipe.id,
          title: this.recipe.title,
          readyInMinutes: this.recipe.readyInMinutes,
          image: this.recipe.image,
          popularity: this.recipe.aggregateLikes,
          vegan: this.recipe.vegan,
          vegetarian: this.recipe.vegetarian,
          glutenFree: this.recipe.glutenFree,
          servings: this.recipe.servings,
          ingredients: formattedIngredients,
          instructions: [{
            name: "",
            steps: formattedSteps
          }],
          parsedInstructions: [{
            name: "",
            steps: formattedSteps
          }],
          topIngredients: formattedTopIngredients,
          topEquipment: formattedTopEquipment,
          summary: this.recipe.summary
        });

        if (response.status === 201) {
          this.resetForm();
          this.$bvToast.toast('Your recipe has been created successfully!', {
            title: 'Success',
            variant: 'success',
            solid: true,
            autoHideDelay: 5000,
            toaster: 'b-toaster-top-center'
          });
          this.$bvModal.hide('create-recipe-modal');
        }
        axios.defaults.withCredentials = false;
      } catch (error) {
        console.error('Error creating recipe:', error);
      }
    },
    getDiets() {
      const diets = [];
      if (this.recipe.vegetarian) diets.push("vegetarian");
      if (this.recipe.vegan) diets.push("vegan");
      if (this.recipe.glutenFree) diets.push("gluten free");
      return diets;
    },
    resetForm() {
      this.recipe = this.getInitialRecipe();
      this.imageOption = 'url';
      this.submitted = false;
      this.currentScreen = 1;
    },
    nextScreen() {
      if (this.currentScreen < 2) {
        this.currentScreen++;
      }
    },
    prevScreen() {
      if (this.currentScreen > 1) {
        this.currentScreen--;
      }
    }
  }
}
</script>

<style scoped>
.wide-modal .modal-dialog {
  max-width: 90% !important;
  width: 90%;
}

.add-recipe {
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.add-recipe h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="url"],
.form-group input[type="number"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
}

.form-group input[type="file"] {
  width: 100%;
}

.form-group textarea {
  height: 100px;
}

.image-input {
  margin-top: 10px;
}

.framed {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.toggle-switch {
  display: flex;
  position: relative;
  width: 140px;
  height: 34px;
  background: #e0e0e0;
  border-radius: 17px;
  margin-bottom: 10px;
}

.toggle-input {
  display: none;
}

.toggle-label {
  width: 70px;
  line-height: 34px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  z-index: 2;
  color: #000;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 70px;
  height: 100%;
  background: rgba(0, 123, 255, 0.8);
  border-radius: 17px;
  transition: left 0.3s;
  z-index: 1;
}

.toggle-slider-none {
  left: 70px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-weight: normal;
}

.checkbox-group label input {
  margin-right: 5px;
}

.selection-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.selection-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.selection-item {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.selection-item.selected {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.ingredient, .step, .equipment {
  margin-bottom: 15px;
}

.ingredient-details, .equipment-details {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.ingredient-details input, .equipment-details input {
  margin-right: 10px;
}

.step-number {
  font-weight: bold;
  margin-right: 10px;
}

.step textarea {
  flex: 1;
  margin-right: 10px;
}

.remove-btn {
  background: #ff4b5c;
  border: none;
  color: #fff;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #ff1f3c;
}

.add-btn {
  background: #007bff;
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
}

.add-btn:hover {
  background: #0056b3;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.submit-btn {
  padding: 10px 40px;
  border: none;
  color: #fff;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  background: #28a745;
  margin-right: 10px;
}

.submit-btn:hover {
  background: #218838;
}

.reset-btn, .next-btn, .prev-btn {
  padding: 10px 20px;
  border: none;
  color: #fff;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  background: #007bff;
  margin: 0 5px;
}

.reset-btn:hover, .next-btn:hover, .prev-btn:hover {
  background: #0056b3;
}

.success-message {
  text-align: center;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
}

.success-message h2 {
  margin: 0 0 10px;
}

::v-deep .modal-title-custom {
  font-size: 30px;
  text-transform: uppercase;
  font-weight: 700;
  font-family: 'Josefin Sans', sans-serif;
  color: #462f4d;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(184, 78, 237, 0.7);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0;
}
</style>
