import prontuariosService from '@/services/prontuariosService';

const BARRAS_ONDA = 36;

function resolverMimeGravacao() {
    const opcoes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        '',
    ];
    return opcoes.find((tipo) => !tipo || MediaRecorder.isTypeSupported(tipo)) || '';
}

export default {
    data() {
        return {
            vozGravando: false,
            vozPausada: false,
            vozProcessando: false,
            vozDuracao: 0,
            vozNiveis: [],
            vozChunks: [],
            vozMimeType: 'audio/webm',
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
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    },
                });

                this.vozStream = stream;
                this.vozChunks = [];
                this.vozDuracao = 0;
                this.vozNiveis = Array(BARRAS_ONDA).fill(12);
                this.vozPausada = false;
                this.vozDescartarAoParar = false;
                this.vozGravando = true;

                const mimeType = resolverMimeGravacao();
                this.vozMimeType = mimeType || 'audio/webm';

                const opcoesRecorder = mimeType ? { mimeType } : undefined;
                this.mediaRecorder = new MediaRecorder(stream, opcoesRecorder);
                this.mediaRecorder.ondataavailable = (e) => {
                    if (e.data?.size > 0) {
                        this.vozChunks.push(e.data);
                    }
                };
                this.mediaRecorder.onstop = () => {
                    if (this.mediaRecorder?.mimeType) {
                        this.vozMimeType = this.mediaRecorder.mimeType;
                    }
                    this.finalizarStreamVoz();
                    if (!this.vozDescartarAoParar) {
                        this.enviarAudioProntuario();
                    }
                    this.vozDescartarAoParar = false;
                };

                await this.iniciarMonitoramentoAudio(stream);
                this.mediaRecorder.start(200);
            } catch {
                this.vozGravando = false;
                this.$toast.add({
                    severity: 'error',
                    summary: 'Permissão negada',
                    detail: 'Autorize o uso do microfone para gravar o resumo.',
                    life: 4000,
                });
            }
        },
        async iniciarMonitoramentoAudio(stream) {
            this.pararMonitoramentoAudio(false);

            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) {
                return;
            }

            this.vozAudioContext = new AudioCtx();
            if (this.vozAudioContext.state === 'suspended') {
                await this.vozAudioContext.resume();
            }

            const source = this.vozAudioContext.createMediaStreamSource(stream);
            this.vozAnalyser = this.vozAudioContext.createAnalyser();
            this.vozAnalyser.fftSize = 256;
            this.vozAnalyser.smoothingTimeConstant = 0.55;
            source.connect(this.vozAnalyser);

            const buffer = new Uint8Array(this.vozAnalyser.fftSize);

            const atualizarOnda = () => {
                if (!this.vozGravando || !this.vozAnalyser) {
                    return;
                }

                if (!this.vozPausada) {
                    this.vozAnalyser.getByteTimeDomainData(buffer);

                    const barras = [];
                    const passo = Math.max(1, Math.floor(buffer.length / BARRAS_ONDA));

                    for (let i = 0; i < BARRAS_ONDA; i++) {
                        const amostra = buffer[i * passo] || 128;
                        const amplitude = Math.abs(amostra - 128) / 128;
                        const altura = Math.max(10, Math.min(100, Math.round(amplitude * 220)));
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
                if (this.vozAudioContext?.state === 'suspended') {
                    this.vozAudioContext.resume().catch(() => {});
                }
            } else {
                this.mediaRecorder.pause();
                this.vozPausada = true;
            }
        },
        enviarGravacaoVoz() {
            if (!this.vozGravando || this.vozProcessando) {
                return;
            }

            const totalBytes = this.vozChunks.reduce((acc, chunk) => acc + (chunk?.size || 0), 0);
            if (totalBytes < 500 && this.vozDuracao < 1) {
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
            const mime = this.vozMimeType || 'audio/webm';
            const blob = new Blob(this.vozChunks, { type: mime });

            if (blob.size < 200) {
                this.vozProcessando = false;
                this.$toast.add({
                    severity: 'warn',
                    summary: 'Áudio vazio',
                    detail: 'Não captamos som do microfone. Verifique permissões e o dispositivo de entrada.',
                    life: 5000,
                });
                return;
            }

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
                    life: 6000,
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
