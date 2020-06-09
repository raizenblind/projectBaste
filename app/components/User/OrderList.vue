<template>
    <GridLayout columns="*" rows="*" padding='5'>
        <GridLayout marginBottom="70">
            <ScrollView height='100%' >
                <StackLayout>
                    <GridLayout class='box' androidElevation='3' width="100%" v-for="orderList in orderLists.cart" :key="orderList">
                        <GridLayout class="order-layout">
                            <StackLayout width='33%' horizontalAlignment='left' verticalAlignment='center' orientation="vertical" >
                                <Image :src="`${url}${orderList.image}`" height='120'></Image>
                            </StackLayout>
                            <StackLayout width='33%' horizontalAlignment='center'  orientation="vertical">
                                <Label :text="orderList.name"  fontSize='16' textWrap='true'></Label>
                                <Label :text="orderList.description" fontSize='14' textWrap='true'></Label>
                                <Label :text="'Price: ₱' + orderList.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" fontSize='14' textWrap='true'></Label>                   
                            </StackLayout>
                            <StackLayout width='33%' horizontalAlignment='right' verticalAlignment='bottom'>
                                <StackLayout orientation="vertical" >
                                    <Label  horizontalAlignment='center'  text="Quantity:"  fontSize='14' textWrap='true' ></Label>
                                    <StackLayout width='100%' orientation="horizontal"  horizontalAlignment='center' :isEnabled="!processing">
                                        <button class="order-button fa" :isEnabled='orderList.quantity == 1 ? false : true' @tap='quantity("sub", orderList)'  :text="'\uf068'" padding='0' margin='0'/>
                                        <TextField borderWidth='0' editable='false' height='40' :text='orderList.quantity' width='40' textAlignment='center' padding='0' margin='0' fontSize='12'/>
                                        <button class="order-button fa" @tap='quantity("add", orderList)' :text="'\uf067'" padding='0' margin='0'/>
                                    </StackLayout>
                                </StackLayout>
                            </StackLayout>
                        </GridLayout>
                            <button  class="order-button-remove fa" :text="'\uf1f8'"  @tap="deleteOrder(orderList)" :isEnabled="!processing"/>
                        
                    </GridLayout>
                </StackLayout>
            </ScrollView>
        </GridLayout>
        <GridLayout orientation='horizontal' verticalAlignment='bottom' padding='5'>
            <StackLayout  width='50%' horizontalAlignment="right">
                <Label fontSize="16" :text="'Total: ₱' + (orderLists == 'No Order List' ? '0.00' :Number(orderLists.total_price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))"  textAlignment='center' textWrap='true'/>
                <Button height="40" :isEnabled="orderLists == 'No Order List' ? false : true" @tap='generateQR' text='Proceed to Payment' borderRadius='5' backgroundColor='green'/>
            </StackLayout>
        </GridLayout>
    </GridLayout>
</template>

<script >
import { ImageSource } from "tns-core-modules/image-source";
import { Image } from "tns-core-modules/ui/image";
import axios from "axios";
const appSettings = require("tns-core-modules/application-settings");
  export default {
    props: {
        orderLists: Object,
        deleteOrder: Function,
        processing: Boolean,
        generateQR: Function
    },
    data() {
      return {
        url: appSettings.getString('url').replace('/api',''),
      }
    },
 
    methods: {
        quantity(status, order){
            this.processing = true
            axios({
                url:appSettings.getString("url") + "cart/"+ order.id,
                method: "PATCH",
                headers: {
                        'Authorization': 'Bearer ' + appSettings.getString("key")
                },
                data: {
                    status: status,
                }
                }).then((response) => {
                    if(status == "add")
                    {
                        this.orderLists.total_price = this.orderLists.total_price + order.price
                        order.quantity += 1
                    }else {
                        this.orderLists.total_price = this.orderLists.total_price - order.price
                        order.quantity -= 1
                    }

                    this.processing = false
                    
                })

        },
        
    }
  }
</script>
