/**
 * AI Mentor Logic
 * Handles chat interface instantiation and interaction.
 */

import { INTERVIEW_QA } from './questions-data.js';

export function initAiMentor(container) {
    if (!container) return;

    // Inject the Chat Interface HTML
    container.innerHTML = `
        <div class="chat-container">
            <div class="chat-header">
                <i class="fas fa-robot text-primary fa-lg"></i>
                <div>
                    <h4>AI Mentor</h4>
                    <span class="text-muted small">Ask me about your interview performance</span>
                </div>
            </div>
            
            <div class="chat-messages" id="ai-chat-messages">
                <div class="message ai">
                    Hello! I'm your AI Mentor. I can help you practice for your interview with common questions. Type "list" to see what I can ask, or just ask me a question like "Tell me about yourself".
                </div>
                <div class="typing-indicator" id="ai-typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>

            <div class="chat-input-area">
                <textarea id="ai-chat-input" placeholder="Type your message..." rows="1"></textarea>
                <button id="ai-chat-send-btn" class="chat-send-btn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;

    // Initialize Event Listeners
    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send-btn');
    const messagesContainer = document.getElementById('ai-chat-messages');

    if (input && sendBtn) {
        // Auto-resize textarea
        input.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            if (this.value === '') this.style.height = 'auto';
        });

        // Send on Enter (shifted for new line)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        sendBtn.addEventListener('click', sendMessage);
    }

    // API Key removed. Using local Q&A database.

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // 1. Add User Message
        appendMessage(text, 'user');
        input.value = '';
        input.style.height = 'auto';

        // 2. Show Typing Indicator
        showTyping(true);

        // 3. Get Local Response
        // Simulate network delay for realism
        setTimeout(() => {
            const response = getLocalResponse(text);
            showTyping(false);
            appendMessage(response, 'ai');
        }, 500 + Math.random() * 500);
    }

    function getLocalResponse(text) {
        const normalizedText = text.toLowerCase().trim();

        // Check for "list" command
        if (normalizedText === 'list' || normalizedText.includes('show questions') || normalizedText.includes('help')) {
            const list = INTERVIEW_QA.map(q => `• ${q.question}`).join('\n');
            return "Here are the questions I can answer:\n\n" + list;
        }

        // Find matching question
        // 1. Check if user text contains the question (e.g. "Can you answer Tell me about yourself")
        // 2. Check if question contains the user text (e.g. "Strengths") - requires minimum length to avoid matching "the"
        const matched = INTERVIEW_QA.find(q => {
            const qText = q.question.toLowerCase().replace(/[?.,]/g, '');
            const uText = normalizedText.replace(/[?.,]/g, '');
            return uText.includes(qText) || (uText.length > 5 && qText.includes(uText));
        });

        if (matched) {
            return matched.answer;
        }

        return "I'm not sure about that one yet. I can only answer specific interview questions from my list. Type 'list' to see what I can answer.";
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;

        // Use innerHTML for AI messages to support basic formatting if needed, 
        // but be careful with XSS if using it generally. 
        // For now, let's parse markdown-like bolding **text** to <b>text</b> for better display?
        // Or just keep textContent for safety. Let's stick to textContent but handle newlines.
        msgDiv.textContent = text;
        msgDiv.style.whiteSpace = "pre-wrap"; // Preserve newlines

        // Insert before typing indicator
        const typingIndicator = document.getElementById('ai-typing-indicator');
        messagesContainer.insertBefore(msgDiv, typingIndicator);

        scrollToBottom();
    }

    function updateTypingStatus(text) {
        const indicator = document.getElementById('ai-typing-indicator');
        if (indicator) {
            let status = indicator.querySelector('.typing-status');
            if (!status) {
                status = document.createElement('span');
                status.className = 'typing-status text-muted small ms-2';
                indicator.appendChild(status);
            }
            status.textContent = text;
        }
    }

    function showTyping(show) {
        const indicator = document.getElementById('ai-typing-indicator');
        if (indicator) {
            indicator.style.display = show ? 'flex' : 'none';
            // Clear status on show/hide
            const status = indicator.querySelector('.typing-status');
            if (status) status.textContent = '';

            if (show) scrollToBottom();
        }
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}
