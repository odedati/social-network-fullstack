CREATE DATABASE IF NOT EXISTS mydb;
USE mydb;

CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(45) NOT NULL,
  firstname VARCHAR(45) DEFAULT NULL,
  lastname VARCHAR(45) DEFAULT NULL,
  country VARCHAR(45) DEFAULT NULL,
  password VARCHAR(100) DEFAULT NULL,
  email VARCHAR(100) DEFAULT NULL,
  profilePic VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY username_UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS favorite_recipes (
  user_id INT NOT NULL,
  recipe_id VARCHAR(64) NOT NULL,
  PRIMARY KEY (user_id, recipe_id),
  CONSTRAINT favorite_recipes_user_fk
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS watchedrecipes (
  user_id INT NOT NULL,
  recipe_id VARCHAR(64) NOT NULL,
  watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, recipe_id),
  CONSTRAINT watchedrecipes_user_fk
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_recipes (
  recipe_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  readyInMinutes INT DEFAULT NULL,
  image VARCHAR(1024) DEFAULT NULL,
  popularity INT DEFAULT 0,
  vegan BOOLEAN DEFAULT FALSE,
  vegetarian BOOLEAN DEFAULT FALSE,
  glutenFree BOOLEAN DEFAULT FALSE,
  servings INT DEFAULT NULL,
  ingredients JSON,
  instructions JSON,
  parsedInstructions JSON,
  topIngredients JSON,
  topEquipment JSON,
  summary TEXT,
  PRIMARY KEY (recipe_id),
  CONSTRAINT user_recipes_user_fk
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_recipes_meal (
  user_id INT NOT NULL,
  recipe_id VARCHAR(64) NOT NULL,
  recipe_status INT NOT NULL DEFAULT 0,
  progress DECIMAL(5,4) NOT NULL DEFAULT 0,
  step INT NOT NULL DEFAULT 0,
  sreving INT DEFAULT NULL,
  PRIMARY KEY (user_id, recipe_id),
  CONSTRAINT user_recipes_meal_user_fk
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS family_recipes (
  recipe_id VARCHAR(64) NOT NULL,
  information JSON NOT NULL,
  PRIMARY KEY (recipe_id)
);
