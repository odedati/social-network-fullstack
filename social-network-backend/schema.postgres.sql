CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(45) NOT NULL UNIQUE,
  firstname VARCHAR(45),
  lastname VARCHAR(45),
  country VARCHAR(45),
  password VARCHAR(100),
  email VARCHAR(100),
  profilepic VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS favorite_recipes (
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  recipe_id VARCHAR(64) NOT NULL,
  PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS watchedrecipes (
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  recipe_id VARCHAR(64) NOT NULL,
  watched_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS user_recipes (
  recipe_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  readyinminutes INTEGER,
  image VARCHAR(1024),
  popularity INTEGER DEFAULT 0,
  vegan BOOLEAN DEFAULT FALSE,
  vegetarian BOOLEAN DEFAULT FALSE,
  glutenfree BOOLEAN DEFAULT FALSE,
  servings INTEGER,
  ingredients TEXT,
  instructions TEXT,
  parsedinstructions TEXT,
  topingredients TEXT,
  topequipment TEXT,
  summary TEXT
);

CREATE TABLE IF NOT EXISTS user_recipes_meal (
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  recipe_id VARCHAR(64) NOT NULL,
  recipe_status INTEGER NOT NULL DEFAULT 0,
  progress NUMERIC(5,4) NOT NULL DEFAULT 0,
  step INTEGER NOT NULL DEFAULT 0,
  sreving INTEGER,
  PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS family_recipes (
  recipe_id VARCHAR(64) PRIMARY KEY,
  information JSONB NOT NULL
);
