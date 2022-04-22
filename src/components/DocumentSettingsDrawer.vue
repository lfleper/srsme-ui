<template>
    <el-drawer 
        direction="rtl"
        v-model="documentSettingsDrawerVisible"
        size="50%"
    >
        <template #title>
            <h4>Settings</h4>
        </template>
        <template #default>
            <el-row>
                <el-form>
                    <el-form-item label="Name">
                        <el-input v-model="documentName" placeholder="name" size="large"></el-input>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <el-table :data="doc.user" style="width: 100%;">
                    <el-table-column prop="username" label="Username"/>
                    <el-table-column prop="firstName" label="First name"/>
                    <el-table-column prop="lastName" label="Last name"/>
                </el-table>
            </el-row>
        </template>
        <template #footer>
            <el-button @click="documentSettingsDrawerVisible = false">
                Cancel
            </el-button>
            <el-button @click="save" type="primary">
                Save
            </el-button>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { FlatDocument } from '@/types'
import { defineProps, ref, toRefs, defineExpose } from 'vue'
import {
    ElDrawer,
    ElButton,
    ElRow,
    ElTable,
    ElTableColumn,
    ElForm,
    ElFormItem,
    ElInput
} from 'element-plus'

const props = defineProps<{
    doc: FlatDocument
}>()
const { doc } = toRefs(props)
const documentSettingsDrawerVisible = ref(false)
const documentName = ref(doc.value.name)

const open = () => documentSettingsDrawerVisible.value = true
const save = () => {
    console.log('save')
    console.log(documentName.value)
    documentSettingsDrawerVisible.value = false
}

defineExpose({
    open
})

</script>