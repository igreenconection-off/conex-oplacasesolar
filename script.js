document.addEventListener('DOMContentLoaded', () => {

    // --- REFERÊNCIAS AOS ELEMENTOS DO HTML ---
    const chatMessages = document.getElementById('chat-messages');
    const chatOptions = document.getElementById('chat-options');
    const restartButton = document.getElementById('restart-button'); // Botão flutuante

    // --- CONSTANTES ---
    const BOT_ICON_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL7d1tVe34hH7WxuBvKRlXDF-GetD5U5eWxg&s';
    
    // Links de Formulário (com ?embedded=true)
    const FORM_COMPRA_PLACAS = 'https://docs.google.com/forms/d/e/1FAIpQLSfuDWoYH004Av4L0Lp0FByLwidwbooL08QcYOpeKyZZK40lBQ/viewform?embedded=true';
    const FORM_ALUGUEL_TELHADO = 'https://docs.google.com/forms/d/e/1FAIpQLSeMbhNi0g7YWbJAGp9M5OqXj5JMcNhk4ukiDgHZcplra0aAbA/viewform?embedded=true';

    // Links de WhatsApp
    const WA_SUPORTE_PLACAS = 'https://wa.me/5584920039738?text=Ol%C3%A1!%20J%C3%A1%20contratei%20meu%20sistema%20solar%20fotovoltaico%20e%20preciso%20de%20suporte.';
    const WA_SUPORTE_ALUGUEL = 'https://wa.me/5584920039738?text=Ol%C3%A1!%20J%C3%A1%20aluguei%20meu%20telhado%20e%20preciso%20de%20suporte.';

    // --- FUNÇÕES AUXILIARES ---

    /** Rola o chat para a última mensagem */
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /** Limpa todos os botões de opção */
    function clearOptions() {
        chatOptions.innerHTML = '';
    }

    /** Adiciona uma mensagem do BOT ao chat */
    function addBotMessage(message, delay = 500) {
        return new Promise(resolve => {
            setTimeout(() => {
                const msgContainer = document.createElement('div');
                msgContainer.className = 'bot-message-container';

                msgContainer.innerHTML = `
                    <img src="${BOT_ICON_URL}" alt="Bot" class="bot-icon">
                    <div class="message bot-message">${message}</div>
                `;
                chatMessages.appendChild(msgContainer);
                scrollToBottom();
                resolve();
            }, delay);
        });
    }

    /** Adiciona uma mensagem do USUÁRIO ao chat */
    function addUserMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message';
        msgDiv.textContent = message;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    /** Adiciona os botões de opção */
    function addOptions(options) {
        clearOptions();
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option.text;
            button.onclick = option.action;
            chatOptions.appendChild(button);
        });
    }

    /** Adiciona um formulário iframe ao chat */
    function addForm(url) {
        const formContainer = document.createElement('div');
        formContainer.className = 'form-container';
        formContainer.innerHTML = `<iframe id="google-form" src="${url}">Carregando formulário...</iframe>`;
        chatMessages.appendChild(formContainer);
        scrollToBottom();
    }

    /** Mostra mensagem de "Atendimento finalizado" e botão de reiniciar */
    function showEndMessage(botMessage) {
        addBotMessage(botMessage).then(() => {
            const endMsg = document.createElement('p');
            endMsg.className = 'end-message';
            endMsg.textContent = 'Atendimento finalizado';
            chatMessages.appendChild(endMsg);
            
            addOptions([{ text: 'Reiniciar Atendimento', action: startChat }]);
            scrollToBottom();
        });
    }


    // --- FUNÇÕES DE FLUXO DO CHAT ---

    /** Inicia ou reinicia o chat */
    function startChat() {
        chatMessages.innerHTML = '';
        clearOptions();
        addBotMessage("Olá, bem-vindo à iGreen Energy. Este é o setor exclusivo para conexão placas e conexão solar. Sobre o que você deseja falar hoje?", 200).then(() => {
            addOptions([
                { text: 'Compra de placas solares', action: handleCompraStart },
                { text: 'Já comprei as placas solares. Desejo suporte', action: handleCompraSuporte },
                { text: 'Desejo alugar meu telhado', action: handleAluguelStart },
                { text: 'Já aluguei meu telhado. Preciso de suporte.', action: handleAluguelSuporte }
            ]);
        });
    }

    // --- Ramo 1: Compra de Placas ---
    function handleCompraStart() {
        addUserMessage('Compra de placas solares');
        clearOptions();
        addBotMessage('Que legal! Para comprar placas solares é necessário cumprir os requisitos de contratação. Vou te fazer algumas perguntas para confirmar os requisitos. Você concorda em contratar uma geração a partir de 250KW, mesmo que seu consumo seja inferior?').then(() => {
            addOptions([
                { text: 'Sim', action: handleCompraPagamento },
                { text: 'Não', action: handleCompraNao }
            ]);
        });
    }

    function handleCompraNao() {
        addUserMessage('Não');
        clearOptions();
        // Não é uma mensagem de "fim", apenas uma recusa.
        addBotMessage('Desculpe, no momento não podemos atendê-lo.').then(() => {
            addOptions([
                { text: 'Voltar ao Início', action: startChat }
            ]);
        });
    }

    function handleCompraPagamento() {
        addUserMessage('Sim');
        clearOptions();
        addBotMessage('Que maravilha! E qual método de pagamento deseja utilizar?').then(() => {
            addOptions([
                { text: 'A vista', action: () => handleCompraShowForm('A vista') },
                { text: 'Financiamento direto com bancos parceiros', action: () => handleCompraShowForm('Financiamento direto com bancos parceiros') },
                { text: 'No cartão de crédito', action: () => handleCompraShowForm('No cartão de crédito') },
                { text: 'Financiamento com meu banco', action: () => handleCompraShowForm('Financiamento com meu banco') }
            ]);
        });
    }

    function handleCompraShowForm(paymentMethod) {
        addUserMessage(paymentMethod);
        clearOptions();
        let message = '';

        if (paymentMethod === 'A vista') {
            message = 'Excelente opção! Com pagamento a vista é tudo mais fácil e rápido, reduz muitas etapas no processo.';
        } else if (paymentMethod === 'No cartão de crédito') {
            message = 'Legal! O pagamento com cartão de crédito é feito em até 21x com juros.';
        } else { // Financiamentos
            message = 'Muito bem. Esta opção de pagamento requer alguns procedimentos para garantir o financiamento.';
        }
        
        message += ' Para prosseguir, preencha o formulário abaixo, e um de nossos atendentes entrará em contato com você por whatsapp para fazer um orçamento.';

        addBotMessage(message).then(() => {
            addForm(FORM_COMPRA_PLACAS);
            addOptions([
                { text: 'Reiniciar Atendimento', action: startChat }
            ]);
        });
    }

    // --- Ramo 2: Suporte Placas ---
    function handleCompraSuporte() {
        addUserMessage('Já comprei as placas solares. Desejo suporte');
        clearOptions();
        addBotMessage('Que bom! Você já é cliente. Para obter suporte, fale conosco por whatsapp.').then(() => {
            addOptions([
                { text: 'Contatar suporte no whatsapp', action: () => window.location.href = WA_SUPORTE_PLACAS }
            ]);
        });
    }

    // --- Ramo 3: Aluguel de Telhado ---
    function handleAluguelStart() {
        addUserMessage('Desejo alugar meu telhado');
        clearOptions();
        addBotMessage('Que legal! Já sabe como funciona?').then(() => {
            addOptions([
                { text: 'Sim', action: handleAluguelSabeSim },
                { text: 'Não', action: handleAluguelSabeNao }
            ]);
        });
    }

    function handleAluguelSabeNao() {
        addUserMessage('Não');
        clearOptions();
        addBotMessage(
            'Vou te explicar brevemente. Nós temos a conexão solar como uma modalidade de aquisição do sistema solar fotovoltaico alternativa, onde nós instalamos o sistema solar completo na sua residência, e durante um período determinado (normalmente 6 anos) esse sistema gera energia para nós.' +
            '<br><br>Enquanto isso, você continuará pagando sua energia normalmente, mas com um desconto de até 15%, e sem pagar bandeiras tarifárias. Ao final do período estipulado, o sistema solar será 100% seu.' +
            '<br><br>É importante ressaltar que neste procedimento, nós não vamos te pagar um valor mensal pelo aluguel do seu telhado, pois o pagamento pelo tempo de aluguel será justamente o sistema solar completo.' +
            '<br><br>Deseja prosseguir e verificar os requisitos de contratação?'
        ).then(() => {
            addOptions([
                { text: 'Sim', action: handleAluguelCheckConsumo },
                { text: 'Não', action: handleAluguelEndSemProblemas }
            ]);
        });
    }

    function handleAluguelSabeSim() {
        addUserMessage('Sim');
        clearOptions();
        // Pula direto para a verificação de requisitos
        handleAluguelCheckConsumo();
    }

    function handleAluguelEndSemProblemas() {
        addUserMessage('Não');
        clearOptions();
        showEndMessage('Sem problemas! Estamos à sua disposição.');
    }

    function handleAluguelCheckConsumo() {
        // Se o usuário veio de "Sim", a mensagem 'Sim' já foi adicionada.
        // Se veio de "Não", a mensagem 'Sim' (para prosseguir) precisa ser adicionada.
        if (chatMessages.lastChild.textContent !== 'Sim') {
            addUserMessage('Sim');
        }
        
        clearOptions();
        addBotMessage('Excelente! Para saber se você tem direito à contratação, vou te fazer algumas perguntinhas. Primeiramente, o local possui um consumo de no mínimo 300 reais por mês em fatura?').then(() => {
            addOptions([
                { text: 'Sim', action: handleAluguelCheckTitular },
                { text: 'Não', action: handleAluguelEndNaoCumpre }
            ]);
        });
    }

    function handleAluguelEndNaoCumpre() {
        addUserMessage('Não');
        clearOptions();
        showEndMessage('Sinto muito, você não cumpre os requisitos.');
    }

    function handleAluguelCheckTitular() {
        addUserMessage('Sim');
        clearOptions();
        addBotMessage('Excelente! Você é o titular da fatura?').then(() => {
            addOptions([
                { text: 'Sim', action: handleAluguelShowForm },
                { text: 'Não', action: handleAluguelEndNaoTitular }
            ]);
        });
    }

    function handleAluguelEndNaoTitular() {
        addUserMessage('Não');
        clearOptions();
        showEndMessage('Sinto muito. Melhor pedir que o titular entre em contato conosco.');
    }

    function handleAluguelShowForm() {
        addUserMessage('Sim');
        clearOptions();
        addBotMessage('Maravilha. Preencha o formulário a Seguir para que nossa equipe técnica possa entrar em contato com você para Solicitar as informações necessárias para gerar uma proposta.').then(() => {
            addForm(FORM_ALUGUEL_TELHADO);
            addOptions([
                { text: 'Reiniciar Atendimento', action: startChat }
            ]);
        });
    }

    // --- Ramo 4: Suporte Aluguel ---
    function handleAluguelSuporte() {
        addUserMessage('Já aluguei meu telhado. Preciso de suporte.');
        clearOptions();
        addBotMessage('Muito bem, vamos lá! Para ter acesso ao suporte especializado, clique em contatar suporte no whatsapp.').then(() => {
            addOptions([
                { text: 'Contatar suporte no whatsapp', action: () => window.location.href = WA_SUPORTE_ALUGUEL }
            ]);
        });
    }


    // --- INICIALIZAÇÃO ---
    // Adiciona o evento de clique ao botão flutuante
    restartButton.onclick = startChat;
    
    // Inicia o chat quando a página carrega
    startChat();

});
