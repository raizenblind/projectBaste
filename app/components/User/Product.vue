<template>
    <!-- <GridLayout ~mainContent columns="*" rows="*"> -->
        <GridLayout>
            <ListView ref="listView"
                for="productList in productLists"
                @itemTap="goToExample">
                <v-template>
                    <StackLayout width="100%" orientation="horizontal">
                        <StackLayout width='35%' horizontalAlignment='left' orientation="vertical" >
                            <Image :src="`${url}${productList.image}`" height='100'></Image>
                            <Label :text="productList.name" textAlignment='center' fontSize='16' textWrap='true'></Label>
                            </StackLayout>
                        <StackLayout width='30%' horizontalAlignment='center' orientation="vertical">
                            <Label text="Description:" fontSize='14' textWrap='true'></Label>
                            <Label :text="productList.description" fontSize='14' textWrap='true'></Label>
                        </StackLayout>
                        <StackLayout width='35%' horizontalAlignment='right' orientation="vertical">
                            <Label :text="'Price: ₱' + productList.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" textAlignment='center' fontSize='14' textWrap='true'></Label>
                            <button @tap="addOrder(productList)" verticalAlignment='bottom' borderRadius='100' height='40' fontSize='10' text="Add to order" backgroundColor='red'></button>
                        </StackLayout>
                    </StackLayout>
                </v-template>
            </ListView>
        </GridLayout>
    <!-- </GridLayout> -->
</template>

<script >
import Home from "./Home";
import axios from "axios";
const appSettings = require("tns-core-modules/application-settings");
  export default {
    props: {
        addOrder: Function
    },
    data() {
      return {
        url: appSettings.getString('url').replace('/api',''),
        productLists: [],
      }
    },
    created() {
        axios({
        url:appSettings.getString("url") + "item/get",
        method: "GET",
        }).then((response) => {
            this.productLists = response.data.filter(res => res.status == 1)
        }).catch((err) => {
            console.log(err)
        })
    },
    methods: {

    }
  }
</script>

<style scoped>
    ActionBar {
        background-color: #34cceb;
        color: #ffffff;
    }

    .title {
        text-align: left;
        padding-left: 16;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }

    .drawer-header {
        padding: 50 16 16 16;
        margin-bottom: 16;
        background-color: #34cceb;
        color: #ffffff;
        font-size: 24;
    }

    .drawer-item {
        padding: 8 16;
        color: gray;
        font-size: 16;
    }
    TabStripItem.tabstripitem:active {
        background-color: yellow;
    } 
    .todobadge {
        position: relative;
        width: 20;
        height: 20;
        border-radius:100px;
        background: red;
    }

</style>
