import Aura from '@primeuix/themes/aura';

export const primeVueOptions = {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    },
    locale: {
        dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sá'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        today: 'Hoje',
        clear: 'Limpar',
        emptyMessage: 'Nenhum registro encontrado',
        fileUpload: {
            choose: 'Escolher',
            upload: 'Enviar',
            cancel: 'Cancelar',
            empty: 'Nenhum arquivo escolhido',
            emptyMultiple: 'Nenhum arquivo escolhido',
            chooseMultiple: 'Escolher arquivos',
            chooseSingle: 'Escolher arquivo',
            uploadMultiple: 'Enviar arquivos',
            uploadSingle: 'Enviar arquivo',
            remove: 'Remover',
            removeAll: 'Remover todos',
            reject: 'Arquivo rejeitado',
            accept: 'Arquivo aceito',
            fileSizeLimit: 'Tamanho máximo do arquivo',
            fileTypeLimit: 'Tipo de arquivo não permitido',
            maxFileSize: 'Tamanho máximo',
            maxFiles: 'Número máximo de arquivos',
            fileSize: 'Tamanho do arquivo',
            files: 'arquivos',
            file: 'arquivo',
            drag: 'Arraste e solte os arquivos aqui',
            dragMultiple: 'Arraste e solte os arquivos aqui'
        }
    }
};

