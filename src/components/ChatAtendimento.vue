<template>
    <div class="chat-atendimento">
        <!-- Botão de Atendimento -->
        <div class="chat-button" :class="{ 'shake': isShaking, 'pulse': unreadMessages > 0 }" @click="toggleChat">
            <i class="pi pi-comments"></i>
            <span v-if="unreadMessages > 0" class="badge">{{ unreadMessages }}</span>
        </div>

        <!-- Janela de Chat -->
        <div v-if="isOpen" class="chat-window">
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar">
                        <i class="pi pi-comments"></i>
                    </div>
                    <div class="chat-header-text">
                        <h6>Assistente PsicoProntuarios</h6>
                        <small>Online agora</small>
                    </div>
                </div>
                <div class="chat-header-actions">
                    <button
                        @click="clearConversation"
                        class="header-action-btn clear-btn"
                        type="button"
                        aria-label="Limpar conversa"
                        title="Limpar conversa"
                    >
                        <i class="pi pi-trash"></i>
                    </button>
                    <button @click="toggleChat" class="header-action-btn close-btn" type="button" aria-label="Fechar chat">
                        <i class="pi pi-times"></i>
                    </button>
                </div>
            </div>

            <div class="chat-body">
                <div class="messages" ref="messagesContainer">
                    <div v-for="message in messages" :key="message.id" class="message" :class="{ 'user': message.isUser }">
                        <div class="message-bubble">
                            <div class="message-content" v-html="formatMessage(message.text)"></div>
                            <div v-if="!message.isUser && message.actions?.length" class="message-actions">
                                <button
                                    v-for="(action, actionIndex) in message.actions"
                                    :key="`${message.id}-${actionIndex}-${action.label || 'acao'}`"
                                    class="action-button"
                                    type="button"
                                    @click="handleAction(action)"
                                >
                                    {{ action.label || 'Abrir' }}
                                </button>
                            </div>
                        </div>
                        <div class="message-time text-500">{{ formatTime(message.timestamp) }}</div>
                    </div>

                    <!-- Indicador de digitando -->
                    <div v-if="isTyping" class="message typing-message">
                        <div class="message-bubble typing-bubble">
                            <div class="message-content typing-content">
                            <div class="typing-indicator">
                                <span class="dot"></span>
                                <span class="dot"></span>
                                <span class="dot"></span>
                            </div>
                            <span class="typing-text">Digitando...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chat-input">
                    <input
                        v-model="newMessage"
                        @keyup.enter="sendMessage"
                        placeholder="Digite sua mensagem..."
                        :disabled="isTyping"
                    />
                    <button @click="sendMessage" :disabled="!newMessage.trim() || isTyping">
                        <i class="pi pi-send"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChatAtendimento',
    props: {
        /** URL completa do webhook POST (ex.: N8N) que recebe o payload da conversa. */
        webhookUrl: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            storageKey: 'psicoprontuarios_chat_messages_v1',
            visitorIdStorageKey: 'psicoprontuarios_chat_visitor_id_v1',
            visitorSessionId: '',
            isOpen: false,
            messages: [
                {
                    id: 1,
                    text: 'Olá! Como posso ajudá-lo hoje?',
                    actions: [],
                    isUser: false,
                    timestamp: new Date()
                }
            ],
            newMessage: '',
            isTyping: false,
            unreadMessages: 0,
            isShaking: false // Controle do efeito de balançando
        };
    },
    created() {
        this.visitorSessionId = this.getOrCreateVisitorSessionId();
        this.loadPersistedConversation();
    },
    methods: {
        toggleChat() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.unreadMessages = 0;
                this.stopShaking(); // Parar efeito de balançando
                this.scrollToBottom();
            }
        },
        
        async sendMessage() {
            if (!this.newMessage.trim()) return;
            
            const message = {
                id: Date.now(),
                text: this.newMessage,
                actions: [],
                isUser: true,
                timestamp: new Date()
            };
            
            this.messages.push(message);
            this.persistConversation();
            this.isTyping = true;
            this.scrollToBottom();
            
            try {
                // Enviar mensagem para o N8N
                const response = await this.sendToN8N({
                    text: this.newMessage,
                    chatId: this.getChatId(),
                    userId: this.getUserId(),
                    timestamp: new Date().toISOString(),
                    userInfo: {
                        name: this.getUserName(),
                        email: this.getUserEmail(),
                        phone: this.getUserPhone()
                    }
                });

                // Debug do payload retornado pelo N8N
                console.log('[ChatAtendimento] Resposta bruta N8N:', response);
                console.log('[ChatAtendimento] Chaves da resposta:', Object.keys(response || {}));
                if (response?.actions) {
                    console.log('[ChatAtendimento] actions recebidas:', response.actions);
                }
                
                if (response && (response.response || response.output)) {
                    const parsedPayload = this.parseN8nPayload(response);
                    console.log('Texto da resposta:', parsedPayload.text);
                    this.messages.push({
                        id: Date.now() + 1,
                        text: parsedPayload.text,
                        actions: parsedPayload.actions,
                        isUser: false,
                        timestamp: new Date()
                    });
                    this.persistConversation();
                    this.scrollToBottom();
                    // Ativar efeito de balançando se chat estiver fechado
                    if (!this.isOpen) {
                        this.unreadMessages++;
                        this.startShaking();
                    }
                } else {
                    // Resposta padrão se N8N não responder
                    this.messages.push({
                        id: Date.now() + 1,
                        text: 'Mensagem recebida! Um atendente responderá em breve.',
                        actions: [],
                        isUser: false,
                        timestamp: new Date()
                    });
                    this.persistConversation();
                    this.scrollToBottom();
                    // Ativar efeito de balançando se chat estiver fechado
                    if (!this.isOpen) {
                        this.unreadMessages++;
                        this.startShaking();
                    }
                }
                
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                this.messages.push({
                    id: Date.now() + 1,
                    text: 'Erro ao enviar mensagem. Tente novamente.',
                    actions: [],
                    isUser: false,
                    timestamp: new Date()
                });
                this.persistConversation();
                this.scrollToBottom();
            } finally {
                this.isTyping = false;
                this.newMessage = '';
                // Scroll final após remover o indicador de digitando
                this.scrollToBottom();
            }
        },
        
        async sendToN8N(messageData) {
            const url = (this.webhookUrl || '').trim();
            if (!url) {
                throw new Error('Webhook do chat não configurado.');
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        },
        
        // Obter chatId único para o psicólogo
        getChatId() {
            const userId = this.getUserId();
            return `psicologo-${userId}`;
        },

        getOrCreateVisitorSessionId() {
            let visitorId = localStorage.getItem(this.visitorIdStorageKey);
            if (!visitorId) {
                visitorId = `visitante-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                localStorage.setItem(this.visitorIdStorageKey, visitorId);
            }
            return visitorId;
        },

        loadPersistedConversation() {
            try {
                const raw = localStorage.getItem(this.storageKey);
                if (!raw) {
                    return;
                }

                const parsed = JSON.parse(raw);
                if (!Array.isArray(parsed) || !parsed.length) {
                    return;
                }

                this.messages = parsed.map((message) => ({
                    id: message.id || Date.now(),
                    text: message.text || '',
                    actions: this.normalizeActions(message.actions),
                    isUser: Boolean(message.isUser),
                    timestamp: message.timestamp ? new Date(message.timestamp) : new Date()
                }));
            } catch (error) {
                console.warn('[ChatAtendimento] Falha ao carregar conversa salva:', error);
            }
        },

        persistConversation() {
            try {
                const serializable = this.messages.slice(-80).map((message) => ({
                    id: message.id,
                    text: message.text,
                    actions: this.normalizeActions(message.actions),
                    isUser: Boolean(message.isUser),
                    timestamp: message.timestamp instanceof Date
                        ? message.timestamp.toISOString()
                        : message.timestamp
                }));

                localStorage.setItem(this.storageKey, JSON.stringify(serializable));
            } catch (error) {
                console.warn('[ChatAtendimento] Falha ao salvar conversa:', error);
            }
        },
        
        // Métodos para efeitos visuais
        startShaking() {
            this.isShaking = true;
            // Parar o efeito após 3 segundos
            setTimeout(() => {
                this.isShaking = false;
            }, 3000);
        },
        
        stopShaking() {
            this.isShaking = false;
        },

        clearConversation() {
            this.messages = [
                {
                    id: Date.now(),
                    text: 'Olá! Como posso ajudá-lo hoje?',
                    actions: [],
                    isUser: false,
                    timestamp: new Date()
                }
            ];
            this.unreadMessages = 0;
            this.stopShaking();
            localStorage.removeItem(this.storageKey);
            this.persistConversation();
            this.scrollToBottom();
        },
        
        // Rolar para a última mensagem
        scrollToBottom() {
            this.$nextTick(() => {
                const messagesContainer = this.$refs.messagesContainer;
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            });
        },

        parseN8nPayload(response) {
            const rawText = response.response || response.output || '';
            let text = typeof rawText === 'string' ? rawText : String(rawText || '');
            let actions = this.normalizeActions(response.actions);

            // Fallback: alguns fluxos do N8N retornam output como string JSON.
            if (typeof rawText === 'string') {
                const trimmed = rawText.trim();
                if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                    try {
                        const parsed = JSON.parse(trimmed);
                        text = parsed.output || parsed.response || text;
                        actions = this.normalizeActions(parsed.actions);
                    } catch (e) {
                        // Mantém texto puro se não for JSON válido.
                    }
                }
            }

            return { text, actions };
        },

        normalizeActions(actions) {
            if (!Array.isArray(actions)) {
                return [];
            }

            return actions
                .filter((action) => action && typeof action === 'object')
                .map((action) => ({
                    label: action.label || 'Abrir',
                    type: action.type || 'route',
                    to: action.to || '',
                    url: action.url || '',
                    target: action.target || ''
                }));
        },

        handleAction(action) {
            const type = action?.type;

            if (type === 'route' && action.to) {
                this.$router.push(action.to);
                return;
            }

            if (type === 'anchor' && action.target) {
                const anchorId = action.target.startsWith('#')
                    ? action.target.slice(1)
                    : action.target;
                const element = document.getElementById(anchorId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                return;
            }

            if (type === 'url' && action.url) {
                window.open(action.url, '_blank', 'noopener,noreferrer');
            }
        },
        
        // Método auxiliar para obter dados do usuário
        getUserData() {
            const user = JSON.parse(sessionStorage.getItem('usuario') || '{}');
            console.log('Dados completos do usuário:', user);
            return user;
        },
        
        getUserId() {
            // Obter ID do usuário logado do sessionStorage
            const user = this.getUserData();
            return user.id || this.visitorSessionId;
        },
        
        getUserName() {
            // Obter nome do usuário logado do sessionStorage
            const user = this.getUserData();
            return user.nome || 'Psicólogo';
        },
        
        getUserEmail() {
            // Obter email do usuário logado do sessionStorage
            const user = this.getUserData();
            return user.email || 'psicologo@exemplo.com';
        },
        
        getUserPhone() {
            // Obter telefone do usuário logado do sessionStorage
            const user = this.getUserData();
            return user.telefone || '(11) 99999-9999';
        },
        
        formatTime(timestamp) {
            return timestamp.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        },
        
        // Formatar mensagem para exibição amigável
        formatMessage(text) {
            if (!text) return '';
            
            // Converter quebras de linha
            let formatted = text.replace(/\n\n/g, '</p><p>');
            formatted = formatted.replace(/\n/g, '<br>');
            
            // Converter texto em negrito (**texto**)
            formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // Converter texto em itálico (*texto*)
            formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
            
            // Converter listas numeradas (1. item)
            formatted = formatted.replace(/^(\d+)\.\s+(.*)$/gm, '<div class="list-item"><span class="list-number">$1.</span> <span class="list-text">$2</span></div>');
            
            // Converter listas com traços (- item)
            formatted = formatted.replace(/^-\s+(.*)$/gm, '<div class="list-item"><span class="list-bullet">•</span> <span class="list-text">$1</span></div>');
            
            // Converter listas com asteriscos (* item)
            formatted = formatted.replace(/^\*\s+(.*)$/gm, '<div class="list-item"><span class="list-bullet">•</span> <span class="list-text">$1</span></div>');
            
            // Envolver em parágrafo se não estiver
            if (!formatted.startsWith('<p>') && !formatted.startsWith('<div')) {
                formatted = `<p>${formatted}</p>`;
            }
            
            return formatted;
        }
    }
};
</script>

<style scoped>
.chat-atendimento {
    position: fixed !important;
    bottom: 1rem !important;
    right: 1rem !important;
    z-index: 9999 !important;
}

.chat-button {
    width: 3.6rem !important;
    height: 3.6rem !important;
    background: linear-gradient(135deg, #2563eb, #3b82f6 55%, #60a5fa) !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    box-shadow: 0 10px 28px rgba(37, 99, 235, 0.35) !important;
    transition: all 0.3s ease !important;
    position: relative !important;
    color: white !important;
    font-size: 1.35rem !important;
}

.chat-button:hover {
    transform: translateY(-2px) scale(1.03) !important;
    box-shadow: 0 14px 30px rgba(37, 99, 235, 0.42) !important;
}

/* Efeito de balançando */
.chat-button.shake {
    animation: shake 0.5s ease-in-out infinite !important;
}

@keyframes shake {
    0%, 100% {
        transform: translateX(0) !important;
    }
    10%, 30%, 50%, 70%, 90% {
        transform: translateX(-2px) !important;
    }
    20%, 40%, 60%, 80% {
        transform: translateX(2px) !important;
    }
}

/* Efeito de pulso para chamar atenção */
.chat-button.pulse {
    animation: pulse 1s ease-in-out infinite !important;
}

@keyframes pulse {
    0% {
        transform: scale(1) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }
    50% {
        transform: scale(1.05) !important;
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
    }
    100% {
        transform: scale(1) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }
}

.badge {
    position: absolute !important;
    top: -0.25rem !important;
    right: -0.25rem !important;
    background: #ef4444 !important;
    color: white !important;
    border-radius: 50% !important;
    width: 1.25rem !important;
    height: 1.25rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 0.7rem !important;
    font-weight: bold !important;
    border: 2px solid #fff !important;
}

.chat-window {
    position: absolute !important;
    bottom: 4.4rem !important;
    right: 0 !important;
    width: min(380px, calc(100vw - 1.5rem)) !important;
    height: min(620px, calc(100vh - 7rem)) !important;
    background: #ffffff !important;
    border-radius: 1.25rem !important;
    border: 1px solid rgba(226, 232, 240, 0.85) !important;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22) !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
    animation: chat-fade-in 0.2s ease-out;
}

@keyframes chat-fade-in {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.chat-header {
    background: linear-gradient(120deg, #1d4ed8, #2563eb, #3b82f6) !important;
    color: white !important;
    padding: 0.9rem 1rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
}

.chat-header-info {
    display: flex !important;
    align-items: center !important;
    gap: 0.65rem !important;
}

.chat-avatar {
    width: 2rem !important;
    height: 2rem !important;
    border-radius: 50% !important;
    background: rgba(255, 255, 255, 0.2) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 0.95rem !important;
}

.chat-header-text h6 {
    margin: 0 !important;
    font-size: 0.93rem !important;
    font-weight: 700 !important;
    letter-spacing: 0.01em;
}

.chat-header-text small {
    display: inline-flex !important;
    align-items: center !important;
    gap: 0.3rem !important;
    font-size: 0.72rem !important;
    color: rgba(255, 255, 255, 0.9) !important;
}

.chat-header-text small::before {
    content: '';
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: #86efac;
}

.close-btn {
    width: 1.9rem !important;
    height: 1.9rem !important;
    border-radius: 50% !important;
    background: rgba(255, 255, 255, 0.16) !important;
    border: none !important;
    color: white !important;
    font-size: 0.95rem !important;
    cursor: pointer !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.24) !important;
    transform: scale(1.05) !important;
}

.chat-header-actions {
    display: inline-flex !important;
    align-items: center !important;
    gap: 0.4rem !important;
}

.header-action-btn {
    width: 1.9rem !important;
    height: 1.9rem !important;
    border-radius: 50% !important;
    border: none !important;
    color: white !important;
    cursor: pointer !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
}

.clear-btn {
    background: rgba(255, 255, 255, 0.16) !important;
}

.clear-btn:hover {
    background: rgba(248, 113, 113, 0.38) !important;
    transform: scale(1.05) !important;
}

.chat-body {
    flex: 1 !important;
    min-height: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    background:
        radial-gradient(circle at top right, rgba(219, 234, 254, 0.6), transparent 38%),
        radial-gradient(circle at bottom left, rgba(224, 242, 254, 0.5), transparent 35%),
        #f8fafc !important;
}

.messages {
    flex: 1 !important;
    min-height: 0 !important;
    padding: 0.9rem !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    overscroll-behavior: contain !important;
    -webkit-overflow-scrolling: touch !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 0.7rem !important;
    scrollbar-width: thin !important;
    scrollbar-color: #cbd5e0 transparent !important;
}

/* Estilização da scrollbar para WebKit (Chrome, Safari, Edge) */
.messages::-webkit-scrollbar {
    width: 5px !important;
}

.messages::-webkit-scrollbar-thumb {
    background: #cbd5e0 !important;
    border-radius: 999px !important;
}

.messages::-webkit-scrollbar-thumb:hover {
    background: #a0aec0 !important;
}

.message {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.25rem !important;
}

.message.user {
    align-items: flex-end !important;
}

.message-bubble {
    max-width: 85% !important;
    padding: 0.68rem 0.78rem !important;
    border-radius: 1rem !important;
    border-top-left-radius: 0.4rem !important;
    background: #ffffff !important;
    border: 1px solid #dbeafe !important;
    box-shadow: 0 6px 14px rgba(148, 163, 184, 0.15) !important;
}

.message-content {
    color: #334155 !important;
    font-size: 0.9rem !important;
    line-height: 1.45 !important;
    word-break: break-word !important;
}

.message.user .message-bubble {
    border-top-left-radius: 1rem !important;
    border-top-right-radius: 0.4rem !important;
    background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
    border-color: #3b82f6 !important;
}

.message.user .message-content {
    color: #374151 !important;
    color: white !important;
}

.message-time {
    font-size: 0.68rem !important;
    color: #64748b !important;
    padding: 0 0.2rem !important;
}

.message.user .message-time {
    text-align: right !important;
}

/* Estilização das mensagens formatadas */
.message-content p {
    margin: 0.35rem 0 !important;
    line-height: 1.45 !important;
}

.message-content p:first-child {
    margin-top: 0 !important;
}

.message-content p:last-child {
    margin-bottom: 0 !important;
}

.message-content strong {
    font-weight: 600 !important;
    color: inherit !important;
}

.message-content em {
    font-style: italic !important;
    color: inherit !important;
}

.message-content .list-item {
    display: flex !important;
    align-items: flex-start !important;
    margin: 0.2rem 0 !important;
    padding-left: 0.35rem !important;
}

.message-content .list-number {
    font-weight: 600 !important;
    color: inherit !important;
    margin-right: 0.5rem !important;
    min-width: 1.5rem !important;
}

.message-content .list-bullet {
    color: inherit !important;
    margin-right: 0.5rem !important;
    font-weight: bold !important;
}

.message-content .list-text {
    flex: 1 !important;
    line-height: 1.4 !important;
}

.message-actions {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 0.45rem !important;
    margin-top: 0.65rem !important;
}

.action-button {
    border: 1px solid #3b82f6 !important;
    background: #eff6ff !important;
    color: #1d4ed8 !important;
    border-radius: 999px !important;
    padding: 0.33rem 0.7rem !important;
    font-size: 0.78rem !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
}

.action-button:hover {
    background: #dbeafe !important;
    transform: translateY(-1px) !important;
}

.chat-input {
    padding: 0.8rem !important;
    border-top: 1px solid #e2e8f0 !important;
    background: #ffffff !important;
    display: flex !important;
    gap: 0.5rem !important;
    align-items: center !important;
}

.chat-input input {
    flex: 1 !important;
    padding: 0.62rem 0.78rem !important;
    border: 1px solid #cbd5e1 !important;
    border-radius: 0.75rem !important;
    outline: none !important;
    font-size: 0.9rem !important;
    transition: all 0.2s ease !important;
}

.chat-input input:focus {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.16) !important;
}

.chat-input button {
    width: 2.3rem !important;
    height: 2.3rem !important;
    background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
    color: white !important;
    border: none !important;
    border-radius: 0.75rem !important;
    cursor: pointer !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
}

.chat-input button:hover:not(:disabled) {
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 14px rgba(59, 130, 246, 0.3) !important;
}

.chat-input button:disabled {
    background: #9ca3af !important;
    cursor: not-allowed !important;
}

/* Responsividade */
@media (max-width: 768px) {
    .chat-atendimento {
        right: 0.75rem !important;
        bottom: 0.75rem !important;
    }

    .chat-window {
        width: calc(100vw - 1.5rem) !important;
        max-width: 420px !important;
        height: calc(100vh - 7.5rem) !important;
        bottom: 4.2rem !important;
        right: 0 !important;
        border-radius: 1rem !important;
    }

    .message-bubble {
        max-width: 90% !important;
    }

    .chat-header-text h6 {
        font-size: 0.88rem !important;
    }

    .chat-header-text small {
        font-size: 0.68rem !important;
    }
}

/* Container do typing */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 18px;
}

/* Pontos */
.typing-indicator .dot {
  width: 7px;
  height: 7px;
  background-color: #64748b;
  border-radius: 50%;
  animation: typing 1s infinite;
}

.typing-text {
  font-size: 0.78rem;
  color: #64748b;
}

/* Animação dos pontos */
@keyframes typing {
  0%, 20% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(-5px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.3; }
}

/* Delay para cada ponto */
.typing-indicator .dot:nth-child(1) { animation-delay: 0s; }
.typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }
</style>
