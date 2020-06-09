<template>
    <Page>
        <ActionBar title="Registration" flat="true"/>
        <Gridlayout class="register-page">
            <ScrollView height="100%" :isEnabled="!processing">
                <StackLayout>
                    <StackLayout  orientation='vertical'>
                        <Image :src="user.profile_pic" class="profile-pic"/>
                        <Button @tap="uploadImage" class="upload-pic fa" :text="'\uf030'" horizontalAlignment='center' :isEnabled="!processing"/>
                    </StackLayout>

                    <Label text="First Name" class="modal-label"/>
                    <TextField v-model="user.firstname"  hint="Type first Name" class="required-textfield" :isEnabled="!processing"/>
                    <Label text="*Required field" class="required-label" v-show="!user.firstname" />
                    
                    <Label text="Middle Name" class="modal-label"/>
                    <TextField v-model="user.middlename" hint="Type Middle Name" class="modal-textfield" :isEnabled="!processing"/>
                    
                    <Label text="Last Name" class="modal-label"/>
                    <TextField v-model="user.lastname" hint="Type Last Name" class="modal-textfield" :isEnabled="!processing"/>
                    <Label text="*Required field" class="required-label" v-show="!user.lastname" />
                    
                    <Label text="Gender" class="modal-label" />
                    <StackLayout orientation='horizontal' :isEnabled="!processing">
                        <CheckBox class="checkbox" @tap="user.gender = true" text="Male" :checked='user.gender ? true : false' onTintColor="#34cceb" onCheckColor="lightgray"   boxType="circle" fillColor="#34cceb"/>
                        <CheckBox class="checkbox" @tap="user.gender = false" text="Female"  :checked='!user.gender ? true: false' onTintColor="#34cceb" onCheckColor="lightgray"   boxType="circle" fillColor="#34cceb" />
                    </StackLayout>

                    <Label text="Email" class="modal-label"/>
                    <TextField v-model="user.email" keyboardType="email" hint="Type Email Address" class="modal-textfield" :isEnabled="!processing"/>
                    <Label text="*Required field" class="required-label" v-show="!user.email" />
                
                    <Label text="Password" class="modal-label"/>
                    <TextField v-model="user.password" secure="true" hint="Type Password" class="modal-textfield" :isEnabled="!processing"/>
                    <Label text="*Required field" class="required-label" v-show="!user.password" />
                    
                    <Label text="Confirm Password" class="modal-label"/>
                    <TextField v-model="user.confirmpassword" secure="true" hint="Type Confirm Password" class="modal-textfield" :isEnabled="!processing"/>
                    <Label text="*Required field" class="required-label" v-show="!user.confirmpassword" />

                    <StackLayout orientation='horizontal' :isEnabled="!processing">
                        <StackLayout marginRight='10' width="80%" orientation='vertical'>
                            <Label text="Birthday" class="modal-label"/>
                            <TextField v-model="user.birthday" @tap="chooseBirthday" editable="false" :hint="birthday" class="modal-textfield"/>
                         <Label text="*Required field" class="required-label" v-show="!user.birthday" />
                         </StackLayout>
                        <StackLayout width="20%" orientation='vertical'>
                            <Label text="Age" class="modal-label"/>
                            <TextField v-model="user.age" editable="false" hint="" class="modal-textfield"/>
                        </StackLayout>
                    </StackLayout>
                    <Button text="Register" @tap="submit" class="btn" :isEnabled="!processing"/>
                </StackLayout>
            </ScrollView>

            <ActivityIndicator  :busy="processing"  color="#34cceb"></ActivityIndicator>
               
        </Gridlayout>
    </Page>
</template>
<script>
import moment from "moment"
import Login from "./Login";
const ModalPicker = require("nativescript-modal-datetimepicker").ModalDatetimepicker;
const picker = new ModalPicker();
import * as camera from "nativescript-camera";
const imageSourceModule = require("tns-core-modules/image-source");
const appSettings = require("tns-core-modules/application-settings");
import axios from "axios";
export default {
    data() {
        return {
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
                gender: true
            }
        }
    },
    computed: {
        birthday() {
            var date = new Date()
            return moment(date).format('MM-DD-YYYY')
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
                
                console.log(this.user.profile_pic)
            })
        },
        submit() {
            this.processing = true
            if(!this.user.firstname || !this.user.lastname || !this.user.email || !this.user.password || !this.user.confirmpassword || !this.user.birthday)
            {
                alert({
                title: "Registration Error",
                message: "Please check required fields.",
                okButtonText: "OK"
                })
                this.processing = false
                return;
            }

            if(this.user.password != this.user.confirmpassword)
            {
               alert({
                title: "Registration Error",
                message: "Password and confirm password should be the same.",
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
            console.log("reg")
            axios({
            url:appSettings.getString("url") + "auth/register",
            method: "POST",
            data: {
                email: this.user.email,
                password: this.user.password,
                firstname: this.user.firstname,
                middlename: this.user.middlename,
                lastname: this.user.lastname,
                gender: this.user.gender ? "Male" : "Female",
                picture: this.user.profile_pic,
                birthday: moment(this.user.birthday).format('YYYY-MM-DD'),
                age: this.user.age
            }
            }).then((response) => {
                console.log(response.data)
                if(response.data.errno)
                {
                    alert({
                    title: "Registration Error",
                    message: "Email address is already exist.",
                    okButtonText: "OK"
                    })
                    this.processing = false
                    return;
                }

                    alert({
                    title: "Registration Successful",
                    message: "Thank you for registering.",
                    okButtonText: "OK"
                    }).then(() => {
                        this.$navigateTo(Login, { clearHistory: true });
                    })
                     
            }).catch((err) => {
                console.log(err)
            })
        }
    }
}
</script>