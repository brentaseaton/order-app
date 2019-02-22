<template>
  <nav>
    <v-toolbar app>
      <v-toolbar-side-icon v-if="loggedIn" class="grey--text" @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase grey--text" @click="redirect" style="cursor: pointer;">
        <span class="font-weight-light">ORDER APP</span>
        <span> Beta</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y v-if="loggedIn" class="hidden-sm-and-down">
        <v-btn flat slot="activator" color="grey">
          <v-icon left>expand_more</v-icon>
          <span>Menu</span>
        </v-btn>
        <v-list>
          <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
            <v-list-tile-title>{{ link.text }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <!-- <v-btn flat color="grey" router to="/login" v-if="!loggedIn">
        <span>Log In</span>
        <v-icon right>power_settings_new</v-icon>
      </v-btn> -->
      <v-btn flat color="grey" v-if="loggedIn" @click="logout" class="hidden-sm-and-down">
        <span>Sign Out</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
      <v-toolbar-title class="grey--text caption" v-if="loggedIn">User: {{ email }}</v-toolbar-title>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" app class="error">
      <v-layout column align-center>
        <v-flex class="mt-5">
          <v-avatar size="100" class="pr-1">
            <img src="/avatar-2.png">
          </v-avatar>
          <p class="white--text subheading mt-2">
            {{ companyName }}
          </p>
        </v-flex>
        <!-- <v-flex class="mt-4 mb-3">
          <Popup @projectAdded="snackbar = true" />
        </v-flex> -->
      </v-layout>
      <v-list>
        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-tile-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="white--text">{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-spacer></v-spacer>
      <v-btn flat color="white" v-if="loggedIn" @click="logout" class="mt-4">
        <span>Sign Out</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import firebase from 'firebase' 

export default {
  name: 'Navbar',
  data() {
    return {
      drawer: false,
      companyName: 'Vera Pizza',
      links: [
        { icon: 'dashboard', text: 'Dashboard', route: '/' },
        { icon: 'folder', text: 'Recipes', route: '/recipes' }
      ],
      loggedIn: null,
      email: null
    }
  },
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'login' })
        this.loggedIn = false
      })
    },
    redirect() {
      this.$router.push({ name: 'dashboard' })
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if(firebase.auth().currentUser) {
        this.loggedIn = true
        this.email = firebase.auth().currentUser.email
      } else {
        this.loggedIn = false
      }
    })    
  }
}
</script>

