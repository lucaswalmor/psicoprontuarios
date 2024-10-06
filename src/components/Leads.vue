<template>
    <div class="container">
        <div class="col-md-12 mt-7 text-center">
            <h4>Cadastro de psicólogos</h4>
        </div>

        <div class="col-md-12">
            <label for="" class="form-label">Nome</label>
            <InputText class="w-full" type="text" v-model="dados.nome" :disabled="isLoading" />

            <label for="" class="form-label mt-4">Email</label>
            <InputText class="w-full" type="email" v-model="dados.email" :disabled="isLoading" />

            <Button class="rounded mt-4" :disabled="isLoading" @click="cadastrar">
                <ProgressSpinner v-if="isLoading" style="width: 20px; height: 20px" strokeWidth="8" fill="transparent"
                    animationDuration=".5s" aria-label="Custom ProgressSpinner" />

                <span v-else>cadastrar</span>
            </Button>
        </div>
        <Toast />
    </div>
</template>

<script>
import InputText from 'primevue/inputtext'; 
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';

export default {
    components: {
        InputText,
        Button,
        ProgressSpinner,
        Toast,
    },
    data() {
        return {
            isLoading: false,
            dados: {},
        }
    },
    methods: {
        cadastrar() {
            this.isLoading = true;
            
            this.axios.post('/leads', this.dados).then(res => {
                if (res.status == 200) {
                    this.isLoading = false;
                    this.dados = {}
                    this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: res.data.message, life: 3000 });
                }
            }).catch(err => {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: err.response.data.message, life: 3000 });
            })
        }
    }
}
</script>

<style>

</style>