import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Login from './views/Login'
import Recipes from './views/Recipes'
import AddRecipe from './views/AddRecipe'
import EditRecipe from './views/EditRecipe'
import Orders from './views/Orders'
import Data from './views/Data'
import Settings from './views/Settings'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: Recipes
    },
    {
      path: '/add-recipe',
      name: 'AddRecipe',
      component: AddRecipe
    },
    {
      path: '/edit-recipe/:recipe_slug',
      name: 'EditRecipe',
      component: EditRecipe
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders
    },
    {
      path: '/data',
      name: 'Data',
      component: Data
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    }
  ]
})
