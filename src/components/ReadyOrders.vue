<template>
  <v-flex xs12 md5>
    <h2 class="header-2 grey--text ma-2">Ready Orders</h2>
    <v-card class="my-4 mx-3" v-for="(order, index) in readyOrders" :key="'B' + index">
      <v-layout class="pa-3" row wrap v-if="order.status == 'READY'">
        <v-flex xs2 class="mb-2">
          <div class="caption grey--text">Order #</div>
          <div>{{ order.orderNumber }}</div>
        </v-flex>
        <!-- <v-flex xs3>
          <div><v-btn color="error" @click="cancelOrder(order.id)">CANCEL</v-btn></div>
        </v-flex> -->
        <v-flex xs3>
          <div class="caption grey--text">Time (Minutes)</div>
          <div>3</div>
        </v-flex>
        <v-flex xs2>
          <div class="caption grey--text">Status</div>
          <div>{{ order.status}}</div>
        </v-flex>
        <v-flex xs5>
          <v-btn class="right" color="success" @click="orderPickedUp(order)" :loading="loading">PICKED UP</v-btn>
        </v-flex>
        <v-flex xs12 class="mb-2" v-if="order.notes">
          <div class="caption grey--text">Notes</div>
          <div>{{ order.notes }}</div>
        </v-flex>
        <v-flex xs12>
          <div class="caption grey--text">Dishes</div>
          <v-chip dark color="warning" v-for="(dish, index) in order.dishes" :key="'C' + index">
            {{ dish.title }} x{{ dish.quantity }}
          </v-chip>
        </v-flex>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
  name: 'ReadyOrders',
  data() {
    return {
      readyOrders: [],
      loading: false
    }
  },
  methods: {
    orderPickedUp(order) {
      this.loading = true
      db.collection('orders').doc(order.id).update({
        status: 'COMPLETE'
      }).then(() => {
        this.readyOrders = this.readyOrders.filter(o => {
          return o.id != order.id
        })
        this.loading = false
      }).catch(err => {
        console.log(err.message)
      })
    }
  },
  created() {
    let ref = db.collection('orders')
    
    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let doc = change.doc

        this.readyOrders.push({
          id: doc.id,
          dishes: doc.data().dishes,
          status: doc.data().status,
          orderNumber: doc.data().orderNumber,
          notes: doc.data().notes
        })
      })
    }) 
  }
}
</script>
