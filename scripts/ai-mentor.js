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

        // Improved matching logic with scoring
        let bestMatch = null;
        let highestScore = 0;

        // Common stop words to ignore in fuzzy matching
        const stopWords = new Set(['what', 'is', 'are', 'do', 'does', 'did', 'can', 'could', 'should', 'would', 'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'me', 'my', 'we', 'us', 'it', 'this', 'that']);

        // Tokenize user input
        const userTokens = normalizedText.replace(/[?.,]/g, '').split(/\s+/);
        const importantUserTokens = userTokens.filter(t => !stopWords.has(t));

        INTERVIEW_QA.forEach(q => {
            const qText = q.question.toLowerCase().replace(/[?.,]/g, '');
            const qTokens = qText.split(/\s+/);
            const importantQTokens = qTokens.filter(t => !stopWords.has(t));

            let currentScore = 0;

            // 1. Exact phrase match (very high score)
            // Prioritize implementation of strict matches
            if (qText === normalizedText) currentScore += 100;
            if (normalizedText.includes(qText)) currentScore += 50;
            // Only give substring bonus if it's a significant match (not just one word like "what")
            if (qText.includes(normalizedText) && normalizedText.length > 5) currentScore += 50;

            // 2. Token overlap score (Fuzzy match)
            // Use important tokens for finding the best semantic match
            let matchedTokens = 0;

            if (importantUserTokens.length > 0) {
                importantUserTokens.forEach(uToken => {
                    const isDirectMatch = importantQTokens.includes(uToken);

                    if (isDirectMatch) {
                        matchedTokens += 1.0;
                    } else {
                        // Check for partial matches (e.g. "self" matching "yourself")
                        const partialMatch = importantQTokens.some(qToken =>
                            (qToken.includes(uToken) && uToken.length > 3) ||
                            (uToken.includes(qToken) && qToken.length > 3)
                        );
                        if (partialMatch) matchedTokens += 0.5;
                    }
                });

                // Calculate score based on percentage of IMPORTANT user words matched
                const coverageScore = (matchedTokens / importantUserTokens.length) * 20;
                currentScore += coverageScore;
            } else {
                // If no important tokens (e.g. "Who are you"), rely on basic tokens
                // but give them less weight
                userTokens.forEach(uToken => {
                    if (qTokens.includes(uToken)) matchedTokens += 0.5;
                });
                currentScore += matchedTokens;
            }

            if (currentScore > highestScore) {
                highestScore = currentScore;
                bestMatch = q;
            }
        });

        // Threshold for acceptance
        if (bestMatch && highestScore >= 10) {
            return bestMatch.answer;
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
