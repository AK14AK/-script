(function() {
  'use strict';

  const API_KEY = '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';

  let questionButtonsVisible = false;
  let controlPanelOpen = false;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    addStyles();
    setupEventListeners();
  }

  function addStyles() {
    if (document.getElementById('seb-hijack-styles')) return;

    const style = document.createElement('style');
    style.id = 'seb-hijack-styles';
    style.textContent = `
            .seb-control-panel {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                background: white !important;
                border: 2px solid #007bff !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
                width: 350px !important;
                padding: 20px !important;
                z-index: 999999 !important;
                font-family: Arial, sans-serif !important;
                display: none !important;
            }
            
            .seb-control-panel h2 {
                margin: 0 0 15px 0 !important;
                color: #333 !important;
                font-size: 18px !important;
            }
            
            .seb-control-panel input, .seb-control-panel button {
                width: 100% !important;
                padding: 8px !important;
                margin-bottom: 8px !important;
                border: 1px solid #ccc !important;
                border-radius: 4px !important;
                font-size: 14px !important;
                box-sizing: border-box !important;
            }
            
            .seb-control-panel button {
                cursor: pointer !important;
                color: white !important;
                border: none !important;
            }
            
            .seb-btn-primary { background: #007bff !important; }
            .seb-btn-success { background: #28a745 !important; }
            .seb-btn-warning { background: #ffc107 !important; color: black !important; }
            .seb-btn-danger { background: #dc3545 !important; }
            .seb-btn-secondary { background: #6c757d !important; }
            
            .seb-question-btn {
                position: absolute !important;
                width: 18px !important;
                height: 18px !important;
                background: #007bff !important;
                color: white !important;
                border: 2px solid white !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                z-index: 999998 !important;
                font-size: 12px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                opacity: 0.2 !important;
                transition: all 0.2s !important;
            }
            
            .seb-question-btn:hover {
                opacity:0.4 !important;
                transform: scale(1.1) !important;
            }
            
            .seb-question-btn.loading {
                background: #ffc107 !important;
                animation: seb-pulse 1s infinite !important;
            }
            
            .seb-question-btn.success {
                background: #28a745 !important;
            }
            
            .seb-question-btn.error {
                background: #dc3545 !important;
            }
            
            @keyframes seb-pulse {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
            }
            
            .seb-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0,0,0,0.3) !important;
                z-index: 999998 !important;
                display: none !important;
            }
        `;
    document.head.appendChild(style);
  }

  function setupEventListeners() {
    document.addEventListener('keydown', handleKeyPress, true);
    window.addEventListener('scroll', updateButtonPositions);
    window.addEventListener('resize', updateButtonPositions);
  }

  function handleKeyPress(event) {
    if (event.key === 'F9') {
      event.preventDefault();
      event.stopPropagation();
      toggleControlPanel();
    }

    if (event.altKey && event.key.toLowerCase() === 'q') {
      event.preventDefault();
      event.stopPropagation();
      toggleQuestionButtons();
    }

    if (event.altKey && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      event.stopPropagation();
      hideQuestionButtons();
    }
  }

  function toggleControlPanel() {
    if (controlPanelOpen) {
      closeControlPanel();
    } else {
      openControlPanel();
    }
  }

  function openControlPanel() {
    closeControlPanel();

    const overlay = document.createElement('div');
    overlay.className = 'seb-overlay';
    overlay.id = 'seb-overlay';

    const panel = document.createElement('div');
    panel.className = 'seb-control-panel';
    panel.id = 'seb-control-panel';
    panel.innerHTML = `
            <h2>SEB Hijack Control Panel</h2>
            <input type="text" id="seb-url-input" placeholder="Enter URL">
            <button class="seb-btn-success" id="seb-open-url">Open URL</button>
            <button class="seb-btn-warning" id="seb-toggle-questions">Toggle Question Buttons</button>
            <button class="seb-btn-danger" id="seb-exit">Exit SEB</button>
            <button class="seb-btn-secondary" id="seb-devtools">Developer Tools</button>
            <button class="seb-btn-secondary" id="seb-close">Close</button>
            <hr style="margin: 15px 0;">
            <p style="margin: 0; font-size: 12px; color: #666;">
                F9: Toggle Panel | Alt+Q: Toggle Buttons | Alt+Z: Hide Buttons
            </p>
        `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    panel.style.display = 'block';
    overlay.style.display = 'block';
    controlPanelOpen = true;

    document.getElementById('seb-close').onclick = closeControlPanel;
    document.getElementById('seb-open-url').onclick = openURL;
    document.getElementById('seb-toggle-questions').onclick = () => {
      toggleQuestionButtons();
      closeControlPanel();
    };
    document.getElementById('seb-exit').onclick = exitSEB;
    document.getElementById('seb-devtools').onclick = openDevTools;
    overlay.onclick = closeControlPanel;
    panel.onclick = (e) => e.stopPropagation();
  }

  function closeControlPanel() {
    const panel = document.getElementById('seb-control-panel');
    const overlay = document.getElementById('seb-overlay');
    if (panel) panel.remove();
    if (overlay) overlay.remove();
    controlPanelOpen = false;
  }

  function openURL() {
    const url = document.getElementById('seb-url-input').value.trim();
    if (!url) return;

    const fullUrl = url.startsWith('http') ? url : 'https://' + url;
    window.open(fullUrl, '_blank');
    closeControlPanel();
  }

  function exitSEB() {
    if (typeof CefSharp !== 'undefined') {
      CefSharp.PostMessage({
        type: 'exitSEB'
      });
    }
    closeControlPanel();
  }

  function openDevTools() {
    if (typeof CefSharp !== 'undefined') {
      CefSharp.PostMessage({
        type: 'devTools'
      });
    }
    closeControlPanel();
  }

  function toggleQuestionButtons() {
    if (questionButtonsVisible) {
      hideQuestionButtons();
    } else {
      showQuestionButtons();
    }
  }

  function showQuestionButtons() {
    hideQuestionButtons();

    const questions = findQuestions();
    questions.forEach((question, index) => {
      createQuestionButton(question, index);
    });

    questionButtonsVisible = true;
  }

  function hideQuestionButtons() {
    document.querySelectorAll('.seb-question-btn').forEach(btn => btn.remove());
    questionButtonsVisible = false;
  }

  function findQuestions() {
    const questions = [];

    // Find all question containers
    document.querySelectorAll('.que, .question').forEach(el => {
      if (el.textContent.trim().length > 30) {
        const hasInputs = el.querySelector('input[type="radio"], input[type="checkbox"], input[type="text"], textarea, select');
        if (hasInputs) {
          questions.push(el);
        }
      }
    });

    return questions.slice(0, 20);
  }

  function createQuestionButton(question, index) {
    const btn = document.createElement('button');
    btn.className = 'seb-question-btn';
    btn.textContent = '';
    btn.title = '';
    btn.dataset.questionIndex = index;

    positionButton(btn, question);

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      answerQuestion(question, btn);
    };

    document.body.appendChild(btn);
  }

  function positionButton(btn, question) {
    const rect = question.getBoundingClientRect();
    btn.style.left = (rect.right + window.scrollX + 5) + 'px';
    btn.style.top = (rect.top + window.scrollY + 5) + 'px';
  }

  function updateButtonPositions() {
    if (!questionButtonsVisible) return;

    const questions = findQuestions();
    document.querySelectorAll('.seb-question-btn').forEach((btn, index) => {
      if (questions[index]) {
        positionButton(btn, questions[index]);
      }
    });
  }

  async function answerQuestion(question, btn) {
    btn.classList.add('loading');
    btn.textContent = '';

    try {
      const questionData = extractFullQuestion(question);
      const answer = await getAIAnswer(questionData);

      if (answer) {
        fillAnswer(question, answer);
        btn.classList.remove('loading');
        btn.classList.add('success');
        btn.textContent = '';
      }
    } catch (error) {
      console.error('Answer error:', error);
      btn.classList.remove('loading');
      btn.classList.add('error');
      btn.textContent = '';
    }
  }

  function extractFullQuestion(element) {
    // Get question text
    const questionTextEl = element.querySelector('.qtext');
    const questionText = questionTextEl ? questionTextEl.textContent.trim() : '';

    // Get all options for multiple choice
    const options = [];
    element.querySelectorAll('[data-region="answer-label"]').forEach(label => {
      const optionText = label.textContent.trim();
      if (optionText) {
        options.push(optionText);
      }
    });

    // If no options found, try alternative selectors
    if (options.length === 0) {
      element.querySelectorAll('label').forEach(label => {
        const text = label.textContent.trim();
        if (text && text.length > 2) {
          options.push(text);
        }
      });
    }

    let fullQuestion = questionText;
    if (options.length > 0) {
      fullQuestion += '\n\nOptions:\n' + options.join('\n');
    }

    return fullQuestion;
  }

  async function getAIAnswer(questionText) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `Answer this quiz question. For multiple choice, respond with just the letter (a, b, c, or d). For text answers, give a brief response.\n\nQuestion: ${questionText}`
        }],
        max_tokens: 50,
        temperature: 0.1
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    return data.choices ? . [0] ? .message ? .content ? .trim();
  }

  function fillAnswer(question, answer) {
    console.log('Filling answer:', answer);

    // Text inputs
    const textInput = question.querySelector('input[type="text"], textarea');
    if (textInput) {
      textInput.value = answer;
      textInput.dispatchEvent(new Event('input', {
        bubbles: true
      }));
      textInput.dispatchEvent(new Event('change', {
        bubbles: true
      }));
      return;
    }

    // Radio buttons - improved matching
    const radios = question.querySelectorAll('input[type="radio"]:not([value="-1"])');
    if (radios.length > 0) {
      const answerLower = answer.toLowerCase().trim();

      for (let radio of radios) {
        const labelEl = document.querySelector(`[id="${radio.getAttribute('aria-labelledby')}"]`) ||
          radio.closest('label') ||
          radio.nextElementSibling;

        if (labelEl) {
          const labelText = labelEl.textContent.toLowerCase().trim();

          // Check for letter match (a, b, c, d)
          if (answerLower.match(/^[a-d]\.?\s*/) && labelText.includes(answerLower.charAt(0))) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change', {
              bubbles: true
            }));
            radio.dispatchEvent(new Event('click', {
              bubbles: true
            }));
            console.log('Selected radio by letter:', answerLower.charAt(0));
            return;
          }

          // Check for content match
          if (labelText.includes(answerLower.substring(0, 15)) ||
            answerLower.includes(labelText.substring(0, 15))) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change', {
              bubbles: true
            }));
            radio.dispatchEvent(new Event('click', {
              bubbles: true
            }));
            console.log('Selected radio by content match');
            return;
          }
        }
      }
    }

    // Checkboxes
    const checkboxes = question.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      const label = getInputLabel(checkbox);
      if (label && matchesAnswer(label, answer)) {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change', {
          bubbles: true
        }));
      }
    });

    // Select dropdowns
    const select = question.querySelector('select');
    if (select) {
      for (let option of select.options) {
        if (matchesAnswer(option.textContent, answer)) {
          select.value = option.value;
          select.dispatchEvent(new Event('change', {
            bubbles: true
          }));
          break;
        }
      }
    }
  }

  function getInputLabel(input) {
    return document.querySelector(`[id="${input.getAttribute('aria-labelledby')}"]`) ? .textContent ||
      input.closest('label') ? .textContent ||
      input.nextElementSibling ? .textContent ||
      '';
  }

  function matchesAnswer(text, answer) {
    const textLower = text.toLowerCase().trim();
    const answerLower = answer.toLowerCase().trim();

    return textLower.includes(answerLower.substring(0, 10)) ||
      answerLower.includes(textLower.substring(0, 10)) ||
      (answerLower.match(/^[a-d]/) && textLower.includes(answerLower.charAt(0)));
  }
})();
