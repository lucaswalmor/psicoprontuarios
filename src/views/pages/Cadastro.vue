<template>
    <div class="cadastro-page bg-surface-0 dark:bg-surface-900 min-h-screen">
        <!-- Header -->
        <header class="bg-surface-0 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <!-- Logo -->
                    <div class="flex items-center">
                        <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-10 w-auto">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M17.1637 19.2467C17.1566 19.4033 17.1529 19.561 17.1529 19.7194C17.1529 25.3503 21.7203 29.915 27.3546 29.915C32.9887 29.915 37.5561 25.3503 37.5561 19.7194C37.5561 19.5572 37.5524 19.3959 37.5449 19.2355C38.5617 19.0801 39.5759 18.9013 40.5867 18.6994L40.6926 18.6782C40.7191 19.0218 40.7326 19.369 40.7326 19.7194C40.7326 27.1036 34.743 33.0896 27.3546 33.0896C19.966 33.0896 13.9765 27.1036 13.9765 19.7194C13.9765 19.374 13.9896 19.0316 14.0154 18.6927L14.0486 18.6994C15.0837 18.9062 16.1223 19.0886 17.1637 19.2467ZM33.3284 11.4538C31.6493 10.2396 29.5855 9.52381 27.3546 9.52381C25.1195 9.52381 23.0524 10.2421 21.3717 11.4603C20.0078 11.3232 18.6475 11.1387 17.2933 10.907C19.7453 8.11308 23.3438 6.34921 27.3546 6.34921C31.36 6.34921 34.9543 8.10844 37.4061 10.896C36.0521 11.1292 34.692 11.3152 33.3284 11.4538ZM43.826 18.0518C43.881 18.6003 43.9091 19.1566 43.9091 19.7194C43.9091 28.8568 36.4973 36.2642 27.3546 36.2642C18.2117 36.2642 10.8 28.8568 10.8 19.7194C10.8 19.1615 10.8276 18.61 10.8816 18.0663L7.75383 17.4411C7.66775 18.1886 7.62354 18.9488 7.62354 19.7194C7.62354 30.6102 16.4574 39.4388 27.3546 39.4388C38.2517 39.4388 47.0855 30.6102 47.0855 19.7194C47.0855 18.9439 47.0407 18.1789 46.9536 17.4267L43.826 18.0518ZM44.2613 9.54743L40.9084 10.2176C37.9134 5.95821 32.9593 3.1746 27.3546 3.1746C21.7442 3.1746 16.7856 5.96385 13.7915 10.2305L10.4399 9.56057C13.892 3.83178 20.1756 0 27.3546 0C34.5281 0 40.8075 3.82591 44.2613 9.54743Z"
                                fill="var(--primary-color)" />
                            <mask id="mask0_1413_1551" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="8"
                                width="54" height="11">
                                <path
                                    d="M27 18.3652C10.5114 19.1944 0 8.88892 0 8.88892C0 8.88892 16.5176 14.5866 27 14.5866C37.4824 14.5866 54 8.88892 54 8.88892C54 8.88892 43.4886 17.5361 27 18.3652Z"
                                    fill="var(--primary-color)" />
                            </mask>
                            <g mask="url(#mask0_1413_1551)">
                                <path
                                    d="M-4.673e-05 8.88887L3.73084 -1.91434L-8.00806 17.0473L-4.673e-05 8.88887ZM27 18.3652L26.4253 6.95109L27 18.3652ZM54 8.88887L61.2673 17.7127L50.2691 -1.91434L54 8.88887ZM-4.673e-05 8.88887C-8.00806 17.0473 -8.00469 17.0505 -8.00132 17.0538C-8.00018 17.055 -7.99675 17.0583 -7.9944 17.0607C-7.98963 17.0653 -7.98474 17.0701 -7.97966 17.075C-7.96949 17.0849 -7.95863 17.0955 -7.94707 17.1066C-7.92401 17.129 -7.89809 17.1539 -7.86944 17.1812C-7.8122 17.236 -7.74377 17.3005 -7.66436 17.3743C-7.50567 17.5218 -7.30269 17.7063 -7.05645 17.9221C-6.56467 18.3532 -5.89662 18.9125 -5.06089 19.5534C-3.39603 20.83 -1.02575 22.4605 1.98012 24.0457C7.97874 27.2091 16.7723 30.3226 27.5746 29.7793L26.4253 6.95109C20.7391 7.23699 16.0326 5.61231 12.6534 3.83024C10.9703 2.94267 9.68222 2.04866 8.86091 1.41888C8.45356 1.10653 8.17155 0.867278 8.0241 0.738027C7.95072 0.673671 7.91178 0.637576 7.90841 0.634492C7.90682 0.63298 7.91419 0.639805 7.93071 0.65557C7.93897 0.663455 7.94952 0.673589 7.96235 0.686039C7.96883 0.692262 7.97582 0.699075 7.98338 0.706471C7.98719 0.710167 7.99113 0.714014 7.99526 0.718014C7.99729 0.720008 8.00047 0.723119 8.00148 0.724116C8.00466 0.727265 8.00796 0.730446 -4.673e-05 8.88887ZM27.5746 29.7793C37.6904 29.2706 45.9416 26.3684 51.6602 23.6054C54.5296 22.2191 56.8064 20.8465 58.4186 19.7784C59.2265 19.2431 59.873 18.7805 60.3494 18.4257C60.5878 18.2482 60.7841 18.0971 60.9374 17.977C61.014 17.9169 61.0799 17.8645 61.1349 17.8203C61.1624 17.7981 61.1872 17.7781 61.2093 17.7602C61.2203 17.7512 61.2307 17.7427 61.2403 17.7348C61.2452 17.7308 61.2499 17.727 61.2544 17.7233C61.2566 17.7215 61.2598 17.7188 61.261 17.7179C61.2642 17.7153 61.2673 17.7127 54 8.88887C46.7326 0.0650536 46.7357 0.0625219 46.7387 0.0600241C46.7397 0.0592345 46.7427 0.0567658 46.7446 0.0551857C46.7485 0.0520238 46.7521 0.0489887 46.7557 0.0460799C46.7628 0.0402623 46.7694 0.0349487 46.7753 0.0301318C46.7871 0.0204986 46.7966 0.0128495 46.8037 0.00712562C46.818 -0.00431848 46.8228 -0.00808311 46.8184 -0.00463784C46.8096 0.00228345 46.764 0.0378652 46.6828 0.0983779C46.5199 0.219675 46.2165 0.439161 45.7812 0.727519C44.9072 1.30663 43.5257 2.14765 41.7061 3.02677C38.0469 4.79468 32.7981 6.63058 26.4253 6.95109L27.5746 29.7793ZM54 8.88887C50.2691 -1.91433 50.27 -1.91467 50.271 -1.91498C50.2712 -1.91506 50.272 -1.91535 50.2724 -1.9155C50.2733 -1.91581 50.274 -1.91602 50.2743 -1.91616C50.2752 -1.91643 50.275 -1.91636 50.2738 -1.91595C50.2714 -1.91515 50.2652 -1.91302 50.2552 -1.9096C50.2351 -1.90276 50.1999 -1.89078 50.1503 -1.874C50.0509 -1.84043 49.8938 -1.78773 49.6844 -1.71863C49.2652 -1.58031 48.6387 -1.377 47.8481 -1.13035C46.2609 -0.635237 44.0427 0.0249875 41.5325 0.6823C36.215 2.07471 30.6736 3.15796 27 3.15796V26.0151C33.8087 26.0151 41.7672 24.2495 47.3292 22.7931C50.2586 22.026 52.825 21.2618 54.6625 20.6886C55.5842 20.4011 56.33 20.1593 56.8551 19.986C57.1178 19.8993 57.3258 19.8296 57.4735 19.7797C57.5474 19.7548 57.6062 19.7348 57.6493 19.72C57.6709 19.7127 57.6885 19.7066 57.7021 19.7019C57.7089 19.6996 57.7147 19.6976 57.7195 19.696C57.7219 19.6952 57.7241 19.6944 57.726 19.6938C57.7269 19.6934 57.7281 19.693 57.7286 19.6929C57.7298 19.6924 57.7309 19.692 54 8.88887ZM27 3.15796C23.3263 3.15796 17.7849 2.07471 12.4674 0.6823C9.95717 0.0249875 7.73904 -0.635237 6.15184 -1.13035C5.36118 -1.377 4.73467 -1.58031 4.3155 -1.71863C4.10609 -1.78773 3.94899 -1.84043 3.84961 -1.874C3.79994 -1.89078 3.76474 -1.90276 3.74471 -1.9096C3.73469 -1.91302 3.72848 -1.91515 3.72613 -1.91595C3.72496 -1.91636 3.72476 -1.91643 3.72554 -1.91616C3.72593 -1.91602 3.72657 -1.91581 3.72745 -1.9155C3.72789 -1.91535 3.72874 -1.91506 3.72896 -1.91498C3.72987 -1.91467 3.73084 -1.91433 -4.673e-05 8.88887C-3.73093 19.692 -3.72983 19.6924 -3.72868 19.6929C-3.72821 19.693 -3.72698 19.6934 -3.72603 19.6938C-3.72415 19.6944 -3.72201 19.6952 -3.71961 19.696C-3.71482 19.6976 -3.70901 19.6996 -3.7022 19.7019C-3.68858 19.7066 -3.67095 19.7127 -3.6494 19.72C-3.60629 19.7348 -3.54745 19.7548 -3.47359 19.7797C-3.32589 19.8296 -3.11788 19.8993 -2.85516 19.986C-2.33008 20.1593 -1.58425 20.4011 -0.662589 20.6886C1.17485 21.2618 3.74125 22.026 6.67073 22.7931C12.2327 24.2495 20.1913 26.0151 27 26.0151V3.15796Z"
                                    fill="var(--primary-color)" />
                            </g>
                        </svg>
                        <span
                            class="text-surface-900 dark:text-surface-0 font-bold text-xl ml-3">PsicoProntuários</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-12">
            <div class="max-w-4xl mx-auto">
                <!-- Header da Página -->
                <div class="text-center mb-12">
                    <h1 class="text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
                        Cadastre-se como Psicólogo
                    </h1>
                    <p class="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
                        Junte-se a milhares de psicólogos que já utilizam nossa plataforma para gerenciar seus
                        prontuários de forma segura e eficiente.
                    </p>
                </div>

                <!-- Formulário de Cadastro -->
                <div
                    class="bg-surface-0 dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 p-8 mobile-form">
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Informações Pessoais -->
                        <div class="row">
                            <div class="col-md-6">
                                <label for="nome"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Nome <span class="text-danger"> *</span>
                                </label>
                                <InputText id="nome" v-model="form.nome" class="w-full" placeholder="Seu nome"
                                    :class="{ 'p-invalid': errors.nome }" />
                                <small v-if="errors.nome" class="p-error">{{ errors.nome }}</small>
                            </div>
                            <div class="col-md-6">
                                <label for="sobrenome"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Sobrenome <span class="text-danger"> *</span>
                                </label>
                                <InputText id="sobrenome" v-model="form.sobrenome" class="w-full"
                                    placeholder="Seu sobrenome" :class="{ 'p-invalid': errors.sobrenome }" />
                                <small v-if="errors.sobrenome" class="p-error">{{ errors.sobrenome }}</small>
                            </div>
                        </div>

                        <!-- Email e Telefone -->
                        <div class="row">
                            <div class="col-md-6">
                                <label for="email"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Email <span class="text-danger"> *</span>
                                </label>
                                <InputText id="email" v-model="form.email" type="email" class="w-full"
                                    placeholder="seu@email.com" :class="{ 'p-invalid': errors.email }" />
                                <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
                            </div>
                            <div class="col-md-6">
                                <label for="telefone"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Telefone <span class="text-danger"> *</span>
                                </label>
                                <InputMask id="telefone" v-model="form.telefone" mask="(99) 99999-9999" class="w-full"
                                    placeholder="(11) 99999-9999" :class="{ 'p-invalid': errors.telefone }" />
                                <small v-if="errors.telefone" class="p-error">{{ errors.telefone }}</small>
                            </div>
                        </div>

                        <!-- CPF e CRP -->
                        <div class="row">
                            <div class="col-md-6">
                                <label for="cpf"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    CPF <span class="text-danger"> *</span>
                                </label>
                                <InputMask id="cpf" v-model="form.cpf" mask="999.999.999-99" class="w-full"
                                    placeholder="000.000.000-00" :class="{ 'p-invalid': errors.cpf }" />
                                <small v-if="errors.cpf" class="p-error">{{ errors.cpf }}</small>
                            </div>
                            <div class="col-md-6">
                                <label for="crp"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    <span class="crp-text">CRP</span> <span class="text-danger"> *</span>
                                </label>
                                <InputMask id="crp" v-model="form.crp" mask="99/99999" class="w-full"
                                    placeholder="00/00000" :class="{ 'p-invalid': errors.crp }" />
                                <small v-if="errors.crp" class="p-error">{{ errors.crp }}</small>
                            </div>
                        </div>

                        <!-- Endereço -->
                        <div class="row">
                            <div class="col-md-6">
                                <label for="cep"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    CEP <span class="text-danger"> *</span>
                                </label>
                                <IconField>
                                    <InputMask id="cep" v-model="form.cep" mask="99999-999" class="w-full"
                                        placeholder="00000-000" :class="{ 'p-invalid': errors.cep }" 
                                        @change="buscarCep" />
                                    <InputIcon class="pi pi-sparkles" />
                                </IconField>
                                <small v-if="errors.cep" class="p-error">{{ errors.cep }}</small>
                            </div>
                            <div class="col-md-6">
                                <label for="estado"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Estado <span class="text-danger"> *</span>
                                </label>
                                <InputText id="estado" v-model="form.estado" class="w-full" 
                                    placeholder="SP" maxlength="2" 
                                    :class="{ 'p-invalid': errors.estado }" />
                                <small v-if="errors.estado" class="p-error">{{ errors.estado }}</small>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <label for="cidade"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Cidade <span class="text-danger"> *</span>
                                </label>
                                <InputText id="cidade" v-model="form.cidade" class="w-full" placeholder="Sua cidade"
                                    :class="{ 'p-invalid': errors.cidade }" />
                                <small v-if="errors.cidade" class="p-error">{{ errors.cidade }}</small>
                            </div>
                            <div class="col-md-6">
                                <label for="bairro"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Bairro <span class="text-danger"> *</span>
                                </label>
                                <InputText id="bairro" v-model="form.bairro" class="w-full" placeholder="Seu bairro"
                                    :class="{ 'p-invalid': errors.bairro }" />
                                <small v-if="errors.bairro" class="p-error">{{ errors.bairro }}</small>
                            </div>
                        </div>

                        <div class="col-md-12">
                            <label for="rua"
                                class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                Rua <span class="text-danger"> *</span>
                            </label>
                            <InputText id="rua" v-model="form.rua" class="w-full" placeholder="Sua rua"
                                :class="{ 'p-invalid': errors.rua }" />
                            <small v-if="errors.rua" class="p-error">{{ errors.rua }}</small>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <label for="numero"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Número
                                </label>
                                <InputText id="numero" v-model="form.numero" class="w-full" placeholder="123"
                                    :class="{ 'p-invalid': errors.numero }" />
                                <small v-if="errors.numero" class="p-error">{{ errors.numero }}</small>
                            </div>
                            <div class="col-md-6">
                                <label for="complemento"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Complemento
                                </label>
                                <InputText id="complemento" v-model="form.complemento" class="w-full" 
                                    placeholder="Apto 45, Bloco B, etc."
                                    :class="{ 'p-invalid': errors.complemento }" />
                                <small v-if="errors.complemento" class="p-error">{{ errors.complemento }}</small>
                            </div>
                        </div>

                        <!-- Senha -->
                        <div class="row">
                            <div class="col-md-6">
                                <label for="password"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Senha <span class="text-danger"> *</span>
                                </label>
                                <InputText id="password" v-model="form.password" type="password" class="w-full"
                                    placeholder="Mínimo 6 caracteres" :class="{ 'p-invalid': errors.password }" />
                                <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
                            </div>
                            <div class="col-md-6">
                                <label for="password_confirmation"
                                    class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                    Confirmar Senha <span class="text-danger"> *</span>
                                </label>
                                <InputText id="password_confirmation" v-model="form.password_confirmation"
                                    type="password" class="w-full" placeholder="Confirme sua senha"
                                    :class="{ 'p-invalid': errors.password_confirmation }" />
                                <small v-if="errors.password_confirmation" class="p-error">{{
                                    errors.password_confirmation }}</small>
                            </div>
                        </div>

                        <!-- Termos e Condições -->
                        <div class="flex items-start space-x-3">
                            <Checkbox id="politica_privacidade" v-model="form.politica_privacidade" :binary="true"
                                :class="{ 'p-invalid': errors.politica_privacidade }" />
                            <label for="politica_privacidade" class="text-sm text-surface-600 dark:text-surface-400">
                                Li e aceito os
                                <router-link to="/termos-uso" class="text-primary-600 hover:text-primary-500 underline"
                                    target="_blank">Termos de Uso</router-link>
                                e a
                                <router-link to="/politica-privacidade"
                                    class="text-primary-600 hover:text-primary-500 underline" target="_blank">Política
                                    de Privacidade</router-link>
                            </label>
                        </div>
                        <small v-if="errors.politica_privacidade" class="p-error">{{ errors.politica_privacidade
                            }}</small>

                        <!-- Botão de Envio -->
                        <div class="text-center">
                            <Button type="submit" :loading="loading" label="Criar Conta" class="w-full" />
                        </div>

                        <!-- Mensagens de Erro -->
                        <div v-if="error"
                            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p class="text-red-800 dark:text-red-200">{{ error }}</p>
                        </div>
                    </form>

                    <!-- Informações Adicionais -->
                    <div class="mt-4 text-center">
                        <p class="text-sm text-surface-600 dark:text-surface-400">
                            Já tem uma conta?
                            <router-link to="/login" class="text-primary-600 hover:text-primary-500 font-medium">Faça
                                login</router-link>
                        </p>
                    </div>
                </div>
            </div>
        </main>

        <!-- Dialog de Sucesso -->
        <Dialog v-model:visible="showSuccessDialog" :dismissable="false" :closable="false" modal class="success-dialog">
            <template #header>
                <div class="flex items-center">
                    <i class="pi pi-check-circle text-green-500 text-2xl mr-3"></i>
                    <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100">
                        Cadastro Realizado com Sucesso!
                    </h3>
                </div>
            </template>

            <div class="text-center py-6">
                <div class="mb-4">
                    <i class="pi pi-check-circle text-green-500 text-6xl mb-4"></i>
                    <h4 class="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
                        Parabéns pelo seu cadastro!
                    </h4>
                    <p class="text-surface-600 dark:text-surface-400 mb-4">
                        Sua conta foi criada com sucesso. Você será redirecionado para a página de login em alguns
                        segundos.
                    </p>
                </div>

                <div class="flex items-center justify-center space-x-2 mb-4">
                    <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="4" fill="var(--surface-ground)"
                        animationDuration=".5s" />
                    <span class="text-surface-600 dark:text-surface-400">
                        Redirecionando...
                    </span>
                </div>

                <div class="text-sm text-surface-500 dark:text-surface-400">
                    <i class="pi pi-clock mr-1"></i>
                    Aguarde {{ countdown }} segundos
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import logo from '@/assets/img/logo-branca.jpg';
import userService from '@/services/userService';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

export default {
    name: 'Cadastro',
    components: {
        InputText,
        InputMask,
        Checkbox,
        Button,
        Dialog,
        ProgressSpinner,
        IconField,
        InputIcon
    },
    data() {
        return {
            logo,
            loading: false,
            loadingCep: false,
            error: '',
            showSuccessDialog: false,
            countdown: 3,
            form: {
                nome: '',
                sobrenome: '',
                email: '',
                telefone: '',
                cpf: '',
                crp: '',
                cep: '',
                cidade: '',
                estado: '',
                rua: '',
                bairro: '',
                numero: '',
                complemento: '',
                password: '',
                password_confirmation: '',
                codigo_cupom: '',
                politica_privacidade: false,
                tipo_usuario: 'psicologo'
            },
            errors: {}
        };
    },
    methods: {
        validateForm() {
            this.errors = {};

            // Validações básicas
            if (!this.form.nome.trim()) {
                this.errors.nome = 'Nome é obrigatório';
            }

            if (!this.form.sobrenome.trim()) {
                this.errors.sobrenome = 'Sobrenome é obrigatório';
            }

            if (!this.form.email.trim()) {
                this.errors.email = 'Email é obrigatório';
            } else if (!this.isValidEmail(this.form.email)) {
                this.errors.email = 'Email inválido';
            }

            if (!this.form.telefone.trim()) {
                this.errors.telefone = 'Telefone é obrigatório';
            }

            if (!this.form.cpf.trim()) {
                this.errors.cpf = 'CPF é obrigatório';
            }

            if (!this.form.crp.trim()) {
                this.errors.crp = 'CRP é obrigatório';
            }

            if (!this.form.cep.trim()) {
                this.errors.cep = 'CEP é obrigatório';
            }

            if (!this.form.estado) {
                this.errors.estado = 'Estado é obrigatório';
            }

            if (!this.form.cidade.trim()) {
                this.errors.cidade = 'Cidade é obrigatória';
            }

            if (!this.form.bairro.trim()) {
                this.errors.bairro = 'Bairro é obrigatório';
            }

            if (!this.form.rua.trim()) {
                this.errors.rua = 'Rua é obrigatória';
            }

            if (!this.form.numero.trim()) {
                this.errors.numero = 'Número é obrigatório';
            }

            if (!this.form.password) {
                this.errors.password = 'Senha é obrigatória';
            } else if (this.form.password.length < 6) {
                this.errors.password = 'Senha deve ter pelo menos 6 caracteres';
            }

            if (!this.form.password_confirmation) {
                this.errors.password_confirmation = 'Confirmação de senha é obrigatória';
            } else if (this.form.password !== this.form.password_confirmation) {
                this.errors.password_confirmation = 'As senhas não coincidem';
            }

            if (!this.form.politica_privacidade) {
                this.errors.politica_privacidade = 'Você deve aceitar os termos de uso';
            }

            return Object.keys(this.errors).length === 0;
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        async handleSubmit() {
            // Reset de mensagens
            this.error = '';

            // Validação do formulário
            if (!this.validateForm()) {
                return;
            }

            this.loading = true;

            try {
                const formData = this.prepareFormData();
                const response = await userService.cadastrar(formData);

                // Limpar formulário após sucesso
                this.clearForm();

                // Mostrar dialog de sucesso
                this.showSuccessDialog = true;
                this.startCountdown();

            } catch (err) {
                if (err.response?.data?.errors) {
                    // Erros de validação do backend
                    this.errors = err.response.data.errors;
                } else if (err.response?.data?.error) {
                    // Erro geral do backend
                    this.error = err.response.data.error;
                } else {
                    // Erro de conexão
                    this.error = 'Erro de conexão. Verifique sua internet e tente novamente.';
                }
            } finally {
                this.loading = false;
            }
        },

        startCountdown() {
            this.countdown = 3;
            const timer = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                    clearInterval(timer);
                    this.redirectToLogin();
                }
            }, 1000);
        },

        redirectToLogin() {
            this.$router.push('/login');
        },

        clearForm() {
            Object.keys(this.form).forEach(key => {
                if (key !== 'tipo_usuario') {
                    if (typeof this.form[key] === 'boolean') {
                        this.form[key] = false;
                    } else {
                        this.form[key] = '';
                    }
                }
            });
            this.errors = {};
        },

        // Método para preparar dados antes do envio
        prepareFormData() {
            const formData = { ...this.form };

            // Converter string vazia para null para campos opcionais
            if (formData.codigo_cupom === '') {
                formData.codigo_cupom = null;
            }

            // Garantir que politica_privacidade seja boolean
            formData.politica_privacidade = Boolean(formData.politica_privacidade);

            return formData;
        },

        // Buscar CEP na API ViaCEP
        async buscarCep() {
            const cep = this.form.cep.replace(/\D/g, ''); // Remove caracteres não numéricos
            
            if (cep.length !== 8) {
                return; // CEP incompleto
            }

            try {
                this.loadingCep = true;
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    // Preencher campos automaticamente
                    this.form.estado = data.uf;
                    this.form.cidade = data.localidade;
                    this.form.bairro = data.bairro;
                    this.form.rua = data.logradouro;
                    
                    // Tentar extrair número do logradouro se disponível
                    if (data.logradouro) {
                        const numeroMatch = data.logradouro.match(/\d+/);
                        if (numeroMatch) {
                            this.form.numero = numeroMatch[0];
                        }
                    }
                    
                    // Mostrar mensagem de sucesso
                    this.$toast.add({
                        severity: 'success',
                        summary: 'CEP encontrado!',
                        detail: 'Endereço preenchido automaticamente',
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity: 'warn',
                        summary: 'CEP não encontrado',
                        detail: 'Verifique se o CEP está correto',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro ao buscar CEP',
                    detail: 'Tente novamente mais tarde',
                    life: 3000
                });
            } finally {
                this.loadingCep = false;
            }
        }
    }
};
</script>

<style scoped>
.cadastro-page {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

img {
    width: 100px;
    height: 100px;
}

/* Animações */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.cadastro-page {
    animation: fadeIn 0.6s ease-out;
}

/* Responsividade */
@media (max-width: 768px) {
    .cadastro-page {
        padding: 0 1rem;
    }
    
    /* Ajustar container principal em mobile */
    .container.mx-auto {
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
    }
    
    .max-w-4xl {
        max-width: 100% !important;
    }
    
    /* Garantir que inputs usem 100% da largura em mobile */
    .row .col-md-6,
    .row .col-md-12 {
        width: 100% !important;
        margin-bottom: 1rem;
    }
    
    /* Remover margens laterais dos inputs em mobile */
    .p-inputtext,
    .p-inputmask,
    .p-dropdown {
        width: 100% !important;
        max-width: none !important;
    }
    
    /* Ajustar espaçamento entre campos */
    .row {
        margin: 0;
    }
    
    .row > div {
        padding: 0;
        margin-bottom: 1rem;
    }
    
    /* Ajustar formulário em mobile */
    .mobile-form {
        padding: 1.5rem !important;
        margin: 0 0.5rem;
    }
    
    /* Garantir que todos os inputs ocupem 100% da largura */
    .p-component {
        width: 100% !important;
        box-sizing: border-box;
    }
}

@media (max-width: 480px) {
    /* Ajustes para telas muito pequenas */
    .cadastro-page {
        padding: 0 0.5rem;
    }
    
    .bg-surface-0.dark\\:bg-surface-800 {
        padding: 1rem !important;
    }
}

/* Dialog de Sucesso */
.success-dialog .p-dialog {
    max-width: 500px;
    width: 90%;
}

.success-dialog .p-dialog-header {
    border-bottom: 1px solid var(--surface-border);
    padding: 1.5rem 1.5rem 1rem;
}

.success-dialog .p-dialog-content {
    padding: 0 1.5rem 1.5rem;
}

.success-dialog .p-dialog-header-icon {
    display: none;
}

/* Solução simples para o problema do CRP */
.crp-text {
    font-family: inherit !important;
    font-weight: inherit !important;
    letter-spacing: inherit !important;
    display: inline-block !important;
    white-space: nowrap !important;
    overflow: visible !important;
    text-overflow: clip !important;
}

/* Garantir que o label seja visível */
label[for="crp"] {
    display: flex !important;
    align-items: center !important;
    gap: 0.25rem !important;
}
</style>