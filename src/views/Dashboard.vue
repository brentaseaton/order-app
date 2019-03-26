<template>
  <div class="dashboard">
    <h1 class="subheading grey--text mx-4 my-3">Dashboard</h1>

    <v-container fluid class="my-2">
      <v-layout row wrap>
        <ReadyOrders />
        <v-flex xs12 sm6 md5>
          <h2 :class="`header-2 ${company.mainColor}--text ma-2`">Active Orders</h2>
          <v-card class="my-4 mx-3" v-for="(order, index) in orders" :key="'A' + index">
            <v-layout class="pa-3" row wrap v-if="order.status == 'ACTIVE'">
              <v-flex xs3 class="mb-2">
                <div class="caption grey--text">Order #</div>
                <div class="display-1"><b>{{ order.orderNumber }}</b></div>
              </v-flex>
              <v-flex xs4>
                <div class="caption grey--text">Time Submitted</div>
                <div>{{ order.timestamp }}</div>
              </v-flex>
              <!-- <v-flex xs1>
                <div class="caption grey--text">Status</div>
                <div>{{ order.status}}</div>
              </v-flex> -->
              <v-flex xs5>
                <v-btn class="right" dark :color="`${company.secondaryColor}`" @click="orderReady(order)" :loading="loading">READY</v-btn>
              </v-flex>
              <v-flex xs12 class="mb-2" v-if="order.notes">
                <div :class="`caption ${company.mainColor}--text`">Notes</div>
                <div>{{ order.notes }}</div>
              </v-flex>
              <v-flex xs12>
                <div class="caption grey--text">Dishes</div>
                <v-chip dark :color="`${company.mainColor}`" v-for="(dish, index) in order.dishes" :key="'F' + index">
                  {{ dish.title }} x<b>{{ dish.quantity }}</b>
                </v-chip>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import ReadyOrders from '@/components/ReadyOrders'
import moment from 'moment'

export default {
  name: 'Dashboard',
  components: {
    ReadyOrders
  },
  data() {
    return {
      orders: [],
      loading: false,
      company: null
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
    
    let ref = db.collection('orders').orderBy('orderNumber')
    
    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let doc = change.doc

        this.orders.push({
          id: doc.id,
          dishes: doc.data().dishes,
          status: doc.data().status,
          orderNumber: doc.data().orderNumber,
          notes: doc.data().notes,
          timestamp: moment(doc.data().timestamp).fromNow()
        })
      })
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
        this.company.secondaryColor = doc.data().secondaryColor
      })
    })
  }
}
</script>