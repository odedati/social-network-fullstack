<template>
  <div>
    <br>
    <h1 class="title">My Family Recipes</h1>
    <div class="container">
      <div class="recipes-grid">
        <RecipePreview v-for="r in recipes" :key="r.id" :recipe="r" class="recipePreview" />
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import RecipePreview from "../components/RecipePreview";
  import { mockGetFamilyRecipes } from "../services/recipes.js";
  import axios from "axios";

  export default {
    name: "RecipePreviewList",
    components: {
      RecipePreview,
    },
    data() {
      return {
        recipes: [],
      };
    },
    mounted() {
      this.updateRecipes();
    },
    methods: {
      async updateRecipes() {
        try {
          const response = await axios.get(`${this.$root.store.server_domain}/recipes/allFamily`);
          const recipes = response.data;
          this.recipes = [];
          this.recipes.push(...recipes);
        } catch (error) {
          console.log(error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
  
  .container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Roboto', sans-serif;
    background: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .title {
    font-size: 2.5em;
    margin-bottom: 30px;
    color: #343a40;
    text-align: center;
    font-weight: 700;
  }
  
  .recipes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    justify-items: center;
  }
  
  .recipePreview {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    width: 100%;
    max-width: 300px;
  }
  
  .recipePreview img {
    width: 100%;
    height: auto;
    border-bottom: 1px solid #eee;
  }
  
  .recipePreview:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .recipePreview .recipe-info {
    padding: 15px;
  }
  
  .recipePreview .recipe-info h3 {
    font-size: 1.5em;
    margin: 0;
    color: #343a40;
  }
  
  .recipePreview .recipe-info .details {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  
  .recipePreview .recipe-info .details span {
    display: flex;
    align-items: center;
    font-size: 0.9em;
    color: #777;
  }
  
  .recipePreview .recipe-info .details span i {
    margin-right: 5px;
  }
  
  @media (max-width: 768px) {
    .title {
      font-size: 2em;
    }
  
    .recipePreview {
      margin: 10px;
    }
  }

  .title {
  font-size: 72px;
  text-transform: uppercase;
  font-weight: 700;
  font-family: 'Josefin Sans', sans-serif;
  color: #345758; /* Stone-like grey with light turquoise */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(77, 248, 222, 0.7); /* Shadow and turquoise glow */
  margin-bottom: 30px;
  text-align: center;
}
  </style>
  
