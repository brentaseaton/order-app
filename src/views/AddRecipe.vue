<template>
  <div class="add-recipe" v-if="company">
    <v-layout row class="justify-center">
      <v-flex xs10 md5>
        <v-card class="ma-4">
          <v-card-title class="justify-center grey--text">
            <h2 :style="`color: ${company.mainColor}`">Add New Recipe</h2>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="form">
              <v-text-field v-model="title" label="Recipe Title:" :color="`${company.mainColor}`"></v-text-field>
              <v-text-field v-model="price" label="Price:" :color="`${company.mainColor}`"></v-text-field>
              <v-text-field v-model="cost" label="Cost:" :color="`${company.mainColor}`"></v-text-field>
              <v-text-field v-for="(ing, index) in ingredients" :key="index" v-model="ingredients[index]" label="Ingredient" append-icon="delete" @click:append="deleteIng(ing)" :color="`${company.mainColor}`"></v-text-field>
              <v-text-field v-model="another" label="Add an ingredient:" @keydown.tab.prevent="addIng" append-icon="add" @click:append="addIng" :color="`${company.mainColor}`"></v-text-field>
              <div class="field center-align">
                <p v-if="feedback" class="red--text">{{ feedback }}</p>
                <v-btn dark :color="`${company.mainColor}`" @click="addRecipe">Add Recipe</v-btn>
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
  name: 'AddRecipe',
  data() {
    return {
      title: null,
      another: null,
      ingredients: [],
      feedback: null,
      slug: null,
      price: 0.00,
      cost: 0.00,
      company: null
    }
  },
  methods: {
    addRecipe() {
      if(this.title) {
        this.feedback = null
        this.slug = slugify(this.title, {
          replacement: '-',
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        })
        let ref = db.collection('recipes').doc(this.slug)
        ref.get().then(doc => {
          if(doc.exists) {
            this.feedback = 'This recipe title already exists'
          } else {
            ref.set({
              title: this.title,
              ingredients: this.ingredients,
              slug: this.slug,
              quantity: 0,
              price: this.price,
              cost: this.cost
            }).then(() => {
              this.$router.push({ name: 'recipes' })
            }).catch(err => {
              this.feedback = err.message
            })
          }
        })
      } else {
        this.feedback = 'You must enter a recipe title'
      }
    },
    addIng() {
      if(this.another) {
        this.ingredients.push(this.another)
        this.another = null
        this.feedback = null
      } else {
        this.feedback = 'You must enter a value to add an ingredient'
      }
    },
    deleteIng(ing) {
      this.ingredients = this.ingredients.filter(ingredient => {
        return ingredient != ing
      })
    }
  },
  created() {
    db.collection('companies').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let c = doc.data()
        this.company = c
        this.company.id = doc.id
        this.orderNum = this.company.orderNumber
        this.company.mainColor = doc.data().mainColor
        this.company.name = doc.data().name
      })
    })
  }
}
</script>

<style>
.add-smoothie {
  margin-top: 60px;
  padding: 20px;
  max-width: 500px;
}
.add-smoothie h2 {
  font-size: 2em;
  margin: 20px auto;
}
.add-smoothie .field {
  margin: 20px auto;
  position: relative;
}
.add-smoothie .delete {
  position: absolute;
  right: 0;
  bottom: 16px;
  color: #aaa;
  font-size: 1.4em;
  cursor: pointer;
}
.add-smoothie .add {
  position: absolute;
  right: 0;
  bottom: 16px;
  color: #aaa;
  font-size: 1.4em;
  cursor: pointer;
}
</style>