<template>
  <div class="dashboard">
    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>Order added successfully</span>
      <v-btn flat color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <h1 class="subheading grey--text ma-4">Orders</h1>
    <Popup @orderAdded="snackbar = true"/>
    <v-container fluid class="my-3">
      <v-layout row wrap>
        <ReadyOrders />
        <!-- <v-flex xs12 md5>
          <h2 class="header-2 grey--text ma-2">Ready for Pickup</h2>
          <v-card class="my-4 mx-3" v-for="order in orders" :key="order.id">
            <v-layout class="pa-3" row wrap v-if="order.status == 'READY'">
              <v-flex xs2 class="mb-2">
                <div class="caption grey--text">Order #</div>
                <div>{{ order.orderNumber }}</div>
              </v-flex>
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
                <v-chip dark color="warning" v-for="(dish, index) in order.dishes" :key="index">
                  {{ dish.title }} x{{ dish.quantity }}
                </v-chip>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex> -->
        <v-flex xs12 sm6>
          <h2 class="header-2 grey--text ma-2">Active Orders</h2>
          <v-card class="my-4 mx-3" v-for="(order, index) in orders" :key="order.id + index">
            <v-layout class="pa-3" row wrap v-if="order.status == 'ACTIVE'">
              <v-flex xs4 class="mb-2">
                <div class="caption grey--text">Order #</div>
                <div>{{ order.orderNumber }}</div>
              </v-flex>
              <!-- <v-flex xs3>
                <div><v-btn color="error" @click="cancelOrder(order.id)">CANCEL</v-btn></div>
              </v-flex> -->
              <v-flex xs4>
                <div class="caption grey--text">Time (Minutes)</div>
                <div>3</div>
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
                <v-chip dark color="warning" v-for="(dish, index) in order.dishes" :key="index">
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
    createOrder(r) {
      if(r.length > 0) {
        this.feedback = null
        db.collection('orders').add({
          dishes: r,
          status: 'ACTIVE',
          orderNumber: this.orderNum
        }).then(() => {
          this.increaseOrderNumber()
          this.orderRecipes = []
        }).catch(err => {
          console.log(err.message)
        })
      } else {
        this.feedback = 'You need to enter a dish before submitting an order'
      }      
    },
    cancelOrder(id) {
      db.collection('orders').doc(id).delete().then(() => {
        this.orders = this.orders.filter(order => {
          return order.id != id
        })
      })
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
        if(c.name == 'Vera Pizza') {
          this.company = c
          this.company.id = doc.id
          this.orderNum = this.company.orderNumber
        }
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
            notes: doc.data().notes
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
            notes: doc.data().notes
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

