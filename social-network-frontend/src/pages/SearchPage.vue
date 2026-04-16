<template>
  <div>
    <br>
    <h1 class="title">Search Recipes</h1>
    <div class="container">
      <div class="content">
        <div class="search-bar-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search for recipes..."
            class="search-input"
            @keyup.enter="handleSearch" 
          />
          <button @click="handleSearch" class="search-button">Search</button>
          <button @click="resetSearch" class="reset-button">Reset</button>
        </div>

        <div class="filter-container">
          <!-- Number of Results Filter -->
          <div class="filter-group">
            <label>Number of Results</label>
            <div class="radio-group">
              <div class="radio-item">
                <input type="radio" id="limit5" value="5" v-model="resultLimit">
                <label for="limit5">5</label>
              </div>
              <div class="radio-item">
                <input type="radio" id="limit10" value="10" v-model="resultLimit">
                <label for="limit10">10</label>
              </div>
              <div class="radio-item">
                <input type="radio" id="limit15" value="15" v-model="resultLimit">
                <label for="limit15">15</label>
              </div>
            </div>
          </div>

          <!-- Diet Filter Dropdown -->
          <div class="filter-group">
            <label for="diet" class="filter-label">Diet</label>
            <select id="diet" v-model="selectedDiet" class="dropdown">
              <option value="">All Diets</option>
              <option v-for="diet in diets" :key="diet" :value="diet">{{ diet }}</option>
            </select>
          </div>

          <!-- Cuisine Filter Dropdown -->
          <div class="filter-group">
            <label for="cuisine" class="filter-label">Cuisine</label>
            <select id="cuisine" v-model="selectedCuisine" class="dropdown">
              <option value="">All Cuisines</option>
              <option v-for="cuisine in cuisines" :key="cuisine" :value="cuisine">{{ cuisine }}</option>
            </select>
          </div>

          <!-- Intolerance Filter Dropdown -->
          <div class="filter-group">
            <label for="intolerance" class="filter-label">Intolerance</label>
            <select id="intolerance" v-model="selectedIntolerance" class="dropdown">
              <option value="">All Intolerances</option>
              <option v-for="intolerance in intolerances" :key="intolerance" :value="intolerance">{{ intolerance }}</option>
            </select>
          </div>
        </div>

        <div class="sort-container" v-if="filteredRecipes.length">
          <!-- Sort By Dropdown -->
          <div class="filter-group">
            <label for="sortBy" class="filter-label">Sort By</label>
            <select id="sortBy" v-model="sortBy" @change="handleSort" class="dropdown sort-dropdown">
              <option value="">None</option>
              <option value="readyInMinutes">Ready In Minutes</option>
              <option value="popularity">Likes</option>
            </select>
          </div>
        </div>

        <div class="results">
          <!-- Recipe List -->
          <div v-if="filteredRecipes.length" class="recipe-list">
            <RecipePreview 
              v-for="recipe in filteredRecipes" 
              :key="recipe.id" 
              :recipe="recipe"
              class="recipe-preview"
            />
          </div>

          <!-- No results message, shown only after search is performed -->
          <div v-if="hasSearched && !filteredRecipes.length" class="no-results">
            <p>No recipes found matching your search. Try adjusting the filters or search term.</p>
          </div>
        </div>

        <!-- Section to display last search results -->
        <div class="results" v-if="search_results.length">
          <h2>Last Search Results</h2>
          <div class="recipe-list">
            <RecipePreview 
              v-for="recipe in search_results" 
              :key="recipe.id" 
              :recipe="recipe"
              class="recipe-preview"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from "@/components/RecipePreview.vue";  // Import your RecipePreview component

export default {
  components: {
    RecipePreview,
  },
  data() {
    return {
      searchQuery: '',
      filteredRecipes: [], // Initial state set to empty
      resultLimit: '5', // Default result limit
      diets: [
        "Ketogenic",
        "Vegetarian",
        "Lacto-Vegetarian",
        "Ovo-Vegetarian",
        "Vegan",
        "Pescetarian",
        "Paleo",
        "Primal",
        "Low FODMAP",
        "Whole30",
      ],
      cuisines: ["Mexican", "Italian", "Chinese", "Indian", "Greek", "Latine"],
      intolerances: [
        "Dairy", "Egg", "Gluten", "Grain", "Peanut", 
        "Seafood", "Sesame", "Shellfish", "Soy", 
        "Sulfite", "Tree Nut", "Wheat", "butter"
      ],
      selectedDiet: '',
      selectedCuisine: '',
      selectedIntolerance: '',
      sortBy: '',
      search_results: [], // Store the last search results
      hasSearched: false, // New flag to track if search has been performed
    };
  },
  mounted() {
    this.fetchLastSearch(); // Fetch the last search results when the component is mounted
  },
  methods: {
    async fetchLastSearch() {
      try {
        this.axios.defaults.withCredentials = true;
        const response = await this.axios.get(
          this.$root.store.server_domain + "/users/lastSearch"
        );
        this.search_results = response.data; // Populate search_results with the last search data
        this.axios.defaults.withCredentials = false;
      } catch (error) {
        console.log(error);
      }
    },
    async handleSearch() {
      this.hasSearched = true; // Set to true whenever search is initiated

      if (this.searchQuery.trim() === '') {
        this.filteredRecipes = [];
        return;
      }
      
      try {
        this.axios.defaults.withCredentials = true;
        const response = await this.axios.get(
          this.$root.store.server_domain + "/recipes/search",
          {
            params: {
              query: this.searchQuery,
              number: this.resultLimit,
              cuisine: this.selectedCuisine,
              diet: this.selectedDiet,
              intolerance: this.selectedIntolerance,
            },
          }
        );
        this.filteredRecipes = response.data;

        if (this.filteredRecipes.length === 0) {
          this.noResults = true;
        } else {
          this.noResults = false;
        }
        this.handleSort();
        this.axios.defaults.withCredentials = false;
      } catch (err) {
        console.log(err);
      }
    },
    handleSort() {
      if (this.filteredRecipes.length && this.sortBy) {
        this.filteredRecipes.sort((a, b) => {
          if (this.sortBy === 'readyInMinutes') {
            return a.readyInMinutes - b.readyInMinutes;
          } else if (this.sortBy === 'popularity') {
            return b.popularity - a.popularity;
          }
          return 0;
        });
      }
    },
    async resetSearch() {
      this.searchQuery = '';
      this.filteredRecipes = [];
      this.selectedDiet = '';
      this.selectedCuisine = '';
      this.selectedIntolerance = '';
      this.sortBy = '';
      this.resultLimit = '5';
      this.hasSearched = false; // Reset search flag on reset
      await this.fetchLastSearch(); // Fetch the last search results again
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');

.title {
  font-size: 72px;
  text-transform: uppercase;
  font-weight: 700;
  font-family: 'Josefin Sans', sans-serif;
  color: #374d37; /* Dark Grey-Green */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(50, 205, 50, 0.7); /* Shadow and green glow */
  text-align: center;
  margin-bottom: 30px;
  margin-top: 0;
}

.container {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Montserrat', sans-serif;
  background-color: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.search-bar-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-input {
  flex: 1;
  padding: 20px;
  font-size: 1.2rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s;
}

.search-input:focus {
  box-shadow: 0 4px 15px rgba(60, 90, 153, 0.2);
  border-color: #3c5a99;
}

.search-button, .reset-button {
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.search-button {
  background-color: #3c5a99;
}

.search-button:hover {
  background-color: #2d3e73;
}

.reset-button {
  background-color: #ef233c;
}

.reset-button:hover {
  background-color: #b81d2e;
}

.filter-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 20px;
}

.filter-group {
  flex: 1;
}

.filter-label {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 10px;
  display: block;
  color: #495057;
}

.dropdown, .sort-dropdown {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 10px;
  font-size: 1rem;
  background-color: #fff;
  transition: box-shadow 0.3s;
}

.dropdown:focus, .sort-dropdown:focus {
  border-color: #3c5a99;
  box-shadow: 0 4px 15px rgba(60, 90, 153, 0.2);
}

.radio-group {
  display: flex;
  justify-content: space-between;
}

.radio-item {
  flex: 1;
  text-align: center;
}

.radio-item input[type="radio"] {
  display: none;
}

.radio-item label {
  display: block;
  padding: 12px;
  background-color: #edf2f4;
  color: #2b2d42;
  border-radius: 10px;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
}

.radio-item input[type="radio"]:checked + label {
  background-color: #3c5a99;
  color: white;
}

.sort-container {
  display: flex;
  justify-content: flex-end;
}

.recipe-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.recipe-preview {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.recipe-preview:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.recipe-preview img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recipe-footer {
  padding: 20px;
  text-align: center;
  background-color: #f8f9fa;
  border-top: 1px solid #ddd;
}

.recipe-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.recipe-overview {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #6c757d;
}

.recipe-overview li {
  text-align: center;
  flex: 1;
}

.no-results {
  margin-top: 20px;
  font-size: 1.5rem;
  color: #ef233c; /* Bright red to highlight no results */
  text-align: center;
  font-weight: 600;
  padding: 20px;
  background-color: #fff4f4; /* Light red background */
  border-radius: 10px;
  border: 1px solid #ef233c;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
</style>
