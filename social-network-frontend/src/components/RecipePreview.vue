<template>
  <router-link
    :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
    class="recipe-preview"
  >
    <div class="recipe-body">
      <div class="watched-ribbon" v-if="watched">
        <i class="fas fa-eye watched-icon"></i>
        <span class="watched-text">Watched</span>
      </div>
      <img
        v-if="image_load"
        :src="recipe.image"
        class="recipe-image"
        @load="onImageLoad"
        @error="onImageError"
        alt="Recipe Image"
      />
      <div v-else class="image-placeholder">
        <i class="fas fa-spinner fa-pulse placeholder-icon"></i>
      </div>
      <div class="favorite-icon-container" v-if="$root.store.username" @click.stop.prevent="toggleFavorite">
        <i
          :class="favorite ? 'fas fa-heart favorite-icon active' : 'far fa-heart favorite-icon'"
        ></i>
      </div>
      <div class="dietary-tabs" v-if="glutenFree || vegetarian || vegan">
        <div v-if="glutenFree" class="dietary-icon-container">
          <img
            src="https://findvectorlogo.com/wp-content/uploads/2018/06/gluten-free-vector-logo.png"
            alt="Gluten-Free"
            class="dietary-icon-gluten"
          />
        </div>
        <div v-if="vegetarian" class="dietary-icon-container">
          <img
            src="https://github.com/WED-2023/assignment2-1-315071910_311394365_31655631/blob/main/photos/pngwing.com.png?raw=true"
            alt="Vegetarian"
            class="dietary-icon-vegetarian"
          />
        </div>
        <div v-if="vegan" class="dietary-icon-container">
          <img
            src="https://uxwing.com/wp-content/themes/uxwing/download/food-and-drinks/vegan-icon.png"
            alt="Vegan"
            class="dietary-icon-vegan"
          />
        </div>
      </div>
    </div>
    <div class="recipe-footer">
      <div :title="recipe.title" class="recipe-title">
        {{ recipe.title }}
      </div>
      <ul class="recipe-overview">
        <li>
          <img
            src="https://banner2.cleanpng.com/20180604/kwx/kisspng-computer-icons-time-attendance-clocks-font-aweso-clock-icon-5b14c6364f6622.2216713915280881183252.jpg"
            alt="Time"
            class="icon"
          />
          {{ recipe.readyInMinutes }} minutes
        </li>
        <li>
          <img
            src="https://w7.pngwing.com/pngs/116/409/png-transparent-social-media-computer-icons-like-button-thumb-signal-social-networking-service-like-rectangle-social-media-marketing-black-thumbnail.png"
            alt="Likes"
            class="icon_like"
          />
          {{ recipe.popularity }} likes
        </li>
      </ul>
    </div>
  </router-link>
</template>

<script>
import axios from 'axios';
import { mockAddWatchedRecipe, mockIsRecipeWatched } from "@/services/user";

export default {
  data() {
    return {
      image_load: false,
      favorite: false,
      glutenFree: false,
      vegetarian: false,
      vegan: false,
      watched: false,
    };
  },
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  async mounted() {
    if (Number.isInteger(Number(this.recipe.id)) || this.recipe.id.substring(0, 6) === "FAMILY"){
      this.favorite = this.recipe.favorite;
    } else {
      this.favorite = this.recipe.isFavorite;  // Set favorite from the recipe prop
    }
    await this.loadRecipeImage();
    await this.loadDietaryInfo();
    await this.isRecipeWatched();
  },
  methods: {
    async loadRecipeImage() {
      try {
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.src = this.recipe.image;
          img.onload = () => {
            this.image_load = true;
            resolve();
          };
          img.onerror = () => {
            this.image_load = false;
            console.error("Image failed to load: " + this.recipe.image);
            reject();
          };
        });
      } catch (error) {
        console.error("Error loading image:", error);
      }
    },
    async isRecipeWatched() {
      // const response = await mockIsRecipeWatched(this.recipe.id);
      // this.watched = response.data.watched;
      this.watched = this.recipe.watched;
      console.log("Is recipe watched:", this.recipe.id, this.watched);
    },
    async loadDietaryInfo() {
      this.glutenFree = this.recipe.glutenFree;
      this.vegetarian = this.recipe.vegetarian;
      this.vegan = this.recipe.vegan;
    },
    onImageLoad() {
      this.image_load = true;
    },
    onImageError() {
      console.error("Image failed to load: " + this.recipe.image);
      this.image_load = false;
    },
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
    // async markAsWatched() {
    //   axios.defaults.withCredentials = true;
      
    //   if (!this.$root.store.username) {
    //     console.log("User not logged in, cannot mark as watched");
    //     return;
    //   }
      
    //   try {
    //     console.log(`Marking recipe ${this.recipe.id} as watched...`);  // Log the request
    //     const response = await axios.post(`/users/markwatched/${this.recipe.id}`);
        
    //     if (response.status === 200) {
    //       this.watched = true;
    //       console.log(`Recipe ${this.recipe.id} marked as watched`);
    //     } else {
    //       console.error(`Failed to mark recipe as watched: ${response.status}`);
    //     }
    //   } catch (error) {
    //     console.error("Error marking recipe as watched:", error);
    //   } finally {
    //     axios.defaults.withCredentials = false;
    //   }
    // },
    // markAsWatched() {
    //   mockAddWatchedRecipe(this.recipe.id);
    //   this.watched = true;
    //   console.log("Marked as watched:", this.recipe.id);
    // },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Lora:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");

body {
  font-family: "Roboto", sans-serif;
}

.recipe-preview {
  display: block;
  max-width: 600px;
  height: 300px;
  margin: 20px auto;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
  background-color: #fff;
}

.recipe-preview:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.recipe-body {
  width: 100%;
  height: 200px;
  position: relative;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  animation: fadeIn 0.5s;
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f0f0f0;
}

.placeholder-icon {
  font-size: 2rem;
  color: #ccc;
}

.favorite-icon-container {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(231, 76, 60, 0.5);
  transition: box-shadow 0.3s ease;
  cursor: pointer;
}

.favorite-icon-container:hover {
  box-shadow: 0 0 25px rgba(231, 76, 60, 0.7);
}

.favorite-icon {
  color: #e74c3c;
  font-size: 24px;
  transition: color 0.3s ease, transform 0.3s ease;
}

.favorite-icon.active {
  animation: pulse 0.3s;
}

.favorite-icon:hover {
  color: #c0392b;
  transform: scale(1.2);
}

.recipe-preview {
  position: relative;
}

.watched-ribbon {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 5px 10px;
  border-top-left-radius: 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  transition: box-shadow 0.3s ease;
}

.watched-ribbon:hover {
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
}

.watched-icon {
  margin-right: 5px;
}

.watched-text {
  font-weight: bold;
}

.dietary-tabs {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dietary-icon-container {
  width: 54px;
  height: 54px;
  border-radius: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.dietary-icon-container:hover {
  transform: scale(1.3);
}

.dietary-icon-gluten {
  width: 180%;
  height: 180%;
  object-fit: contain;
}

.dietary-icon-vegan {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.dietary-icon-vegetarian {
  width: 120%;
  height: 120%;
  object-fit: contain;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.recipe-footer {
  padding: 10px 15px;
  background-color: #fafafa;
  border-top: 1px solid #eee;
  text-align: center;
}

.recipe-title {
  font-family: "Lora", serif;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 5px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 3.4rem;
}

.recipe-overview {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #777;
}

.recipe-overview li {
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
}

.recipe-overview li .icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.icon_like {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

@media (max-width: 600px) {
  .recipe-preview {
    margin: 10px 0;
  }

  .recipe-title {
    font-size: 1rem;
  }

  .recipe-overview {
    font-size: 0.8rem;
  }
}
</style>
