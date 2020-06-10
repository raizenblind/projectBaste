import Vue from 'nativescript-vue'
import Login from './components/Login'


import VueDevtools from 'nativescript-vue-devtools'
import './app.scss';
import './assets/css/drawer.css';
const appSettings = require("tns-core-modules/application-settings");

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// appSettings.setString("url", "http://192.168.1.4:3030/api/")
appSettings.setString("url", "http://88093ac3c99d.ngrok.io/api/")
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = true
// Prints Colored logs when --env.production is *NOT* set while building
Vue.config.debug = (TNS_ENV !== 'production')

Vue.registerElement(
  'RadSideDrawer',
  () => require('nativescript-ui-sidedrawer').RadSideDrawer
)
Vue.registerElement(
  'RadListView',
  () => require('nativescript-ui-listview').RadListView
)

Vue.registerElement(
  'CheckBox',
  () => require('@nstudio/nativescript-checkbox').CheckBox
)

require( "nativescript-localstorage" );


new Vue({
  
  render: h => h('frame', [h(Login)])
}).$start()
