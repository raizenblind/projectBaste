<template>
    <Page>
        <ActionBar flat="true">
            <GridLayout width="100%" columns="auto, *">
                <Label class='fa' :text="'\uf0c9'" fontSize='25' @tap="openSideDrawer" col="0"/>
                <Label class="title" text="Admin Settings"  col="1"/>
                <GridLayout col="2" @tap="sendWalletModal">
                    <Label class='fa' :text="'\uf1d8 '" fontSize='24' />
                </GridLayout>
            </GridLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer" drawerTransition='PushTransition'>
            <StackLayout ~drawerContent backgroundColor="#ffffff">
                    <GridLayout class="drawer-header"  orientation='vertical'>
                        <StackLayout class="drawer-header"  orientation='vertical'>
                            <Image :src="`${url}${user.profile_pic}`" class="profile-pic"/>
                            <Label :text="'Admin: ' + user.firstname + ' ' + user.lastname" class="drawer-name"/>
                        </StackLayout>
                        <!-- <Label :text="'Wallet balance: ₱ ' + user.wallet" class="drawer-wallet"/> -->
                    </GridLayout>
                    <ScrollView orientation="vertical" height='100%'>
                        <StackLayout ~drawerContent backgroundColor="#ffffff">
                            <TextField editable="false" :backgroundColor="view == 'Home' ? '#34cceb' : 'transparent'" class="drawer-item fa" :text="'\uF015' + '   Home'" @tap='changeView("Home")'/>
                            <TextField editable="false" :backgroundColor="view == 'Product List' ? '#34cceb' : 'transparent'" class="drawer-item fa" :text="'\uf0f5' + '   Products List'" @tap='changeView("Product List")'/>
                            <TextField editable="false" :backgroundColor="view == 'User Transaction Logs' ? '#34cceb' : 'transparent'" class="drawer-item fa" :text="'\uf1da' + '   User Transaction Logs'" @tap='changeView(" User Transaction Logs")'/>
                            <TextField editable="false" :backgroundColor="view == 'Account' ? '#34cceb' : 'transparent'" class="drawer-item fa" :text="'\uf007' + '   My Account'" @tap='changeView("Account")'/>
                            <TextField editable="false" class="drawer-item fa" :text="'\uf08b' + '   Sign Out'" @tap="changeView(false)"/>
                            
                        </StackLayout>
                    </ScrollView>
            </StackLayout>
            <GridLayout ~mainContent columns="*" rows="*">
                <Home v-show="view == 'Home'"/>
                <ProductList v-show="view == 'Product List'"/>
                <Account v-show="view == 'Account'" :user="user"/>
                <!-- <Transaction v-show="view == 'Transaction Logs'"/>
                <Account v-show="view == 'Account'" :user="user"/>
                <Order v-show="view == 'Order'" :processing="processing" :orderLists="orderLists" :deleteOrder="deleteOrder"/> -->
            </GridLayout>
            
        </RadSideDrawer>
    </Page>
</template>
<script>
import Login from "../Login";
import Home from "./Main";
import Account from "./Account";
import ProductList from "./ProductList";
// import Order from "./OrderList";
// import Transaction from "./Transaction";
const appSettings = require("tns-core-modules/application-settings");
import axios from "axios";
import moment from "moment";
export default {
    components: {
        Home,
        ProductList,
        Account,
        // Order,
        // Transaction
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

        sendWalletModal() {
            var vm = this
            vm.$showModal({
                template: `
                    <Page>
                        <GridLayout height="300">
                            <StackLayout>
                                <Label text="Send E-Wallet" class="modal-title"/>
                                <ScrollView height="100%">
                                    <StackLayout padding="8"  marginBottom="50">
                                        <Label text="Recipients Email Address" class="modal-label"/>
                                        <TextField v-model="user.email" :isEnabled="!processing"  hint="Add Recipients" class="modal-textfield"/>

                                        <Label text="Amount" class="modal-label"/>
                                        <TextField v-model="user.wallet" :isEnabled="!processing" keyboardType="phone"  class="modal-textfield"   hint="Type Price here" />
                                   </StackLayout>
                                </ScrollView>
                            </StackLayout>
                            <Button :isEnabled="!processing" class="modal-float-button" text="Send" @tap="sendWallet" verticalAlignment="bottom"/>
                            <ActivityIndicator  :busy="processing"  color="#34cceb"></ActivityIndicator>
                        </GridLayout>
                    </Page>`,
                    data() {
                        return {
                            url: appSettings.getString('url').replace('/api',''),
                            processing: false,
                            user: {
                                email: "",
                                wallet: ""
                            }
                        }
                    },
                    methods: {
                        sendWallet() {
                            this.processing = true
                            if(!this.user.email || !this.user.wallet)
                            {
                                alert({
                                title: "Send Wallet Error",
                                message: "Please complete fields.",
                                okButtonText: "OK"
                                })
                                this.processing = false
                                return
                            }
                            confirm({
                            title: "Confirmation",
                            message: `Are you sure do you want to send ${this.user.wallet} wallet to ${this.user.email}?`,
                            okButtonText: "Yes",
                            cancelButtonText: "No"
                            }).then(result => {
                                if(result){
                                    axios({
                                    url:appSettings.getString("url") + "wallet/send",
                                    method: "PATCH",
                                    data: {
                                        email: this.user.email,
                                        wallet: Number(this.user.wallet)
                                    }
                                    }).then((response) => {
                                        if(response.data == "Not exist")
                                        {
                                            alert({
                                            title: "Send Wallet Error",
                                            message: "Email address not exist.",
                                            okButtonText: "OK"
                                            })
                                            this.processing = false
                                            return
                                        }
                                        alert({
                                        title: "Successful",
                                        message: "Send Wallet Successful.",
                                        okButtonText: "OK"
                                        })
                                        this.$modal.close()
                                        this.processing = false
                                    }).catch((err) => {
                                        console.log(err)
                                    })
                                }
                                else{
                                    this.processing = false  
                                }
                            });
                        },
                        modalClose() {
                            this.$modal.close()
                        }
                    }, 


            })
        },
    }
}
</script>