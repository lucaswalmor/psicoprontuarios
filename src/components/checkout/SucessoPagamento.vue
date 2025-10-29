<template>
    <div class="sucesso-pagamento">
        <div class="sucesso-content">
            <div class="icone-sucesso">
                <i class="pi pi-check-circle"></i>
            </div>
            
            <h2 class="titulo-sucesso">Pagamento Realizado com Sucesso! 🎉</h2>
            
            <p class="descricao-sucesso">
                Sua assinatura foi ativada e você já pode acessar todos os recursos do plano <strong>{{ planoNome }}</strong>.
            </p>

            <div class="detalhes-plano">
                <div class="item-plano">
                    <i class="pi pi-check"></i>
                    <span>Acesso ilimitado a todos os módulos</span>
                </div>
                <div class="item-plano">
                    <i class="pi pi-check"></i>
                    <span>Backup automático de seus dados</span>
                </div>
                <div class="item-plano">
                    <i class="pi pi-check"></i>
                    <span>Suporte prioritário ativo</span>
                </div>
            </div>

            <Button 
                label="Acessar Dashboard" 
                icon="pi pi-arrow-right" 
                class="p-button-primary p-button-lg"
                @click="$emit('continuar')"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'SucessoPagamento',
    props: {
        planoNome: {
            type: String,
            required: true
        }
    },
    emits: ['continuar']
};
</script>

<style scoped>
.sucesso-pagamento {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 500px;
    padding: 2rem;
}

.sucesso-content {
    text-align: center;
    max-width: 600px;
    background: var(--surface-card);
    padding: 3rem;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.icone-sucesso {
    margin-bottom: 1.5rem;
}

.icone-sucesso i {
    font-size: 5rem;
    color: var(--green-500);
    animation: scale-in 0.5s ease-out;
}

@keyframes scale-in {
    from {
        transform: scale(0);
    }
    to {
        transform: scale(1);
    }
}

.titulo-sucesso {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-color);
    margin-bottom: 1rem;
}

.descricao-sucesso {
    font-size: 1.1rem;
    color: var(--text-color-secondary);
    margin-bottom: 2rem;
    line-height: 1.6;
}

.detalhes-plano {
    background: var(--surface-ground);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    text-align: left;
}

.item-plano {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.item-plano:last-child {
    margin-bottom: 0;
}

.item-plano i {
    color: var(--green-500);
    font-size: 1.25rem;
}

.item-plano span {
    color: var(--text-color);
    font-weight: 500;
}

@media (max-width: 768px) {
    .sucesso-content {
        padding: 2rem;
    }

    .titulo-sucesso {
        font-size: 1.5rem;
    }

    .descricao-sucesso {
        font-size: 1rem;
    }
}
</style>

