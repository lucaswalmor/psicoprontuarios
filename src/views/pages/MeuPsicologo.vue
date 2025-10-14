<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <!-- Cabeçalho -->
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0">Meu Perfil Público</h5>
                    <div class="flex gap-2" v-if="perfil && !planStore.isPlanPaused">
                        <Button 
                            icon="pi pi-eye" 
                            label="Preview" 
                            severity="secondary"
                            outlined
                            @click="abrirPreview" />
                    </div>
                </div>

                <!-- Estado inicial - sem perfil -->
                <div v-if="!loading && !perfil" class="text-center p-6">
                    <i class="pi pi-user-plus text-6xl text-500 mb-4"></i>
                    <h3 class="text-500 mb-3">Crie seu perfil público</h3>
                    
                    <!-- Explicação sobre o MeuPsicólogo -->
                    <div class="mb-4 p-4 surface-50 border-1 surface-border border-round text-left">
                        <div class="flex align-items-start gap-3">
                            <i class="pi pi-globe text-primary text-xl mt-1"></i>
                            <div class="flex-grow-1">
                                <h6 class="text-800 font-semibold mb-2">O que é o MeuPsicólogo?</h6>
                                <p class="text-700 text-sm mb-2">
                                    O <strong>MeuPsicólogo</strong> é um marketplace público onde pacientes podem encontrar psicólogos 
                                    próximos a eles. Seu perfil aparecerá em 
                                    <a href="https://www.meupsicologo.com.br" target="_blank" class="text-primary hover:text-primary-emphasis underline font-semibold">
                                        www.meupsicologo.com.br
                                    </a> 
                                    para que pacientes possam entrar em contato diretamente com você via WhatsApp.
                                </p>
                                <div class="flex align-items-center gap-2 text-xs text-600">
                                    <i class="pi pi-check-circle"></i>
                                    <span>Aparece nas buscas por localização e especialidade</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <p class="text-500 mb-4">
                        Configure seu perfil para aparecer no marketplace e receber pacientes diretamente via WhatsApp.
                    </p>
                    <Button label="Criar Perfil" icon="pi pi-plus" @click="abrirDialogCriarPerfil" />
                </div>

                <!-- Loading -->
                <div v-else-if="loading" class="flex justify-content-center p-4">
                    <ProgressSpinner />
                </div>

                <!-- Conteúdo do Perfil -->
                <div v-else class="p-4">
                    <!-- Barra de Completude -->
                    <div class="surface-card p-4 border-round mb-4">
                        <div class="flex align-items-center justify-content-between mb-3">
                            <h6 class="text-800 font-bold mb-0">Progessso do Perfil</h6>
                            <span class="text-600 font-medium">{{ completude }}%</span>
                        </div>
                        <ProgressBar :value="completude" :showValue="false" class="mb-2" />
                        <small class="text-600">
                            <i class="pi pi-info-circle mr-1"></i>
                            Perfis mais completos aparecem melhor posicionados nas buscas
                        </small>
                    </div>

                    <!-- Status do Perfil - Destacado -->
                    <div class="surface-card p-4 border-round mb-4 border-2" 
                         :class="perfil?.perfil_ativo ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'">
                        <div class="flex align-items-center justify-content-between">
                            <div class="flex align-items-center gap-3">
                                <i class="pi pi-power-off text-xl" 
                                   :class="perfil?.perfil_ativo ? 'text-green-600' : 'text-orange-600'"></i>
                                <div>
                                    <div class="flex align-items-center gap-2 mb-1">
                                        <h5 class="text-800 font-bold mb-0">Status do Perfil Público</h5>
                                        <i class="pi pi-info-circle text-primary cursor-pointer" 
                                           v-tooltip.top="'O perfil público é o seu perfil profissional que aparece na plataforma de captação de pacientes www.meupsicologo.com.br.\n\nQuando ativo, pacientes podem encontrar e entrar em contato com você através desta plataforma.'"></i>
                                    </div>
                                    <div class="flex align-items-center gap-2">
                                        <Tag :severity="perfil?.perfil_ativo ? 'success' : 'warning'"
                                            :value="perfil?.perfil_ativo ? 'Ativo' : 'Inativo'" />
                                        <small class="text-600">
                                            {{ perfil?.perfil_ativo ? 'Seu perfil está visível para pacientes' : 'Seu perfil não está visível para pacientes' }}
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <Button 
                                v-if="!planStore.isPlanPaused"
                                :label="perfil?.perfil_ativo ? 'Desativar' : 'Ativar'" 
                                icon="pi pi-power-off" 
                                :severity="perfil?.perfil_ativo ? 'danger' : 'success'"
                                outlined 
                                size="small"
                                @click="toggleStatus"
                            />
                        </div>
                    </div>

                    <div class="surface-card p-4 border-round">
                        <h6 class="mb-3 text-800 font-bold">Informações do Perfil Público</h6>

                        <div class="grid">
                            <!-- Coluna Esquerda -->
                            <div class="col-12 md:col-6">
                                <div class="flex flex-column gap-3">
                                    <!-- Foto Profissional -->
                                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-image text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">Foto Profissional</h6>
                                                <small class="text-600">{{ perfil?.foto_profissional ? 'Cadastrada' : 'Não cadastrada' }}</small>
                                            </div>
                                        </div>
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            severity="secondary" 
                                            outlined 
                                            size="small"
                                            @click="abrirDialogEditarFoto"
                                        />
                                    </div>

                                    <!-- Nome Completo -->
                                    <div class="flex align-items-center p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-user text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">Nome Completo</h6>
                                                <small class="text-600">{{ psicologo?.nome }} {{ psicologo?.sobrenome }}</small>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- CRP -->
                                    <div class="flex align-items-center p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-briefcase text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">CRP</h6>
                                                <small class="text-600">{{ psicologo?.crp || 'Não cadastrado' }}</small>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Descrição -->
                                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-align-left text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">Descrição</h6>
                                                <small class="text-600">{{ perfil?.descricao ? 'Cadastrada' : 'Não cadastrada' }}</small>
                                            </div>
                                        </div>
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            severity="secondary" 
                                            outlined 
                                            size="small"
                                            @click="abrirDialogEditarDescricao"
                                        />
                                    </div>

                                    <!-- Vídeo -->
                                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-video text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">Vídeo Apresentação</h6>
                                                <small class="text-600">{{ perfil?.video_apresentacao ? 'Cadastrado' : 'Não cadastrado' }}</small>
                                            </div>
                                        </div>
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            severity="secondary" 
                                            outlined 
                                            size="small"
                                            @click="abrirDialogEditarVideo"
                                        />
                                    </div>

                                    <!-- Especialidades -->
                                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-star text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">Especialidades</h6>
                                                <small class="text-600">{{ perfil?.especialidades?.length || 0 }} especialidade(s)</small>
                                            </div>
                                        </div>
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            severity="secondary" 
                                            outlined 
                                            size="small"
                                            @click="abrirDialogEditarEspecialidades"
                                        />
                                    </div>

                                    <!-- Temas -->
                                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-tags text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">Temas Tratados</h6>
                                                <small class="text-600">{{ perfil?.temas?.length || 0 }} tema(s)</small>
                                            </div>
                                        </div>
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            severity="secondary" 
                                            outlined 
                                            size="small"
                                            @click="abrirDialogEditarTemas"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Coluna Direita -->
                            <div class="col-12 md:col-6">
                                <div class="flex flex-column gap-3">
                                    <!-- Público Alvo -->
                                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-users text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">Público-alvo</h6>
                                                <small class="text-600">{{ formatarPublicoAlvo(perfil?.publico_alvo) }}</small>
                                            </div>
                                        </div>
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            severity="secondary" 
                                            outlined 
                                            size="small"
                                            @click="abrirDialogEditarPublicoAlvo"
                                        />
                                    </div>

                                    <!-- Tipo de Atendimento -->
                                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-desktop text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">Tipo de Atendimento</h6>
                                                <small class="text-600">{{ formatarTipoAtendimento(perfil?.tipo_atendimento) }}</small>
                                            </div>
                                        </div>
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            severity="secondary" 
                                            outlined 
                                            size="small"
                                            @click="abrirDialogEditarTipoAtendimento"
                                        />
                                    </div>

                                    <!-- Valores -->
                                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-dollar text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">Valores</h6>
                                                <small class="text-600">R$ {{ perfil?.valor_minimo }} - R$ {{ perfil?.valor_maximo }}</small>
                                            </div>
                                        </div>
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            severity="secondary" 
                                            outlined 
                                            size="small"
                                            @click="abrirDialogEditarValores"
                                        />
                                    </div>

                                    <!-- Localização -->
                                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-map-marker text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">Localização</h6>
                                                <small class="text-600">{{ formatarLocalizacao() }}</small>
                                            </div>
                                        </div>
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            severity="secondary" 
                                            outlined 
                                            size="small"
                                            @click="abrirDialogEditarLocalizacao"
                                        />
                                    </div>

                                    <!-- WhatsApp -->
                                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-whatsapp text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">WhatsApp</h6>
                                                <small class="text-600">{{ perfil?.whatsapp || 'Não cadastrado' }}</small>
                                            </div>
                                        </div>
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            severity="secondary" 
                                            outlined 
                                            size="small"
                                            @click="abrirDialogEditarContato"
                                        />
                                    </div>

                                    <!-- Convênios -->
                                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-credit-card text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">Convênios Aceitos</h6>
                                                <small class="text-600">{{ perfil?.convenios?.length || 0 }} convênio(s)</small>
                                            </div>
                                        </div>
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            severity="secondary" 
                                            outlined 
                                            size="small"
                                            @click="abrirDialogEditarConvenios"
                                        />
                                    </div>

                                    <!-- Idiomas -->
                                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-globe text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">Idiomas de Atendimento</h6>
                                                <small class="text-600">{{ perfil?.idiomas?.length || 0 }} idioma(s)</small>
                                            </div>
                                        </div>
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            severity="secondary" 
                                            outlined 
                                            size="small"
                                            @click="abrirDialogEditarIdiomas"
                                        />
                                    </div>

                                    <!-- Redes Sociais -->
                                    <div class="flex align-items-center justify-content-between p-3 surface-100 border-round">
                                        <div class="flex align-items-center gap-3">
                                            <i class="pi pi-share-alt text-primary text-xl"></i>
                                            <div>
                                                <h6 class="m-0 text-800">Redes Sociais</h6>
                                                <small class="text-600">{{ contarRedesSociais() }} rede(s) cadastrada(s)</small>
                                            </div>
                                        </div>
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            severity="secondary" 
                                            outlined 
                                            size="small"
                                            @click="abrirDialogEditarRedesSociais"
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Dialogs -->
    <DialogCriarPerfil 
        :visible="dialogCriarPerfil"
        @update:visible="dialogCriarPerfil = false"
        @perfil-criado="onPerfilCriado"
    />

    <DialogEditarNome 
        :visible="dialogEditarNome"
        :psicologo="psicologo"
        @update:visible="dialogEditarNome = false"
        @nome-atualizado="onNomeAtualizado"
    />

    <DialogEditarCrp 
        :visible="dialogEditarCrp"
        :psicologo="psicologo"
        @update:visible="dialogEditarCrp = false"
        @crp-atualizado="onCrpAtualizado"
    />

    <DialogEditarFoto 
        :visible="dialogEditarFoto"
        @update:visible="dialogEditarFoto = false"
        @foto-atualizada="onFotoAtualizada"
    />

    <DialogEditarDescricao 
        :visible="dialogEditarDescricao"
        :perfil="perfil"
        @update:visible="dialogEditarDescricao = false"
        @descricao-atualizada="onDescricaoAtualizada"
    />

    <DialogEditarVideo 
        :visible="dialogEditarVideo"
        @update:visible="dialogEditarVideo = false"
        @video-atualizado="onVideoAtualizado"
    />

    <DialogEditarEspecialidades 
        :visible="dialogEditarEspecialidades"
        :perfil="perfil"
        @update:visible="dialogEditarEspecialidades = false"
        @especialidades-atualizadas="onEspecialidadesAtualizadas"
    />

    <DialogEditarTemas 
        :visible="dialogEditarTemas"
        :perfil="perfil"
        @update:visible="dialogEditarTemas = false"
        @temas-atualizados="onTemasAtualizados"
    />

        <DialogEditarAtendimento 
            :visible="dialogEditarAtendimento"
            :perfil="perfil"
            :campo-edicao="campoEdicaoAtendimento"
            @update:visible="dialogEditarAtendimento = false"
            @atendimento-atualizado="onAtendimentoAtualizado"
        />

    <DialogEditarLocalizacao 
        :visible="dialogEditarLocalizacao"
        :perfil="perfil"
        @update:visible="dialogEditarLocalizacao = false"
        @localizacao-atualizada="onLocalizacaoAtualizada"
    />

    <DialogEditarContato 
        :visible="dialogEditarContato"
        :perfil="perfil"
        @update:visible="dialogEditarContato = false"
        @contato-atualizado="onContatoAtualizado"
    />

    <DialogEditarRedesSociais 
        :visible="dialogEditarRedesSociais"
        :perfil="perfil"
        @update:visible="dialogEditarRedesSociais = false"
        @redes-atualizadas="onRedesAtualizadas"
    />

    <DialogEditarConvenios 
        :visible="dialogEditarConvenios"
        :perfil="perfil"
        @update:visible="dialogEditarConvenios = false"
        @convenios-atualizados="onConveniosAtualizados"
    />

    <DialogEditarIdiomas 
        :visible="dialogEditarIdiomas"
        :perfil="perfil"
        @update:visible="dialogEditarIdiomas = false"
        @idiomas-atualizados="onIdiomasAtualizados"
    />

    <DialogPreviewPerfil 
        :visible="dialogPreviewPerfil"
        :perfil="perfil"
        @update:visible="dialogPreviewPerfil = false"
    />
</template>

<script>
import { usePlanStore } from '@/store/plan';
import perfilPublicoService from '@/services/perfilPublicoService';
import userService from '@/services/userService';

// Dialogs
import DialogCriarPerfil from '@/components/dialogs/perfil-publico/DialogCriarPerfil.vue';
import DialogEditarNome from '@/components/dialogs/perfil-publico/DialogEditarNome.vue';
import DialogEditarCrp from '@/components/dialogs/perfil-publico/DialogEditarCrp.vue';
import DialogEditarFoto from '@/components/dialogs/perfil-publico/DialogEditarFoto.vue';
import DialogEditarDescricao from '@/components/dialogs/perfil-publico/DialogEditarDescricao.vue';
import DialogEditarVideo from '@/components/dialogs/perfil-publico/DialogEditarVideo.vue';
import DialogEditarEspecialidades from '@/components/dialogs/perfil-publico/DialogEditarEspecialidades.vue';
import DialogEditarTemas from '@/components/dialogs/perfil-publico/DialogEditarTemas.vue';
import DialogEditarAtendimento from '@/components/dialogs/perfil-publico/DialogEditarAtendimento.vue';
import DialogEditarLocalizacao from '@/components/dialogs/perfil-publico/DialogEditarLocalizacao.vue';
import DialogEditarContato from '@/components/dialogs/perfil-publico/DialogEditarContato.vue';
import DialogEditarRedesSociais from '@/components/dialogs/perfil-publico/DialogEditarRedesSociais.vue';
import DialogEditarConvenios from '@/components/dialogs/perfil-publico/DialogEditarConvenios.vue';
import DialogEditarIdiomas from '@/components/dialogs/perfil-publico/DialogEditarIdiomas.vue';
import DialogPreviewPerfil from '@/components/dialogs/perfil-publico/DialogPreviewPerfil.vue';

export default {
    name: 'MeuPsicologo',
    components: {
        DialogCriarPerfil,
        DialogEditarNome,
        DialogEditarCrp,
        DialogEditarFoto,
        DialogEditarDescricao,
        DialogEditarVideo,
        DialogEditarEspecialidades,
        DialogEditarTemas,
        DialogEditarAtendimento,
        DialogEditarLocalizacao,
        DialogEditarContato,
        DialogEditarRedesSociais,
        DialogEditarConvenios,
        DialogEditarIdiomas,
        DialogPreviewPerfil,
    },
    computed: {
        planStore() {
            return usePlanStore();
        },
        psicologo() {
            return this.userData;
        },
        completude() {
            if (!this.perfil) return 0;
            return perfilPublicoService.calcularCompletude(this.perfil);
        }
    },
    data() {
        return {
            loading: false,
            perfil: null,
            userData: null,
            
            // Dialogs
            dialogCriarPerfil: false,
            dialogEditarNome: false,
            dialogEditarCrp: false,
            dialogEditarFoto: false,
            dialogEditarDescricao: false,
            dialogEditarVideo: false,
            dialogEditarEspecialidades: false,
            dialogEditarTemas: false,
            dialogEditarPublico: false,
            dialogEditarAtendimento: false,
            campoEdicaoAtendimento: 'todos',
            dialogEditarLocalizacao: false,
            dialogEditarContato: false,
            dialogEditarRedesSociais: false,
            dialogEditarConvenios: false,
            dialogEditarIdiomas: false,
            dialogPreviewPerfil: false,
        };
    },
    async mounted() {
        await this.carregarDadosUsuario();
        await this.carregarPerfil();
    },
    methods: {
        async carregarDadosUsuario() {
            try {
                const response = await userService.getProfile();
                this.userData = response;
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar dados do usuário',
                    life: 3000
                });
            }
        },

        async carregarPerfil() {
            this.loading = true;
            try {
                const response = await perfilPublicoService.buscarPerfil();
                this.perfil = response.data;
            } catch (error) {
                if (error.response?.status === 404) {
                    // Perfil não existe ainda - definir como null
                    this.perfil = null;
                } else {
                    console.error('Erro ao carregar perfil:', error);
                    this.perfil = null;
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao carregar perfil',
                        life: 3000
                    });
                }
            } finally {
                this.loading = false;
            }
        },

        async recarregarDados() {
            // Recarregar dados do usuário
            await this.carregarDadosUsuario();
            // Recarregar perfil
            await this.carregarPerfil();
        },

        async criarPerfilBasico() {
            try {
                // Buscar especialidades, temas, convênios e idiomas disponíveis
                const especialidades = await perfilPublicoService.buscarEspecialidades();
                const temas = await perfilPublicoService.buscarTemas();
                const convenios = await perfilPublicoService.buscarConvenios();
                const idiomas = await perfilPublicoService.buscarIdiomas();
                
                // Criar perfil público básico com dados mínimos obrigatórios
                const dadosBasicos = {
                    publico_alvo: 'Adultos',
                    valor_minimo: 50.00,
                    valor_maximo: 150.00,
                    aceita_convenio: false,
                    tipo_atendimento: 'online',
                    descricao: 'Psicólogo(a) clínico(a) com experiência em atendimento psicológico. Ofereço um espaço seguro e acolhedor para que você possa trabalhar suas questões pessoais e desenvolver seu potencial. Meu objetivo é ajudá-lo(a) a encontrar caminhos para uma vida mais plena e satisfatória. Atendimento online com foco no bem-estar e desenvolvimento pessoal.',
                    whatsapp: '11999999999', // Formato: 2 dígitos + 8-9 dígitos
                    especialidades: especialidades.slice(0, 1).map(e => e.id),
                    temas: temas.slice(0, 3).map(t => t.id),
                    convenios: convenios.slice(0, 1).map(c => c.id), // Primeiro convênio
                    idiomas: idiomas.slice(0, 1).map(i => i.id), // Primeiro idioma (Português)
                    perfil_ativo: false // Sempre inativo inicialmente
                };

                const response = await perfilPublicoService.criarPerfil(dadosBasicos);
                this.perfil = response.data;
                
            } catch (error) {
                console.error('Erro ao criar perfil básico:', error);
                // Definir perfil como null para parar o loading
                this.perfil = null;
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao criar perfil básico',
                    life: 3000
                });
            }
        },

        async toggleStatus() {
            // Verificar se pode ativar
            if (!this.perfil.perfil_ativo) {
                const camposObrigatorios = this.validarCamposObrigatorios();
                if (camposObrigatorios.length > 0) {
                    this.$toast.add({
                        severity: 'warn',
                        summary: 'Campos Obrigatórios',
                        detail: `Preencha os seguintes campos antes de ativar: ${camposObrigatorios.join(', ')}`,
                        life: 5000
                    });
                    return;
                }
            }

            try {
                const response = await perfilPublicoService.toggleStatus();
                this.perfil.perfil_ativo = response.perfil_ativo;
                
                this.$toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: response.message,
                    life: 3000
                });
            } catch (error) {
                console.error('Erro ao alterar status:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao alterar status do perfil',
                    life: 3000
                });
            }
        },

        validarCamposObrigatorios() {
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
            if (!this.perfil?.publico_alvo || (Array.isArray(this.perfil.publico_alvo) ? this.perfil.publico_alvo.length === 0 : !this.perfil.publico_alvo)) {
                campos.push('Público-alvo');
            }
            if (!this.perfil?.tipo_atendimento || (Array.isArray(this.perfil.tipo_atendimento) ? this.perfil.tipo_atendimento.length === 0 : !this.perfil.tipo_atendimento)) {
                campos.push('Tipo de atendimento');
            }
            if (!this.perfil?.valor_minimo) {
                campos.push('Valor mínimo');
            }
            if (!this.perfil?.whatsapp) {
                campos.push('WhatsApp');
            }
            if (!this.perfil?.convenios || this.perfil.convenios.length === 0) {
                campos.push('Convênios aceitos');
            }
            if (!this.perfil?.idiomas || this.perfil.idiomas.length === 0) {
                campos.push('Idiomas de atendimento');
            }
            
            return campos;
        },

        async abrirPreview() {
            try {
                const response = await perfilPublicoService.buscarPreview();
                this.perfil = response.perfil;
                this.dialogPreviewPerfil = true;
            } catch (error) {
                console.error('Erro ao buscar preview:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar preview',
                    life: 3000
                });
            }
        },

        // Métodos para abrir dialogs
        abrirDialogCriarPerfil() {
            this.dialogCriarPerfil = true;
        },

        abrirDialogEditarNome() {
            this.dialogEditarNome = true;
        },

        abrirDialogEditarCrp() {
            this.dialogEditarCrp = true;
        },

        abrirDialogEditarFoto() {
            this.dialogEditarFoto = true;
        },

        abrirDialogEditarDescricao() {
            this.dialogEditarDescricao = true;
        },

        abrirDialogEditarVideo() {
            this.dialogEditarVideo = true;
        },

        abrirDialogEditarEspecialidades() {
            this.dialogEditarEspecialidades = true;
        },

        abrirDialogEditarTemas() {
            this.dialogEditarTemas = true;
        },

        abrirDialogEditarPublico() {
            this.dialogEditarPublico = true;
        },

        abrirDialogEditarAtendimento() {
            this.campoEdicaoAtendimento = 'todos';
            this.dialogEditarAtendimento = true;
        },

        abrirDialogEditarPublicoAlvo() {
            this.campoEdicaoAtendimento = 'publico_alvo';
            this.dialogEditarAtendimento = true;
        },

        abrirDialogEditarTipoAtendimento() {
            this.campoEdicaoAtendimento = 'tipo_atendimento';
            this.dialogEditarAtendimento = true;
        },

        abrirDialogEditarValores() {
            this.campoEdicaoAtendimento = 'valores';
            this.dialogEditarAtendimento = true;
        },

        abrirDialogEditarLocalizacao() {
            this.dialogEditarLocalizacao = true;
        },

        abrirDialogEditarContato() {
            this.dialogEditarContato = true;
        },

        abrirDialogEditarRedesSociais() {
            this.dialogEditarRedesSociais = true;
        },

        abrirDialogEditarConvenios() {
            this.dialogEditarConvenios = true;
        },

        abrirDialogEditarIdiomas() {
            this.dialogEditarIdiomas = true;
        },

        // Callbacks dos dialogs
        onPerfilCriado() {
            this.dialogCriarPerfil = false;
            this.carregarPerfil();
        },

        onNomeAtualizado() {
            this.dialogEditarNome = false;
            this.recarregarDados();
        },

        onCrpAtualizado() {
            this.dialogEditarCrp = false;
            this.recarregarDados();
        },

        onFotoAtualizada() {
            this.dialogEditarFoto = false;
            this.carregarPerfil();
        },

        onDescricaoAtualizada() {
            this.dialogEditarDescricao = false;
            this.carregarPerfil();
        },

        onVideoAtualizado() {
            this.dialogEditarVideo = false;
            this.carregarPerfil();
        },

        onEspecialidadesAtualizadas() {
            this.dialogEditarEspecialidades = false;
            this.carregarPerfil();
        },

        onTemasAtualizados() {
            this.dialogEditarTemas = false;
            this.carregarPerfil();
        },

        onPublicoAtualizado() {
            this.dialogEditarPublico = false;
            this.carregarPerfil();
        },

        onAtendimentoAtualizado() {
            this.dialogEditarAtendimento = false;
            this.carregarPerfil();
        },

        onLocalizacaoAtualizada() {
            this.dialogEditarLocalizacao = false;
            this.carregarPerfil();
        },

        onContatoAtualizado() {
            this.dialogEditarContato = false;
            this.carregarPerfil();
        },

        onRedesAtualizadas() {
            this.dialogEditarRedesSociais = false;
            this.carregarPerfil();
        },

        onConveniosAtualizados() {
            this.dialogEditarConvenios = false;
            this.carregarPerfil();
        },

        onIdiomasAtualizados() {
            this.dialogEditarIdiomas = false;
            this.carregarPerfil();
        },

        // Métodos de formatação
        formatarTipoAtendimento(tipo) {
            if (!tipo) return 'Não definido';
            
            // Se for array, formatar cada item
            if (Array.isArray(tipo)) {
                const tipos = {
                    'online': 'Online',
                    'presencial': 'Presencial',
                    'híbrido': 'Híbrido'
                };
                return tipo.map(t => tipos[t] || t).join(', ');
            }
            
            // Se for string única (compatibilidade com dados antigos)
            const tipos = {
                'online': 'Online',
                'presencial': 'Presencial',
                'híbrido': 'Híbrido',
                'ambos': 'Online e Presencial'
            };
            return tipos[tipo] || 'Não definido';
        },

        formatarPublicoAlvo(publico) {
            if (!publico) return 'Não definido';
            
            // Se for array, formatar cada item
            if (Array.isArray(publico)) {
                const publicos = {
                    'crianças': 'Crianças',
                    'adolescentes': 'Adolescentes',
                    'adultos': 'Adultos',
                    'casais': 'Casais',
                    'idosos': 'Idosos'
                };
                return publico.map(p => publicos[p] || p).join(', ');
            }
            
            // Se for string única (compatibilidade com dados antigos)
            const publicos = {
                'crianças': 'Crianças',
                'adolescentes': 'Adolescentes',
                'adultos': 'Adultos',
                'casais': 'Casais',
                'idosos': 'Idosos'
            };
            return publicos[publico] || publico || 'Não definido';
        },

        formatarLocalizacao() {
            if (!this.perfil) return 'Não cadastrada';
            
            const partes = [];
            if (this.perfil.cidade) partes.push(this.perfil.cidade);
            if (this.perfil.estado) partes.push(this.perfil.estado);
            
            return partes.length > 0 ? partes.join(' - ') : 'Não cadastrada';
        },

        contarRedesSociais() {
            if (!this.perfil) return 0;
            
            let count = 0;
            if (this.perfil.instagram) count++;
            if (this.perfil.facebook) count++;
            if (this.perfil.linkedin) count++;
            if (this.perfil.site) count++;
            
            return count;
        }
    }
};
</script>

<style scoped>
.surface-card {
    border: 1px solid var(--surface-border);
    transition: all 0.2s ease;
}

.surface-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
