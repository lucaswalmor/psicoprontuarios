<template>
    <div class="card">
        <h1>Lista</h1>

        <DataTable :value="prontuarios" :loading="loading" tableStyle="min-width: 50rem" paginator :rows="perPage"
            :totalRecords="totalRecords" :lazy="true" @page="onPageChange"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
            <Column field="data_prontuario" header="Data"></Column>
            <Column header="Ações">
                <template #body="slotProps">
                    <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-sm"
                        @click="verProntuario($event, slotProps.data)" v-tooltip.top="'Ações'" />
                </template>
            </Column>
            
            <template #empty>
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="pi pi-file-edit text-6xl text-gray-400"></i>
                    </div>
                    <div class="empty-content">
                        <h3 class="empty-title">Nenhum prontuário encontrado</h3>
                        <p class="empty-description">
                            Este paciente ainda não possui prontuários registrados. Crie o primeiro prontuário para começar a documentar os atendimentos.
                        </p>
                        <Button 
                            label="Criar Primeiro Prontuário" 
                            icon="pi pi-file-plus" 
                            @click="criarPrimeiroProntuario"
                            class="mt-3"
                        />
                    </div>
                </div>
            </template>
        </DataTable>

        <Popover ref="acoes" id="overlay_panel" style="width: 350px">
            <ul class="rounded-md overflow-hidden">
                <li class="border-bottom-2 border-primary-500 cursor-pointer py-3 px-2"
                    @click="dialogEditarProntuario = true">
                    <i class="fa-solid fa-pen-to-square me-2"></i>
                    Prontuário
                </li>
                <li class="border-bottom-2 border-primary-500 cursor-pointer py-3 px-2" @click="exportarParaPdf">
                    <i class="fa-solid fa-file-export me-2"></i>
                    Exportar Prontuário
                </li>
                <li class="border-bottom-2 border-primary-500 cursor-pointer py-3 px-2" @click="requireConfirmation($event)">
                    <i class="fa-solid fa-trash me-2"></i>
                    Excluir Prontuário
                </li>
            </ul>
        </Popover>

        <DialogEditarProntuario :prontuario="prontuarioSelecionado" :visible="dialogEditarProntuario"
            @update:visible="onUpdateDialogEditarProntuario" @salvarProntuario="salvarProntuario" />
    </div>

    <ConfirmPopup group="headless">
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="rounded p-4">
                <span>{{ message.message }}</span>
                <div class="flex items-center gap-2 mt-4">
                    <Button label="Não" variant="outlined" @click="rejectCallback" severity="secondary" size="small"
                    text></Button>
                    <Button label="Sim" @click="acceptCallback" size="small"></Button>
                </div>
            </div>
        </template>
    </ConfirmPopup>
</template>
<script>
import DialogEditarProntuario from '@/components/dialogs/prontuarios/DialogEditarProntuario.vue';
import logoUrl from '@/assets/img/logo3_semfundo.png';
import jsPDF from 'jspdf';

export default {
    name: 'ListaProntuarios',
    components: {
        DialogEditarProntuario
    },
    data() {
        return {
            pacienteId: this.$route.params.pacienteId,
            prontuarios: [],
            loading: false,
            perPage: 10,
            totalRecords: 0,
            dialogEditarProntuario: false,
            prontuarioSelecionado: null,
            logoUrl: logoUrl
        }
    },
    mounted() {
        this.getProntuarios(this.pacienteId);
    },
    methods: {

        getProntuarios(pacienteId, page = 1, perPage = 10) {
            this.$prontuariosService.getPaginatedByPaciente(pacienteId, page, perPage).then((res) => {
                this.prontuarios = res.data;
                this.totalRecords = res.pagination.total;
            }).catch((err) => {
                console.log(err);
            });
        },

        onPageChange(event) {
            this.getProntuarios(this.pacienteId, event.first, event.rows);
        },

        onUpdateDialogEditarProntuario(visible) {
            this.dialogEditarProntuario = visible;
        },

        salvarProntuario() {
            this.getProntuarios(this.pacienteId);
        },

        async verProntuario(event, prontuario) {
            this.prontuarioSelecionado = prontuario;
            this.$refs.acoes.show(event);
        },

        requireConfirmation(event) {
            this.$confirm.require({
                target: event.currentTarget,
                group: 'headless',
                message: 'Deseja excluir o prontuário?',
                accept: () => {
                    this.excluirProntuario(this.prontuarioSelecionado);
                    this.$refs.acoes.hide();
                },
                reject: () => {
                    this.$toast.add({ severity: 'error', summary: 'Rejeitado', detail: 'Você rejeitou a exclusão do prontuário', life: 3000 });
                }
            });
        },

        excluirProntuario(prontuario) {
            this.$prontuariosService.delete(prontuario.id).then(response => {
                this.getProntuarios(this.pacienteId);
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Prontuário excluído com sucesso', life: 3000 });
            });
        },

        exportarParaPdf() {
            const logoUrl = this.logoUrl;

            const getBase64Image = url => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.setAttribute('crossOrigin', 'anonymous');
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        const dataURL = canvas.toDataURL('image/png');
                        resolve(dataURL);
                    };
                    img.onerror = error => reject(error);
                    img.src = url;
                });
            };

            getBase64Image(logoUrl).then(base64 => {
                this.$prontuariosService.exportarParaPdf(this.prontuarioSelecionado.id).then(response => {
                    const prontuarios = response.prontuarios;

                    // Iniciar a criação do PDF
                    const doc = new jsPDF('p', 'mm', 'a4');
                    let y = 50;

                    // Define a cor de fundo desejada
                    const backgroundColor = "#ede7ff";

                    // Desenha um retângulo que cobre toda a página
                    doc.setFillColor(backgroundColor); // Define a cor de preenchimento
                    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F'); // Desenha o retângulo preenchido


                    // Adiciona a logo centralizada com 30px de margem
                    const logoWidth = 40; // Ajuste o tamanho da logo conforme necessário
                    const logoHeight = 30;
                    const logoMargin = (doc.internal.pageSize.width - logoWidth) / 2;
                    doc.addImage(base64, 'PNG', logoMargin, 10, logoWidth, logoHeight);

                    // Adiciona o título abaixo da imagem
                    const titleText = "Título do Documento"; // Texto do título
                    const titleColor = "#65529d"; // Cor do título
                    const titleFontSize = 18; // Tamanho da fonte do título
                    const titleX = doc.internal.pageSize.width / 2; // Posição X centralizada
                    const titleY = 50; // Posição Y ajustada conforme necessário
                    const titleMargin = 15; // Margem abaixo do título
                    doc.setTextColor(titleColor); // Define a cor do texto
                    doc.setFontSize(titleFontSize); // Define o tamanho da fonte
                    doc.setFont("helvetica", "bold"); // Define o estilo da fonte (negrito)
                    doc.text(titleText, titleX, titleY, null, null, 'center'); // Adiciona o texto centralizado
                    y += titleMargin; // aqui definie o espacamento entre o titulo e o conteudo abaixo

                    // Altura da linha
                    const lineHeight = 10; // Ajuste conforme necessário
                    const hrMargin = 20; // Margem abaixo de cada linha horizontal

                    const currentColor = "#525659"; // busca a cor original do documento

                    // Voltar a cor original do texto
                    doc.setTextColor(currentColor); // Restaura a cor do texto

                    // Adicionar os dados ao PDF
                    prontuarios.forEach(prontuario => {
                        // Divide a descrição em linhas
                        const descricaoSemHtml = this.removeHtmlTags(prontuario.descricao);
                        const descricaoLines = doc.splitTextToSize(descricaoSemHtml, doc.internal.pageSize.width - 20);
                        // const descricaoLines = doc.splitTextToSize(prontuario.descricao, doc.internal.pageSize.width - 20);

                        // Calcula a altura necessária para o texto
                        const textHeight = descricaoLines.length * lineHeight;

                        // Verifica se é necessário adicionar uma nova página
                        if (y + textHeight > doc.internal.pageSize.height - 10) { // Ajuste o valor -10 para deixar uma margem inferior
                            doc.addPage();
                            y = 10;
                        }

                        // Adiciona os dados
                        doc.text(`Data do Prontuário: ${prontuario.data_prontuario}`, 10, y);

                        // Adiciona o título "Descrição:"
                        doc.setFontSize(18); // Define o tamanho da fonte do título
                        doc.text("Descrição:", 10, y + lineHeight);

                        // Define o tamanho da fonte da descrição
                        doc.setFontSize(12);

                        descricaoLines.forEach((line, index) => {
                            doc.text(line, 10, y + lineHeight * (index + 2));
                        });

                        // y += textHeight;

                        // // Adiciona a margem abaixo da descrição e acima da linha horizontal
                        // y += hrMargin;

                        // Mover o conteúdo para baixo
                        y += textHeight + hrMargin;

                        // Adiciona uma linha horizontal ao final de cada item
                        if (y + lineHeight < doc.internal.pageSize.height - 10) { // Ajuste o valor -10 para deixar uma margem inferior
                            doc.line(10, y, doc.internal.pageSize.width - 10, y);
                            y += lineHeight;
                        }
                    });

                    // Salvar ou exibir o PDF
                    doc.save('prontuario.pdf');
                    // Ou exibir o PDF em uma nova guia
                    // doc.output('dataurlnewwindow');
                }).catch(error => {
                    console.log(error)
                    this.$toast.add({
                        severity: "error",
                        summary: "Erro ao econtrar prontuário!",
                        detail: error.response.data.error,
                        life: 3000,
                    });
                });
            })
        },
        removeHtmlTags(text) {
            const div = document.createElement('div');
            div.innerHTML = text;

            return div.textContent || div.innerText || '';
        },

        criarPrimeiroProntuario() {
            // Abrir o dialog para criar o primeiro prontuário
            this.dialogEditarProntuario = true;
            this.prontuarioSelecionado = {
                paciente_id: this.pacienteId,
                data_prontuario: new Date().toISOString().split('T')[0],
                descricao: ''
            };
        }
    }
}
</script>
<style scoped>
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
}

.empty-icon {
    margin-bottom: 1rem;
}

.empty-content {
    max-width: 400px;
}

.empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
}

.empty-description {
    color: #6b7280;
    line-height: 1.5;
    margin-bottom: 1rem;
}

.mt-3 {
    margin-top: 0.75rem;
}
</style>