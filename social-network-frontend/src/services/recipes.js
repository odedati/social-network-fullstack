// // src/services/recipes.js
// // import recipe_full_view from "../assets/mocks/recipe_full_view.json";
// // import recipe_preview from "../assets/mocks/recipe_preview.json";
// import recipe_information from "../assets/mocks/GetRecipeInformation.json";
// import { mockGetUserFullRecipeView, mockIsUserRecipeVegan, mockIsUserRecipeGlutenFree, mockIsUserRecipeVegetarian } from "@/services/user.js";


// // export function mockGetRecipesPreview(amount = 1) {
// //   let recipes = [];
// //   for(let i = 0; i < amount; i++){
// //     recipes.push(recipe_preview);
// //   }

// //   return { data: { recipes: recipes } };
// // }


// // export function mockGetRecipesPreview(amount = 1) {
// //   const recipeIds = Object.keys(recipe_preview);
// //   const totalRecipes = recipeIds.length;

// //   // Shuffle the array of recipe IDs
// //   for (let i = recipeIds.length - 1; i > 0; i--) {
// //     const j = Math.floor(Math.random() * (i + 1));
// //     [recipeIds[i], recipeIds[j]] = [recipeIds[j], recipeIds[i]];
// //   }

// //   // If the requested amount is greater than the total number of recipes, repeat recipes
// //   const selectedRecipes = [];
// //   while (selectedRecipes.length < amount) {
// //     const remaining = amount - selectedRecipes.length;
// //     const toAdd = Math.min(remaining, totalRecipes);
// //     selectedRecipes.push(
// //       ...recipeIds.slice(0, toAdd).map((id) => recipe_preview[id])
// //     );
// //   }

// //   return { data: { recipes: selectedRecipes } };
// // }

// export function mockGetRecipesPreview(amount = 1) {
//   const recipeIds = Object.keys(recipe_information);
//   const totalRecipes = recipeIds.length;

//   // Shuffle the array of recipe IDs
//   const shuffledRecipeIds = recipeIds.sort(() => 0.5 - Math.random());

//   // Generate the requested amount of recipes, repeating if necessary
//   const selectedRecipes = Array.from({ length: amount }, (_, i) =>
//     recipe_information[shuffledRecipeIds[i % totalRecipes]]
//   );

//   return { data: { recipes: selectedRecipes } };
// }


// // export function mockGetRecipeFullDetails(recipeId) {
// //   const recipe = recipe_information[recipeId];
// //   if (recipe) {
// //     return { data: { recipe } };
// //   } else {
// //     recipe = mockGetUserFullRecipeView(recipeId).data.recipe;
// //     return recipe;
// //   }
// // }

  
// // Function to check if a recipe is vegan
// export function mockIsRecipeVegan(recipeId) {
//   if (recipe_information[recipeId]) {
//     return { data: { vegan: recipe_information[recipeId].vegan } };
//   }
//   else{
//     return mockIsUserRecipeVegan(recipeId);
//   }
//   return { data: { vegan: false } }; // Default to false if recipe not found
// }

// // Function to check if a recipe is gluten-free
// export function mockIsRecipeGlutenFree(recipeId) {
//   if (recipe_information[recipeId]) {
//     return { data: { glutenFree: recipe_information[recipeId].glutenFree } };
//   }
//   else{
//     return mockIsUserRecipeGlutenFree(recipeId);
//   }
//   return { data: { glutenFree: false } }; // Default to false if recipe not found
// }

// // Function to check if a recipe is vegetarian
// export function mockIsRecipeVegetarian(recipeId) {
//   if (recipe_information[recipeId]) {
//     return { data: { vegetarian: recipe_information[recipeId].vegetarian } };
//   }
//   else{
//     return mockIsUserRecipeVegetarian(recipeId);
//   }
//   return { data: { vegetarian: false } }; // Default to false if recipe not found
// }

// export function mockGetFamilyRecipes() {
//   return mockGetRecipesPreview(3);
// }

// export function mockGetRecipeInformation(recipeId) {
//   const recipeInfo = recipe_information[recipeId] || {};
//   const userRecipeInfo = mockGetUserFullRecipeView().data.dict[recipeId] || {};

//   // Merge only non-empty recipe information objects
//   const mergedRecipeInfo = {
//     ...(isEmpty(recipeInfo) ? {} : recipeInfo),
//     ...(isEmpty(userRecipeInfo) ? {} : userRecipeInfo),
//   };

//   return { data: { recipe: mergedRecipeInfo } };
// }

// // Helper function to check if an object is empty
// function isEmpty(obj) {
//   return Object.keys(obj).length === 0 && obj.constructor === Object;
// }
