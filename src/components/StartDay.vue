<template>
  <v-dialog v-model="dialog" width="400" v-if="!company.dayStarted && company.dayFeature">
    <template v-slot:activator="{ on }">
      <v-btn :color="`${company.mainColor}`" dark v-on="on" class="ml-4" small>
        Start Day
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Quantities
      </v-card-title>

      <v-form ref="form">
        <v-text-field type="number" v-for="(ing, index) in company.ingredients" v-model="quantities[index]" :key="index" :label="`${company.ingredients[index]}:`" :color="`${company.mainColor}`"></v-text-field>
      </v-form>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="red" flat @click="dialog = false">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="startDay()">
          Start Day
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
      quantities: []
    }
  },
  props: {
    company: null
  },
  methods: {
    startDay() {
      this.dialog = false 
      this.company.days = this.company.days + 1   

      db.collection("days").doc(String(this.company.days)).set({
        dayNumber: this.company.days,
        ingredients: this.company.ingredients,
        quantities: this.quantities
      })
      
      db.collection('companies').doc(this.company.id).update({
        dayStarted: true,
        days: this.company.days
      }).then(() => {
        this.getDay()
        this.$router.go()
      }).catch(err => {
        console.log(err)
      })
    },
    getDay(company) {     
      db.collection('days').doc(String(company.days)).get().then(doc => {
        if(doc.exists) {
          let d = doc.data()
          this.day = d
          this.day.ingredients = doc.data().ingredients
          this.day.quantities = doc.data().quantities
          this.updateRecipeLeft()
        }
      })
    },
    updateRecipeLeft() {
      
    }
  }
}
</script>
