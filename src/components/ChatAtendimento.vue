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
                <h6 class="text-white">💬 F.A.Q</h6>
                <button @click="toggleChat" class="close-btn">×</button>
            </div>
            
            <div class="chat-body">
                <div class="messages" ref="messagesContainer">
                    <div v-for="message in messages" :key="message.id" class="message" :class="{ 'user': message.isUser }">
                        <div class="message-content" v-html="formatMessage(message.text)"></div>
                        <div class="message-time text-500">{{ formatTime(message.timestamp) }}</div>
                    </div>
                    
                    <!-- Indicador de digitando -->
                    <div v-if="isTyping" class="message typing-message">
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
                
                <div class="chat-input">
                    <input 
                        v-model="newMessage" 
                        @keyup.enter="sendMessage"
                        placeholder="Digite sua mensagem..."
                        :disabled="isTyping"
                    />
                    <button @click="sendMessage" :disabled="!newMessage.trim() || isTyping">
                        📤
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChatAtendimento',
    data() {
        return {
            isOpen: false,
            messages: [
                {
                    id: 1,
                    text: 'Olá! Como posso ajudá-lo hoje?',
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
                isUser: true,
                timestamp: new Date()
            };
            
            this.messages.push(message);
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
                
                if (response && (response.response || response.output)) {
                    // Adicionar resposta do N8N (suporte a 'response' e 'output')
                    const responseText = response.response || response.output;
                    console.log('Texto da resposta:', responseText);
                    this.messages.push({
                        id: Date.now() + 1,
                        text: responseText,
                        isUser: false,
                        timestamp: new Date()
                    });
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
                        isUser: false,
                        timestamp: new Date()
                    });
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
                    isUser: false,
                    timestamp: new Date()
                });
                this.scrollToBottom();
            } finally {
                this.isTyping = false;
                this.newMessage = '';
                // Scroll final após remover o indicador de digitando
                this.scrollToBottom();
            }
        },
        
        async sendToN8N(messageData) {
            const webhookUrl = 'https://petgre-n8n-petgre.irkqjy.easypanel.host/webhook/psico-bot-webhook/chat';
            
            const response = await fetch(webhookUrl, {
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
        
        // Rolar para a última mensagem
        scrollToBottom() {
            this.$nextTick(() => {
                const messagesContainer = this.$refs.messagesContainer;
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            });
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
            return user.id || 'psicologo-' + Date.now();
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
    bottom: 20px !important;
    right: 20px !important;
    z-index: 9999 !important;
}

.chat-button {
    width: 60px !important;
    height: 60px !important;
    background: #3b82f6 !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    transition: all 0.3s ease !important;
    position: relative !important;
    color: white !important;
    font-size: 24px !important;
}

.chat-button:hover {
    transform: scale(1.1) !important;
    background: #2563eb !important;
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
    top: -5px !important;
    right: -5px !important;
    background: #ef4444 !important;
    color: white !important;
    border-radius: 50% !important;
    width: 20px !important;
    height: 20px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 12px !important;
    font-weight: bold !important;
}

.chat-window {
    position: absolute !important;
    bottom: 70px !important;
    right: 0 !important;
    width: 350px !important;
    height: 500px !important;
    background: white !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
}

.chat-header {
    background: #3b82f6 !important;
    color: white !important;
    padding: 1rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
}

.chat-header h6 {
    margin: 0 !important;
    font-size: 16px !important;
}

.close-btn {
    background: none !important;
    border: none !important;
    color: white !important;
    font-size: 20px !important;
    cursor: pointer !important;
}

.chat-body {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
}

.messages {
    flex: 1 !important;
    padding: 1rem !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 0.5rem !important;
    max-height: 400px !important;
    scrollbar-width: thin !important;
    scrollbar-color: #cbd5e0 #f7fafc !important;
}

/* Estilização da scrollbar para WebKit (Chrome, Safari, Edge) */
.messages::-webkit-scrollbar {
    width: 6px !important;
}

.messages::-webkit-scrollbar-track {
    background: #f7fafc !important;
    border-radius: 3px !important;
}

.messages::-webkit-scrollbar-thumb {
    background: #cbd5e0 !important;
    border-radius: 3px !important;
}

.messages::-webkit-scrollbar-thumb:hover {
    background: #a0aec0 !important;
}

.message {
    display: flex !important;
    margin-bottom: 0.5rem !important;
    gap: 0.5rem !important;
}

.message.user {
    justify-content: flex-end !important;
}

.message-content {
    max-width: 80% !important;
    padding: 0.75rem !important;
    border-radius: 12px !important;
    background: #f3f4f6 !important;
    color: #374151 !important;
}

.message.user .message-content {
    background: #3b82f6 !important;
    color: white !important;
}

.message-time {
    font-size: 0.75rem !important;
    margin-top: 0.25rem !important;
}

/* Estilização das mensagens formatadas */
.message-content p {
    margin: 0.5rem 0 !important;
    line-height: 1.5 !important;
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
    margin: 0.25rem 0 !important;
    padding-left: 0.5rem !important;
}

.message-content .list-number {
    font-weight: 600 !important;
    color: #3b82f6 !important;
    margin-right: 0.5rem !important;
    min-width: 1.5rem !important;
}

.message-content .list-bullet {
    color: #3b82f6 !important;
    margin-right: 0.5rem !important;
    font-weight: bold !important;
}

.message-content .list-text {
    flex: 1 !important;
    line-height: 1.4 !important;
}

.chat-input {
    padding: 1rem !important;
    border-top: 1px solid #e5e7eb !important;
    background: white !important;
    display: flex !important;
    gap: 0.5rem !important;
}

.chat-input input {
    flex: 1 !important;
    padding: 0.5rem !important;
    border: 1px solid #d1d5db !important;
    border-radius: 6px !important;
    outline: none !important;
}

.chat-input input:focus {
    border-color: #3b82f6 !important;
}

.chat-input button {
    padding: 0.5rem 1rem !important;
    background: #3b82f6 !important;
    color: white !important;
    border: none !important;
    border-radius: 6px !important;
    cursor: pointer !important;
}

.chat-input button:disabled {
    background: #9ca3af !important;
    cursor: not-allowed !important;
}

/* Responsividade */
@media (max-width: 768px) {
    .chat-window {
        width: calc(100vw - 40px) !important;
        height: calc(100vh - 120px) !important;
        bottom: 80px !important;
        right: 20px !important;
    }
    
    .messages {
        max-height: calc(100vh - 200px) !important;
    }
}

/* Container do typing */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 20px;
}

/* Pontos */
.typing-indicator .dot {
  width: 8px;
  height: 8px;
  background-color: #555;
  border-radius: 50%;
  animation: typing 1s infinite;
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
