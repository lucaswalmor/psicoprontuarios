<template>
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
            <h5 class="text-500 mb-0">Informações Básicas</h5>
            <i class="pi pi-info-circle text-blue-500" v-tooltip.top="'Estas informações são obtidas do seu cadastro e não podem ser alteradas aqui'"></i>
        </div>
        
        <div class="grid">
            <div class="col-12 md:col-6">
                <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                    <div class="flex align-items-center gap-3">
                        <i class="pi pi-user text-primary text-xl"></i>
                        <div>
                            <h6 class="m-0 text-800">Nome Completo</h6>
                            <small class="text-600">{{ nomeCompleto || 'Não informado' }}</small>
                        </div>
                    </div>
                    <Button 
                        label="Editar" 
                        icon="pi pi-pencil" 
                        severity="secondary" 
                        outlined 
                        size="small"
                        @click="$emit('editar-nome')"
                    />
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                    <div class="flex align-items-center gap-3">
                        <i class="pi pi-briefcase text-primary text-xl"></i>
                        <div>
                            <h6 class="m-0 text-800">CRP</h6>
                            <small class="text-600">{{ psicologo?.crp || 'Não informado' }}</small>
                        </div>
                    </div>
                    <Button 
                        label="Editar" 
                        icon="pi pi-pencil" 
                        severity="secondary" 
                        outlined 
                        size="small"
                        @click="$emit('editar-crp')"
                    />
                </div>
            </div>
        </div>
        
        <div class="mt-3 p-3 bg-blue-50 border-blue-200 rounded">
            <div class="flex align-items-center">
                <i class="pi pi-info-circle text-blue-600 mr-2"></i>
                <span class="text-blue-800 text-sm">
                    Estas informações aparecem no seu perfil público. Clique em "Editar" para atualizá-las.
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardInformacoesBasicas',
    props: {
        psicologo: {
            type: Object,
            default: null
        }
    },
    computed: {
        nomeCompleto() {
            if (!this.psicologo?.nome || !this.psicologo?.sobrenome) {
                return null;
            }
            return `${this.psicologo.nome} ${this.psicologo.sobrenome}`;
        }
    }
};
</script>

<style scoped>
.card {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

:deep(.p-inputtext:disabled) {
    background-color: #f8f9fa;
    border-color: #e9ecef;
    color: #495057;
    cursor: not-allowed;
    opacity: 0.8;
}
</style>
