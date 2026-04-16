import Main from "./pages/MainPage";
import NotFound from "./pages/NotFoundPage";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/RegisterPage"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("./pages/SearchPage"),
  },
  {
    path: "/recipe/:id",
    name: "recipe",
    component: () => import("./pages/RecipeViewPage"),
  },
  {
    path: "*",
    name: "notFound",
    component: NotFound,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("./pages/AboutPage"),
  },
  {
    path: "/favorites",
    name: "favorites",
    component: () => import("./pages/MyFavoritesPage"),
  },
  {
    path: "/my-recipes",
    name: "my-recipes",
    component: () => import("./pages/MyRecipesPage.vue"),
  },
  {
    path: "/family-recipes",
    name: "family-recipes",
    component: () => import("./pages/MyFamilyPage.vue"),
  },
  {
    path: "/preparation/:recipeId",
    name: "RecipePreparation",
    component: () => import("./pages/RecipePreparation.vue"),
  },
  {
    path: "/meal-plan",
    name: "meal-plan",
    component: () => import("./pages/MealPlanning.vue"),
  },
];

export default routes;
