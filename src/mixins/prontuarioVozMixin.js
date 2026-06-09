import prontuariosService from '@/services/prontuariosService';

export default {
    data() {
        return {
            vozGravando: false,
            vozProcessando: false,
            mediaRecorder: null,
            vozChunks: [],
        };
    },
    methods: {
        onClickGravarResumoVoz() {
            if (!this.isPlanoPro) {
                this.dialogPlanoProVisible = true;
                return;
            }
            if (this.vozGravando) {
                this.pararGravacaoVoz();
            } else {
                this.iniciarGravacaoVoz();
            }
        },
        async iniciarGravacaoVoz() {
            if (!navigator.mediaDevices?.getUserMedia) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Microfone indisponível',
                    detail: 'Seu navegador não suporta gravação de áudio.',
                    life: 4000,
                });
                return;
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.vozChunks = [];
                const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                    ? 'audio/webm;codecs=opus'
                    : 'audio/webm';
                this.mediaRecorder = new MediaRecorder(stream, { mimeType });
                this.mediaRecorder.ondataavailable = (e) => {
                    if (e.data?.size > 0) {
                        this.vozChunks.push(e.data);
                    }
                };
                this.mediaRecorder.onstop = () => {
                    stream.getTracks().forEach((t) => t.stop());
                    this.enviarAudioProntuario();
                };
                this.mediaRecorder.start();
                this.vozGravando = true;
            } catch {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Permissão negada',
                    detail: 'Autorize o uso do microfone para gravar o resumo.',
                    life: 4000,
                });
            }
        },
        pararGravacaoVoz() {
            if (this.mediaRecorder && this.vozGravando) {
                this.mediaRecorder.stop();
                this.vozGravando = false;
            }
        },
        resolverPacienteIdVoz() {
            return (
                this.pacienteId
                || this.paciente?.id
                || this.prontuario?.paciente_id
                || this.prontuario?.paciente?.id
                || null
            );
        },
        async enviarAudioProntuario() {
            const pacienteId = this.resolverPacienteIdVoz();
            if (!pacienteId || this.vozChunks.length === 0) {
                return;
            }

            this.vozProcessando = true;
            const blob = new Blob(this.vozChunks, { type: 'audio/webm' });

            try {
                const { data } = await prontuariosService.transcreverAudio(pacienteId, blob);
                if (data?.descricao) {
                    this.prontuario.descricao = data.descricao;
                    this.editorDescricaoKey += 1;
                }
                if (data?.humor != null) this.prontuario.humor = data.humor;
                if (data?.avaliacao_progresso != null) {
                    this.prontuario.avaliacao_progresso = data.avaliacao_progresso;
                }
                if (data?.escala_ansiedade != null) {
                    this.prontuario.escala_ansiedade = data.escala_ansiedade;
                }
                if (data?.escala_depressao != null) {
                    this.prontuario.escala_depressao = data.escala_depressao;
                }
                this.$toast.add({
                    severity: 'success',
                    summary: 'Áudio processado',
                    detail: 'Revise o rascunho antes de salvar.',
                    life: 4000,
                });
            } catch (error) {
                const msg = error?.response?.data?.message || error?.response?.data?.error || 'Erro ao processar áudio.';
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: msg,
                    life: 5000,
                });
            } finally {
                this.vozProcessando = false;
                this.vozChunks = [];
            }
        },
        resetVozState() {
            this.vozGravando = false;
            this.vozProcessando = false;
            this.vozChunks = [];
            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }
            this.mediaRecorder = null;
        },
    },
};
