<template>
  <v-dialog v-model="dialog" width="400" v-if="company.dayStarted && company.dayFeature">
    <template v-slot:activator="{ on }">
      <v-btn :color="`${company.mainColor}`" dark v-on="on" class="ml-2" small>
        Qty Adjustments
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Quantities
      </v-card-title>

      <v-form ref="form" v-if="day">
        <v-text-field type="number" v-for="(ing, index) in day.ingredients" v-model="day.quantities[index]" :key="index" :label="`${ing}:`" :color="`${company.mainColor}`"></v-text-field>
      </v-form>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="red" flat @click="dialog = false">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="updateQty()">
          Submit Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import db from '@/firebase/init'

export default {
  data() {
    return {
      dialog: false,
      recipe: null,
      day: null
    }
  },
  props: {
    company: null
  },
  methods: {
    updateQty() {
      db.collection("days").doc(String(this.company.days)).update({
        quantities: this.day.quantities
      }).then(() => {
        this.updateOrdersLeft()
      }).catch(err => {
        console.log(err)
      })
    },
    updateOrdersLeft() {
      db.collection('recipes').get().then(snapshot => {
        snapshot.forEach(doc => {
          this.recipe = doc.data()
          this.recipe.ingredients.forEach(recipeIng => {
            if(this.day.ingredients.indexOf(recipeIng) >= 0) {
              this.recipe.ordersLeft = this.day.quantities[this.day.ingredients.indexOf(recipeIng)]
              this.updateRecipe(this.recipe)
            }
          })
        })
      }) 
    },
    updateRecipe(r) {
      db.collection('recipes').doc(r.slug).update({
        ordersLeft: r.ordersLeft
      }).then(() => {
        this.dialog = false
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    db.collection('days').doc(String(this.company.days)).get().then(doc => {
      if(doc.exists) {
        let d = doc.data()
        this.day = d
        this.day.ingredients = doc.data().ingredients
        this.day.quantities = doc.data().quantities
      }
    })
  }
}
</script>
