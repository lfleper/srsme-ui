<template>
    <el-container>
        <el-main>
            <el-row>
                <el-col :span="24">
                    <el-divider>
                        <h2 class="header">Account Settings</h2>
                    </el-divider>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="6">
                    <el-form
                        label-position="top"
                        :model="userAccount"
                    >   
                        <el-form-item
                            label="Username"
                        >
                            <el-input
                                v-model="userAccount.username"
                                placeholder="username"
                                size="large"
                                autocomplete="off"
                            />
                        </el-form-item>
                        <el-form-item
                            label="First name"
                        >
                            <el-input 
                                v-model="userAccount.firstName"
                                placeholder="first name"
                                size="large"
                                autocomplete="off"
                            />
                        </el-form-item>
                        <el-form-item
                            label="Last name"
                        >
                            <el-input 
                                v-model="userAccount.lastName"
                                placeholder="last name"
                                size="large"
                                autocomplete="off"
                            />
                        </el-form-item>
                        <el-form-item
                            label="E-Mail"
                        >
                            <el-input 
                                v-model="userAccount.email"
                                placeholder="email"
                                size="large"
                                type="email"
                                autocomplete="off"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="save"
                            >
                                Save
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-divider>
                        <h2 class="header">Change Password</h2>
                    </el-divider>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="6">
                    <el-form
                        label-position="top"
                        :model="userAccount"
                    >   
                        <el-form-item
                            label="Password"
                        >
                            <el-input 
                                v-model="changePassword.password"
                                placeholder="password"
                                size="large"
                                type="password"
                                autocomplete="off"
                            />
                        </el-form-item>
                        <el-form-item
                            label="Confirm Password"
                        >
                            <el-input 
                                v-model="changePassword.confirmPassword"
                                placeholder="password"
                                size="large"
                                type="password"
                                autocomplete="off"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="savePassword"
                            >
                                Save
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { UserService } from '@/services/UserService'
import store from '@/store'
import { User } from '@/types'
import {
    ElContainer,
    ElMain,
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElNotification
} from 'element-plus'
import { reactive } from 'vue'

const userService = new UserService()
const user = store.state.user
let userAccount = reactive<User>({
    id: user?.id ?? '',
    username: user?.username ?? '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    role: user?.role ?? {role: 'USER', id: ''},
    enabled: user?.enabled ?? true,
})
let changePassword = reactive({
    password: '',
    confirmPassword: ''
})

const save = () => {
    userService.updateUser(userAccount)
        .then(resp => {
            if (!resp) {
                throw Error('Error updating user')
            }
            store.commit('user', resp)
            ElNotification.success({
                title: 'Success',
                message: 'User updated successfully'
            })
        })
        .catch(err => {
            ElNotification.error({
                title: 'Error',
                message: 'Failed to update user'
            })
        })
}
const savePassword = () => {
    userService.updateUserPassword(userAccount.id, changePassword.password, changePassword.confirmPassword)
        .then(() => {
            ElNotification.success({
                title: 'Success',
                message: 'Password updated successfully'
            })
        })
        .catch(err => {
            console.log(err)
            ElNotification.error({
                title: 'Error',
                message: 'Failed to update user'
            })
        })
}

</script>

<style>
.header {
    font-family: 'Red Hat Mono', monospace;
    font-weight: 300;
}
</style>