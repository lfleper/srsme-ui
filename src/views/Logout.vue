<template>
    <div></div>
</template>

<script setup lang="ts">
import router from '@/router';
import { TokenService } from '@/services/TokenService'
import { ElLoading } from 'element-plus'
import { nextTick } from 'process'
import { onMounted } from 'vue'

const logOut = () => {
    nextTick(() => {
        const tokenService = new TokenService()
        tokenService.removeToken()
        router.push('/home')
    })
}

onMounted(() => {
    const loading = ElLoading.service({
        lock: true,
        text: 'log out ...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    logOut()
    loading.close()
})

</script>