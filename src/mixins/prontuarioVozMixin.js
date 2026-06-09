import prontuariosService from '@/services/prontuariosService';

const BARRAS_ONDA = 36;

export default {
    data() {
        return {
            vozGravando: false,
            vozPausada: false,
            vozProcessando: false,
            vozDuracao: 0,
            vozNiveis: [],
            vozChunks: [],
            mediaRecorder: null,
            vozStream: null,
            vozAudioContext: null,
            vozAnalyser: null,
            vozAnimationFrame: null,
            vozTimerInterval: null,
            vozDescartarAoParar: false,
        };
    },
    methods: {
        onClickGravarResumoVoz() {
            if (!this.isPlanoPro) {
                this.dialogPlanoProVisible = true;
                return;
            }
            if (!this.vozGravando && !this.vozProcessando) {
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
                this.vozStream = stream;
                this.vozChunks = [];
                this.vozDuracao = 0;
                this.vozNiveis = [];
                this.vozPausada = false;
                this.vozDescartarAoParar = false;

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
                    this.finalizarStreamVoz();
                    if (!this.vozDescartarAoParar) {
                        this.enviarAudioProntuario();
                    }
                    this.vozDescartarAoParar = false;
                };

                this.iniciarMonitoramentoAudio(stream);
                this.mediaRecorder.start(250);
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
        iniciarMonitoramentoAudio(stream) {
            this.pararMonitoramentoAudio(false);

            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) {
                return;
            }

            this.vozAudioContext = new AudioCtx();
            const source = this.vozAudioContext.createMediaStreamSource(stream);
            this.vozAnalyser = this.vozAudioContext.createAnalyser();
            this.vozAnalyser.fftSize = 128;
            this.vozAnalyser.smoothingTimeConstant = 0.75;
            source.connect(this.vozAnalyser);

            const buffer = new Uint8Array(this.vozAnalyser.frequencyBinCount);

            const atualizarOnda = () => {
                if (!this.vozGravando || !this.vozAnalyser) {
                    return;
                }

                if (!this.vozPausada) {
                    this.vozAnalyser.getByteFrequencyData(buffer);
                    const passo = Math.max(1, Math.floor(buffer.length / BARRAS_ONDA));
                    const barras = [];

                    for (let i = 0; i < BARRAS_ONDA; i++) {
                        const valor = buffer[i * passo] || 0;
                        const altura = Math.max(8, Math.min(100, Math.round((valor / 255) * 100)));
                        barras.push(altura);
                    }

                    this.vozNiveis = barras;
                }

                this.vozAnimationFrame = requestAnimationFrame(atualizarOnda);
            };

            this.vozTimerInterval = setInterval(() => {
                if (this.vozGravando && !this.vozPausada) {
                    this.vozDuracao += 1;
                }
            }, 1000);

            atualizarOnda();
        },
        pararMonitoramentoAudio(limparNiveis = true) {
            if (this.vozAnimationFrame) {
                cancelAnimationFrame(this.vozAnimationFrame);
                this.vozAnimationFrame = null;
            }
            if (this.vozTimerInterval) {
                clearInterval(this.vozTimerInterval);
                this.vozTimerInterval = null;
            }
            if (this.vozAudioContext) {
                this.vozAudioContext.close().catch(() => {});
                this.vozAudioContext = null;
            }
            this.vozAnalyser = null;
            if (limparNiveis) {
                this.vozNiveis = [];
            }
        },
        finalizarStreamVoz() {
            if (this.vozStream) {
                this.vozStream.getTracks().forEach((track) => track.stop());
                this.vozStream = null;
            }
            this.pararMonitoramentoAudio();
            this.vozGravando = false;
            this.vozPausada = false;
            this.mediaRecorder = null;
        },
        pararGravacaoVoz() {
            if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
                return;
            }
            if (this.mediaRecorder.state === 'recording' && typeof this.mediaRecorder.requestData === 'function') {
                this.mediaRecorder.requestData();
            }
            this.mediaRecorder.stop();
        },
        cancelarGravacaoVoz() {
            if (!this.vozGravando) {
                return;
            }
            this.vozDescartarAoParar = true;
            this.vozChunks = [];
            this.pararGravacaoVoz();
            this.vozDuracao = 0;
        },
        alternarPausaVoz() {
            if (!this.mediaRecorder || !this.vozGravando) {
                return;
            }
            if (typeof this.mediaRecorder.pause !== 'function' || typeof this.mediaRecorder.resume !== 'function') {
                return;
            }
            if (this.vozPausada) {
                this.mediaRecorder.resume();
                this.vozPausada = false;
            } else {
                this.mediaRecorder.pause();
                this.vozPausada = true;
            }
        },
        enviarGravacaoVoz() {
            if (!this.vozGravando || this.vozProcessando) {
                return;
            }
            if (this.vozDuracao < 1 && this.vozChunks.length === 0) {
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Gravação muito curta',
                    detail: 'Fale por alguns segundos antes de enviar.',
                    life: 3500,
                });
                return;
            }
            this.pararGravacaoVoz();
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
                this.vozDuracao = 0;
            }
        },
        resetVozState() {
            if (this.vozGravando) {
                this.vozDescartarAoParar = true;
                this.vozChunks = [];
                this.pararGravacaoVoz();
            } else {
                this.finalizarStreamVoz();
            }
            this.vozProcessando = false;
            this.vozDuracao = 0;
            this.vozPausada = false;
            this.vozChunks = [];
        },
    },
};
