<template>
    <div id="login">
        <div id="loginBox">
            <el-form
                    :model="loginForm"
                    :rules="loginRules"
                    ref="loginForm"
                    label-width="0px">
                <el-form-item
                        label=""
                        prop="userName"
                        style="margin-top:10px;">
                    <el-row :span="24" style="margin-bottom: 20px">
                        <span style="font-size: 28px; font-weight: bold; color: #affeff; margin-bottom: 20px">{{loginTitle}}</span>
                    </el-row>

                    <el-row>
                        <el-col :span='24'>
                            <el-input prefix-icon="el-icon-s-custom"  style="border: 1px solid #66B1FF; border-radius: 5px"
                                      class="inps"
                                      placeholder='    用户名'
                                      v-model="loginForm.userName"
                            ></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item
                        label=""
                        prop="passWord"
                        style="margin-top:35px;">
                    <el-row>
                        <el-col :span='24'>
                            <el-input prefix-icon="el-icon-lock" style="border: 1px solid #66B1FF; border-radius: 5px"
                                      type="password"
                                      class="inps"
                                      placeholder='    密码'
                                      v-model="loginForm.passWord"
                            ></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item style="margin-top:5px; margin-left: 0px">
                    <el-button
                            type="primary"
                            class="submitBtn"
                            @click="submitForm"
                            style="background-color: #087CF5; color: #ffffff; width: 250px"
                    >登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {loginApi} from "../api/LoginApi"
    export default {
        name: 'login',
        data() {
            return {
                loginTitle:'系统登录',
                loginForm: {
                    userName: "",
                    passWord: ""
                },
                loginRules: {
                    userName: [
                        { required: true, message: "请输入用户名", trigger: "blur" }
                    ],
                    passWord: [{ required: true, message: "请输入密码", trigger: "blur" }]
                },
                passwordChecked:'',//记住密码复选框
            };
        },
        mounted() {

        },
        methods: {
            //提交登录
            submitForm() {
                loginApi(this.loginForm.userName, this.loginForm.passWord).then((response) => {
                    if(response.data.msg === "success"){
                        let storage = window.localStorage;
                        storage.setItem("userName", this.loginForm.userName);
                        storage.setItem("userId", response.data.data.userid);
                        this.$router.push({
                            name:'CesiumViewer',
                            params:{
                                "username": this.loginForm.userName
                            }
                        });
                    } else {
                        this.$message({
                            message:"登录失败，请检查用户名或密码是否有误",
                            type:"warning",
                            duration:3000
                        })
                    }
                }).catch((error) => {
                    this.$message({
                        message:"登录发生错误",
                        type:"error",
                        duration:3000
                    })
                })
            }
        },

    }
</script>

<style scoped>
    #login {
        position: absolute;
        width: 100%;
        padding: 0;
        margin: 0;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center center;
        color: #fff;
        background-color: #010a16;
        background-image: url("../assets/earth.png");
    }
    #loginBox {
        width: 246px;
        height: 280px;
        position: absolute;
        top: 0px;
        right: 235px;
        bottom: 0;
        margin: auto;
        padding: 50px 40px 40px 40px;
        opacity: 1;
    }
</style>


