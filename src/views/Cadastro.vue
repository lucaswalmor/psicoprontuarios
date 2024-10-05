<template>
  <div id="cadastro" class="mt-8 ms-3 me-3 d-flex flex-column justify-content-center align-items-center">
    <div class="col-md-12">
      <div class="text-roxo font-bold text-5xl mb-4 text-center">Cadastro</div>
    </div>

    <div class="col-md-8 p-4 card" v-if="!pixGerado">
        <Stepper v-model:activeStep="active">
          <StepperPanel>
            <template #header="{ index, clickCallback }">
              <button class="bg-transparent border-none inline-flex flex-column gap-2" @click="clickCallback" :disabled="cadastroFinalizado">
                  <span :class="['border-round border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                      <i class="pi pi-lock" />
                  </span>
              </button>
            </template>
            <template #content="{ nextCallback }">
              <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                <div class="text-center mt-3 mb-3 text-xl font-semibold">Dados de Login</div>
                <div class="field p-fluid">
                  <IconField>
                      <InputIcon>
                          <i class="pi pi-envelope" />
                      </InputIcon>
                      <InputText id="email" v-model="usuario.email" type="email" placeholder="Email" :readonly="cadastroFinalizado" />
                  </IconField>
                </div>
                <div class="field p-fluid">
                  <IconField>
                      <InputIcon>
                          <i class="pi pi-phone" />
                      </InputIcon>
                      <InputText id="telefone" v-model="usuario.telefone" type="text" v-mask="'(##) #####-####'" placeholder="Telefone" :readonly="cadastroFinalizado" />
                  </IconField>
                </div>
                <div class="field p-fluid">
                    <Password v-model="usuario.password" toggleMask placeholder="Senha" :readonly="cadastroFinalizado" />
                </div>
                
                <div class="col-md-12">
                  <div class="flex align-items-center">
                      <Checkbox v-model="usuario.politica_privacidade" inputId="politica_privacidade" name="pizza" :binary="true" />
                      <label for="politica_privacidade" class="ml-2">Políticas de privacidade</label>
                      <span class="text-primary ms-2" @click="lerPoliticas = true">Leia aqui</span>
                  </div>
                </div>

                <Dialog v-model:visible="lerPoliticas" modal header="" :style="{ width: '25rem' }">
                    <PoliticasDePrivacidade @fecharPoliticaPrivacidade="fecharPoliticaPrivacidade" />
                </Dialog>
              </div>
              <div class="flex pt-4 justify-content-between">
                  <Button label="Voltar para página" class="rounded" icon="pi pi-arrow-left" iconPos="left" severity="secondary" @click="voltarPaginaInicial" />
                  <Button label="Próximo" class="rounded" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" :disabled="!usuario.politica_privacidade" />
              </div>
            </template>
          </StepperPanel>

          <StepperPanel>
            <template #header="{ index, clickCallback }">
                <button class="bg-transparent border-none inline-flex flex-column gap-2" @click="clickCallback" :disabled="cadastroFinalizado || !usuario.politica_privacidade">
                    <span :class="['border-round border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                        <i class="pi pi-user" />
                    </span>
                </button>
            </template>
            <template #content="{ prevCallback, nextCallback }">
                <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                  <div class="text-center mt-3 mb-3 text-xl font-semibold">Dados de Pessoais</div>
                  <div class="field p-fluid">
                      <InputText id="nome" class="w-full" v-model="usuario.nome" type="text" placeholder="Nome" :readonly="cadastroFinalizado" />
                  </div>
                  <div class="field p-fluid">
                      <InputText id="sobrenome" class="w-full" v-model="usuario.sobrenome" type="text" placeholder="Sobrenome" :readonly="cadastroFinalizado" />
                  </div>
                  <div class="field p-fluid">
                      <InputText id="cpf" class="w-full" v-model="usuario.cpf" type="text" placeholder="CPF" v-mask="'###.###.###-##'" :readonly="cadastroFinalizado" />
                  </div>
                  <div class="field p-fluid">
                      <InputText id="crp" class="w-full" v-model="usuario.crp" type="text" placeholder="CRP" v-mask="'##/########'" :readonly="cadastroFinalizado" />
                  </div>
                </div>
                <div class="flex pt-4 justify-content-between">
                    <Button label="Voltar" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                    <Button label="Próximo" class="rounded" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                </div>
            </template>
          </StepperPanel>

          <StepperPanel>
            <template #header="{ index, clickCallback }">
                <button class="bg-transparent border-none inline-flex flex-column gap-2" @click="clickCallback" :disabled="cadastroFinalizado || !usuario.politica_privacidade">
                    <span :class="['border-round border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                        <i class="pi pi-id-card" />
                    </span>
                </button>
            </template>
            <template #content="{ prevCallback }">
              <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                <div class="text-center mt-1 mb-3 text-xl font-semibold">Dados de Endereço</div>
                <div class="field p-fluid">
                  <InputText id="cep" class="w-full" v-model="usuario.cep" type="text" placeholder="CEP" v-mask="'#####-###'" :readonly="cadastroFinalizado" />
                </div>
                <div class="field p-fluid">
                  <InputText id="estado" class="w-full" v-model="usuario.estado" type="text" placeholder="Estado" :readonly="cadastroFinalizado" />
                </div>
                <div class="field p-fluid">
                  <InputText id="cidade" class="w-full" v-model="usuario.cidade" type="text" placeholder="Cidade" :readonly="cadastroFinalizado" />
                </div>
                <div class="field p-fluid">
                  <InputText id="bairro" class="w-full" v-model="usuario.bairro" type="text" placeholder="Bairro" :readonly="cadastroFinalizado" />
                </div>
                <div class="field p-fluid">
                  <InputText id="rua" class="w-full" v-model="usuario.rua" type="text" placeholder="Rua" :readonly="cadastroFinalizado" />
                </div>
              </div>
              <div class="flex pt-4 justify-content-between">
                  <Button label="Voltar" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                  <Button class="rounded" severity="success" @click="cadastrar" :disabled="isLoading || cadastroFinalizado" >
                    <ProgressSpinner style="width: 20px; height: 20px" v-if="isLoading" />
                    <span v-else>Finalizar</span>
                  </Button>
              </div>
            </template>
          </StepperPanel>
        </Stepper>
    </div>

    <Toast/>

    <Pix :pix="pix" v-if="pixGerado"/>
  </div>
</template>

<script>
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import Button from 'primevue/button';
import ToggleButton from 'primevue/togglebutton';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import Pix from '@/components/Pix.vue';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import PoliticasDePrivacidade from './PoliticasDePrivacidade.vue';

export default {
  components: {
    Stepper,
    StepperPanel,
    Button,
    ToggleButton,
    IconField,
    InputIcon,
    InputText,
    Password,
    Toast,
    ProgressSpinner,
    Message,
    Pix,
    Checkbox,
    Dialog,
    PoliticasDePrivacidade,
  },
  data() {
    return {
      active: 0,
      usuario: {
        email: '',
        telefone: '',
        password: '',
        nome: '',
        sobrenome: '',
        cpf: '',
        crp: '',
        cep: '',
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        politica_privacidade: false,
        tipo_usuario: 'psicologo',
      },
      lerPoliticas: false,
      isLoading: false,
      cadastroFinalizado: false,
      mensagemRedirecionamento: '',
      pix: [],
      pixGerado: false,
    }
  },
  methods: {
    fecharPoliticaPrivacidade(value) {
      if (!value) {
        this.lerPoliticas = value;
      }
    },
    cadastrar() {
      this.isLoading = true;
      
      if (this.$route.query.ref != undefined && this.$route.query.ref.length > 0) {
        this.usuario.codigo_cupom = this.$route.query.ref;
      }

      this.axios.post('/usuario', this.usuario).then(res => {
        if (res.status == 200) {
          this.gerarPix();
        }
      }).catch(err => {
        this.$toast.add({ severity: 'error', summary: 'Erro ao se cadastrar', detail: err.response.data.error, life: 5000 });
      }).finally(() => {
        this.isLoading = false;
      });
    },
    gerarPix() {
      // let valor = 1;
      let valor = 29.90;

      this.axios.get(`https://projetopix.lksoftware.com.br/public/api/novo-pix?valor=${valor}&system=psicoprontuarios`).then(res => {
          res.data.email = this.usuario.email;
          this.$router.push({path: '/pix', query: {pix: JSON.stringify(res.data)}})
      }).catch(err => {
          console.log(err)
      });
    },
    voltarPaginaInicial() {
      if (this.$route.query.ref != undefined) {
        this.$router.push(`/?ref=${this.$route.query.ref}`)
      } else {
        this.$router.push(`/`)
      }
    }
  },
  watch: {
    'usuario.cep'(newValue) {
        var cep = newValue.replace(/\D/g, "");

        if (cep != "") {
          var validacep = /^[0-9]{8}$/;

          if(validacep.test(cep) && cep.length > 7) {
              this.axios.get(`https://viacep.com.br/ws/${cep}/json/`).then((res) => {
                  this.usuario.rua = res.data.logradouro;
                  this.usuario.bairro = res.data.bairro;
                  this.usuario.cidade = res.data.localidade;
                  this.usuario.estado = res.data.uf;
              });
          }
        }
    },
  },
}
</script>

<style scoped>
.p-stepper {
  width: 100%;
}
</style>

