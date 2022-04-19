<template>
    <el-drawer
        direction="rtl"
        v-model="exportDocumentDrawerVisible"
    >
        <template #title>
            Export "{{doc.name}}"
        </template>
        <template #default>
            <el-select v-model="exportOption" placeholder="format" size="large">
                <el-option
                    v-for="option in exportOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                />
            </el-select>
        </template>
        <template #footer>
            <div style="flex: auto;">
                <el-button @click="exportDocumentDrawerVisible = false">
                    Cancel
                </el-button>
                <el-button @click="exportDocument" type="primary">
                    Export
                </el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import {
    ElDrawer,
    ElButton,
    ElSelect,
    ElOption
} from 'element-plus'
import { FlatDocument } from '@/types'
import { ref, toRefs, defineExpose, defineProps, reactive } from 'vue';

const props = defineProps<{
    doc: FlatDocument
}>()
const { doc } = toRefs(props)
const exportDocumentDrawerVisible = ref(false)
const exportOptions = reactive([
    {
        value: 'pdf',
        label: 'PDF'
    },
    {
        value: 'json',
        label: 'JSON'
    },
    {
        value: 'html',
        label: 'HTML'
    }
])
const exportOption = ref('')

const open = () => exportDocumentDrawerVisible.value = true
const exportDocument = () => {
    console.log('export as ' + exportOption.value)
    exportDocumentDrawerVisible.value = false
}

defineExpose({
    open
})

</script>
