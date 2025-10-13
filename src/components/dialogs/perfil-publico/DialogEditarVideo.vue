<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" modal header="Editar Vídeo" :style="{ width: '500px' }">
        <div class="text-center p-4">
            <i class="pi pi-video text-4xl text-blue-500 mb-3"></i>
            <h4 class="font-semibold mb-2">Upload de Vídeo</h4>
            <p class="text-600 mb-4">Faça upload de um vídeo de apresentação.</p>
            <FileUpload mode="basic" accept="video/*" :maxFileSize="50000000" chooseLabel="Escolher Vídeo" />
        </div>
        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="$emit('update:visible', false)" />
                <Button label="Salvar" icon="pi pi-check" @click="$emit('video-atualizado'); $emit('update:visible', false)" />
            </div>
        </template>
    </Dialog>
</template>

<script>
export default {
    name: 'DialogEditarVideo',
    props: { visible: { type: Boolean, default: false } },
    emits: ['update:visible', 'video-atualizado']
};
</script>
