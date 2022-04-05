<template>
    <el-container>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style="position: absolute">
            <path fill="#f3f4f5" fill-opacity="1" d="M0,288L30,277.3C60,267,120,245,180,218.7C240,192,300,160,360,138.7C420,117,480,107,540,106.7C600,107,660,117,720,117.3C780,117,840,107,900,122.7C960,139,1020,181,1080,186.7C1140,192,1200,160,1260,154.7C1320,149,1380,171,1410,181.3L1440,192L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"></path>
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
                        <el-form-item label="username" prop="username">
                            <el-input placeholder="username" v-model="form.username" clearable/>
                        </el-form-item>
                        <el-form-item label="password" prop="password">
                            <el-input placeholder="password" v-model="form.password" type="password" show-password/>
                        </el-form-item>

                        <el-row justify="center">
                            <el-button @click="login">Login</el-button>
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
import { Token, UserLogin } from '@/types'
import fetcher from '@/api/Api'
import { TokenService } from '@/services/TokenService'
import router from '@/router'

const tokenService = new TokenService()
let form: UserLogin = reactive({
    username: '',
    password: ''
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

const login = () => {
    fetcher<Token>('POST', '/auth/login', form)
        .then(data => {
            if (!data.data)
                throw new Error('login failed')

            tokenService.setToken(data.data)
        })
        .catch(err => {
            if (err.status === 401) {
                ElNotification({
                    title: 'login failed',
                    message: 'invalid username or password'
                })
            } else {
                ElNotification({
                    title: 'login failed',
                    message: 'something went wrong'
                })
            }
        })
}

</script>

<style scoped src="@/assets/style/login.css">
</style>