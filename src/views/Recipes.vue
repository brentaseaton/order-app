<template>
  <div class="recipes">
    <h1 class="subheading grey--text ma-4">Recipes</h1>

    <v-flex xs12>
      <v-btn router to="/add-recipe" color="warning" class="ml-4">Add Recipe<v-icon right>add</v-icon></v-btn>
      <v-layout row xs12 wrap>
        <v-flex xs12 md4 v-for="recipe in recipes" :key="recipe.slug">
          <v-card class="ma-4" color="error white--text">
            <v-card-title><h2>{{ recipe.title }}</h2></v-card-title>
            <v-list>
              <v-chip outline color="error" v-for="(ing, index) in recipe.ingredients" :key="index" class="my-2">{{ ing }}</v-chip>
            </v-list>
            <v-card-actions>
              <v-btn icon router :to="{ name: 'EditRecipe', params: {recipe_slug: recipe.slug} }">
                <v-icon color="white">edit</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn icon @click="deleteRecipe(recipe.slug)">
                <v-icon color="white">delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
  name: 'Recipes',
  data() {
    return {
      recipes: []
    }
  },
  methods: {
    deleteRecipe(slug) {
      db.collection('recipes').doc(slug).delete().then(() => {
        this.recipes = this.recipes.filter(recipe => {
          return recipe.slug != slug
        })
      })
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if(!firebase.auth().currentUser) {
        this.$router.push({ name: 'login' })
      }
    })
    
    db.collection('recipes').get().then(snapshot => {
      snapshot.forEach(doc => {
        let recipe = doc.data()
        this.recipes.push(recipe)
      })
    })
  }
}
</script>