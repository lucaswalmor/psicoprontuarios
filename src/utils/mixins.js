// Mixins para dados estáticos do cadastro de pacientes

export const profissoes = {
    data() {
        return {
            profissoes: [
                'Administrador',
                'Advogado',
                'Analista de Sistemas',
                'Arquiteto',
                'Assistente Social',
                'Biomédico',
                'Contador',
                'Dentista',
                'Designer',
                'Economista',
                'Enfermeiro',
                'Engenheiro',
                'Farmacêutico',
                'Fisioterapeuta',
                'Fonoaudiólogo',
                'Fotógrafo',
                'Jornalista',
                'Médico',
                'Nutricionista',
                'Odontólogo',
                'Pedagogo',
                'Professor',
                'Psicólogo',
                'Publicitário',
                'Químico',
                'Secretário',
                'Técnico',
                'Tecnólogo',
                'Terapeuta Ocupacional',
                'Veterinário',
                'Outro'
            ]
        };
    }
};

export const escolaridades = {
    data() {
        return {
            escolaridades: [
                'Analfabeto',
                'Ensino Fundamental Incompleto',
                'Ensino Fundamental Completo',
                'Ensino Médio Incompleto',
                'Ensino Médio Completo',
                'Ensino Superior Incompleto',
                'Ensino Superior Completo',
                'Pós-graduação',
                'Mestrado',
                'Doutorado'
            ]
        };
    }
};

export const convenios = {
    data() {
        return {
            convenios: [
                'Particular',
                'Unimed',
                'Amil',
                'SulAmérica',
                'Bradesco Saúde',
                'Porto Seguro',
                'Allianz',
                'Itaú Saúde',
                'Caixa Saúde',
                'Petrobras',
                'Vale',
                'Outro'
            ]
        };
    }
}; 