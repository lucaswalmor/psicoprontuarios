<template>
    <Dialog
        :visible="visible"
        modal
        header="Plano Pro"
        :style="{ width: '92vw', maxWidth: '760px' }"
        @update:visible="$emit('update:visible', $event)"
    >
        <PlanoPro @close="$emit('update:visible', false)" />
    </Dialog>
</template>

<script>
import PlanoPro from '@/components/PlanoPro.vue';

export default {
    name: 'DialogPlanoPro',
    components: {
        PlanoPro,
        Dialog: () => import('primevue/dialog'),
    },
    props: {
        visible: { type: Boolean, default: false },
    },
    emits: ['update:visible'],
};
</script>

