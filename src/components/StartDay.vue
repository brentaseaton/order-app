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
        <v-text-field v-model="doughs" label="Doughs:" :color="`${company.mainColor}`"></v-text-field>
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
      doughs: null
    }
  },
  props: {
    company: null
  },
  methods: {
    startDay() {
      this.dialog = false    
      
      db.collection('companies').doc(this.company.id).update({
        dayStarted: true
      }).then(() => {
        console.log('Day ended.')
        this.$router.go()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
