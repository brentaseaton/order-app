<template>
  <v-flex xs12 sm6 md5 v-if="company">
    <h2 :class="`header-2 ${company.mainColor}--text ma-2`">Ready Orders</h2>
    <v-card class="my-4 mx-3" v-for="(order, index) in readyOrders" :key="'B' + index">
      <v-layout class="pa-3" row wrap v-if="order.status == 'READY'">
        <v-flex xs3 class="mb-2">
          <div class="caption grey--text">Order #</div>
          <div class="display-1"><b>{{ order.orderNumber }}</b></div>
        </v-flex>
        <!-- <v-flex xs3>
          <div><v-btn color="error" @click="cancelOrder(order.id)">CANCEL</v-btn></div>
        </v-flex> -->
        <v-flex xs4>
          <div class="caption grey--text">Time Submitted</div>
          <div>{{ order.timestamp }}</div>
        </v-flex><!-- 
        <v-flex xs1>
          <div class="caption grey--text">Status</div>
          <div>{{ order.status}}</div>
        </v-flex> -->
        <v-flex xs5>
          <v-btn class="right" dark :color="`${company.secondaryColor}`" @click="orderPickedUp(order)" :loading="loading">PICKED UP</v-btn>
        </v-flex>
        <v-flex xs12 class="mb-2" v-if="order.notes">
          <div :class="`caption ${company.mainColor}--text`">Notes</div>
          <div>{{ order.notes }}</div>
        </v-flex>
        <v-flex xs12>
          <div class="caption grey--text">Dishes</div>
          <v-chip dark :color="`${company.mainColor}`" v-for="(dish, index) in order.dishes" :key="'C' + index">
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
import moment from 'moment'

export default {
  name: 'ReadyOrders',
  data() {
    return {
      readyOrders: [],
      loading: false,
      company: null
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
    let ref = db.collection('orders').orderBy('orderNumber')
    
    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let doc = change.doc
        if(change.type == 'added') {
          this.readyOrders.push({
            id: doc.id,
            dishes: doc.data().dishes,
            status: doc.data().status,
            orderNumber: doc.data().orderNumber,
            notes: doc.data().notes,
            timestamp: moment(doc.data().timestamp).fromNow()
          })
        } else if (change.type == 'modified') {
          this.readyOrders.forEach(order => {
            if(order.id == doc.id) {
              this.readyOrders = this.readyOrders.filter(o => {
                return o.id != order.id
              })
            }
          })
          
          this.readyOrders.push({
            id: doc.id,
            dishes: doc.data().dishes,
            status: doc.data().status,
            orderNumber: doc.data().orderNumber,
            notes: doc.data().notes,
            timestamp: moment(doc.data().timestamp).fromNow()
          })
        } else if (change.type == 'removed') {
          this.readyOrders.forEach(order => {
            if(order.id == doc.id) {
              this.readyOrders = this.readyOrders.filter(o => {
                return o.id != order.id
              })
            }
          })
        }
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
