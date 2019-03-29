<template>
  <div class="NewOrderPopup" v-if="company">
    <v-dialog max-width="1000px" v-model="dialog" v-if="company.dayStarted">
      <v-btn slot="activator" dark :color="`${company.secondaryColor}`" class="mx-4" small>
        Enter Order
      </v-btn>
      <v-layout row style="background-color: white">
        <v-flex xs12 lg6 style="max-height: 800px; overflow: auto">
          <h2 :class="`header-2 ${company.mainColor}--text ma-2`">Enter Order</h2>
          <v-flex xs12 v-for="recipe in recipes" :key="recipe.slug">
            <v-card class="my-4 mx-3" :color="`${company.mainColor} white--text`">
              <v-card-title>
                <h2>{{ recipe.title }}</h2>
                <v-spacer></v-spacer>
                ${{ recipe.price }}
              </v-card-title>
              <v-list>
                <v-chip outline :color="`${company.secondaryColor}`" v-for="(ing, index) in recipe.ingredients" :key="index" class="my-2">{{ ing }}</v-chip>
              </v-list>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text mx-4" @click="decreaseQty(recipe)">
                  <v-icon>remove</v-icon>
                </v-btn>
                {{ recipe.quantity }}
                <v-btn icon class="white--text ml-4" @click="increaseQty(recipe)">
                  <v-icon>add</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-flex>
        <v-flex xs12 lg4>
          <h2 :class="`title ${company.mainColor}--text ma-2`">Order Summary</h2>        
          <p class="red--text center">{{ feedback }}</p>
          <v-btn dark :color="`${company.secondaryColor}`" @click="createOrder(orderRecipes, notes)" :loading="loading">Submit Order</v-btn>
          <v-list style="background-color: transparent">
            <v-list-tile v-for="(r, index) in orderRecipes" :key="index">
              <v-list-tile-title class="subheading grey--text">{{ r.title }} <span class="mx-4">x{{ r.quantity }}</span></v-list-tile-title>
            </v-list-tile>
          </v-list>
          <h2 :class="`subheading ${company.mainColor}--text ml-3 mb-3`">Total: $<b>{{ total }}</b></h2>
          <v-textarea :color="`${company.mainColor}`" solo v-model="notes" label="Notes:" class="ma-3"></v-textarea>
        </v-flex>
      </v-layout>
    </v-dialog>
  </div>
  
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
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
      dialog: false,
      loading: false,
      notes: null,
      total: 0,
      company: null
    }
  },
  methods: {
    decreaseQty(r) {
      if(r.quantity > 0) {
        r.quantity--
        this.total = this.total - r.price
        if(r.quantity <= 0) {
          this.orderRecipes.splice(r.index, 1)
        }
      }
    },
    increaseQty(r) {
      r.quantity++
      this.total = this.total + r.price
      if(!this.orderRecipes.includes(r)) {
        this.orderRecipes.push(r)
      }
    },
    createOrder(r, n) {
      let TodayDate = new Date()

      if(r.length > 0) {
        this.loading = true
        this.feedback = null
        db.collection('orders').add({
          dishes: r,
          status: 'ACTIVE',
          orderNumber: this.orderNum,
          notes: n,
          timestamp: Date.now(),
          day: TodayDate.getDay()
        }).then(() => {
          this.increaseOrderNumber()
          this.orderRecipes = []
          this.loading = false
          this.dialog = false
          this.notes = null
          this.total = 0
          this.$emit('orderAdded')
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
      
      this.recipes.forEach(recipe => {
        recipe.quantity = 0
        console.log(recipe.quantity)
      })

      db.collection('companies').doc(this.company.id).update({
        orderNumber: this.orderNum
      }).catch(err => {
        console.log(err.message)
      })
    },
    orderPickedUp(order) {
      db.collection('orders').doc(order.id).update({
        status: 'COMPLETE'
      }).then(() => {
        this.orders = this.orders.filter(o => {
          return o.id != order.id
        })
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