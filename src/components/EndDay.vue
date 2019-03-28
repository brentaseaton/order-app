<template>
  <v-dialog v-model="dialog" width="400" v-if="company.dayStarted && company.dayFeature">
    <template v-slot:activator="{ on }">
      <v-btn :color="`${company.mainColor}`" dark v-on="on" class="ml-4" small>
        End Day
      </v-btn>
    </template>

    <v-card>
      <!-- <v-card-title class="headline grey lighten-2" primary-title>
        Privacy Policy
      </v-card-title> -->

      <v-card-text>
        Are you sure you want to end the day? Any existing orders will be marked incomplete.
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="red" flat @click="dialog = false">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="endDay">
          End Day
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
      dialog: false
    }
  },
  props: {
    company: null,
    orders: Array
  },
  methods: {
    endDay() {
      this.dialog = false

      this.orders.forEach(order => {
        if(order.status == 'READY' || order.status == 'ACTIVE') {
          db.collection('orders').doc(order.id).update({
            status: 'INCOMPLETE'
          }).then(() => {
            console.log('Order update successful.')
          }).catch(err => {
            console.log(err)
          })
        }
      })     
      
      db.collection('companies').doc(this.company.id).update({
        dayStarted: false
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
