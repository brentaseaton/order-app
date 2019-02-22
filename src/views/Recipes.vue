<template>
  <div class="dashboard">
    <h1 class="subheading grey--text ma-4">Recipes</h1>

    <v-container class="my-3">
      content
    </v-container>

  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  data() {
    return {

    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if(!firebase.auth().currentUser) {
        this.$router.push({ name: 'login' })
      }
    })    
  }
}
</script>