<template>
    <Page>
        <ActionBar flat="true">
            <GridLayout width="100%" columns="auto, *">
                <Label class='fa' :text="'\uf0c9'" fontSize='25' @tap="openSideDrawer" col="0"/>
                <Label class="title" :text="view"  col="1"/>
                <GridLayout col="2" @tap="changeView('Order')">
                    <Label class='fa' :text="'\uf07a '" fontSize='24' />
                    <TextField v-show="cart != 0" class='todobadge' editable='false' :text='cart' textAlignment='center' fontWeight="700"  fontSize="10" padding='0' verticalAlignment="top" horizontalAlignment="left" color='white'/>
                </GridLayout>
            </GridLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer" drawerTransition='PushTransition'>
            <StackLayout ~drawerContent backgroundColor="#ffffff">
                    <GridLayout class="drawer-header"  orientation='vertical'>
                        <StackLayout class="drawer-header"  orientation='vertical'>
                            <Image :src="`${url}${user.profile_pic}`" class="profile-pic"/>
                            <Label :text="user.firstname + ' ' + user.lastname" class="drawer-name"/>
                        </StackLayout>
                        <Label :text="'Wallet balance: ₱ ' + user.wallet" class="drawer-wallet"/>
                    </GridLayout>
                    <ScrollView orientation="vertical" height='100%'>
                        <StackLayout ~drawerContent backgroundColor="#ffffff">
                            <TextField editable="false" :backgroundColor="view == 'Home' ? '#34cceb' : 'transparent'" class="drawer-item fa" :text="'\uF015' + '   Home'" @tap='changeView("Home")'/>
                            <TextField editable="false" :backgroundColor="view == 'Product' ? '#34cceb' : 'transparent'" class="drawer-item fa" :text="'\uf0f5' + '   Products'" @tap='changeView("Product")'/>
                            <TextField editable="false" :backgroundColor="view == 'Transaction Logs' ? '#34cceb' : 'transparent'" class="drawer-item fa" :text="'\uf1da' + '   Transaction Logs'" @tap='changeView("Transaction Logs")'/>
                            <TextField editable="false" :backgroundColor="view == 'Account' ? '#34cceb' : 'transparent'" class="drawer-item fa" :text="'\uf007' + '   My Account'" @tap='changeView("Account")'/>
                            <TextField editable="false" class="drawer-item fa" :text="'\uf08b' + '   Sign Out'" @tap="changeView(false)"/>
                            
                        </StackLayout>
                    </ScrollView>
            </StackLayout>
            <GridLayout ~mainContent columns="*" rows="*">
                <Home v-show="view == 'Home'"/>
                <Product v-show="view == 'Product'" :addOrder="addOrder"/>
                <Transaction v-show="view == 'Transaction Logs'"/>
                <Account v-show="view == 'Account'" :user="user"/>
                <Order v-show="view == 'Order'" :processing="processing" :orderLists="orderLists" :deleteOrder="deleteOrder" :generateQR="generateQR"/>
            </GridLayout>
            
        </RadSideDrawer>
    </Page>
</template>
<script>
import Login from "../Login";
import Home from "./Home";
import Account from "./Account";
import Product from "./Product";
import Order from "./OrderList";
import Transaction from "./Transaction";
const appSettings = require("tns-core-modules/application-settings");
import axios from "axios";
import moment from "moment";
import { QrGenerator } from "nativescript-qr-generator";
import { ImageSource } from "tns-core-modules/image-source";
import { Image } from "tns-core-modules/ui/image";
export default {
    components: {
        Home,
        Product,
        Account,
        Order,
        Transaction
    },
    data() {
      return {
        url:appSettings.getString('url').replace('/api',''),
        view:"Home",
        processing: false,
        user: {
            profile_pic: "~/assets/images/profile_pic.png",
            firstname: "",
            middlename: "",
            lastname: "",
            email: "",
            password: "",
            confirmpassword: "",
            birthday: "",
            age: "",
            gender: true,
            wallet:""
        },
        orderLists: [],
        cart: 0
      }
    },
    created() {
        this.getOrderCartList()
    },
    methods: {
        getOrderCartList() {
            axios({
            url:appSettings.getString("url") + "cart/get",
            method: "GET",
            headers: {
                    'Authorization': 'Bearer ' + appSettings.getString("key")
            },
            }).then((response) => {
                this.orderLists = response.data
                this.cart = response.data.cart.length
                this.processing = false
            }).catch((err) => {
                console.log(err)
            })

        },
        openSideDrawer() {
            axios({
            url:appSettings.getString("url") + "auth/get",
            method: "GET",
            headers: {
                    'Authorization': 'Bearer ' + appSettings.getString("key")
            },
            }).then((response) => {
                this.user.profile_pic = response.data.picture
                this.user.firstname = response.data.firstname
                this.user.middlename = response.data.middlename
                this.user.lastname = response.data.lastname
                this.user.email = response.data.email
                this.user.password = response.data.password
                this.user.birthday = moment(response.data.birthday).format('MM-DD-YYYY')
                this.user.age = response.data.age
                this.user.gender = response.data.gender == "Male" ? true : false
                this.user.wallet = response.data.wallet.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                this.$refs.drawer.nativeView.showDrawer()
            }).catch((err) => {
                console.log(err)
            })
        },
        changeView(a) {
            this.$refs.drawer.nativeView.closeDrawer()
            if(a)
            {
                this.view = a
            }else{
                confirm({
                title: "Confirmation",
                message: "Are you sure do you want to Sign out?",
                okButtonText: "YES",
                cancelButtonText: "NO"
                }).then(result => {
                    if(result){
                        this.$navigateTo(Login, { clearHistory: true });
                    }
                })
            }
        },
        addOrder(product) {
            axios({
            url:appSettings.getString("url") + "order/add",
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + appSettings.getString("key")
            },
            data: {
                name: product.name,
                description: product.description,
                type: product.type,
                price: product.price,
                image: product.image,
                status: product.status
            }
            }).then((response) => {
                this.orderLists = response.data
                this.cart = response.data.cart.length
            }).catch((err) => {
                console.log(err)
            })

        },
        deleteOrder(order) {
            this.processing = true
            confirm({
            title: "Confirmation",
            message: "Are you sure do you want to delete this item?",
            okButtonText: "Yes",
            cancelButtonText: "No"
            }).then(result => {
                if(result){
                    axios({
                    url:appSettings.getString("url") + "cart/" + order.id,
                    method: "DELETE",
                    headers: {
                            'Authorization': 'Bearer ' + appSettings.getString("key")
                    },
                    }).then((response) => {
                        this.getOrderCartList()
                    }).catch((err) => {
                        console.log(err)
                    })
                } else
                {
                    this.processing = false
                }
                
            });
        },
        generateQR() {
            var vm = this
            const result = new QrGenerator().generate(`Order Number ${this.orderLists.id}`);
            var src = new ImageSource(result);
            vm.$showModal({template: `
                <StackLayout backgroundColor="white">
                    <Label class="h2 text-center" text="QR Code Payment" />
                    <image :src="src" height="300"/>
                    <Button class="btn btn-outline" text="Close Modal" @tap="closeModal" />
                </StackLayout>`,
                data() {
                    return {
                        src:  src
                    };
                },
                methods: {
                    closeModal() {
                        axios({
                        url:appSettings.getString("url") + "cart/get",
                        method: "GET",
                        headers: {
                                'Authorization': 'Bearer ' + appSettings.getString("key")
                        },
                        }).then((response) => {
                            if(response.data == 'No Order List'){
                                vm.cart = 0
                                vm.orderLists = response.data
                                alert({
                                title: "Payment Successful",
                                message: "Thank you!",
                                okButtonText: "OK"
                                })
                            }
                            this.$modal.close()
                        }).catch((err) => {
                            console.log(err)
                        })
                    }

                }
            
            })
        
        }
    }
}
</script>