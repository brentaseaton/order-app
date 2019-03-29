<template>
  <div class="stats">
    <h1 class="subheading grey--text mx-4 my-2">Statistics</h1>

    <v-layout row>
      <v-flex xs6 md2 class="mx-4 my-2">
        <v-select :items="items" label="Select Data" solo v-on:change="setChartDishes()"></v-select>
      </v-flex>
    </v-layout>
    
    <v-layout row wrap v-if="chartData.length">
      <v-flex xs12 md10 class="mx-4 my-2">
        <GChart type="LineChart" :data="chartData" :options="chartOptions" />
      </v-flex>

      <v-flex xs12 md10 class="mx-4 my-2">
        <v-data-table :headers="headers" :items="tableItems" class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.Sun }}</td>
            <td>{{ props.item.Mon }}</td>
            <td>{{ props.item.Tues }}</td>
            <td>{{ props.item.Weds }}</td>
            <td>{{ props.item.Thurs }}</td>
            <td>{{ props.item.Fri }}</td>
            <td>{{ props.item.Sat }}</td>
          </template>
        </v-data-table>
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
      ],
      headers: [
        { text: 'Dish', align: 'left', sortable: false, value: 'name'},
        { text: 'Sun (%)', value: 'Sun', align: 'left', sortable: false},
        { text: 'Mon (%)', value: 'Mon', align: 'left', sortable: false},
        { text: 'Tues (%)', value: 'Tues', align: 'left', sortable: false},
        { text: 'Weds (%)', value: 'Weds', align: 'left', sortable: false},
        { text: 'Thurs (%)', value: 'Thurs', align: 'left', sortable: false},
        { text: 'Fri (%)', value: 'Fri', align: 'left', sortable: false},
        { text: 'Sat (%)', value: 'Sat', align: 'left', sortable: false}/* ,
        { text: 'Total (%)', value: 'Total', align: 'left', sortable: false} */
      ],
      tableItems: []
    }
  },
  methods: {
    setChartDishes() {
      this.chartData = []
      this.tableItems = []
      this.chartData.push(['Day'])

      this.dishes.forEach(dish => {
        this.chartData[0].push(dish.title)

        /* this.tableItems.push({
          name: dish.title,
          Sun: null,
          Mon: null,
          Tues: null,
          Weds: null,
          Thurs: null,
          Fri: null,
          Sat: null
        }) */
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
      
      let SunTotal = 0
      let MonTotal = 0
      let TuesTotal = 0
      let WedsTotal = 0
      let ThursTotal = 0
      let FriTotal = 0
      let SatTotal = 0

      this.dishes.forEach(dish => {

        this.orderQuantities.forEach(oq => {
          if(dish.title == oq.name) {
            if(oq.day == 'Sun') {
              SunTotal += oq.quantity
            } else if(oq.day == 'Mon') {
              MonTotal += oq.quantity
            } else if(oq.day == 'Tues') {
              TuesTotal += oq.quantity
            } else if(oq.day == 'Weds') {
              WedsTotal += oq.quantity
            } else if(oq.day == 'Thurs') {
              ThursTotal += oq.quantity
            } else if(oq.day == 'Fri') {
              FriTotal += oq.quantity
            } else if(oq.day == 'Sat') {
              SatTotal += oq.quantity
            }
          }
        })
      })

      this.dishes.forEach(dish => {
        let Sunday = 0
        let Monday = 0
        let Tuesday = 0
        let Wednesday = 0
        let Thursday = 0
        let Friday = 0
        let Saturday = 0

        this.orderQuantities.forEach(oq => {
          if(dish.title == oq.name) {
            if(oq.day == 'Sun' && SunTotal != 0) {
              Sunday = oq.quantity / SunTotal * 100
            } else if(oq.day == 'Mon' && MonTotal != 0) {
              Monday = oq.quantity / MonTotal * 100
            } else if(oq.day == 'Tues' && TuesTotal != 0) {
              Tuesday = oq.quantity / TuesTotal * 100
            } else if(oq.day == 'Weds' && WedsTotal != 0) {
              Wednesday = oq.quantity / WedsTotal * 100
            } else if(oq.day == 'Thurs' && ThursTotal != 0) {
              Thursday = oq.quantity / ThursTotal * 100
            } else if(oq.day == 'Fri' && FriTotal != 0) {
              Friday = oq.quantity / FriTotal * 100
            } else if(oq.day == 'Sat' && SatTotal != 0) {
              Saturday = oq.quantity / SatTotal * 100
            }
          }
        })

        this.tableItems.push({
          name: dish.title,
          Sun: Math.round(Sunday),
          Mon: Math.round(Monday),
          Tues: Math.round(Tuesday),
          Weds: Math.round(Wednesday),
          Thurs: Math.round(Thursday),
          Fri: Math.round(Friday),
          Sat: Math.round(Saturday)
        })
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
