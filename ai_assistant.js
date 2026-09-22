/**
 * AI Study Assistant - Modern 3D AI Learning Assistant Script
 * Features:
 * - 3D Interactive Mascot (Cute AI Robot Tutor "Aura")
 * - Idle floating, blinking, head-tracking mouse cursor, bounce on message
 * - Glassmorphic chat widget window with entrance animations
 * - Suggested question chips ("Explain this topic", "Create a quiz", "Summarize my notes", "Help me solve this")
 * - Voice microphone visualizer & file attachment simulations
 * - Interactive quiz generation with live feedback
 * - Full Keyboard & ARIA Accessibility
 */

(function () {
  'use me strict';

  // Prevent multiple initializations
  if (document.getElementById('ai-study-assistant-root')) return;

  // DOM Container Setup
  const rootDiv = document.createElement('div');
  rootDiv.id = 'ai-study-assistant-root';
  document.body.appendChild(rootDiv);

  // State Management
  const state = {
    isOpen: false,
    isMinimized: false,
    isRecording: false,
    soundEnabled: true,
    attachedFile: null,
    messages: [
      {
        id: 1,
        sender: 'bot',
        text: '👋 Namaste! I am **Aura**, your 3D AI Study Assistant. What would you like to learn today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    mousePos: { x: 0, y: 0 }
  };

  // Sound Synth Generator (Web Audio API - lightweight audio feedback)
  function playBeepSound(type = 'msg') {
    if (!state.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'msg') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'pop') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  // 3D Avatar Robot Generator (SVG + Canvas dynamic 3D elements)
  function generate3DMascotSVG(idPrefix = 'widget') {
    return `
      <div class="ai-mascot-container" id="${idPrefix}-mascot-container">
        <div class="ai-mascot-3d ai-mascot-float" id="${idPrefix}-mascot-3d">
          <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Metallic Head Gradient -->
              <radialGradient id="${idPrefix}-head-grad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="35%" stop-color="#60a5fa"/>
                <stop offset="70%" stop-color="#1e3a8a"/>
                <stop offset="100%" stop-color="#0f172a"/>
              </radialGradient>

              <!-- Glowing Visor Gradient -->
              <linearGradient id="${idPrefix}-visor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f172a"/>
                <stop offset="50%" stop-color="#1e293b"/>
                <stop offset="100%" stop-color="#0284c7"/>
              </linearGradient>

              <!-- Cyan Eye Glow Filter -->
              <filter id="${idPrefix}-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>

            <!-- Floating Anti-Gravity Ring -->
            <ellipse cx="50" cy="88" rx="28" ry="6" fill="none" stroke="url(#${idPrefix}-head-grad)" stroke-width="2" opacity="0.6">
              <animate attributeName="ry" values="6;8;6" dur="3s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="50" cy="88" rx="18" ry="4" fill="#22d3ee" opacity="0.4" filter="url(#${idPrefix}-glow)"/>

            <!-- Robot Body Base -->
            <path d="M 32 62 C 32 55, 68 55, 68 62 L 64 78 C 64 82, 36 82, 36 78 Z" fill="url(#${idPrefix}-head-grad)"/>

            <!-- Heart AI Core Pulse -->
            <circle cx="50" cy="69" r="5" fill="#22d3ee" filter="url(#${idPrefix}-glow)">
              <animate attributeName="r" values="4;6.5;4" dur="1.8s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite"/>
            </circle>

            <!-- Robot Neck -->
            <rect x="44" y="50" width="12" height="6" rx="3" fill="#64748b"/>

            <!-- Robot Head Group (Interactive Mouse Tracking) -->
            <g id="${idPrefix}-head-group" transform="translate(0, 0)">
              <!-- Ears / Side Antennas -->
              <circle cx="21" cy="35" r="4" fill="#38bdf8" filter="url(#${idPrefix}-glow)"/>
              <circle cx="79" cy="35" r="4" fill="#38bdf8" filter="url(#${idPrefix}-glow)"/>

              <!-- Graduation Cap / Scholar Halo -->
              <polygon points="50,6 74,15 50,24 26,15" fill="#7c3aed" stroke="#a78bfa" stroke-width="1.5"/>
              <polygon points="50,15 58,18 50,21 42,18" fill="#c084fc"/>
              <rect x="46" y="19" width="8" height="6" fill="#4c1d95" rx="1"/>

              <!-- Head Outer Sphere -->
              <circle cx="50" cy="35" r="26" fill="url(#${idPrefix}-head-grad)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>

              <!-- Dark Glass Visor Screen -->
              <rect x="30" y="25" width="40" height="20" rx="9" fill="url(#${idPrefix}-visor-grad)" stroke="#38bdf8" stroke-width="1"/>

              <!-- Expressive Cyan LED Eyes -->
              <g id="${idPrefix}-eyes-group">
                <!-- Left Eye -->
                <ellipse cx="40" cy="35" rx="3.5" ry="5" fill="#22d3ee" filter="url(#${idPrefix}-glow)">
                  <animate id="${idPrefix}-blink1" attributeName="ry" values="5;5;0.5;5" keyTimes="0;0.9;0.95;1" dur="3.8s" repeatCount="indefinite"/>
                </ellipse>
                <!-- Right Eye -->
                <ellipse cx="60" cy="35" rx="3.5" ry="5" fill="#22d3ee" filter="url(#${idPrefix}-glow)">
                  <animate id="${idPrefix}-blink2" attributeName="ry" values="5;5;0.5;5" keyTimes="0;0.9;0.95;1" dur="3.8s" repeatCount="indefinite"/>
                </ellipse>
              </g>

              <!-- Visor Light Reflection -->
              <path d="M 33 27 Q 45 27 48 30 Q 37 31 33 27" fill="#ffffff" opacity="0.35"/>
            </g>
          </svg>
        </div>
      </div>
    `;
  }

  // Render Base HTML Structure into Page
  rootDiv.innerHTML = `
    <!-- Floating Launcher Widget Button -->
    <div class="ai-widget-launcher">
      <div class="ai-launcher-tooltip" id="ai-tooltip">
        Need study help? Ask Aura! 👋
      </div>
      <button class="ai-launcher-btn" id="ai-launcher-toggle" aria-label="Open 3D AI Study Assistant" aria-expanded="false">
        <div class="ai-status-badge"></div>
        ${generate3DMascotSVG('launcher')}
      </button>
    </div>

    <!-- Chat Dialog Window -->
    <div class="ai-chat-window" id="ai-chat-window" role="dialog" aria-label="AI Study Assistant Chat" aria-hidden="true">
      <!-- Header -->
      <div class="ai-chat-header">
        <div class="ai-header-info">
          <div class="ai-header-avatar">
            ${generate3DMascotSVG('header')}
          </div>
          <div class="ai-header-text">
            <h3>AI Study Assistant ✨</h3>
            <div class="ai-header-status">
              <span class="ai-header-dot"></span> Online • Ready to help
            </div>
          </div>
        </div>
        <div class="ai-header-actions">
          <button class="ai-icon-btn" id="ai-sound-btn" title="Toggle Sound" aria-label="Toggle Sound">
            🔊
          </button>
          <button class="ai-icon-btn" id="ai-minimize-btn" title="Minimize Chat" aria-label="Minimize Chat">
            —
          </button>
          <button class="ai-icon-btn" id="ai-close-btn" title="Close Chat" aria-label="Close Chat">
            ✕
          </button>
        </div>
      </div>

      <!-- Messages Body -->
      <div class="ai-chat-body" id="ai-chat-body">
        <!-- Welcome Card -->
        <div class="ai-welcome-card">
          <h4>🤖 Hi! I'm Aura, your 3D Tutor</h4>
          <p>I can help you understand topics, create practice quizzes, summarize lecture notes, or solve tough problems!</p>
        </div>

        <!-- Suggested Chips -->
        <div class="ai-suggested-chips-container">
          <div class="ai-chips-title">Suggested Quick Questions</div>
          <div class="ai-chips-grid">
            <button class="ai-chip-btn" data-question="Explain this topic">
              💡 Explain this topic
            </button>
            <button class="ai-chip-btn" data-question="Create a quiz">
              📝 Create a quiz
            </button>
            <button class="ai-chip-btn" data-question="Summarize my notes">
              📄 Summarize my notes
            </button>
            <button class="ai-chip-btn" data-question="Help me solve this">
              🧮 Help me solve this
            </button>
          </div>
        </div>

        <!-- Messages List Render Area -->
        <div id="ai-messages-list" style="display: flex; flex-direction: column; gap: 14px;"></div>
      </div>

      <!-- Attachment Preview Bar (hidden by default) -->
      <div id="ai-attachment-preview-container" style="display: none; padding: 0 18px;">
        <div class="ai-attachment-preview">
          <span id="ai-file-name">📎 note_file.pdf</span>
          <button id="ai-remove-file-btn" style="background:none; border:none; color:#ef4444; cursor:pointer;">✕</button>
        </div>
      </div>

      <!-- Input Footer -->
      <div class="ai-chat-footer">
        <form class="ai-input-form" id="ai-input-form">
          <button type="button" class="ai-input-action-btn" id="ai-attach-btn" title="Attach file or notes" aria-label="Attach file">
            📎
          </button>
          <input type="file" id="ai-file-input" style="display:none;" accept=".txt,.pdf,.png,.jpg,.doc" />

          <button type="button" class="ai-input-action-btn" id="ai-mic-btn" title="Voice Input" aria-label="Voice Input">
            🎙️
          </button>

          <input type="text" class="ai-chat-input" id="ai-chat-input" placeholder="Ask your AI tutor anything..." autocomplete="off" />

          <button type="submit" class="ai-send-btn" id="ai-send-btn" aria-label="Send message">
            🚀
          </button>
        </form>
      </div>
    </div>
  `;

  // Element References
  const launcherToggle = document.getElementById('ai-launcher-toggle');
  const chatWindow = document.getElementById('ai-chat-window');
  const closeBtn = document.getElementById('ai-close-btn');
  const minimizeBtn = document.getElementById('ai-minimize-btn');
  const soundBtn = document.getElementById('ai-sound-btn');
  const chatBody = document.getElementById('ai-chat-body');
  const messagesList = document.getElementById('ai-messages-list');
  const inputForm = document.getElementById('ai-input-form');
  const chatInput = document.getElementById('ai-chat-input');
  const tooltip = document.getElementById('ai-tooltip');
  const attachBtn = document.getElementById('ai-attach-btn');
  const fileInput = document.getElementById('ai-file-input');
  const fileContainer = document.getElementById('ai-attachment-preview-container');
  const fileNameSpan = document.getElementById('ai-file-name');
  const removeFileBtn = document.getElementById('ai-remove-file-btn');
  const micBtn = document.getElementById('ai-mic-btn');

  // Trigger External Website Buttons if Present
  const externalAiBtns = document.querySelectorAll('[data-testid="talk-to-ai-btn"], [data-testid="launch-ai-agent-btn"]');
  externalAiBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openChat();
    });
  });

  // Toggle Window State
  function openChat() {
    state.isOpen = true;
    chatWindow.classList.add('open');
    chatWindow.setAttribute('aria-hidden', 'false');
    launcherToggle.setAttribute('aria-expanded', 'true');
    tooltip.style.display = 'none';
    chatInput.focus();
    playBeepSound('pop');
    triggerMascotBounce();
  }

  function closeChat() {
    state.isOpen = false;
    chatWindow.classList.remove('open');
    chatWindow.setAttribute('aria-hidden', 'true');
    launcherToggle.setAttribute('aria-expanded', 'false');
    playBeepSound('pop');
  }

  launcherToggle.addEventListener('click', () => {
    if (state.isOpen) closeChat();
    else openChat();
  });

  closeBtn.addEventListener('click', closeChat);
  minimizeBtn.addEventListener('click', closeChat);

  // Sound Toggle
  soundBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    soundBtn.textContent = state.soundEnabled ? '🔊' : '🔇';
    soundBtn.title = state.soundEnabled ? 'Mute Sound' : 'Enable Sound';
  });

  // Trigger 3D Mascot Bounce Animation
  function triggerMascotBounce() {
    const mascotElements = document.querySelectorAll('.ai-mascot-3d');
    mascotElements.forEach(el => {
      el.classList.add('ai-mascot-bounce');
      setTimeout(() => el.classList.remove('ai-mascot-bounce'), 1200);
    });
  }

  // Interactive Head Tracking (Subtle 3D rotation following mouse cursor)
  document.addEventListener('mousemove', (e) => {
    if (!state.isOpen && Math.random() > 0.3) return;
    const launcherRect = launcherToggle.getBoundingClientRect();
    const centerX = launcherRect.left + launcherRect.width / 2;
    const centerY = launcherRect.top + launcherRect.height / 2;

    const deltaX = (e.clientX - centerX) / window.innerWidth;
    const deltaY = (e.clientY - centerY) / window.innerHeight;

    const moveX = Math.max(-10, Math.min(10, deltaX * 24));
    const moveY = Math.max(-8, Math.min(8, deltaY * 20));

    const headLauncher = document.getElementById('launcher-head-group');
    const headHeader = document.getElementById('header-head-group');

    if (headLauncher) {
      headLauncher.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX * 0.5}deg)`;
    }
    if (headHeader) {
      headHeader.style.transform = `translate(${moveX * 0.7}px, ${moveY * 0.7}px)`;
    }
  });

  // Render Messages List
  function renderMessages() {
    messagesList.innerHTML = '';
    state.messages.forEach(msg => {
      const msgRow = document.createElement('div');
      msgRow.className = `ai-message-row ${msg.sender}`;

      if (msg.sender === 'bot') {
        msgRow.innerHTML = `
          <div class="ai-msg-avatar">
            ${generate3DMascotSVG(`msg-${msg.id}`)}
          </div>
          <div>
            <div class="ai-msg-bubble">${formatText(msg.text)}</div>
            <span class="ai-msg-time">${msg.time}</span>
          </div>
        `;
      } else {
        msgRow.innerHTML = `
          <div>
            <div class="ai-msg-bubble">${escapeHTML(msg.text)}</div>
            <span class="ai-msg-time">${msg.time}</span>
          </div>
        `;
      }
      messagesList.appendChild(msgRow);
    });

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Formatting Helper for Markdown / Code / Lists
  function formatText(text) {
    let formatted = escapeHTML(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px; font-family:monospace; color:#22d3ee;">$1</code>')
      .replace(/\n/g, '<br>');
    return formatted;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Handle Suggested Chip Click
  document.querySelectorAll('.ai-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.getAttribute('data-question');
      handleUserSendMessage(question);
    });
  });

  // Handle Send Message
  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text && !state.attachedFile) return;
    handleUserSendMessage(text);
    chatInput.value = '';
  });

  function handleUserSendMessage(userText) {
    if (!userText && state.attachedFile) {
      userText = `Uploaded document: ${state.attachedFile.name}`;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    state.messages.push({
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: time
    });

    // Clear attached file if present
    if (state.attachedFile) {
      state.attachedFile = null;
      fileContainer.style.display = 'none';
    }

    renderMessages();
    playBeepSound('msg');

    // Show Typing Indicator
    showTypingIndicator();

    // Generate Intelligent Response after slight delay
    setTimeout(() => {
      removeTypingIndicator();
      const botResponse = generateAIAnswer(userText);
      state.messages.push({
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      renderMessages();

      // If response includes interactive quiz, append quiz box
      if (botResponse.quiz) {
        appendInteractiveQuiz(botResponse.quiz);
      }

      playBeepSound('msg');
      triggerMascotBounce();
    }, 1000);
  }

  // Typing Indicator Logic
  function showTypingIndicator() {
    removeTypingIndicator();
    const typingRow = document.createElement('div');
    typingRow.id = 'ai-typing-row';
    typingRow.className = 'ai-message-row bot';
    typingRow.innerHTML = `
      <div class="ai-msg-avatar">${generate3DMascotSVG('typing')}</div>
      <div class="ai-typing-indicator">
        <div class="ai-typing-dot"></div>
        <div class="ai-typing-dot"></div>
        <div class="ai-typing-dot"></div>
      </div>
    `;
    messagesList.appendChild(typingRow);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('ai-typing-row');
    if (el) el.remove();
  }

  // AI Knowledge Base & Simulated Intelligent Tutor Responses
  function generateAIAnswer(query) {
    const q = query.toLowerCase();

    if (q.includes('quiz') || q.includes('create a quiz')) {
      return {
        text: "🎯 Here is a quick practice quiz for you! Test your knowledge below:",
        quiz: {
          question: "Which data structure operates on a First-In, First-Out (FIFO) basis?",
          options: ["A) Stack", "B) Queue", "C) Tree", "D) Graph"],
          correct: 1,
          explanation: "Correct! A **Queue** follows FIFO (First-In, First-Out) order, just like a real-world standing queue."
        }
      };
    }

    if (q.includes('explain') || q.includes('explain this topic')) {
      return {
        text: "📘 **Topic Breakdown Concept:**\n\n1. **Core Idea**: Every complex concept can be broken into simple building blocks.\n2. **Analogy**: Imagine building a house — foundations come first, then bricks, then roof.\n3. **Key Takeaway**: Focus on understanding *why* a formula or rule exists, rather than just memorizing it!\n\nWould you like me to explain Physics, Computer Science, or Mathematics next?"
      };
    }

    if (q.includes('summarize') || q.includes('summarize my notes')) {
      return {
        text: "📝 **Smart Note Summary Generator:**\n\n• **Main Concept**: Key keypoints extracted from your study material.\n• **High-Yield Facts**: High probability exam topics highlighted.\n• **Action Items**: 3 recommended review questions to test your memory tonight."
      };
    }

    if (q.includes('solve') || q.includes('help me solve this')) {
      return {
        text: "🧮 **Step-by-Step Solver Mode:**\n\n1. **Identify Given Values**: Read the problem carefully and list variables.\n2. **Select Formula**: Choose the matching theorem or equation.\n3. **Execute & Verify**: Substitute numbers and verify unit dimensions.\n\n*Paste your exact equation or problem statement here and I will step through it!*"
      };
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('namaste')) {
      return {
        text: "Hello there! 👋 How can I support your study session today? Feel free to click any of the suggested topics or type your question below!"
      };
    }

    return {
      text: `Great question about "${escapeHTML(query)}"! As your AI Study Assistant, I recommend reviewing the main definitions first, practicing 2 example problems, and testing yourself with flashcards. Would you like me to generate a practice quiz on this topic?`
    };
  }

  // Append Interactive Quiz UI
  function appendInteractiveQuiz(quizData) {
    const quizDiv = document.createElement('div');
    quizDiv.className = 'ai-quiz-box';
    quizDiv.innerHTML = `
      <div style="font-weight:700; font-size:13px; color:#f8fafc; margin-bottom:8px;">${quizData.question}</div>
      ${quizData.options.map((opt, index) => `
        <button class="ai-quiz-opt" data-opt-index="${index}">${opt}</button>
      `).join('')}
      <div class="ai-quiz-feedback" style="display:none; margin-top:10px; font-size:12px;"></div>
    `;

    const lastBotMsg = messagesList.lastElementChild;
    if (lastBotMsg) {
      lastBotMsg.querySelector('.ai-msg-bubble').appendChild(quizDiv);
    }

    const optBtns = quizDiv.querySelectorAll('.ai-quiz-opt');
    const feedbackDiv = quizDiv.querySelector('.ai-quiz-feedback');

    optBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = parseInt(btn.getAttribute('data-opt-index'));
        optBtns.forEach(b => b.disabled = true);

        if (selected === quizData.correct) {
          btn.classList.add('correct');
          feedbackDiv.style.display = 'block';
          feedbackDiv.style.color = '#34d399';
          feedbackDiv.innerHTML = `🎉 ${quizData.explanation}`;
          triggerMascotBounce();
        } else {
          btn.classList.add('wrong');
          optBtns[quizData.correct].classList.add('correct');
          feedbackDiv.style.display = 'block';
          feedbackDiv.style.color = '#fca5a5';
          feedbackDiv.innerHTML = `❌ Not quite! ${quizData.explanation}`;
        }
      });
    });
  }

  // File Attachment Handling
  attachBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      state.attachedFile = e.target.files[0];
      fileNameSpan.textContent = `📎 ${state.attachedFile.name}`;
      fileContainer.style.display = 'block';
    }
  });
  removeFileBtn.addEventListener('click', () => {
    state.attachedFile = null;
    fileContainer.style.display = 'none';
    fileInput.value = '';
  });

  // Voice Recording Microphone Simulation
  micBtn.addEventListener('click', () => {
    state.isRecording = !state.isRecording;
    if (state.isRecording) {
      micBtn.classList.add('recording');
      micBtn.title = "Stop Recording";
      chatInput.placeholder = "Listening to your voice... 🎙️";
      playBeepSound('pop');
    } else {
      micBtn.classList.remove('recording');
      micBtn.title = "Voice Input";
      chatInput.placeholder = "Ask your AI tutor anything...";
      chatInput.value = "Can you explain how photosynthesis works?";
      playBeepSound('pop');
    }
  });

  // Keyboard Accessibility (Esc to close window)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isOpen) {
      closeChat();
    }
  });

  // Initial Render
  renderMessages();

})();
