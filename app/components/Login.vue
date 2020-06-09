<template>
  <Page title='Login' actionBarHidden="true" @loaded='loaded'>
    <!-- backgroundColor="#a5ff52 -->
  <GridLayout>
    <ScrollView  height='100%'>
        <FlexboxLayout class="page" verticalAlignment='center'>
            <StackLayout class="form">
                <Image class="logo" src="~/assets/images/sample.png"></Image>
                <Label class="header" text="APP NAME"></Label>

                <GridLayout rows="auto, auto">
                    <StackLayout row="0" class="input-field">
                        <TextField class="input" hint="Email" :isEnabled="!processing"
                            keyboardType="email" autocorrect="false"
                            autocapitalizationType="none" v-model="user.email"></TextField>
                    </StackLayout>

                    <StackLayout row="1" class="input-field">
                        <TextField class="input" ref="password" :isEnabled="!processing"
                            hint="Password" secure="true" v-model="user.password"></TextField>
                    </StackLayout>

                    <ActivityIndicator rowSpan="2" :busy="processing"  color="#34cceb"></ActivityIndicator>
                </GridLayout>

                <Button text='Log In' :isEnabled="!processing"
                    @tap="submit('login')" class="btn"></Button>
                <Label text="Forgot your password?"
                    class="login-label" ></Label>
            </StackLayout>
            <Stacklayout orientation="horizontal" marginTop="15">
                <Label text='Don’t have an account? ' fontSize="14"></Label>
                <Label text='Register' :isEnabled="!processing"
                    @tap="submit('register')" fontSize="14" fontWeight="600"></Label>
            </Stacklayout>

        </FlexboxLayout>
      </ScrollView>
   <!-- <Label row='1' textWrap='true' id='error' horizontalAlignment='center' verticalAlignment='bottom' text='' backgroundColor='red' visibility='collapse' color='white' borderRadius='6' textAlignment='center' padding='15' paddingTop='10' paddingBottom='10' fontSize='14' marginBottom='40' opacity='0.8'/> --> -->
  </GridLayout>
    
  </Page>
</template>

<script>
    import User from "./User/SideDrawer";
    import Register from "./Register";
    import Admin from "./Admin/SideDrawer";
    const appSettings = require("tns-core-modules/application-settings");
    import axios from "axios";
    export default {
        data() {
            return {
                isLoggingIn: true,
                processing: false,
                user: {
                    email: "",
                    password: ""
                }
            };
        },
        methods: {
            toggleForm() {
                this.isLoggingIn = !this.isLoggingIn;
            },

            submit(a) {
                if(a == "register")
                {
                    this.$navigateTo(Register, { clearHistory: true });
                }
                else
                {
                    if (!this.user.email || !this.user.password) {
                        alert({
                        title: "Error!",
                        message: "Please provide both an email address and password.",
                        okButtonText: "OK"
                        }).then(() => {
                        })
                        return;
                    }

                    this.processing = true;
                    this.login();
                }
                
            },

            login() {
                axios({
                url:appSettings.getString("url") + "auth/login",
                method: "POST",
                data: {
                    email: this.user.email,
                    password: this.user.password,
                }
                }).then((response) => {
                    if(!response.data.token)
                    {
                        this.processing = false;
                        alert({
                        title: "Invalid Account",
                        message: "Incorrect email address or password.",
                        okButtonText: "OK"
                        }).then(() => {
                        })
                        return;
                    }
                    appSettings.setString("key", response.data.token)
                    appSettings.setString("email", this.user.email)
                    appSettings.setString("password", this.user.password)
                    axios({
                    url:appSettings.getString("url") + "auth/get",
                    method: "GET",
                    headers: {
                            'Authorization': 'Bearer ' + appSettings.getString("key")
                    },
                    }).then((response) => {
                        if(response.data.user_type == "admin")
                        {
                            this.$navigateTo(Admin, { clearHistory: true });
                        }
                        else
                        {
                            this.$navigateTo(User, { clearHistory: true });
                        }
                        
                    }).catch((err) => {
                        console.log(err)
                    })
                    
                    
                }).catch((err) => {
                    console.log(err)
                })
            },

            forgotPassword() {
                prompt({
                    title: "Forgot Password",
                    message: "Enter the email address you used to register for APP NAME to reset your password.",
                    inputType: "email",
                    defaultText: "",
                    okButtonText: "Ok",
                    cancelButtonText: "Cancel"
                }).then(data => {
                    if (data.result) {
                        this.$backendService
                            .resetPassword(data.text.trim())
                            .then(() => {
                                this.alert(
                                    "Your password was successfully reset. Please check your email for instructions on choosing a new password."
                                );
                            })
                            .catch(() => {
                                this.alert(
                                    "Unfortunately, an error occurred resetting your password."
                                );
                            });
                    }
                });
            },

            focusPassword() {
                this.$refs.password.nativeView.focus();
            },
            focusConfirmPassword() {
                if (!this.isLoggingIn) {
                    this.$refs.confirmPassword.nativeView.focus();
                }
            },

            alert(message) {
                return alert({
                    title: "APP NAME",
                    okButtonText: "OK",
                    message: message
                });
            }
        }
    };
</script>

<style scoped>
    .page {
        align-items: center;
        flex-direction: column;
    }

    .form {
        margin-left: 30;
        margin-right: 30;
        flex-grow: 2;
        vertical-align: middle;
    }

    .logo {
        margin-bottom: 12;
        height: 90;
        font-weight: bold;
    }

    .header {
        horizontal-align: center;
        font-size: 25;
        font-weight: 600;
        margin-bottom: 70;
        text-align: center;
        color: #D51A1A;
    }

    .input-field {
        margin-bottom: 25;
    }

    .login-label {
        horizontal-align: center;
        color: #A8A8A8;
        font-size: 16;
    }

    .sign-up-label {
        margin-bottom: 20;
    }

    .bold {
        font-weight: 600;
        color: #000000;
    }
</style>