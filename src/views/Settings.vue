<template>
  <div class="settings">
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
      feedback: null
    }
  },
  methods: {
    editSettings() {
      if(!this.company.name || !this.company.mainColor) {
        this.feedback = 'All fields must be filled in'
      } else {
        this.feedback = null

        db.collection('companies').doc(this.company.id).update({
          name: this.company.name,
          mainColor: this.company.mainColor,
          secondaryColor: this.company.secondaryColor
        }).then(() => {
          this.$router.push({ name: 'Settings' })
        }).catch(err => {
          this.feedback = err.message
        })
      }
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
