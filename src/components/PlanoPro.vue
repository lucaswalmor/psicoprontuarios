<template>
    <div class="plano-pro">
        <div class="stack">
            <div class="title-row">
                <h3 class="m-0">Recurso disponível no Plano Pro</h3>
                <Tag value="PRO" severity="warning" class="pro-tag" />
            </div>

            <p class="subtitle m-0 mt-2">
                Para editar e publicar seu site, faça upgrade para o Plano Pro e libere todas as ferramentas.
            </p>

            <div class="actions mt-4">
                <Button
                    label="Fazer upgrade"
                    icon="pi pi-arrow-up-right"
                    class="p-button-rounded p-button-warning"
                    @click="goToUpgrade"
                />
            </div>

            <div class="glass mt-4">
                <div class="stat">
                    <div class="stat__icon">
                        <i class="pi pi-globe" />
                    </div>
                    <div class="stat__text">
                        <div class="stat__title">Meu Site</div>
                        <div class="stat__desc">Personalização completa da sua landing page</div>
                    </div>
                </div>
                <div class="divider" />
                <ul class="benefits">
                    <li>
                        <i class="pi pi-check-circle" />
                        <span>Editar textos e seções</span>
                    </li>
                    <li>
                        <i class="pi pi-check-circle" />
                        <span>Trocar cores e identidade visual</span>
                    </li>
                    <li>
                        <i class="pi pi-check-circle" />
                        <span>Gerenciar especialidades e horários</span>
                    </li>
                    <li>
                        <i class="pi pi-check-circle" />
                        <span>Adicionar foto e link público do site</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <small class="hint">
                Dica: se você já contratou o Pro e ainda está bloqueado, faça logout/login para atualizar o status da assinatura.
            </small>
        </div>
    </div>
</template>

<script>
import Button from 'primevue/button';
import Tag from 'primevue/tag';

export default {
    name: 'PlanoPro',
    components: { Button, Tag },
    emits: ['close'],
    props: {
        /** Para sobrescrever o destino do CTA, se necessário */
        upgradeRoute: { type: String, default: '/upgrade' }
    },
    methods: {
        goToUpgrade() {
            if (this.upgradeRoute) {
                this.$router.push(this.upgradeRoute);
                return;
            }
            this.$emit('close');
        }
    }
};
</script>

<style scoped lang="scss">
.plano-pro {
    border-radius: 14px;
    padding: 1.25rem;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
}

.stack {
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.title-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.pro-tag {
    font-weight: 800;
    letter-spacing: 0.04em;
}

.subtitle {
    color: var(--text-color-secondary);
    line-height: 1.5;
    max-width: 52ch;
}

.actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.glass {
    border-radius: 14px;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background:
        radial-gradient(1200px 260px at 0% 0%, rgba(255, 193, 7, 0.18) 0%, rgba(255, 193, 7, 0) 55%),
        radial-gradient(900px 220px at 100% 10%, rgba(99, 102, 241, 0.14) 0%, rgba(99, 102, 241, 0) 55%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%);
}

.stat {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.stat__icon {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: rgba(255, 193, 7, 0.16);
    color: var(--text-color);
}

.stat__icon i {
    font-size: 1.25rem;
}

.stat__title {
    font-weight: 700;
}

.stat__desc {
    color: var(--text-color-secondary);
    font-size: 0.92rem;
    margin-top: 2px;
}

.divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: 0.9rem 0;
}

.benefits {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.6rem;
}

.benefits li {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--text-color);
}

.benefits i {
    color: var(--green-400, #4ade80);
}

.footer {
    margin-top: 0.9rem;
    display: flex;
    justify-content: flex-end;
}

.hint {
    color: var(--text-color-secondary);
}

@media (max-width: 900px) {
    .actions :deep(.p-button) {
        width: 100%;
        justify-content: center;
    }
}
</style>

