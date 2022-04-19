<template>
    <el-drawer
        direction="rtl"
        v-model="exportDocumentDrawerVisible"
    >
        <template #title>
            Export {{doc.name}}
        </template>
        <template #default>
            <span>Test</span>
        </template>
        <template #footer>
            <div style="flex: auto;">
                <el-button @click="exportDocumentDrawerVisible = false">
                    Cancel
                </el-button>
                <el-button @click="exportDocument">
                    Export
                </el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import {
    ElDrawer,
    ElButton
} from 'element-plus'
import { FlatDocument } from '@/types'
import { ref, toRefs, defineExpose, defineProps } from 'vue';

const props = defineProps<{
    doc: FlatDocument
}>()
const { doc } = toRefs(props)

const exportDocumentDrawerVisible = ref(false)
const open = () => exportDocumentDrawerVisible.value = true
const exportDocument = () => {
    console.log('Export document.')
    exportDocumentDrawerVisible.value = false
}

defineExpose({
    open
})

</script>
