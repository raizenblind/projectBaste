<template>
    <GridLayout class="main-page">
        
        <StackLayout class="table"> 

            <FlexboxLayout class="t-header">
                <Label class="t-header-label" text="Product Name" width="35%"  textWrap="true"></Label>
                <!-- <Label class="t-header-label"  text="Description" width="25%"  textWrap="true"></Label> -->
                <Label class="t-header-label"  text="Price" width="25%"  textWrap="true"></Label>
                
                <Label class="t-header-label" text="Status" width="20%" extWrap="true" ></Label>
                <Label class="t-header-label" text="" width="20%"  textWrap="true" borderRightWidth="0"></Label>
            </FlexboxLayout>
            <!-- <Label :visibility='availact' color='black' textAlignment='center' text='No data available for this date.' textWrap='true' fontSize='14' paddingTop='10'/>
            
            <FlexboxLayout borderBottomWidth='1' borderBottomColor='#53b880' v-for='actLists in actList'>
                <Label color='black'  borderRightWidth='1' borderRightColor='#53b880' padding='10' paddingLeft='5' paddingRight='5' :text="actLists.Date" width="25%" fontSize="12" textWrap="true" ></Label>
                <Label color='black' borderRightWidth='1' borderRightColor='#53b880' padding='10' paddingLeft='5' paddingRight='5' :text="actLists.Day" width="25%"  textWrap="true" fontSize="12" ></Label>
                <Label color='black' borderRightWidth='1' borderRightColor='#53b880' padding='10' paddingLeft='5' paddingRight='5' :text="actLists.TimeIn" width="25%" fontSize="12" textWrap="true" ></Label>
                <Label color='black' padding='10' paddingLeft='5' paddingRight='5' :text="actLists.TimeOut" width="25%" textWrap="true" fontSize="12"  ></Label>
            </FlexboxLayout> -->
            <ScrollView height="100%">
                <StackLayout>
                    <FlexboxLayout v-for="productList in productLists" :key="productList">
                        <Label class="t-data" :text="productList.name" width="35%"  textWrap="true"></Label>
                        <!-- <Label class="t-data" :text="productList.description" width="20%"  textWrap="true"></Label> -->
                        <Label class="t-data" :text="'₱' + productList.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" width="25%"  textWrap="true"></Label>
                        
                        <Label class="t-data" :text="productList.status == 1 ? 'Active' : 'Inactive'" width="20%" textWrap="true" ></Label>
                        <StackLayout class="t-data" width="20%" alignment="center" orientation="horizontal" borderRightWidth="0">
                            <Label @tap="showModalUpdateProduct(productList)"  class="fa" :text="'\uf044'" width="50%" textWrap="true"  fontSize="20"></Label>
                            <Label @tap="deleteProduct(productList.id)" class="fa" color="red" :text="'\uf1f8'" width="50%" textWrap="true"  fontSize="20"></Label>
                            </StackLayout>
                            </FlexboxLayout>
                </StackLayout>
            </ScrollView>
        </StackLayout>
        
        <!-- <Button class="float-button fa" marginRight="80" :text="'\uf06e'"></Button> -->
        <Button class="float-button fa" :text="'\uf067'" @tap="showModalAddProduct"></Button>

    </GridLayout>

    
</template>

<script>
import * as camera from "nativescript-camera";
const imageSourceModule = require("tns-core-modules/image-source");
const fileSystemModule = require("tns-core-modules/file-system");
const appSettings = require("tns-core-modules/application-settings");
import axios from "axios";
export default {
    data() {
      return {
        product: {
            id: "",
            name: "",
            description: "",
            price: "",
            image: "~/assets/icons/product.png"
        },
        productLists: []
      }
    },
    created() {
        axios({
        url:appSettings.getString("url") + "item/get",
        method: "GET",
        }).then((response) => {
            this.productLists = response.data
        }).catch((err) => {
            console.log(err)
        })
    },
    methods: {
        showModalAddProduct() {
            var vm = this;
            vm.$showModal({
                template: `
                    <Page>
                        <GridLayout>
                            <StackLayout>
                                <Label text="Add New Product" class="modal-title"/>
                                <ScrollView height="100%">
                                    <StackLayout padding="8"  marginBottom="50">
                                        <Label text="Product Name" class="modal-label"/>
                                        <TextField :isEnabled="!processing" v-model="product.name" hint="Type Product Name" class="modal-textfield"/>
                                        <Label text="*Required field" class="required-label" v-show="!product.name" />

                                        <Label text="Description" class="modal-label"/>
                                        <TextView :isEnabled="!processing" v-model="product.description" class="modal-textfield" height="auto" minHeight="120"  hint="Type description here" />
                                        <FlexboxLayout orientation="horizontal">
                                            <StackLayout marginRight="3">
                                                <Label text="Product Type" class="modal-label"/>
                                                <TextField :isEnabled="!processing" editable="false" @tap="chooseType" keyboardType="phone" v-model="product.type" class="modal-textfield"   hint="Choose Type" />
                                                <Label text="*Required field" class="required-label" v-show="!product.type" />
                                            </StackLayout>
                                            <StackLayout>
                                                <Label text="Price" class="modal-label"/>
                                                <TextField :isEnabled="!processing" keyboardType="phone" v-model="product.price" class="modal-textfield"   hint="Type Price here" />
                                                <Label text="*Required field" class="required-label" v-show="!product.price" />
                                           </StackLayout>
                                        </FlexboxLayout>
                                        <Label text="Product Image" class="modal-label"/>
                                        <Image :src="product.image" height="250" width="250"/>
                                        <Button :isEnabled="!processing" text="upload" @tap="uploadImage"/>
                                        <Label text="*Required field" class="required-label" v-show="product.image == '~/assets/icons/product.png'" />

                                        <StackLayout :isEnabled="!processing" orientation="horizontal">
                                            <Label text="Status:" class="modal-label" verticalAlignment="center"/>
                                            <Switch v-model="product.status" backgroundColor="green" offBackgroundColor="red"/>
                                        </StackLayout>
                                   
                                   </StackLayout>
                                </ScrollView>
                            </StackLayout>
                            <FlexboxLayout class="modal-float-layout">
                                <Button :isEnabled="!processing" class="modal-float-button" text="Save" @tap="addNewProduct"/>
                                <Button :isEnabled="!processing" class="modal-float-button" text="Cancel" @tap="modalClose"/>
                            </FlexboxLayout>
                            <ActivityIndicator  :busy="processing"  color="#34cceb"></ActivityIndicator>
                        </GridLayout>
                    </Page>`,
                    data() {
                        return {
                            processing: false,
                            product: {
                                id: "",
                                name: "",
                                description: "",
                                price: "",
                                image: "~/assets/icons/product.png",
                                status: true,
                                type: ""
                            }
                        }
                    },
                    methods: {
                        chooseType() {
                            action("Choose Product Type", "Cancel", ["Foods", "Drinks"])
                            .then(result => {
                                if(result != "Cancel"){
                                    this.product.type = result
                                }
                            });
                        },
                        addNewProduct() {
                            if(!this.product.name || !this.product.type || !this.product.price || this.product.image == "~/assets/icons/product.png")
                            {
                                alert({
                                title: "Adding Product Error!",
                                message: "Please fill up required fields",
                                okButtonText: "OK"
                                }).then(() => {
                                })
                                return
                            }
                            this.processing = true
                            axios({
                            url:appSettings.getString("url") + "item/add",
                            method: "POST",
                            data: {
                                name: this.product.name,
                                description: this.product.description,
                                type: this.product.type,
                                price: this.product.price,
                                image: this.product.image,
                                status: this.product.status
                            }
                            }).then((response) => {
                                vm.productLists = response.data
                                this.processing = false
                                this.$modal.close()
                                
                            }).catch((e) => {
                                console.log(e)
                            })
                            
                            
                        },
                        async uploadImage() {
                            camera.requestPermissions()
                            camera.takePicture({ width: 1024, height: 1024, keepAspectRatio: true, saveToGallery: false})
                            .then((imageAsset) => {
                                console.log(this.product.image)
                                const img =  imageSourceModule.fromFile(imageAsset._android);
                                this.product.image = "data:image/png;base64," +img.toBase64String('jpeg', 50)
                            })
                        },
                        modalClose() {
                            this.$modal.close()
                        }
                    }, 


            })
        },
        showModalUpdateProduct(request) {
            var vm = this
            vm.$showModal({
                template: `
                    <Page>
                        <GridLayout>
                            <StackLayout>
                                <Label text="Add New Product" class="modal-title"/>
                                <ScrollView height="100%">
                                    <StackLayout padding="8"  marginBottom="50">
                                        <Label text="Product Name" class="modal-label"/>
                                        <TextField :isEnabled="!processing" v-model="product.name" hint="Type Product Name" class="modal-textfield"/>
                                        <Label text="*Required field" class="required-label" v-show="!product.name" />

                                        <Label text="Description" class="modal-label"/>
                                        <TextView :isEnabled="!processing" v-model="product.description" class="modal-textfield" height="auto" minHeight="120"  hint="Type description here" />
                                        <FlexboxLayout orientation="horizontal">
                                            <StackLayout marginRight="3">
                                                <Label text="Product Type" class="modal-label"/>
                                                <TextField :isEnabled="!processing" editable="false" @tap="chooseType" keyboardType="phone" v-model="product.types" class="modal-textfield"   hint="Choose Type" />
                                                <Label text="*Required field" class="required-label" v-show="!product.types" />
                                            </StackLayout>
                                            <StackLayout>
                                                <Label text="Price" class="modal-label"/>
                                                <TextField :isEnabled="!processing" keyboardType="phone" v-model="product.price" class="modal-textfield"   hint="Type Price here" />
                                                <Label text="*Required field" class="required-label" v-show="!product.price" />
                                           </StackLayout>
                                        </FlexboxLayout>
                                        <Label text="Product Image" class="modal-label"/>
                                         <Image :src="product.image.includes('base64') ? product.image : url + product.image" height="250" width="250"/>
                                        <Button :isEnabled="!processing" text="upload" @tap="uploadImage"/>
                                        <Label text="*Required field" class="required-label" v-show="product.image == '~/assets/icons/product.png'" />

                                        <StackLayout :isEnabled="!processing" orientation="horizontal">
                                            <Label text="Status:" class="modal-label" verticalAlignment="center"/>
                                            <Switch v-model="product.status" backgroundColor="green" offBackgroundColor="red"/>
                                        </StackLayout>
                                   
                                   </StackLayout>
                                </ScrollView>
                            </StackLayout>
                            <FlexboxLayout class="modal-float-layout">
                                <Button :isEnabled="!processing" class="modal-float-button" text="Save" @tap="updateProduct"/>
                                <Button :isEnabled="!processing" class="modal-float-button" text="Cancel" @tap="modalClose"/>
                            </FlexboxLayout>
                            <ActivityIndicator  :busy="processing"  color="#34cceb"></ActivityIndicator>
                        </GridLayout>
                    </Page>`,
                    data() {

                                      
                        return {
                            url: appSettings.getString('url').replace('/api',''),
                            processing: false,
                            product: {
                                id: request.id,
                                name: request.name,
                                description: request.description,
                                types: request.type,
                                price: request.price,
                                image: request.image,
                                status: request.status == 1 ? true : false,
                                type: ""
                            }
                        }
                    },
                    methods: {
                        chooseType() {
                            action("Choose Product Type", "Cancel", ["Foods", "Drinks"])
                            .then(result => {
                                if(result != "Cancel"){
                                    this.product.types = result
                                }
                            });
                        },
                        async updateProduct() {
                            if(!this.product.name || !this.product.types || !this.product.price || this.product.image == "~/assets/icons/product.png")
                            {
                                alert({
                                title: "Updating Product Error!",
                                message: "Please fill up required fields",
                                okButtonText: "OK"
                                }).then(() => {
                                })
                                return
                            }
                            this.processing = true
                            await axios({
                                url:appSettings.getString("url") + "item/" + this.product.id,
                                method: "PATCH",
                                data: {
                                    name: this.product.name,
                                    description: this.product.description,
                                    type: this.product.types,
                                    price: this.product.price,
                                    image: this.product.image,
                                    status: this.product.status
                                }
                                }).then((response) => {
                                    vm.productLists = response.data
                                    this.processing = false
                                    this.$modal.close()
                                }).catch((e) => {
                                    console.log(e)
                            })
                            
                        },
                        async uploadImage() {
                            camera.requestPermissions()
                            camera.takePicture({ width: 1024, height: 1024, keepAspectRatio: true, saveToGallery: false})
                            .then((imageAsset) => {
                                const img =  imageSourceModule.fromFile(imageAsset._android);
                                this.product.image = "data:image/png;base64," +img.toBase64String('jpeg', 50)
                            })
                        },
                        modalClose() {
                            this.$modal.close()
                        }
                    }, 


            })
        },
        deleteProduct(id) {
            confirm({
            title: "Confirmation",
            message: "Are you sure do you want to delete this product?",
            okButtonText: "Yes",
            cancelButtonText: "No"
            }).then(result => {
                if(result){
                    axios({
                        url:appSettings.getString("url") + "item/" + id,
                        method: "DELETE",
                        }).then((response) => {
                            this.productLists = response.data
                        })
                }
            });
            
        }
        
    }
}
</script>
