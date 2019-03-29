<template>
  <div class="settings" v-if="company">
    <v-snackbar v-model="snackbar" :timeout="4000" top :color="`${company.mainColor}`">
      <span>Settings updated successfully</span>
      <v-btn flat color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <h1 class="subheading grey--text mx-4 my-2">Settings</h1>

    <v-form class="mx-4 my-2" ref="form" v-if="company">
      <v-layout row wrap>
        <v-flex xs12 sm4 md3>
          <v-text-field :color="`${company.mainColor}`" v-model="company.name" label="Company Name"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm4 md3>
          <v-text-field :color="`${company.mainColor}`" v-model="company.mainColor" label="Main Color (hex accepted)"></v-text-field>
        </v-flex>
        <v-flex xs12 sm4 md3 class="mx-3">
          <v-text-field :color="`${company.mainColor}`" v-model="company.secondaryColor" label="Secondary Color (hex accepted)"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm4 md3>
          <v-checkbox :color="`${company.mainColor}`" v-model="company.dayFeature" label="Start/End Day Feature"></v-checkbox>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 v-if="company.dayFeature">
          <v-flex xs3>
            <v-form ref="form">
              <v-text-field v-for="(ing, index) in company.ingredients" :key="index" v-model="company.ingredients[index]" label="Ingredient" append-icon="delete" @click:append="deleteIng(ing)" :color="`${company.mainColor}`"></v-text-field>
              <v-text-field v-model="another" label="Add an ingredient:" @keydown.tab.prevent="addIng" append-icon="add" @click:append="addIng" :color="`${company.mainColor}`"></v-text-field>
            </v-form>
          </v-flex>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <p v-if="feedback" class="red--text">{{ feedback }}</p> <br/><br/>
        </v-flex>
        <v-flex xs12>
          <v-btn dark :style="`background-color: ${company.mainColor}`" @click="editSettings">Submit Changes</v-btn>
        </v-flex>         
      </v-layout>
    </v-form>      
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
  components: {
  },
  data() {
    return {
      company: null,
      feedback: null,
      snackbar: false,
      ingredients: [],
      another: null
    }
  },
  methods: {
    editSettings() {
      if(!this.company.name || !this.company.mainColor) {
        this.feedback = 'All fields must be filled in'
      } else {
        this.feedback = null

        if(this.company.dayFeature == false) {
          this.company.dayStarted = true
        } else {
          this.company.dayStarted = false
        }

        db.collection('companies').doc(this.company.id).update({
          name: this.company.name,
          mainColor: this.company.mainColor,
          secondaryColor: this.company.secondaryColor,
          dayFeature: this.company.dayFeature,
          dayStarted: this.company.dayStarted
        }).then(() => {
          this.snackbar = true
        }).catch(err => {
          this.feedback = err.message
        })
      }
    },
    addIng() {
      if(this.another) {
        this.company.ingredients.push(this.another)
        this.another = null
        this.feedback = null
      } else {
        this.feedback = 'You must enter a value to add an ingredient'
      }
    },
    deleteIng(ing) {
      this.company.ingredients = this.company.ingredients.filter(ingredient => {
        return ingredient != ing
      })
    } 
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if(!firebase.auth().currentUser) {
        this.$router.go()
      }
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
      })
    })
  }
}
</script>
