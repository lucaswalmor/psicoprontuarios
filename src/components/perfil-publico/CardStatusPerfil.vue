<template>
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-4">
            <h5 class="text-500 mb-0">Status do Perfil</h5>
            <div class="flex gap-2">
                <Button 
                    icon="pi pi-eye" 
                    label="Preview" 
                    size="small"
                    @click="$emit('preview')"
                />
                <Button 
                    :icon="perfil?.perfil_ativo ? 'pi pi-power-off' : 'pi pi-power-on'"
                    :label="perfil?.perfil_ativo ? 'Desativar' : 'Ativar'"
                    :severity="perfil?.perfil_ativo ? 'danger' : 'success'"
                    :disabled="!perfil?.perfil_ativo && !podeAtivar"
                    size="small"
                    @click="$emit('toggle-status')"
                />
            </div>
        </div>
        
        <!-- Explicação sobre o Encontre Psicólogo -->
        <div class="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div class="flex align-items-start gap-3">
                <i class="pi pi-globe text-blue-600 text-xl mt-1"></i>
                <div class="flex-grow-1">
                    <h6 class="text-blue-800 font-semibold mb-2">O que é o Encontre Psicólogo?</h6>
                    <p class="text-blue-700 text-sm mb-2">
                        O <strong>Encontre Psicólogo</strong> é um marketplace público onde pacientes podem encontrar psicólogos 
                        próximos a eles. Seu perfil aparecerá em 
                        <a href="https://www.encontrepsicologo.com.br" target="_blank" class="text-blue-600 hover:text-blue-800 underline font-semibold">
                            www.encontrepsicologo.com.br
                        </a> 
                        para que pacientes possam entrar em contato diretamente com você via WhatsApp.
                    </p>
                    <div class="flex align-items-center gap-2 text-xs text-blue-600">
                        <i class="pi pi-check-circle"></i>
                        <span>Aparece nas buscas por localização e especialidade</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Validação de Campos Obrigatórios -->
        <div v-if="perfil && !perfil.perfil_ativo && !podeAtivar" class="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div class="flex align-items-start gap-3">
                <i class="pi pi-exclamation-triangle text-orange-600 text-xl mt-1"></i>
                <div class="flex-grow-1">
                    <h6 class="text-orange-800 font-semibold mb-2">Campos Obrigatórios</h6>
                    <p class="text-orange-700 text-sm mb-2">
                        Para ativar seu perfil, você precisa preencher os seguintes campos:
                    </p>
                    <ul class="text-orange-700 text-sm list-none p-0 m-0">
                        <li v-for="campo in camposObrigatorios" :key="campo" class="flex align-items-center gap-2 mb-1">
                            <i class="pi pi-times-circle text-orange-600 text-xs"></i>
                            <span>{{ campo }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="grid">
            <div class="col-12 md:col-6">
                <div class="flex align-items-center">
                    <i class="pi pi-info-circle text-blue-500 mr-2"></i>
                    <span class="text-500 mr-2">Status:</span>
                    <Tag 
                        :severity="perfil?.perfil_ativo ? 'success' : 'danger'"
                        :value="perfil?.perfil_ativo ? 'Ativo' : 'Inativo'"
                    />
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex align-items-center">
                    <i class="pi pi-eye text-green-500 mr-2"></i>
                    <span class="text-500 mr-2">Visualizações:</span>
                    <span class="font-semibold">{{ perfil?.visualizacoes || 0 }}</span>
                </div>
            </div>
        </div>
        
        <div class="mt-3">
            <div class="flex align-items-center">
                <i class="pi pi-calendar text-orange-500 mr-2"></i>
                <span class="text-500 mr-2">Criado em:</span>
                <span>{{ formatarData(perfil?.data_criacao_perfil) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardStatusPerfil',
    props: {
        perfil: {
            type: Object,
            default: null
        },
        psicologo: {
            type: Object,
            default: null
        }
    },
    computed: {
        camposObrigatorios() {
            const campos = [];
            
            // Campos obrigatórios do psicólogo
            if (!this.psicologo?.nome || !this.psicologo?.sobrenome) {
                campos.push('Nome completo');
            }
            if (!this.psicologo?.crp) {
                campos.push('CRP');
            }
            
            // Campos obrigatórios do perfil
            if (!this.perfil?.foto_profissional) {
                campos.push('Foto profissional');
            }
            if (!this.perfil?.descricao) {
                campos.push('Descrição sobre você');
            }
            if (!this.perfil?.especialidades || this.perfil.especialidades.length === 0) {
                campos.push('Especialidades');
            }
            if (!this.perfil?.temas || this.perfil.temas.length === 0) {
                campos.push('Temas tratados');
            }
            if (!this.perfil?.publico_alvo) {
                campos.push('Público-alvo');
            }
            if (!this.perfil?.valor_minimo) {
                campos.push('Valor mínimo');
            }
            if (!this.perfil?.whatsapp) {
                campos.push('WhatsApp');
            }
            
            return campos;
        },
        podeAtivar() {
            return this.camposObrigatorios.length === 0;
        }
    },
    methods: {
        formatarData(data) {
            if (!data) return '-';
            return new Date(data).toLocaleDateString('pt-BR');
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

.bg-gradient-to-r {
    background: linear-gradient(to right, #eff6ff, #eef2ff);
}

a {
    transition: all 0.2s ease;
}

a:hover {
    text-decoration: underline !important;
}

.from-blue-50 {
    --tw-gradient-from: #eff6ff;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(239, 246, 255, 0));
}

.to-indigo-50 {
    --tw-gradient-to: #eef2ff;
}
</style>
