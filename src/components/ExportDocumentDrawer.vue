<template>
    <el-drawer
        direction="rtl"
        v-model="exportDocumentDrawerVisible"
        size="50%"
    >
        <template #title>
            <h4>Export "{{doc.name}}"</h4>
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
    ElOption,
    ElNotification
} from 'element-plus'
import { FlatDocument } from '@/types'
import { ref, toRefs, defineExpose, defineProps, reactive } from 'vue'
import { ExportService } from '@/services/ExportService'

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
const fileDownload = (documentType: string, name: string, content: string) => {
    const blob = new Blob([content], { type: documentType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}
const exportDocument = async () => {
    console.log('export as ' + exportOption.value)
    try {
        const exportService = new ExportService()
        await exportService.loadDocument(doc.value.id)

        switch (exportOption.value) {
            case 'pdf':
                console.log('ToDo')
                break
            case 'json':
                fileDownload('application/json', doc.value.name + '.json', JSON.stringify(exportService.getJson()))
                break
            case 'html':
                fileDownload('text/html', doc.value.name + '.html', exportService.getHtml())
                break
            default:
                throw new Error('Unknown export option')
        }
    } catch (err) {
        console.error(err)
        ElNotification.error({
            title: 'Error export document',
            message: 'Cannot export document as ' + exportOption.value
        })
    }
    exportDocumentDrawerVisible.value = false
}

defineExpose({
    open
})

</script>
