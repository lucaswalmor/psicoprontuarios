export default {
    data() {
        return {
            horasMinutos: [
                { label: '08:00', value: '08:00' },
                { label: '08:30', value: '08:30' },
                { label: '09:00', value: '09:00' },
                { label: '09:30', value: '09:30' },
                { label: '10:00', value: '10:00' },
                { label: '10:30', value: '10:30' },
                { label: '11:00', value: '11:00' },
                { label: '11:30', value: '11:30' },
                { label: '12:00', value: '12:00' },
                { label: '12:30', value: '12:30' },
                { label: '13:00', value: '13:00' },
                { label: '13:30', value: '13:30' },
                { label: '14:00', value: '14:00' },
                { label: '14:30', value: '14:30' },
                { label: '15:00', value: '15:00' },
                { label: '15:30', value: '15:30' },
                { label: '16:00', value: '16:00' },
                { label: '16:30', value: '16:30' },
                { label: '17:00', value: '17:00' },
                { label: '17:30', value: '17:30' },
                { label: '18:00', value: '18:00' },
                { label: '18:30', value: '18:30' },
                { label: '19:00', value: '19:00' },
                { label: '19:30', value: '19:30' },
                { label: '20:00', value: '20:00' },
                { label: '20:30', value: '20:30' },
                { label: '21:00', value: '21:00' },
                { label: '21:30', value: '21:30' },
                { label: '22:00', value: '22:00' }
            ],
            horariosNotificacao: []
        };
    },
    methods: {
        retroativoComIntervalo(horario) {
            const valorHorario = horario.value != undefined ? horario.value : horario;

            // Divide o horário em horas e minutos
            const [hora, minuto] = valorHorario.split(':').map(Number);
            
            // Converte o horário para minutos
            const totalMinutos = hora * 60 + minuto;
            
            // Cria um array para armazenar os horários retroativos
            const horariosRetroativos = [];
            
            // Inicia o loop retroativo de 15 minutos
            for (let i = totalMinutos - 15; i >= totalMinutos - 60; i -= 15) {
                // Se o tempo retroativo for menor que 0, interrompe o loop
                if (i < 0) break;
                
                // Calcula as horas e minutos
                const horas = Math.floor(i / 60);
                const minutos = i % 60;
                
                // Formata as horas e minutos para 'H:i'
                const horarioFormatado = `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}`;
                
                // Adiciona o horário formatado ao array
                horariosRetroativos.push(horarioFormatado);
            }
            
            this.horariosNotificacao = horariosRetroativos;

            return horariosRetroativos;
        }
    }
}; 