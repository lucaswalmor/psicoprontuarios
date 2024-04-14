<template>
  <div id="cadastro" class="mt-8 ms-3 me-3 d-flex flex-column justify-content-center align-items-center">
    <div class="col-md-12">
      <div class="text-roxo font-bold text-5xl mb-4 text-center">Cadastro</div>
    </div>

    <div class="col-md-8 p-4 card">
        <Stepper v-model:activeStep="active">
          <StepperPanel>
              <template #header="{ index, clickCallback }">
                <button class="bg-transparent border-none inline-flex flex-column gap-2" @click="clickCallback">
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
                          <InputText id="email" v-model="usuario.email" type="email" placeholder="Email" />
                      </IconField>
                  </div>
                  <div class="field p-fluid">
                      <IconField>
                          <InputIcon>
                              <i class="pi pi-phone" />
                          </InputIcon>
                          <InputText id="telefone" v-model="usuario.telefone" type="text" v-mask="'(##) #####-####'" placeholder="Telefone" />
                      </IconField>
                  </div>
                  <div class="field p-fluid">
                      <Password v-model="usuario.password" toggleMask placeholder="Senha" />
                  </div>
                </div>
                <div class="flex pt-4 justify-content-between">
                    <Button label="Voltar para página" class="rounded" icon="pi pi-arrow-left" iconPos="left" severity="secondary" @click="$router.push('/')" />
                    <Button label="Próximo" class="rounded" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                </div>
              </template>
            </StepperPanel>

            <StepperPanel>
              <template #header="{ index, clickCallback }">
                  <button class="bg-transparent border-none inline-flex flex-column gap-2" @click="clickCallback">
                      <span :class="['border-round border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                          <i class="pi pi-user" />
                      </span>
                  </button>
              </template>
              <template #content="{ prevCallback, nextCallback }">
                  <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                    <div class="text-center mt-3 mb-3 text-xl font-semibold">Dados de Pessoais</div>
                    <div class="field p-fluid">
                        <InputText id="nome" class="w-full" v-model="usuario.nome" type="text" placeholder="Nome" />
                    </div>
                    <div class="field p-fluid">
                        <InputText id="cpf" class="w-full" v-model="usuario.cpf" type="text" placeholder="CPF" v-mask="'###.###.###-##'" />
                    </div>
                    <div class="field p-fluid">
                        <InputText id="crp" class="w-full" v-model="usuario.crp" type="text" placeholder="CRP" v-mask="'##/########'" />
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
                    <button class="bg-transparent border-none inline-flex flex-column gap-2" @click="clickCallback">
                        <span :class="['border-round border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                            <i class="pi pi-id-card" />
                        </span>
                    </button>
                </template>
                <template #content="{ prevCallback }">
                  <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                    <div class="text-center mt-3 mb-3 text-xl font-semibold">Dados de Endereço</div>
                    <div class="field p-fluid">
                        <InputText id="cep" class="w-full" v-model="usuario.cep" type="text" placeholder="CEP" v-mask="'#####-###'" />
                    </div>
                    <div class="field p-fluid">
                      <InputText id="estado" class="w-full" v-model="usuario.estado" type="text" placeholder="Estado" />
                    </div>
                    <div class="field p-fluid">
                      <InputText id="cidade" class="w-full" v-model="usuario.cidade" type="text" placeholder="Cidade" />
                    </div>
                    <div class="field p-fluid">
                      <InputText id="bairro" class="w-full" v-model="usuario.bairro" type="text" placeholder="Bairro" />
                    </div>
                    <div class="field p-fluid">
                      <InputText id="rua" class="w-full" v-model="usuario.rua" type="text" placeholder="Rua" />
                    </div>
                  </div>
                  <div class="flex pt-4 justify-content-between">
                      <Button label="Voltar" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                      <Button label="Finalizar" class="rounded" icon="pi pi-check" iconPos="right" severity="success" @click="cadastrar" />
                  </div>
                </template>
            </StepperPanel>
        </Stepper>
    </div>
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
  },
  data() {
    return {
      active: 0,
      usuario: {
        email: '',
        telefone: '',
        password: '',
        nome: '',
        cpf: '',
        crp: '',
        cep: '',
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
      }
    }
  },
  methods: {
    cadastrar() {
      console.log(this.usuario)
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

