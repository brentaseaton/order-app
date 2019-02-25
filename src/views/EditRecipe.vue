<template>
  <div class="edit-recipe" v-if="recipe">
    <v-layout row class="justify-center">
      <v-flex xs10 md5>
        <v-card class="ma-4">
          <v-card-title class="justify-center grey--text">
            <h2>Edit {{ recipe.title }} Recipe</h2>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="form">
              <v-text-field v-model="recipe.title" label="Recipe Title:"></v-text-field>
              <v-text-field v-model="recipe.price" label="Price:"></v-text-field>
              <v-text-field v-for="(ing, index) in recipe.ingredients" :key="index" v-model="recipe.ingredients[index]" label="Ingredient" append-icon="delete" @click:append="deleteIng(ing)"></v-text-field>
              <v-text-field v-model="another" label="Add an ingredient:" @keydown.tab.prevent="addIng" append-icon="add" @click:append="addIng"></v-text-field>
              <div class="field center-align">
                <p v-if="feedback" class="red--text">{{ feedback }}</p>
                <v-btn color="success" @click="editRecipe">Edit Recipe</v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import db from '@/firebase/init'
import slugify from 'slugify'

export default {
  name: 'EditSmoothie',
  data() {
    return {
      recipe: null,
      another: null,
      feedback: null
    }
  },
  methods: {
    editRecipe() {
      if(this.recipe.title) {
        this.feedback = null
        this.recipe.slug = slugify(this.recipe.title, {
          replacement: '-',
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        })
        db.collection('recipes').doc(this.recipe.slug).update({
          title: this.recipe.title,
          ingredients: this.recipe.ingredients,
          slug: this.recipe.slug,
          price: this.recipe.price
        }).then(() => {
          this.$router.push({ name: 'recipes' })
        }).catch(err => {
          this.feedback = err.message
        })
      } else {
        this.feedback = 'You must enter a recipe title'
      }
    },
    addIng() {
      if(this.another) {
        this.recipe.ingredients.push(this.another)
        this.another = null
        this.feedback = null
      } else {
        this.feedback = 'You must enter a value to add an ingredient'
      }
    },
    deleteIng(ing) {
      this.recipe.ingredients = this.recipe.ingredients.filter(ingredient => {
        return ingredient != ing
      })
    } 
  },
  created() {
    let ref = db.collection('recipes').where('slug', '==', this.$route.params.recipe_slug)
    ref.get().then(snapshot => {
      snapshot.forEach(doc => {
        this.recipe = doc.data()
        /* this.recipe.id = doc.id */
      })
    })
  }   
}
</script>

<style>
.edit-smoothie {
  margin-top: 60px;
  padding: 20px;
  max-width: 500px;
}
.edit-smoothie h2 {
  font-size: 2em;
  margin: 20px auto;
}
.edit-smoothie .field {
  margin: 20px auto;
  position: relative;
}
.edit-smoothie .delete {
  position: absolute;
  right: 0;
  bottom: 16px;
  color: #aaa;
  font-size: 1.4em;
  cursor: pointer;
}
.edit-smoothie .add {
  position: absolute;
  right: 0;
  bottom: 16px;
  color: #aaa;
  font-size: 1.4em;
  cursor: pointer;
}
</style>