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
                <el-form 
                    label-position="top"
                >
                    <el-form-item label="Document name">
                        <el-input v-model="documentName" placeholder="name" size="large"/>
                    </el-form-item>
                </el-form>
            </el-row>

            <el-divider/>

            <el-row>
                <h4 class="el-drawer__header">User</h4>
                <el-table :data="doc.users" style="width: 100%;">
                    <el-table-column prop="username" label="Username"/>
                    <el-table-column prop="firstName" label="First name"/>
                    <el-table-column prop="lastName" label="Last name"/>
                    <el-table-column label="">
                        <template #default="scope">
                            <el-select
                                size="small"
                                v-model="scope.row.documentPermission"
                                @change="updateDocumentPermission(scope.row)"
                            >
                                <el-option
                                    v-for="permission in ['READ_ONLY', 'READ_WRITE']"
                                    :key="permission"
                                    :label="permission"
                                    :value="permission"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="Operations">
                        <template #default="scope">
                            <el-button type="danger" :icon="Delete" size="small" @click="deleteUser(scope.$index, scope.row)"/>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button style="width: 100%;" @click="addUser">
                    Add User
                </el-button>
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
import { DocumentUser, FlatDocument } from '@/types'
import { defineProps, ref, toRefs, defineExpose } from 'vue'
import { DocumentService } from '@/services/DocumentService'
import {
    ElDrawer,
    ElButton,
    ElRow,
    ElTable,
    ElTableColumn,
    ElForm,
    ElFormItem,
    ElInput,
    ElDivider,
    ElSelect,
    ElOption,
    ElNotification
} from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const documentService = new DocumentService()

const props = defineProps<{
    doc: FlatDocument
}>()
const { doc } = toRefs(props)
const documentSettingsDrawerVisible = ref(false)
const documentName = ref(doc.value.name)

console.log(doc.value)

const open = () => documentSettingsDrawerVisible.value = true
const save = () => {
    console.log('save')
    console.log(documentName.value)
    documentSettingsDrawerVisible.value = false
}
const deleteUser = (index: number, row: DocumentUser) => {
    console.log(index, row)
    documentService.deleteUserFromDocument(doc.value.id, row)
        .then(() => {
            doc.value.users.splice(index, 1)
        })
        .catch(resp => {
            if (resp.status === 403) {
                ElNotification.error({
                    title: 'Error deleting user',
                    message: 'You are not allowed to delete this user'
                })
            } else {
                ElNotification.error({
                    title: 'Error deleting user',
                    message: 'Something went wrong'
                })
            }
        })
}
const updateDocumentPermission = (row: DocumentUser) => {
    // ToDo: Disable select if user is not owner
    documentService.updateDocumentUserPermission(doc.value.id, row)
        .catch(err => {
            console.log(err)
            ElNotification({
                title: 'Cannot set user permission',
                message: 'Something went wrong',
            })
        })
}
const addUser = () => {
    console.log('addUser')
}

defineExpose({
    open
})

</script>