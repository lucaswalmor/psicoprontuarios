<template>
    <div class="faq-page">
        <!-- Header -->
        <div class="faq-header">
            <h1 class="faq-title">
                <i class="pi pi-question-circle"></i>
                FAQ - Perguntas Frequentes
            </h1>
            <p class="faq-subtitle">
                Encontre respostas rápidas para suas dúvidas sobre o sistema
            </p>
        </div>

        <!-- Barra de Busca -->
        <div class="search-section">
            <div class="search-container">
                <i class="pi pi-search search-icon"></i>
                <input
                    v-model="searchTerm"
                    @input="handleSearch"
                    type="text"
                    placeholder="Digite sua dúvida..."
                    class="search-input"
                />
                <button 
                    v-if="searchTerm"
                    @click="clearSearch"
                    class="clear-search-btn"
                >
                    <i class="pi pi-times"></i>
                </button>
            </div>
        </div>

        <!-- Filtros por Categoria -->
        <div class="category-filters" v-if="!searchTerm">
            <button
                v-for="(nome, categoria) in categorias"
                :key="categoria"
                @click="filterByCategory(categoria)"
                :class="['category-btn', { active: selectedCategory === categoria }]"
            >
                <i :class="getCategoryIcon(categoria)"></i>
                {{ nome }}
            </button>
        </div>

        <!-- Resultados da Busca -->
        <div v-if="searchTerm && searchResults.length > 0" class="search-results">
            <h3>Resultados para "{{ searchTerm }}"</h3>
            <div class="faq-list">
                <div
                    v-for="faq in searchResults"
                    :key="faq.id"
                    class="faq-item"
                >
                    <div class="faq-question" @click="toggleFaq(faq.id)">
                        <i class="pi pi-plus" :class="{ 'pi-minus': openFaqs.includes(faq.id) }"></i>
                        <span>{{ faq.pergunta }}</span>
                        <span class="faq-category">{{ faq.getNomeCategoria() }}</span>
                    </div>
                    <div class="faq-answer" :class="{ 'open': openFaqs.includes(faq.id) }">
                        <p>{{ faq.resposta }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lista de FAQs por Categoria -->
        <div v-else class="faq-categories">
            <div
                v-for="(faqs, categoria) in filteredFaqs"
                :key="categoria"
                class="category-section"
            >
                <h3 class="category-title">
                    <i :class="getCategoryIcon(categoria)"></i>
                    {{ categorias[categoria] }}
                </h3>
                <div class="faq-list">
                    <div
                        v-for="faq in faqs"
                        :key="faq.id"
                        class="faq-item"
                    >
                        <div class="faq-question" @click="toggleFaq(faq.id)">
                            <i class="pi pi-plus" :class="{ 'pi-minus': openFaqs.includes(faq.id) }"></i>
                            <span>{{ faq.pergunta }}</span>
                        </div>
                        <div class="faq-answer" :class="{ 'open': openFaqs.includes(faq.id) }">
                            <p>{{ faq.resposta }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mensagem quando não há resultados -->
        <div v-if="searchTerm && searchResults.length === 0" class="no-results">
            <i class="pi pi-search"></i>
            <h3>Nenhum resultado encontrado</h3>
            <p>Tente usar termos diferentes ou verifique a ortografia.</p>
            <button @click="clearSearch" class="btn-secondary">
                Limpar Busca
            </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-container">
            <i class="pi pi-spin pi-spinner"></i>
            <p>Carregando FAQ...</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import faqService from '@/services/faqService';

const toast = useToast();

// Estados
const faqs = ref({});
const categorias = ref({});
const searchTerm = ref('');
const selectedCategory = ref('');
const openFaqs = ref([]);
const loading = ref(true);
const searchResults = ref([]);

// Buscar FAQs do backend
const fetchFaqs = async () => {
    try {
        loading.value = true;
        const data = await faqService.getAll();
        
        faqs.value = data.faqs;
        categorias.value = data.categorias;
    } catch (error) {
        console.error('Erro ao carregar FAQ:', error);
        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar as perguntas frequentes',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

// Buscar por termo
const handleSearch = async () => {
    if (searchTerm.value.length < 3) {
        searchResults.value = [];
        return;
    }

    try {
        const data = await faqService.search(searchTerm.value);
        searchResults.value = data.faqs;
    } catch (error) {
        console.error('Erro na busca:', error);
    }
};

// Limpar busca
const clearSearch = () => {
    searchTerm.value = '';
    searchResults.value = [];
    selectedCategory.value = '';
};

// Filtrar por categoria
const filterByCategory = (categoria) => {
    selectedCategory.value = selectedCategory.value === categoria ? '' : categoria;
};

// Toggle FAQ
const toggleFaq = (faqId) => {
    const index = openFaqs.value.indexOf(faqId);
    if (index > -1) {
        openFaqs.value.splice(index, 1);
    } else {
        openFaqs.value.push(faqId);
    }
};

// Obter ícone da categoria
const getCategoryIcon = (categoria) => {
    const icons = {
        'dashboard': 'pi pi-fw pi-home',
        'financeiro': 'pi pi-fw pi-wallet',
        'pacientes': 'pi pi-fw pi-user',
        'prontuarios': 'pi pi-fw pi-file',
        'planos': 'pi pi-fw pi-credit-card',
        'geral': 'pi pi-fw pi-question-circle'
    };
    return icons[categoria] || 'pi pi-fw pi-question-circle';
};

// FAQs filtradas
const filteredFaqs = computed(() => {
    if (selectedCategory.value) {
        return { [selectedCategory.value]: faqs.value[selectedCategory.value] || [] };
    }
    return faqs.value;
});

onMounted(() => {
    fetchFaqs();
});
</script>

<style scoped>
.faq-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.faq-header {
    text-align: center;
    margin-bottom: 2rem;
}

.faq-title {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.faq-subtitle {
    font-size: 1.1rem;
    color: var(--text-color-secondary);
    margin: 0;
}

.search-section {
    margin-bottom: 2rem;
}

.search-container {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
}

.search-input {
    width: 100%;
    padding: 1rem 3rem 1rem 3rem;
    border: 2px solid var(--surface-border);
    border-radius: 50px;
    font-size: 1.1rem;
    transition: all 0.3s ease;
}

.search-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
}

.search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-color-secondary);
}

.clear-search-btn {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-color-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.clear-search-btn:hover {
    background: var(--surface-hover);
    color: var(--text-color);
}

.category-filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    justify-content: center;
}

.category-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--surface-border);
    border-radius: 25px;
    background: var(--surface-card);
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.category-btn:hover {
    border-color: var(--primary-color);
    background: var(--primary-color);
    color: white;
}

.category-btn.active {
    border-color: var(--primary-color);
    background: var(--primary-color);
    color: white;
}

.category-section {
    margin-bottom: 3rem;
}

.category-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--surface-border);
}

.faq-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.faq-item {
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.faq-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.faq-question {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--surface-card);
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.faq-question:hover {
    background: var(--surface-hover);
}

.faq-question i {
    color: var(--primary-color);
    transition: transform 0.3s ease;
}

.faq-question .pi-minus {
    transform: rotate(45deg);
}

.faq-category {
    margin-left: auto;
    font-size: 0.8rem;
    color: var(--text-color-secondary);
    background: var(--surface-200);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
}

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    background: var(--surface-ground);
}

.faq-answer.open {
    max-height: 500px;
}

.faq-answer p {
    padding: 1.5rem;
    margin: 0;
    line-height: 1.6;
    color: var(--text-color);
}

.search-results h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.no-results {
    text-align: center;
    padding: 3rem;
    color: var(--text-color-secondary);
}

.no-results i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--surface-400);
}

.btn-secondary {
    background: var(--surface-card);
    border: 2px solid var(--surface-border);
    color: var(--text-color);
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

.btn-secondary:hover {
    background: var(--surface-hover);
    border-color: var(--primary-color);
}

.loading-container {
    text-align: center;
    padding: 3rem;
    color: var(--text-color-secondary);
}

.loading-container i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
}

/* Responsividade */
@media (max-width: 768px) {
    .faq-page {
        padding: 1rem;
    }
    
    .faq-title {
        font-size: 2rem;
    }
    
    .category-filters {
        flex-direction: column;
        align-items: center;
    }
    
    .category-btn {
        width: 100%;
        max-width: 300px;
        justify-content: center;
    }
}
</style> 