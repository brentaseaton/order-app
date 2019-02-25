<template>
  <div class="dashboard">
    <h1 class="subheading grey--text ma-4">Dashboard</h1>

    <v-container fluid class="my-3">
      <v-layout row wrap>
        <v-flex xs12 md5>
          <h2 class="header-2 grey--text ma-2">Active Orders</h2>
          <v-card class="my-4 mx-3" v-for="(order, index) in orders" :key="'A' + index">
            <v-layout class="pa-3" row wrap v-if="order.status == 'ACTIVE'">
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
                <v-btn class="right" color="success" @click="orderReady(order)" :loading="loading">READY</v-btn>
              </v-flex>
              <v-flex xs12 class="mb-2" v-if="order.notes">
                <div class="caption grey--text">Notes</div>
                <div>{{ order.notes }}</div>
              </v-flex>
              <v-flex xs12>
                <div class="caption grey--text">Dishes</div>
                <v-chip dark color="warning" v-for="(dish, index) in order.dishes" :key="'F' + index">
                  {{ dish.title }} x{{ dish.quantity }}
                </v-chip>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <ReadyOrders />
      </v-layout>
    </v-container>

  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import ReadyOrders from '@/components/ReadyOrders'

export default {
  name: 'Dashboard',
  components: {
    ReadyOrders
  },
  data() {
    return {
      orders: [],
      loading: false
    }
  },
  methods: {
    orderReady(order) {
      this.loading = true
      db.collection('orders').doc(order.id).update({
        status: 'READY'
      }).then(() => {
        this.orders = this.orders.filter(o => {
          return o.id != order.id
        })
        this.loading = false
      }).catch(err => {
        console.log(err.message)
      })
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if(!firebase.auth().currentUser) {
        this.$router.push({ name: 'login' })
      }
    })
    
    let ref = db.collection('orders')
    
    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let doc = change.doc

        this.orders.push({
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