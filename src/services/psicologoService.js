class PsicologoService {
    obterDadosPsicologo() {
        try {
            const raw = sessionStorage.getItem('usuario');
            if (!raw) return null;
            const u = JSON.parse(raw);
            return u && typeof u === 'object' ? u : null;
        } catch {
            return null;
        }
    }

    obterIdPsicologo() {
        const u = this.obterDadosPsicologo();
        return u?.id ?? null;
    }
}

export default new PsicologoService();

