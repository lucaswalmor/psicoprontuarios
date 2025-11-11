<template>
    <div class="card">
        <div class="flex align-items-center justify-content-between mb-4 flex-wrap">
            <div>
                <h1 class="text-3xl font-bold text-900 mb-2">Editar Paciente</h1>
                <p class="text-600 m-0">Atualize os dados do paciente</p>
            </div>
            <div class="flex gap-2">
                <Button 
                    label="Voltar" 
                    icon="pi pi-arrow-left" 
                    severity="secondary" 
                    @click="$router.push(`/pacientes/ficha/${pacienteId}`)"
                    class="p-button-outlined"
                />
                <Button 
                    label="Atualizar Paciente" 
                    icon="pi pi-check" 
                    @click="atualizarPaciente"
                    :loading="isSaving"
                />
            </div>
        </div>

        <div v-if="isLoading" class="flex justify-content-center">
            <ProgressSpinner />
        </div>

        <div v-else class="card">
            <Accordion :activeIndex="[0, 1, 2]" :multiple="true" class="custom-accordion">
                <!-- Seção 1: Dados Pessoais -->
                <AccordionTab>
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-user"></i>
                            <span>Dados Pessoais</span>
                        </div>
                    </template>
                    <div class="p-fluid">
                <div class="grid">
                    <div class="col-12 md:col-4">
                        <label for="nome" class="text-600 mb-2 block">Nome Completo <span class="text-red-500">*</span></label>
                        <InputText 
                            id="nome" 
                            v-model="paciente.nome" 
                            placeholder="Digite o nome completo"
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-4">
                        <label for="cpf" class="text-600 mb-2 block">CPF</label>
                        <InputMask 
                            id="cpf" 
                            v-model="paciente.cpf" 
                            placeholder="000.000.000-00"
                            class="w-full"
                            mask="999.999.999-99"
                        />
                    </div>
                    <div class="col-12 md:col-4">
                        <label for="data_nascimento" class="text-600 mb-2 block">Data de Nascimento</label>
                        <InputMask 
                            id="data_nascimento" 
                            v-model="paciente.data_nascimento" 
                            placeholder="dd/mm/aaaa"
                            class="w-full"
                            mask="99/99/9999"
                        />
                    </div>
                    <div class="col-12 md:col-4">
                        <label for="nome_mae" class="text-600 mb-2 block">Nome da Mãe</label>
                        <InputText 
                            id="nome_mae" 
                            v-model="paciente.nome_mae" 
                            placeholder="Digite o nome da mãe"
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-4">
                        <label for="nome_pai" class="text-600 mb-2 block">Nome do Pai</label>
                        <InputText 
                            id="nome_pai" 
                            v-model="paciente.nome_pai" 
                            placeholder="Digite o nome do pai"
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-4">
                        <label for="genero" class="text-600 mb-2 block">Gênero</label>
                        <Dropdown 
                            id="genero" 
                            v-model="paciente.genero" 
                            :options="generos" 
                            placeholder="Selecione o gênero"
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-6">
                        <label for="email" class="text-600 mb-2 block">Email</label>
                        <InputText 
                            id="email" 
                            v-model="paciente.email" 
                            type="email"
                            placeholder="exemplo@email.com"
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-6">
                        <label for="telefone" class="text-600 mb-2 block">Telefone</label>
                        <InputMask 
                            id="telefone" 
                            v-model="paciente.telefone" 
                            placeholder="(00) 00000-0000"
                            class="w-full"
                            mask="(99) 99999-9999"
                        />
                    </div>
                    <div class="col-12 md:col-6">
                        <label for="rg" class="text-600 mb-2 block">RG</label>
                        <InputText 
                            id="rg" 
                            v-model="paciente.rg" 
                            placeholder="Digite o RG"
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-6">
                        <label for="naturalidade" class="text-600 mb-2 block">Naturalidade</label>
                        <InputText 
                            id="naturalidade" 
                            v-model="paciente.naturalidade" 
                            placeholder="Cidade/Estado"
                            class="w-full"
                        />
                    </div>
                </div>
                    </div>
                </AccordionTab>

                <!-- Seção 2: Dados Profissionais -->
                <AccordionTab>
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-briefcase"></i>
                            <span>Dados Profissionais</span>
                        </div>
                    </template>
                    <div class="p-fluid">
                <div class="grid">
                    <div class="col-12 md:col-6">
                        <label for="escolaridade" class="text-600 mb-2 block">Escolaridade</label>
                        <Dropdown 
                            id="escolaridade" 
                            v-model="paciente.escolaridade" 
                            :options="escolaridades" 
                            placeholder="Selecione a escolaridade"
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-6">
                        <label for="data_inicio_tratamento" class="text-600 mb-2 block">Início do Tratamento</label>
                        <Calendar 
                            id="data_inicio_tratamento" 
                            v-model="paciente.data_inicio_tratamento" 
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/aaaa"
                            :manualInput="false"
                            showIcon
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-6">
                        <label for="profissao" class="text-600 mb-2 block">Profissão</label>
                        <Dropdown 
                            id="profissao" 
                            v-model="paciente.profissao" 
                            :options="profissoes" 
                            placeholder="Selecione a profissão"
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-6" v-if="paciente.profissao === 'Outro'">
                        <label for="outra_profissao" class="text-600 mb-2 block">Especificar Profissão</label>
                        <InputText 
                            id="outra_profissao" 
                            v-model="paciente.outra_profissao" 
                            placeholder="Digite a profissão"
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-6">
                        <label for="convenio" class="text-600 mb-2 block">Convênio</label>
                        <Dropdown 
                            id="convenio" 
                            v-model="paciente.convenio" 
                            :options="convenios" 
                            placeholder="Selecione o convênio"
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-6" v-if="paciente.convenio === 'Outro'">
                        <label for="outro_convenio" class="text-600 mb-2 block">Especificar Convênio</label>
                        <InputText 
                            id="outro_convenio" 
                            v-model="paciente.outro_convenio" 
                            placeholder="Digite o convênio"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Informações Adicionais -->
                <div class="mt-5">
                    <h3 class="text-xl text-600 mb-3">Informações Adicionais</h3>
                    
                    <div class="grid">
                        <div class="col-12 md:col-6">
                            <label class="text-600 mb-2 block">Toma Medicação?</label>
                            <div class="flex gap-3">
                                <div class="flex align-items-center">
                                    <RadioButton 
                                        v-model="paciente.toma_medicacao" 
                                        inputId="nao_toma_medicacao" 
                                        name="toma_medicacao" 
                                        :value="0" 
                                    />
                                    <label for="nao_toma_medicacao" class="ml-2 text-600">Não</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton 
                                        v-model="paciente.toma_medicacao" 
                                        inputId="toma_medicacao" 
                                        name="toma_medicacao" 
                                        :value="1" 
                                    />
                                    <label for="toma_medicacao" class="ml-2 text-600">Sim</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12" v-if="paciente.toma_medicacao === 1">
                            <label for="especificacao_medicacao" class="text-600 mb-2 block">Especificação da Medicação</label>
                            <Textarea 
                                id="especificacao_medicacao" 
                                v-model="paciente.especificacao_medicacao" 
                                rows="3" 
                                placeholder="Descreva as medicações utilizadas"
                                class="w-full"
                            />
                        </div>

                        <div class="col-12 md:col-6">
                            <label class="text-600 mb-2 block">Tem Contato de Emergência?</label>
                            <div class="flex gap-3">
                                <div class="flex align-items-center">
                                    <RadioButton 
                                        v-model="paciente.tem_contato_emergencia" 
                                        inputId="nao_tem_contato_emergencia" 
                                        name="tem_contato_emergencia" 
                                        :value="0" 
                                    />
                                    <label for="nao_tem_contato_emergencia" class="text-600 ml-2">Não</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton 
                                        v-model="paciente.tem_contato_emergencia" 
                                        inputId="tem_contato_emergencia" 
                                        name="tem_contato_emergencia" 
                                        :value="1" 
                                    />
                                    <label for="tem_contato_emergencia" class="text-600 ml-2">Sim</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6" v-if="paciente.tem_contato_emergencia === 1">
                            <label for="contato_emergencia" class="text-600 mb-2 block">Contato de Emergência</label>
                            <InputMask 
                                id="contato_emergencia" 
                                v-model="paciente.contato_emergencia" 
                                placeholder="(00) 00000-0000"
                                class="w-full"
                                mask="(99) 99999-9999"
                            />
                        </div>

                        <div class="col-12 md:col-6">
                            <label class="text-600 mb-2 block">Faz Outro Acompanhamento Médico?</label>
                            <div class="flex gap-3">
                                <div class="flex align-items-center">
                                    <RadioButton 
                                        v-model="paciente.faz_outro_acompanhamento_medico" 
                                        inputId="nao_faz_outro_acompanhamento_medico" 
                                        name="faz_outro_acompanhamento_medico" 
                                        :value="0" 
                                    />
                                    <label for="nao_faz_outro_acompanhamento_medico" class="ml-2 text-600">Não</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton 
                                        v-model="paciente.faz_outro_acompanhamento_medico" 
                                        inputId="faz_outro_acompanhamento_medico" 
                                        name="faz_outro_acompanhamento_medico" 
                                        :value="1" 
                                    />
                                    <label for="faz_outro_acompanhamento_medico" class="ml-2 text-600">Sim</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12" v-if="paciente.faz_outro_acompanhamento_medico === 1">
                            <label for="descricao_outro_acompanhamento" class="text-600 mb-2 block">Descrição do Outro Tratamento</label>
                            <Textarea 
                                id="descricao_outro_acompanhamento" 
                                v-model="paciente.descricao_outro_acompanhamento" 
                                rows="3" 
                                placeholder="Descreva o outro tratamento"
                                class="w-full"
                            />
                        </div>

                        <div class="col-12 md:col-6">
                            <label class="text-600 mb-2 block">É Menor de Idade?</label>
                            <div class="flex gap-3">
                                <div class="flex align-items-center">
                                    <RadioButton 
                                        v-model="paciente.is_menor_idade" 
                                        inputId="nao_is_menor_idade" 
                                        name="is_menor_idade" 
                                        :value="0" 
                                    />
                                    <label for="nao_is_menor_idade" class="ml-2 text-600">Não</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton 
                                        v-model="paciente.is_menor_idade" 
                                        inputId="is_menor_idade" 
                                        name="is_menor_idade" 
                                        :value="1" 
                                    />
                                    <label for="is_menor_idade" class="ml-2 text-600">Sim</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6" v-if="paciente.is_menor_idade === 1">
                            <label for="contato_responsavel" class="text-600 mb-2 block">Contato do Responsável</label>
                            <InputMask 
                                id="contato_responsavel" 
                                v-model="paciente.contato_responsavel" 
                                placeholder="(00) 00000-0000"
                                class="w-full"
                                mask="(99) 99999-9999"
                            />
                        </div>

                        <div class="col-12 md:col-6">
                            <label class="text-600 mb-2 block">Tem Diagnóstico Prévio?</label>
                            <div class="flex gap-3">
                                <div class="flex align-items-center">
                                    <RadioButton 
                                        v-model="paciente.tem_diagnostico_previo" 
                                        inputId="nao_tem_diagnostico_previo" 
                                        name="tem_diagnostico_previo" 
                                        :value="0" 
                                    />
                                    <label for="nao_tem_diagnostico_previo" class="ml-2 text-600">Não</label>
                                </div>
                                <div class="flex align-items-center">
                                    <RadioButton 
                                        v-model="paciente.tem_diagnostico_previo" 
                                        inputId="tem_diagnostico_previo" 
                                        name="tem_diagnostico_previo" 
                                        :value="1" 
                                    />
                                    <label for="tem_diagnostico_previo" class="ml-2 text-600">Sim</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12" v-if="paciente.tem_diagnostico_previo === 1">
                            <label for="descricao_diagnostico_previo" class="text-600 mb-2 block">Descrição do Diagnóstico</label>
                            <Textarea 
                                id="descricao_diagnostico_previo" 
                                v-model="paciente.descricao_diagnostico_previo" 
                                rows="3" 
                                placeholder="Descreva o diagnóstico prévio"
                                class="w-full"
                            />
                        </div>
                    </div>
                </div>
                    </div>
                </AccordionTab>

                <!-- Seção 3: Endereço -->
                <AccordionTab>
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-map-marker"></i>
                            <span>Endereço</span>
                        </div>
                    </template>
                    <div class="p-fluid">
                <div class="grid">
                    <div class="col-12 md:col-4">
                        <label for="cep" class="text-600 mb-2 block">CEP</label>
                        <InputMask 
                            id="cep" 
                            v-model="paciente.cep" 
                            placeholder="00000-000"
                            class="w-full"
                            mask="99999-999"
                            @blur="buscarCep"
                        />
                    </div>
                    <div class="col-12 md:col-8">
                        <label for="rua" class="text-600 mb-2 block">Rua</label>
                        <InputText 
                            id="rua" 
                            v-model="paciente.rua" 
                            placeholder="Digite o nome da rua"
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-6">
                        <label for="bairro" class="text-600 mb-2 block">Bairro</label>
                        <InputText 
                            id="bairro" 
                            v-model="paciente.bairro" 
                            placeholder="Digite o bairro"
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-3">
                        <label for="cidade" class="text-600 mb-2 block">Cidade</label>
                        <InputText 
                            id="cidade" 
                            v-model="paciente.cidade" 
                            placeholder="Digite a cidade"
                            class="w-full"
                        />
                    </div>
                    <div class="col-12 md:col-3">
                        <label for="estado" class="text-600 mb-2 block">Estado</label>
                        <InputText 
                            id="estado" 
                            v-model="paciente.estado" 
                            placeholder="UF"
                            class="w-full"
                        />
                    </div>
                </div>
                    </div>
                </AccordionTab>
            </Accordion>
        </div>

        <Toast />
        
        <!-- Botões Flutuantes -->
        <div v-if="formularioModificado" :class="['floating-buttons', { 'slide-down': slideDown }]">
            <Card class="bg-gray-900">
                <template #content>
                    <div class=" d-flex gap-3 justify-content-between">

                        <Button icon="pi pi-times" severity="secondary" @click="cancelarAlteracoes" label="Cancelar" />
                         <Button icon="pi pi-check" :loading="isSaving" @click="atualizarPaciente"
                             label="Salvar Alterações" />
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script>
import { profissoes, escolaridades, convenios } from '@/utils/mixins';

export default {
    name: 'EditarPaciente',
    mixins: [profissoes, escolaridades, convenios],
    data() {
        return {
            isLoading: true,
            isSaving: false,
            formularioModificado: false,
            formularioInicializado: false,
            slideDown: false,
            pacienteOriginal: null,
            paciente: {
                nome: '',
                nome_mae: '',
                nome_pai: '',
                escolaridade: '',
                data_nascimento: null,
                profissao: '',
                outra_profissao: '',
                email: '',
                telefone: '',
                cpf: '',
                rg: '',
                naturalidade: '',
                cep: '',
                rua: '',
                bairro: '',
                cidade: '',
                estado: '',
                toma_medicacao: null,
                especificacao_medicacao: '',
                tem_contato_emergencia: null,
                contato_emergencia: '',
                genero: '',
                data_inicio_tratamento: null,
                faz_outro_acompanhamento_medico: null,
                descricao_outro_acompanhamento: '',
                is_menor_idade: null,
                contato_responsavel: '',
                tem_diagnostico_previo: null,
                descricao_diagnostico_previo: '',
                convenio: '',
                outro_convenio: ''
            },
            generos: [
                'Masculino',
                'Feminino',
                'Agênero',
                'Gênero fluído',
                'Não binário',
                'Transgênero',
                'Prefere não informar',
                'Outro'
            ]
        };
    },
    computed: {
        pacienteId() {
            return this.$route.params.id;
        }
    },
    watch: {
        paciente: {
            handler() {
                // Só marcar como modificado se o formulário já foi inicializado
                if (this.formularioInicializado) {
                    this.formularioModificado = true;
                }
            },
            deep: true
        }
    },
    async mounted() {
        await this.carregarPaciente();
        // Marcar que o formulário foi inicializado após carregar os dados
        this.$nextTick(() => {
            this.formularioInicializado = true;
        });
    },
    methods: {
        async carregarPaciente() {
            try {
                this.isLoading = true;
                const pacienteData = await this.$pacientesService.getById(this.pacienteId);
                
                // Mantém a data de nascimento como string (dd/mm/yyyy) para o InputMask
                if (pacienteData.data_inicio_tratamento) {
                    const [day, month, year] = pacienteData.data_inicio_tratamento.split('/');
                    pacienteData.data_inicio_tratamento = new Date(year, month - 1, day);
                }
                
                // Converter campos booleanos para números para garantir que os RadioButtons funcionem
                pacienteData.toma_medicacao = Number(pacienteData.toma_medicacao);
                pacienteData.tem_contato_emergencia = Number(pacienteData.tem_contato_emergencia);
                pacienteData.faz_outro_acompanhamento_medico = Number(pacienteData.faz_outro_acompanhamento_medico);
                pacienteData.is_menor_idade = Number(pacienteData.is_menor_idade);
                pacienteData.tem_diagnostico_previo = Number(pacienteData.tem_diagnostico_previo);
                
                this.paciente = { ...pacienteData };
                // Salvar cópia original dos dados para o botão cancelar
                this.pacienteOriginal = JSON.parse(JSON.stringify(pacienteData));
                // Resetar flag de modificação após carregar dados
                this.formularioModificado = false;
            } catch (error) {
                console.error('Erro ao carregar paciente:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao carregar dados do paciente',
                    life: 3000
                });
                this.$router.push('/pacientes');
            } finally {
                this.isLoading = false;
            }
        },
        async buscarCep() {
            if (this.paciente.cep && this.paciente.cep.length === 9) {
                const cep = this.paciente.cep.replace(/\D/g, '');
                
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    
                    if (!data.erro) {
                        this.paciente.rua = data.logradouro;
                        this.paciente.bairro = data.bairro;
                        this.paciente.cidade = data.localidade;
                        this.paciente.estado = data.uf;
                    }
                } catch (error) {
                    console.error('Erro ao buscar CEP:', error);
                }
            }
        },
        async atualizarPaciente() {
            try {
                this.isSaving = true;
                
                // Validações do frontend
                const validacoes = this.validarDadosPaciente();
                if (validacoes.length > 0) {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro de Validação!',
                        detail: validacoes.join(', '),
                        life: 5000
                    });
                    return;
                }
                
                // Converter datas para formato adequado
                const pacienteData = {
                    ...this.paciente,
                    data_nascimento: this.paciente.data_nascimento ? 
                        this.parseDateToISO(this.paciente.data_nascimento) : null,
                    data_inicio_tratamento: this.paciente.data_inicio_tratamento ? 
                        this.formatDate(this.paciente.data_inicio_tratamento) : null
                };

                await this.$pacientesService.update(this.pacienteId, pacienteData);
                
                // Resetar flag de modificação após salvar
                this.formularioModificado = false;
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Paciente atualizado com sucesso',
                    life: 3000
                });
            } catch (error) {
                console.error('Erro ao atualizar paciente:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: error.response?.data?.error || 'Erro ao atualizar paciente',
                    life: 3000
                });
            } finally {
                this.isSaving = false;
            }
        },

        validarDadosPaciente() {
            const erros = [];

            // Validar nome obrigatório
            if (!this.paciente.nome || this.paciente.nome.trim() === '') {
                erros.push('O nome do paciente é obrigatório');
            }

            // Validar CPF
            if (this.paciente.cpf && !this.validarCPF(this.paciente.cpf)) {
                erros.push('CPF inválido');
            }

            // Validar data de nascimento
            if (this.paciente.data_nascimento && !this.validarData(this.paciente.data_nascimento, 'nascimento')) {
                erros.push('Data de nascimento inválida');
            }

            // Validar data de início de tratamento
            if (this.paciente.data_inicio_tratamento && !this.validarData(this.paciente.data_inicio_tratamento, 'inicio_tratamento')) {
                erros.push('Data de início de tratamento inválida');
            }

            return erros;
        },

        validarCPF(cpf) {
            // Remove caracteres não numéricos
            cpf = cpf.replace(/\D/g, '');
            
            // Verifica se o CPF possui 11 dígitos
            if (cpf.length !== 11) {
                return false;
            }
            
            // Verifica se todos os dígitos são iguais
            if (/^(\d)\1{10}$/.test(cpf)) {
                return false;
            }
            
            // Calcula o primeiro dígito verificador
            let soma = 0;
            for (let i = 0; i < 9; i++) {
                soma += parseInt(cpf.charAt(i)) * (10 - i);
            }
            let resto = 11 - (soma % 11);
            let digito1 = resto >= 10 ? 0 : resto;
            
            // Calcula o segundo dígito verificador
            soma = 0;
            for (let i = 0; i < 10; i++) {
                soma += parseInt(cpf.charAt(i)) * (11 - i);
            }
            resto = 11 - (soma % 11);
            let digito2 = resto >= 10 ? 0 : resto;
            
            // Verifica se os dígitos verificadores estão corretos
            return cpf.charAt(9) == digito1 && cpf.charAt(10) == digito2;
        },

        validarData(data, tipo) {
            if (!data) return true; // Data vazia é válida (opcional)
            
            try {
                let dataObj;
                let dia, mes, ano;
                
                // Se vier como Date (outros campos), usar diretamente
                if (data instanceof Date) {
                    dataObj = data;
                    dia = dataObj.getDate();
                    mes = dataObj.getMonth() + 1;
                    ano = dataObj.getFullYear();
                } else {
                    // Converter data do formato DD/MM/YYYY para Date
                    [dia, mes, ano] = data.split('/').map(Number);
                    dataObj = new Date(ano, (mes || 1) - 1, dia || 1);
                }
                
                // Verificar se a data é válida
                if (isNaN(dataObj.getTime())) {
                    return false;
                }
                // Validação estrita do calendário (evitar 31/02 etc.)
                if (dataObj.getFullYear() !== ano || (dataObj.getMonth() + 1) !== mes || dataObj.getDate() !== dia) {
                    return false;
                }
                
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                
                if (tipo === 'nascimento') {
                    // Não pode ser futura
                    if (dataObj > hoje) return false;
                    // Idade mínima: 5 anos
                    const limiteMinimoIdade = new Date(hoje);
                    limiteMinimoIdade.setFullYear(hoje.getFullYear() - 5);
                    if (dataObj > limiteMinimoIdade) return false;
                    // Idade máxima razoável: 150 anos
                    const dataMinima = new Date(hoje);
                    dataMinima.setFullYear(hoje.getFullYear() - 150);
                    if (dataObj < dataMinima) return false;
                } else if (tipo === 'inicio_tratamento') {
                    // Data de início de tratamento pode ser até 30 dias no futuro
                    const dataMaxima = new Date();
                    dataMaxima.setDate(hoje.getDate() + 30);
                    
                    if (dataObj > dataMaxima) {
                        return false;
                    }
                }
                
                return true;
            } catch (error) {
                return false;
            }
        },
        parseDateToISO(dateStr) {
            if (!dateStr) return null;
            if (dateStr instanceof Date) {
                return dateStr.toISOString().split('T')[0];
            }
            const [dia, mes, ano] = dateStr.split('/');
            if (!dia || !mes || !ano) return null;
            const dd = String(dia).padStart(2, '0');
            const mm = String(mes).padStart(2, '0');
            const yyyy = String(ano).padStart(4, '0');
            return `${yyyy}-${mm}-${dd}`;
        },
        formatDate(date) {
            if (typeof date === 'string') return date;
            if (date instanceof Date) {
                return date.toISOString().split('T')[0];
            }
            return null;
        },

        cancelarAlteracoes() {
            // Ativar animação de saída
            this.slideDown = true;
            
            // Desabilitar o watcher ANTES de resetar dados
            this.formularioInicializado = false;
            
            // Aguardar animação terminar antes de resetar
            setTimeout(() => {
                // Restaurar dados originais
                if (this.pacienteOriginal) {
                    this.paciente = JSON.parse(JSON.stringify(this.pacienteOriginal));
                }
                
                // Resetar flags (watcher continua desabilitado)
                this.formularioModificado = false;
                this.slideDown = false;
                
                // Aguardar mais um ciclo para reabilitar o watcher
                this.$nextTick(() => {
                    this.formularioInicializado = true;
                });
            }, 300); // Aguardar animação de 300ms
            
            this.$toast.add({
                severity: 'info',
                summary: 'Cancelado',
                detail: 'Alterações descartadas. Dados restaurados.',
                life: 2000
            });
        }
    }
};
</script>

<style scoped>
.card {
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
}

/* Estilos para Accordion */
.custom-accordion :deep(.p-accordion-header-link) {
    cursor: default !important;
    font-weight: bold;
}

.custom-accordion :deep(.p-accordion-header-link:hover) {
    background: transparent !important;
}

.custom-accordion :deep(.p-accordion-header-link:focus) {
    box-shadow: none !important;
}

/* Espaçamento entre ícone e texto */
.custom-accordion :deep(.p-accordion-header-link) span {
    margin-left: 0.5rem;
    font-weight: bold;
}

.custom-accordion :deep(.p-accordion-header-link i) {
    margin-right: 0.5rem;
}

/* Container para botões flutuantes */
.floating-buttons {
    position: fixed;
    bottom: 1.5rem;
    right: 7rem;
    display: flex;
    gap: 0.75rem;
    z-index: 1000;
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideDown {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(20px);
    }
}

.floating-buttons.slide-down {
    animation: slideDown 0.3s ease-out;
}

/* Estilos para os botões flutuantes */
.floating-save-button,
.floating-cancel-button {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1);
}

.floating-save-button:hover,
.floating-cancel-button:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
}

/* Responsividade */
@media (max-width: 768px) {
    .floating-buttons {
        bottom: 1.5rem;
        right: 6rem;
        gap: 0.5rem;
    }
}
</style> 