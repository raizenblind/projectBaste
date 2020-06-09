<template>
    <GridLayout class="register-page" >
        <ScrollView height="100%" >
            <StackLayout>
                <StackLayout  orientation='vertical'>
                    <Image :src="user.profile_pic.includes('base64') ? user.profile_pic :`${url}${user.profile_pic}`" class="profile-pic"/>
                    <Button @tap="uploadImage" class="upload-pic fa" :text="'\uf030'" horizontalAlignment='center' :isEnabled="!processing"/>
                </StackLayout>

                <Label text="First Name" class="modal-label"/>
                <TextField v-model="user.firstname"  hint="Type first Name" class="required-textfield" :editable="!processing"/>
                <Label text="*Required field" class="required-label" v-show="!user.firstname" />
                
                <Label text="Middle Name" class="modal-label"/>
                <TextField v-model="user.middlename" hint="Type Middle Name" class="modal-textfield" :editable="!processing"/>
                
                <Label text="Last Name" class="modal-label"/>
                <TextField v-model="user.lastname" hint="Type Last Name" class="modal-textfield" :editable="!processing"/>
                <Label text="*Required field" class="required-label" v-show="!user.lastname" />
                
                <Label text="Gender" class="modal-label" />
                <StackLayout orientation='horizontal' >
                    <CheckBox :isEnabled="!processing" class="checkbox" @tap="user.gender = true" text="Male" :checked='user.gender ? true : false' onTintColor="#34cceb" onCheckColor="lightgray"   boxType="circle" fillColor="#34cceb"/>
                    <CheckBox :isEnabled="!processing" class="checkbox" @tap="user.gender = false" text="Female"  :checked='!user.gender ? true: false' onTintColor="#34cceb" onCheckColor="lightgray"   boxType="circle" fillColor="#34cceb" />
                </StackLayout>

                <Label text="Email" class="modal-label"/>
                <TextField v-model="user.email" keyboardType="email" hint="Type Email Address" class="modal-textfield" :editable="!processing"/>
                <Label text="*Required field" class="required-label" v-show="!user.email" />
                    
                <StackLayout orientation='horizontal' :isEnabled="!processing">
                    <StackLayout marginRight='10' width="80%" orientation='vertical'>
                        <Label text="Birthday" class="modal-label"/>
                        <TextField v-model="user.birthday" @tap="chooseBirthday" editable="false" :hint="birthday" class="modal-textfield"/>
                    </StackLayout>
                    <StackLayout width="20%" orientation='vertical'>
                        <Label text="Age" class="modal-label"/>
                        <TextField v-model="user.age" editable="false" hint="" class="modal-textfield"/>
                    </StackLayout>
                </StackLayout>
                <FlexboxLayout orientation="horizontal" :isEnabled="!processing" v-show="isUpdate">
                    <Button width="50%" text="Cancel" @tap="isUpdate = !isUpdate, processing = !processing" class="btn" marginRight="5"/>
                    <Button width="50%" text="Update" @tap="submit" class="btn" />
                </FlexboxLayout>
                
                <Button text="Edit" class="btn" v-show="!isUpdate" @tap="isUpdate = !isUpdate, processing = !processing"/>
            </StackLayout>
        </ScrollView>

        <ActivityIndicator  :busy="processing" v-show="isUpdate" color="#34cceb"></ActivityIndicator>
        
    </GridLayout>

</template>
<script>
import moment from "moment";
const ModalPicker = require("nativescript-modal-datetimepicker").ModalDatetimepicker;
const picker = new ModalPicker();
import * as camera from "nativescript-camera";
const imageSourceModule = require("tns-core-modules/image-source");
const appSettings = require("tns-core-modules/application-settings");
import axios from "axios";

export default {
    props: ['user'],
    data() {
      return {
        url: appSettings.getString('url').replace('/api',''),
        isUpdate: false,
        processing: true,
      }
    },
    methods: {
        chooseBirthday() {
            picker
            .pickDate({
            title: "Select Your Birthdays",
            theme: "light",
            maxDate: new Date()
            })
            .then(result => {
                var now = new Date()
                if(result != undefined)
                {   this.user.age = now.getUTCFullYear() - result.year
                    this.user.birthday = moment(result).format('MM-DD-YYYY')
                }
                    
        
            }).catch(error => {
            console.log("Error: " + error);
            });
        },
        uploadImage() {
            camera.requestPermissions()
            camera.takePicture({ width: 1024, height: 1024, keepAspectRatio: true, saveToGallery: false})
            .then((imageAsset) => {
                let img =  imageSourceModule.fromFile(imageAsset._android);
                setTimeout(() => {
                    this.user.profile_pic = "data:image/png;base64," +img.toBase64String('jpeg', 50)
                }, 100);
                
            })
        },
        submit() {
            this.processing = true
            if(!this.user.firstname || !this.user.lastname || !this.user.email)
            {
                alert({
                title: "Updating Account Error",
                message: "Please check required fields.",
                okButtonText: "OK"
                })
                this.processing = false
                return;
            }
            if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.user.email))
            {
                alert({
                title: "Updating Account Error",
                message: "Invalid Email Address.",
                okButtonText: "OK"
                })
                this.processing = false
                return;
            }

            this.register()
        },
        register() {
            axios({
            url:appSettings.getString("url") + "auth/update",
            method: "PATCH",
            headers: {
                'Authorization': 'Bearer ' + appSettings.getString("key")
            },
            data: {
                email: this.user.email,
                firstname: this.user.firstname,
                middlename: this.user.middlename,
                lastname: this.user.lastname,
                gender: this.user.gender ? "Male" : "Female",
                picture: this.user.profile_pic,
                birthday: moment(this.user.birthday).format('YYYY-MM-DD'),
                age: this.user.age
            }
            }).then((response) => {
                if(response.data.errno)
                {
                    alert({
                    title: "Updating Account Error",
                    message: "Email address is already exist.",
                    okButtonText: "OK"
                    })
                    this.processing = false
                    return;
                }

                    alert({
                    title: "Successful!",
                    message: "Update Account Success.",
                    okButtonText: "OK"
                    }).then(() => {
                        this.isUpdate = false
                        this.processing = true
                    })
                     
            }).catch((err) => {
                console.log(err)
            })
        }
    }
}
</script>