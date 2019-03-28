<template>
  <div class="recipes" v-if="company">
    <h1 class="subheading grey--text ma-4">Recipes</h1>

    <v-flex xs12>
      <v-btn router to="/add-recipe" dark :color="`${company.secondaryColor}`" class="ml-4">Add Recipe<v-icon right>add</v-icon></v-btn>
      <v-layout row xs12 wrap>
        <v-flex xs12 md4 v-for="recipe in recipes" :key="recipe.slug">
          <v-card class="ma-4" :color="`${company.mainColor} white--text`">
            <v-card-title>
              <h2>{{ recipe.title }}</h2>
              <v-spacer></v-spacer>
              ${{ recipe.price }}
            </v-card-title>
            <v-list>
              <v-chip outline :color="`${company.secondaryColor}`" v-for="(ing, index) in recipe.ingredients" :key="index" class="my-2">{{ ing }}</v-chip>
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
      recipes: [],
      company: null
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

    db.collection('companies').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let c = doc.data()
        this.company = c
        this.company.id = doc.id
        this.orderNum = this.company.orderNumber
        this.company.mainColor = doc.data().mainColor
        this.company.name = doc.data().name
        this.company.secondaryColor = doc.data().secondaryColor
      })
    })
  }
}
</script>