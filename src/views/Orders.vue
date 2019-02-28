<template>
  <div class="dashboard">
    <v-snackbar v-model="snackbar" :timeout="4000" top :color="`${company.mainColor}`">
      <span>Order added successfully</span>
      <v-btn flat color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <h1 class="subheading grey--text mx-4 my-3">Orders</h1>
    <Popup @orderAdded="snackbar = true"/>
    <v-container fluid class="my-3">
      <v-layout row wrap>
        <ReadyOrders />
        <v-flex xs12 sm6 md5>
          <h2 :class="`header-2 ${company.mainColor}--text ma-2`">Active Orders</h2>
          <v-card class="my-4 mx-3" v-for="(order, index) in orders" :key="order.id + index">
            <v-layout class="pa-3" row wrap v-if="order.status == 'ACTIVE'">
              <v-flex xs4 class="mb-2">
                <div class="caption grey--text">Order #</div>
                <div><b>{{ order.orderNumber }}</b></div>
              </v-flex>
              <v-flex xs4>
                <div class="caption grey--text">Time Submitted</div>
                <div>{{ order.timestamp }}</div>
              </v-flex>
              <v-flex xs4>
                <div class="caption grey--text">Status</div>
                <div>{{ order.status}}</div>
              </v-flex>
              <v-flex xs12 class="mb-2" v-if="order.notes">
                <div class="caption grey--text">Notes</div>
                <div>{{ order.notes }}</div>
              </v-flex>
              <v-flex xs12>
                <div class="caption grey--text">Dishes</div>
                <v-chip dark :color="`${company.mainColor}`" v-for="(dish, index) in order.dishes" :key="index">
                  {{ dish.title }} x{{ dish.quantity }}
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
import Popup from '@/components/NewOrderPopup'
import ReadyOrders from '@/components/ReadyOrders'
import moment from 'moment'

export default {
  components: {
    Popup,
    ReadyOrders
  },
  data() {
    return {
      recipes: [],
      textColor: null,
      quantity: 0,
      orderRecipes: [],
      orders: [],
      company: null,
      orderNum: 0,
      feedback: null,
      snackbar: false,
      loading: false
    }
  },
  methods: {
    decreaseQty(r) {
      if(r.quantity > 0) {
        r.quantity--
        if(r.quantity <= 0) {
          this.orderRecipes.splice(r.index, 1)
        }
      }
    },
    increaseQty(r) {
      r.quantity++
      if(!this.orderRecipes.includes(r)) {
        this.orderRecipes.push(r)
      }
    },
    increaseOrderNumber() {
      this.orderNum++

      db.collection('companies').doc(this.company.id).update({
        orderNumber: this.orderNum
      }).catch(err => {
        console.log(err.message)
      })
    },
    orderPickedUp(order) {
      this.loading = true
      db.collection('orders').doc(order.id).update({
        status: 'COMPLETE'
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
    
    db.collection('recipes').get().then(snapshot => {
      snapshot.forEach(doc => {
        let recipe = doc.data()
        this.recipes.push(recipe)
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

    let ref = db.collection('orders').orderBy('orderNumber')
    
    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let doc = change.doc
        if(change.type == 'added') {
          this.orders.push({
            id: doc.id,
            dishes: doc.data().dishes,
            status: doc.data().status,
            orderNumber: doc.data().orderNumber,
            notes: doc.data().notes,
            timestamp: moment(doc.data().timestamp).fromNow()
          })
        } else if (change.type == 'modified') {
          this.orders.forEach(order => {
            if(order.id == doc.id) {
              this.orders = this.orders.filter(o => {
                return o.id != order.id
              })
            }
          })
          
          this.orders.push({
            id: doc.id,
            dishes: doc.data().dishes,
            status: doc.data().status,
            orderNumber: doc.data().orderNumber,
            notes: doc.data().notes,
            timestamp: moment(doc.data().timestamp).fromNow()
          })
        } else if (change.type == 'removed') {
          this.orders.forEach(order => {
            if(order.id == doc.id) {
              this.orders = this.orders.filter(o => {
                return o.id != order.id
              })
            }
          })
        }
      })
    })
  }
}
</script>

