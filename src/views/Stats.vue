<template>
  <div class="stats">
    <h1 class="subheading grey--text mx-4 my-3">Statistics</h1>

    <v-layout row>
      <v-flex xs2 class="mx-4 my-3">
        <v-select :items="items" label="Select Graph" solo v-on:change="setChartDishes()"></v-select>
      </v-flex>
    </v-layout>
    
    <v-layout row wrap>
      <v-flex xs10 class="mx-4 my-3">
        <GChart type="LineChart" :data="chartData" :options="chartOptions" v-if="chartData.length" />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import { GChart } from 'vue-google-charts'
import moment from 'moment'

export default {
  components: {
    GChart
  },
  data() {
    return {
      orders: [],
      dishes: [],
      items: ['Dish by Day'],
      orderQuantities: [],
      dishTitles: [],
      chartData: [],
      chartOptions: {
          title: '',
          subtitle: 'Test subtitle',
          height: 400
      },
      days: [
        { name: 'Sun', id: 0},
        { name: 'Mon', id: 1},
        { name: 'Tues', id: 2},
        { name: 'Weds', id: 3},
        { name: 'Thurs', id: 4},
        { name: 'Fri', id: 5 },
        { name: 'Sat', id: 6 }
      ]
    }
  },
  methods: {
    setChartDishes() {
      this.chartData =[]
      this.chartData.push(['Day'])

      this.dishes.forEach(dish => {
        this.chartData[0].push(dish.title)
      })

      this.days.forEach(day => {
        this.chartData.push([day.name])
      })

      this.orderQuantities = []

      this.days.forEach(day => {
          this.dishes.forEach(dish => {
            this.orderQuantities.push({
              name: dish.title,
              quantity: 0,
              day: day.name
            })
            
            this.orders.forEach(order => {
              if(day.id == order.day) {
                order.dishes.forEach(orderDish => {
                  if(dish.title == orderDish.title) {
                    this.orderQuantities.forEach(oq => {
                      if(oq.name == orderDish.title && oq.day == day.name) {
                        oq.quantity += orderDish.quantity
                      }
                    })
                  }
                })
              }   
            })           
          })

        this.orderQuantities.forEach(oq => {
          if(oq.day == day.name) {
            this.chartData[day.id + 1].push(oq.quantity)
          }
        })
      })
      console.log(this.orderQuantities)
      console.log(this.chartData) 
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
        this.dishes.push({
          title: recipe.title,
          price: recipe.price
        })
      })
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
          notes: doc.data().notes,
          timestamp: moment(doc.data().timestamp).fromNow(),
          day: doc.data().day
        })
      })
    }) 
  }
}
</script>
