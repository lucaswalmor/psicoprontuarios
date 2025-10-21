import { computed } from 'vue';
import { usePlanStore } from '@/store/plan';

export function usePlano() {
    const planStore = usePlanStore();

    /**
     * Verificar se usuário tem acesso a um módulo específico
     */
    const temAcesso = (moduloChave) => {
        return planStore.podeAcessarModulo(moduloChave);
    };

    /**
     * Obter módulos disponíveis para o usuário
     */
    const modulosDisponiveis = computed(() => {
        return planStore.modulosAcesso;
    });

    /**
     * Obter informações do plano ativo
     */
    const plano = computed(() => {
        return planStore.planInfo;
    });

    /**
     * Obter status da assinatura
     */
    const statusAssinatura = computed(() => {
        return planStore.statusAssinatura;
    });

    /**
     * Obter dias restantes até próxima cobrança
     */
    const diasRestantes = computed(() => {
        return planStore.diasRestantes;
    });

    /**
     * Verificar se tem assinatura ativa
     */
    const temAssinaturaAtiva = computed(() => {
        return planStore.temAssinaturaAtiva;
    });

    /**
     * Verificar se é usuário vitalício
     */
    const isVitalicio = computed(() => {
        return planStore.isVitalicio;
    });

    /**
     * Obter informações da assinatura
     */
    const assinatura = computed(() => {
        return planStore.assinatura;
    });

    /**
     * Verificar se pode acessar dashboard
     */
    const podeAcessarDashboard = computed(() => {
        return planStore.canAccessDashboard;
    });

    /**
     * Verificar se pode acessar gestão financeira
     */
    const podeAcessarGestaoFinanceira = computed(() => {
        return planStore.canAccessGestaoFinanceira;
    });

    /**
     * Verificar se pode acessar agendamentos
     */
    const podeAcessarAgendamentos = computed(() => {
        return planStore.canAccessAgendamentos;
    });

    /**
     * Verificar se pode acessar perfil público
     */
    const podeAcessarPerfilPublico = computed(() => {
        return planStore.canAccessPerfilPublico;
    });

    /**
     * Verificar se pode acessar prontuários PDF
     */
    const podeAcessarProntuariosPDF = computed(() => {
        return planStore.canAccessProntuariosPDF;
    });

    /**
     * Verificar se pode acessar backup automático
     */
    const podeAcessarBackupAutomatico = computed(() => {
        return planStore.canAccessBackupAutomatico;
    });

    /**
     * Verificar se pode acessar prontuários
     */
    const podeAcessarProntuario = computed(() => {
        return planStore.canAccessProntuario;
    });

    /**
     * Verificar se plano está pausado
     */
    const isPlanoPausado = computed(() => {
        return planStore.isPlanPaused;
    });

    /**
     * Obter estatísticas do usuário
     */
    const stats = computed(() => {
        return planStore.stats;
    });

    /**
     * Verificar se pode adicionar paciente
     */
    const podeAdicionarPaciente = computed(() => {
        return planStore.canAddPaciente;
    });

    /**
     * Obter contagem de pacientes
     */
    const contagemPacientes = computed(() => {
        return planStore.pacientesCount;
    });

    /**
     * Obter limite de pacientes
     */
    const limitePacientes = computed(() => {
        return planStore.limitePacientes;
    });

    /**
     * Verificar se pode fazer upload de anexos
     */
    const podeUploadAnexos = computed(() => {
        return planStore.canUploadAnexos;
    });

    /**
     * Obter contagem de anexos
     */
    const contagemAnexos = computed(() => {
        return planStore.anexosCount;
    });

    /**
     * Obter limite de anexos
     */
    const limiteAnexos = computed(() => {
        return planStore.anexosLimite;
    });

    /**
     * Obter anexos restantes
     */
    const anexosRestantes = computed(() => {
        return planStore.anexosRestantes;
    });

    /**
     * Verificar se tem dados carregados
     */
    const temDadosCarregados = computed(() => {
        return planStore.hasPlanData;
    });

    /**
     * Obter informações do usuário
     */
    const userInfo = computed(() => {
        return planStore.userInfo;
    });

    return {
        // Funções
        temAcesso,
        
        // Computed properties
        modulosDisponiveis,
        plano,
        statusAssinatura,
        diasRestantes,
        temAssinaturaAtiva,
        isVitalicio,
        assinatura,
        podeAcessarDashboard,
        podeAcessarGestaoFinanceira,
        podeAcessarAgendamentos,
        podeAcessarPerfilPublico,
        podeAcessarProntuariosPDF,
        podeAcessarBackupAutomatico,
        podeAcessarProntuario,
        isPlanoPausado,
        stats,
        podeAdicionarPaciente,
        contagemPacientes,
        limitePacientes,
        podeUploadAnexos,
        contagemAnexos,
        limiteAnexos,
        anexosRestantes,
        temDadosCarregados,
        userInfo
    };
}
