<template>
  <div class="login">
    <v-layout row class="justify-center">
      <v-flex xs10 md6>
        <v-card class="ma-4">
          <v-card-title class="justify-center grey--text">
            <h2>Login</h2>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3" ref="form">
              <v-text-field label="Email" v-model="email" prepend-icon="email" ></v-text-field>
              <v-text-field type="password" label="Password" v-model="password" prepend-icon="lock" ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn flat class="success mx-0 mt-3" @click="login">Login</v-btn>
            </v-form>
          </v-card-text>
          <v-card-text v-if="feedback" class="red--text center">{{ feedback }}</v-card-text>
        </v-card>
      </v-flex>        
    </v-layout>    
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
  data() {
    return {
      email: null,
      password: null,
      feedback: null
    }
  },
  methods: {
    login() {
      if(this.email && this.password) {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(cred => {
          this.$router.push({ name: 'dashboard' })
        }).catch(err => {
          this.feedback = err.message
        })
        this.feedback = null
      } else {
        this.feedback = 'Please fill in both fields.'
      }
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if(firebase.auth().currentUser) {
        this.$router.push({ name: 'dashboard' })
      }
    })    
  }
}
</script>

