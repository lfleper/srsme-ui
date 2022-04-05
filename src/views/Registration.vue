<template>
    <el-container>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style="position: absolute;">
            <path fill="#f3f4f5" fill-opacity="1" d="M0,64L24,58.7C48,53,96,43,144,64C192,85,240,139,288,170.7C336,203,384,213,432,186.7C480,160,528,96,576,96C624,96,672,160,720,165.3C768,171,816,117,864,122.7C912,128,960,192,1008,213.3C1056,235,1104,213,1152,213.3C1200,213,1248,235,1296,234.7C1344,235,1392,213,1416,202.7L1440,192L1440,0L1416,0C1392,0,1344,0,1296,0C1248,0,1200,0,1152,0C1104,0,1056,0,1008,0C960,0,912,0,864,0C816,0,768,0,720,0C672,0,624,0,576,0C528,0,480,0,432,0C384,0,336,0,288,0C240,0,192,0,144,0C96,0,48,0,24,0L0,0Z"></path>
        </svg>
        <el-header>
            <el-menu 
                class="login-header"
                mode="horizontal" 
                :router="true"
            >
                <el-menu-item route="/home" index="1">
                    <el-icon>
                        <ArrowLeft/>
                    </el-icon>
                    Back
                </el-menu-item>
            </el-menu>
        </el-header>
        <el-main>
            <el-row justify="center">
                <h1 class="title">SRSME</h1>
            </el-row>

            <el-row justify="center">
                <el-col
                    :xs="24"
                    :sm="16"
                    :md="14"
                    :lg="12"
                    :xl="10"
                >
                    <el-form 
                        label-position="top"
                        :model="form"
                        :rules="rules"
                        label-width="120px"
                        size="large"
                    >
                        <el-form-item label="first name" prop="firstName">
                            <el-input placeholder="first name" v-model="form.firstName" clearable/>
                        </el-form-item>

                        <el-form-item label="last name" prop="lastName">
                            <el-input placeholder="last name" v-model="form.lastName" clearable/>
                        </el-form-item>

                        <el-form-item label="e-mail" prop="eMail">
                            <el-input placeholder="e-mail" v-model="form.email" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="username" prop="username">
                            <el-input placeholder="username" v-model="form.username" clearable/>
                        </el-form-item>

                        <el-form-item label="password" prop="password">
                            <el-input placeholder="password" v-model="form.password" type="password" show-password/>
                        </el-form-item>

                        <el-row justify="center">
                            <el-button @click="signIn">SignIn</el-button>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import {
    ElContainer,
    ElHeader,
    ElMain,
    ElMenu,
    ElMenuItem,
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElNotification
} from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { Token, UserRegistration } from '@/types'
import fetcher from '@/api/Api'
import { TokenService } from '@/services/TokenService'

const tokenService = new TokenService()
let form: UserRegistration = reactive({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: ''
})
let rules = reactive({
    username: [
        {
            required: true,
            message: 'please enter your username',
            trigger: 'blur'
        },
        {
            min: 3,
            message: 'the minimum length of username is 3',
            trigger: 'blur'
        }
    ],
    password: {
        required: true,
        message: 'please enter your password',
        trigger: 'blur'
    }
})

const signIn = () => {
    fetcher<Token>('POST', '/auth/register', form)
        .then(data => {
            if (!data.data)
                throw new Error('registration failed')

            tokenService.setToken(data.data)
        })
        .catch(err => {
            if (err.status === 409) {
                ElNotification({
                    title: 'registration failed',
                    message: 'username already exists',
                })
            } else {
                ElNotification({
                    title: 'registration failed',
                    message: 'something went wrong',
                })
            }
        })
}

</script>

<style scoped src="@/assets/style/login.css">
</style>
