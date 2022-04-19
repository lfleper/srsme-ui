<template>
    <el-card class="document-card" @click="openDocument">
        <el-skeleton :rows="5" animated/>
        <div class="bottom">
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    {{doc.name}}
                    <el-icon>
                        <ArrowDown/>
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="settings">
                            Settings
                        </el-dropdown-item>
                        <el-dropdown-item command="export">
                            Export
                        </el-dropdown-item>
                        <el-dropdown-item command="delete">
                            <span class="delete-item">Delete</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

        <export-document-drawer
            :doc="doc"
            ref="exportDocumentDrawer"
        >
        </export-document-drawer>
    </el-card>
</template>

<script setup lang="ts">
import { 
    ElCard, 
    ElSkeleton, 
    ElDropdown, 
    ElDropdownMenu, 
    ElDropdownItem,
    ElIcon
} from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { toRefs, defineProps, defineEmits, ref } from 'vue'
import { FlatDocument } from '@/types'
import ExportDocumentDrawer from '@/components/ExportDocumentDrawer.vue'

interface ExportDocumentDrawerIntf extends HTMLElement {
    open(): void
}

const props = defineProps<{
    doc: FlatDocument
}>()
// Delete and Open must be emitted so that the resulting changes 
// are implemented directly in the interface.
const emits = defineEmits<{
    (e: 'delete', value: FlatDocument): void,
    (e: 'open', value: FlatDocument): void
}>()

const { doc } = toRefs(props)
const exportDocumentDrawer = ref<ExportDocumentDrawerIntf | null>(null)

const openDocument = () => emits('open', doc.value)
const deleteDocument = () => emits('delete', doc.value)
const exportDocument = () => exportDocumentDrawer.value?.open()
const settingsDocument = () => console.log('settings')

const handleCommand = (command: string | number) => {
    switch (command) {
        case 'settings':
            settingsDocument()
            break
        case 'export':
            exportDocument()
            break
        case 'delete':
            deleteDocument()
            break
        default:
            break
    }
}

</script>

<style scoped>
.el-dropdown-link {
    display: flex;
    align-items: center;
    font-family: 'Montserrat Alternates', sans-serif;
    font-weight: 300;
    color: var(--srs-text-primary);
}
.document-card {
    width: 200px;
    cursor: pointer;
}
.bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.delete-item {
    color: var(--el-color-danger);
}
</style>