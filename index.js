const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose.set('strictQuery', true); // or false depending on your preference

mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany();
  })
  .then(result => {
    console.log("Existing recipes deleted:", result);

    const newRecipe = {
      title: 'Hefeklöße',
      level: 'Easy Peasy',
      ingredients: ['milk', 'flour', 'vanilla'],
      cuisine: 'German',
    };

    console.log("New Recipe to be added:", newRecipe);

    return Recipe.create(newRecipe);
  })
  .then(() => {
    console.log(`Adding alot of recipes`);
    return Recipe.insertMany(data);
  })
  .then(addedRecipes => {
    addedRecipes.forEach(recipe => {
      console.log(`${recipe.title}`);
    });
  })
/*  .then(recipe => {
    console.log(`Recipe founded ${recipe.title}`);
    return Recipe.findOne({ title: 'Hefeklöße' });
  })
*/ 
  .then(()=> {
    return Recipe.findOneAndUpdate(
      {title: 'Rigatoni alla Genovese'},
      {duration: 100},
      {new: true, runValidators: true }
    );
  })
  .then((updatedRecipe)=>{
    console.log(`Success! recipe founded and updated!!! ${updatedRecipe.title} with new duration ${updatedRecipe.duration}`);
  })
  .then(()=>{
    return Recipe.deleteOne({title: "Carrot Cake"});
  })
  .then(()=>{
    console.log(`Yay! Success, we deleted one recipe`);
  })
  .then(()=> {
    return mongoose.connection.close();
  })
  .catch (error => {
  console.error('Error connecting to the database', error);
});

