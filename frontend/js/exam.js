/**
 * Mockly — Live Exam Interface Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- MOCK DATA ---
    const examData = {
        title: "SSC CGL TIER 1 - Full Mock Series",
        durationMinutes: 60,
        sections: [
            {
                id: "sec1",
                name: "General Intelligence",
                questions: [
                    {
                        id: "q1",
                        text: "In a certain code language, 'COMPUTER' is written as 'RFUVQNPC'. How will 'MEDICINE' be written in that language?",
                        options: ["EOJDJEFM", "EOJDEJFM", "MFEJDJOE", "MFEDJJOE"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q2",
                        text: "Select the related word/letters/number from the given alternatives.<br>Brain : Nervous :: ? : ?",
                        options: ["Heart : Blood", "Eye : Sight", "Liver : Excretory", "Kidney : Excretory"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q3",
                        text: "Find the odd one out.",
                        options: ["Square", "Rectangle", "Cylinder", "Triangle"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q4",
                        text: "If A is the brother of B, C is the father of A, D is the brother of E, and E is the daughter of B, then who is the uncle of D?",
                        options: ["A", "B", "C", "E"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q5",
                        text: "Select the missing number from the given responses.<br>3, 6, 12, 21, ?, 48",
                        options: ["31", "33", "34", "36"],
                        positive: 2.0,
                        negative: 0.5
                    }
                ]
            },
            {
                id: "sec2",
                name: "General Awareness",
                questions: [
                    {
                        id: "q6",
                        text: "Who was the first female Governor of an Indian state?",
                        options: ["Sucheta Kripalani", "Sarojini Naidu", "Indira Gandhi", "Vijaya Lakshmi Pandit"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q7",
                        text: "The article of the Indian Constitution related to the Abolition of Untouchability is:",
                        options: ["Article 15", "Article 16", "Article 17", "Article 18"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q8",
                        text: "Which of the following is known as the 'Suicide bag' of the cell?",
                        options: ["Lysosome", "Ribosome", "Mitochondria", "Golgi body"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q9",
                        text: "What is the SI unit of electric current?",
                        options: ["Volt", "Watt", "Ohm", "Ampere"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q10",
                        text: "Who wrote the famous book 'Poverty and Un-British Rule in India'?",
                        options: ["R.C. Dutt", "Dadabhai Naoroji", "Mahatma Gandhi", "Jawaharlal Nehru"],
                        positive: 2.0,
                        negative: 0.5
                    }
                ]
            },
            {
                id: "sec3",
                name: "Quantitative Aptitude",
                questions: [
                    {
                        id: "q11",
                        text: "If 20% of a = b, then b% of 20 is the same as:",
                        options: ["4% of a", "5% of a", "20% of a", "None of these"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q12",
                        text: "A sum of money doubles itself in 8 years at simple interest. What is the rate of interest?",
                        options: ["10%", "12.5%", "15%", "20%"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q13",
                        text: "The ratio of the ages of A and B is 3:4. Four years ago, the ratio was 5:7. Find the present age of A.",
                        options: ["24 years", "18 years", "20 years", "30 years"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q14",
                        text: "A train running at a speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
                        options: ["120 metres", "180 metres", "324 metres", "150 metres"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q15",
                        text: "The price of commodity X increases by 40 p every year, while the price of commodity Y increases by 15 p every year. If in 2001, the price of X was Rs. 4.20 and that of Y was Rs. 6.30, in which year will commodity X cost 40 p more than commodity Y?",
                        options: ["2010", "2011", "2012", "2013"],
                        positive: 2.0,
                        negative: 0.5
                    }
                ]
            },
            {
                id: "sec4",
                name: "English Comprehension",
                questions: [
                    {
                        id: "q16",
                        text: "Select the most appropriate synonym of the given word: <b>ABUNDANT</b>",
                        options: ["Plentiful", "Scarce", "Sparse", "Minimal"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q17",
                        text: "Identify the segment which contains a grammatical error: <br>'She did not wrote the letter to her friend.'",
                        options: ["She did not", "wrote the letter", "to her", "friend"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q18",
                        text: "Select the correctly spelt word.",
                        options: ["Accomodation", "Accommodation", "Acommodation", "Accomodation"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q19",
                        text: "Select the most appropriate antonym of the given word: <b>HOSTILE</b>",
                        options: ["Unfriendly", "Adverse", "Amiable", "Aggressive"],
                        positive: 2.0,
                        negative: 0.5
                    },
                    {
                        id: "q20",
                        text: "Choose the correct meaning of the idiom: <b>'To beat around the bush'</b>",
                        options: ["To cut down trees", "To avoid coming to the point", "To search for something thoroughly", "To speak frankly"],
                        positive: 2.0,
                        negative: 0.5
                    }
                ]
            }
        ]
    };

    // --- STATE MANAGEMENT ---
    let currentSectionIndex = 0;
    let currentQuestionIndex = 0;
    
    // Status definitions: 'not-visited', 'not-answered', 'answered', 'marked', 'marked-answered'
    // Format: userAnswers[sectionId][questionId] = { selectedOptionIndex: number | null, status: string }
    const userAnswers = {};

    // Initialize state
    examData.sections.forEach(sec => {
        userAnswers[sec.id] = {};
        sec.questions.forEach((q, idx) => {
            userAnswers[sec.id][q.id] = {
                selectedOptionIndex: null,
                status: idx === 0 && sec.id === examData.sections[0].id ? 'not-answered' : 'not-visited' // First question is visited initially
            };
        });
    });

    // --- DOM ELEMENTS ---
    const timeDisplay = document.getElementById('time-left');
    const timerBox = document.querySelector('.timer-box');
    const sectionTabsContainer = document.getElementById('section-tabs');
    const qNumberDisplay = document.getElementById('q-number-display');
    const qTextDisplay = document.getElementById('question-text');
    const qOptionsContainer = document.getElementById('question-options');
    const paletteGrid = document.getElementById('palette-grid');
    const paletteSectionName = document.getElementById('palette-section-name');

    // Buttons
    const btnSaveNext = document.getElementById('btn-save-next');
    const btnMarkReview = document.getElementById('btn-mark-review');
    const btnClearResponse = document.getElementById('btn-clear-response');
    const btnSubmitTest = document.getElementById('btn-submit-test');

    // Summary Elements
    const countAnswered = document.getElementById('count-answered');
    const countNotAnswered = document.getElementById('count-not-answered');
    const countNotVisited = document.getElementById('count-not-visited');
    const countMarked = document.getElementById('count-marked');
    const countMarkedAnswered = document.getElementById('count-marked-answered');

    // Modal
    const submitModal = document.getElementById('submit-modal');
    const btnCancelSubmit = document.getElementById('btn-cancel-submit');
    const btnConfirmSubmit = document.getElementById('btn-confirm-submit');

    // --- INIT ---
    document.getElementById('exam-title').innerText = examData.title;
    renderSections();
    loadQuestion(0, 0);
    startTimer(examData.durationMinutes * 60);

    // --- TIMER LOGIC ---
    let timerInterval;
    function startTimer(durationInSeconds) {
        let timer = durationInSeconds;
        
        const updateTimer = () => {
            let minutes = parseInt(timer / 60, 10);
            let seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            timeDisplay.textContent = minutes + ":" + seconds;

            if (timer <= 300) { // 5 minutes warning
                timerBox.classList.add('warning');
            }

            if (--timer < 0) {
                clearInterval(timerInterval);
                submitExam(true); // Auto submit
            }
        };

        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // --- RENDERING ---
    function renderSections() {
        sectionTabsContainer.innerHTML = '';
        examData.sections.forEach((sec, idx) => {
            const btn = document.createElement('button');
            btn.className = `section-tab ${idx === currentSectionIndex ? 'active' : ''}`;
            btn.innerText = sec.name;
            btn.onclick = () => switchSection(idx);
            sectionTabsContainer.appendChild(btn);
        });
        paletteSectionName.innerText = examData.sections[currentSectionIndex].name;
    }

    function renderPalette() {
        paletteGrid.innerHTML = '';
        const currentSec = examData.sections[currentSectionIndex];
        
        currentSec.questions.forEach((q, idx) => {
            const state = userAnswers[currentSec.id][q.id];
            const btn = document.createElement('button');
            
            let classes = ['grid-btn', state.status];
            if (idx === currentQuestionIndex) classes.push('current');
            
            btn.className = classes.join(' ');
            btn.innerText = idx + 1;
            btn.onclick = () => loadQuestion(currentSectionIndex, idx);
            
            paletteGrid.appendChild(btn);
        });

        updateLegend();
    }

    function updateLegend() {
        let answered = 0, notAnswered = 0, notVisited = 0, marked = 0, markedAns = 0;
        
        examData.sections.forEach(sec => {
            sec.questions.forEach(q => {
                const status = userAnswers[sec.id][q.id].status;
                if (status === 'answered') answered++;
                else if (status === 'not-answered') notAnswered++;
                else if (status === 'not-visited') notVisited++;
                else if (status === 'marked') marked++;
                else if (status === 'marked-answered') markedAns++;
            });
        });

        countAnswered.innerText = answered;
        countNotAnswered.innerText = notAnswered;
        countNotVisited.innerText = notVisited;
        countMarked.innerText = marked;
        countMarkedAnswered.innerText = markedAns;

        // Also update modal numbers
        document.getElementById('summary-answered').innerText = answered;
        document.getElementById('summary-not-answered').innerText = notAnswered;
        document.getElementById('summary-marked').innerText = marked + markedAns;
        document.getElementById('summary-not-visited').innerText = notVisited;
    }

    function loadQuestion(secIdx, qIdx) {
        currentSectionIndex = secIdx;
        currentQuestionIndex = qIdx;

        const sec = examData.sections[secIdx];
        const q = sec.questions[qIdx];
        const state = userAnswers[sec.id][q.id];

        // Trigger enter animation
        const qBodyContainer = document.querySelector('.question-body-container');
        if (qBodyContainer) {
            qBodyContainer.classList.remove('animate-enter');
            void qBodyContainer.offsetWidth; // trigger reflow
            qBodyContainer.classList.add('animate-enter');
        }

        // Update status if it was not-visited
        if (state.status === 'not-visited') {
            state.status = 'not-answered';
        }

        qNumberDisplay.innerText = `Question ${qIdx + 1}`;
        qTextDisplay.innerHTML = q.text;

        qOptionsContainer.innerHTML = '';
        q.options.forEach((optText, optIdx) => {
            const row = document.createElement('div');
            row.className = `option-row ${state.selectedOptionIndex === optIdx ? 'selected' : ''}`;
            
            row.innerHTML = `
                <div class="option-input"></div>
                <div class="option-text">${optText}</div>
            `;

            row.onclick = () => selectOption(optIdx);
            qOptionsContainer.appendChild(row);
        });

        renderSections();
        renderPalette();
    }

    function switchSection(idx) {
        if (idx === currentSectionIndex) return;
        loadQuestion(idx, 0); // Load first question of new section
    }

    // --- INTERACTIONS ---
    function selectOption(optIdx) {
        const sec = examData.sections[currentSectionIndex];
        const q = sec.questions[currentQuestionIndex];
        const state = userAnswers[sec.id][q.id];

        // Toggle if clicked again
        if (state.selectedOptionIndex === optIdx) {
            state.selectedOptionIndex = null;
        } else {
            state.selectedOptionIndex = optIdx;
        }

        // Re-render options to show selection
        const rows = qOptionsContainer.querySelectorAll('.option-row');
        rows.forEach((r, i) => {
            if (i === state.selectedOptionIndex) r.classList.add('selected');
            else r.classList.remove('selected');
        });
    }

    function goToNextQuestion() {
        const sec = examData.sections[currentSectionIndex];
        if (currentQuestionIndex < sec.questions.length - 1) {
            loadQuestion(currentSectionIndex, currentQuestionIndex + 1);
        } else if (currentSectionIndex < examData.sections.length - 1) {
            loadQuestion(currentSectionIndex + 1, 0);
        } else {
            // End of exam
            renderPalette();
        }
    }

    btnSaveNext.onclick = () => {
        const sec = examData.sections[currentSectionIndex];
        const q = sec.questions[currentQuestionIndex];
        const state = userAnswers[sec.id][q.id];

        if (state.selectedOptionIndex !== null) {
            state.status = 'answered';
        } else {
            state.status = 'not-answered';
        }

        goToNextQuestion();
    };

    btnMarkReview.onclick = () => {
        const sec = examData.sections[currentSectionIndex];
        const q = sec.questions[currentQuestionIndex];
        const state = userAnswers[sec.id][q.id];

        if (state.selectedOptionIndex !== null) {
            state.status = 'marked-answered';
        } else {
            state.status = 'marked';
        }

        goToNextQuestion();
    };

    btnClearResponse.onclick = () => {
        const sec = examData.sections[currentSectionIndex];
        const q = sec.questions[currentQuestionIndex];
        const state = userAnswers[sec.id][q.id];

        state.selectedOptionIndex = null;
        state.status = 'not-answered';
        
        loadQuestion(currentSectionIndex, currentQuestionIndex);
    };

    // --- SUBMISSION ---
    btnSubmitTest.onclick = () => {
        updateLegend();
        submitModal.style.display = 'flex';
    };

    btnCancelSubmit.onclick = () => {
        submitModal.style.display = 'none';
    };

    btnConfirmSubmit.onclick = () => {
        submitExam(false);
    };

    function submitExam(isAuto = false) {
        clearInterval(timerInterval);
        submitModal.style.display = 'none';
        
        if (isAuto) {
            alert("Time is up! Your exam has been automatically submitted. Taking you to results...");
        } else {
            alert("Exam submitted successfully! Taking you to results...");
        }
        
        // In a real app, redirect to results page
        // window.location.href = "results.html";
    }

});
