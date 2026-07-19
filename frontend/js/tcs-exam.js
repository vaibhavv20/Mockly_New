/**
 * TCS iON Exam Engine Replica Logic
 */

// --- Exam State & Config ---
let paperConfig = null;
let currentSectionIdx = 0;
let currentQuestionIdx = 0;
let answersData = {}; // map of qId -> { status, selectedOpt, lang }

// Timers
let globalTimerInterval = null;
let sectionTimerInterval = null;
let globalSecondsLeft = 0;
let sectionSecondsLeft = 0;

let currentQStartTime = 0;
let currentQTimerInterval = null;

// --- Real Data Setup ---
let rawMockQuestions = {}; // Will hold question details fetched from API

function parseApiDataToEngineFormat(apiPaper) {
    // 1. Build the mockQuestions object dictionary
    rawMockQuestions = {};
    const formattedSections = [];
    
    apiPaper.sections.forEach((sec, idx) => {
        const questionIds = [];
        sec.questions.forEach(q => {
            const qId = q._id;
            questionIds.push(qId);
            
            rawMockQuestions[qId] = {
                text: { 
                    english: q.questionText?.english || 'Question text missing.',
                    hindi: q.questionText?.hindi || 'प्रश्न उपलब्ध नहीं है।'
                },
                image: q.questionImage || { english: '', hindi: '' },
                options: q.options.map(opt => ({
                    e: opt.english || '',
                    h: opt.hindi || '',
                    img: opt.image || ''
                })),
                correctOptionIndex: q.correctOptionIndex,
                solution: q.solution || {},
                marks: q.marks,
                negativeMarks: q.negativeMarks
            };
        });
        
        formattedSections.push({
            id: `sec${idx}`,
            name: sec.name,
            durationMinutes: sec.duration || (apiPaper.duration / apiPaper.sections.length),
            questions: questionIds
        });
    });

    // 2. Build the paperConfig
    return {
        _id: apiPaper._id,
        title: apiPaper.title,
        candidateName: 'John Doe', // TODO: Get from auth token later
        totalDurationMinutes: apiPaper.duration,
        hasSectionalTimer: apiPaper.paperType === 'Sectional' || (formattedSections[0].durationMinutes < apiPaper.duration),
        strictNavigation: apiPaper.navigationType === 'strict',
        sections: formattedSections
    };
}

// --- Pre-Exam Instructions Logic ---
document.getElementById('declarationCheck').addEventListener('change', function(e) {
    document.getElementById('btn-ready').disabled = !e.target.checked;
});

function showInstPage1() {
    document.getElementById('inst-page-1').style.display = 'block';
    document.getElementById('inst-page-config').style.display = 'none';
    document.getElementById('inst-page-2').style.display = 'none';
}

function showInstConfigPage() {
    document.getElementById('inst-page-1').style.display = 'none';
    document.getElementById('inst-page-config').style.display = 'block';
    document.getElementById('inst-page-2').style.display = 'none';
}

function showInstPage2() {
    document.getElementById('inst-page-1').style.display = 'none';
    document.getElementById('inst-page-config').style.display = 'none';
    document.getElementById('inst-page-2').style.display = 'block';
}

// --- Init & Start ---
window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const paperId = urlParams.get('id');

    if (!paperId) {
        alert("Invalid Test ID! Redirecting to Dashboard.");
        window.location.href = "ssc-cgl.html";
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Not logged in");

        const response = await fetch(`http://localhost:5000/api/papers/${paperId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (!data.success || !data.paper) {
            console.error("Backend Error:", data);
            alert(`Error loading test from backend. ID: ${paperId}, Msg: ${data.message || 'Unknown'}`);
            return;
        }

        // Convert the MongoDB schema into the engine's internal format
        paperConfig = parseApiDataToEngineFormat(data.paper);

        // Populate Instruction text
        document.getElementById('inst-cand-name').innerText = paperConfig.candidateName;
        document.getElementById('inst-duration').innerText = paperConfig.totalDurationMinutes;
        document.getElementById('examTitle').innerText = paperConfig.title;
        
        let totalQs = 0;
        paperConfig.sections.forEach(sec => totalQs += sec.questions.length);
        document.getElementById('inst-total-qs').innerText = totalQs;

        // Populate Config UI
        const orderContainer = document.getElementById('sectionOrderContainer');
        orderContainer.innerHTML = '';
        paperConfig.sections.forEach((sec, idx) => {
            let optionsHtml = '';
            for(let i=0; i<paperConfig.sections.length; i++) {
                optionsHtml += `<option value="${i}" ${i === idx ? 'selected' : ''}>Position ${i+1}</option>`;
            }
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            div.style.padding = '8px 12px';
            div.style.background = '#fff';
            div.style.border = '1px solid #ccc';
            div.style.borderRadius = '4px';
            div.innerHTML = `
                <span style="font-weight: 600;">${sec.name}</span>
                <select class="section-order-select" data-original-idx="${idx}" style="padding: 4px 8px; border-radius: 4px; border: 1px solid #ccc;">
                    ${optionsHtml}
                </select>
            `;
            orderContainer.appendChild(div);
        });

    } catch (e) {
        console.error(e);
        alert("Server connection failed. Make sure the backend is running on port 5000.");
    }
};

let isSectionalTimingEnabled = false;

function startExam() {
    isSectionalTimingEnabled = document.getElementById('enableSectionalTimer').checked;
    
    // Reorder Sections
    const selects = document.querySelectorAll('.section-order-select');
    let orderArray = [];
    selects.forEach(sel => {
        orderArray.push({
            originalIdx: parseInt(sel.getAttribute('data-original-idx')),
            pos: parseInt(sel.value)
        });
    });
    orderArray.sort((a, b) => a.pos - b.pos);
    
    let newSections = [];
    orderArray.forEach(item => {
        newSections.push(paperConfig.sections[item.originalIdx]);
    });
    paperConfig.sections = newSections;

    document.getElementById('instructions-screen').classList.remove('active');
    document.getElementById('exam-screen').style.display = 'flex';
    
    document.getElementById('exam-cand-name').innerText = paperConfig.candidateName;
    document.getElementById('left-cand-name').innerText = paperConfig.candidateName;

    // Init state (or restore)
    const savedStateStr = localStorage.getItem(`exam_state_${paperConfig._id}`);
    if (savedStateStr && confirm("We found a saved exam session. Do you want to resume?")) {
        const savedState = JSON.parse(savedStateStr);
        answersData = savedState.answersData;
        globalSecondsLeft = savedState.globalSecondsLeft;
        
        if (isSectionalTimingEnabled && savedState.hasSectionalTimer) {
            sectionSecondsLeft = savedState.sectionSecondsLeft;
            currentSectionIdx = savedState.currentSectionIdx;
        } else {
            currentSectionIdx = savedState.currentSectionIdx;
        }
        
        currentQuestionIdx = savedState.currentQuestionIdx;
    } else {
        paperConfig.sections.forEach(sec => {
            sec.questions.forEach(qId => {
                answersData[qId] = { status: 'not_visited', selectedOpt: null, lang: document.getElementById('instLangSelect').value, timeSpent: 0 };
            });
        });
        globalSecondsLeft = paperConfig.totalDurationMinutes * 60;
    }
    
    if (isSectionalTimingEnabled) {
        paperConfig.hasSectionalTimer = true;
        paperConfig.strictNavigation = true;
        const equalMinutes = Math.floor(paperConfig.totalDurationMinutes / paperConfig.sections.length);
        paperConfig.sections.forEach(sec => {
            sec.durationMinutes = equalMinutes;
        });
        if (!savedStateStr) sectionSecondsLeft = equalMinutes * 60;
    } else {
        paperConfig.hasSectionalTimer = false;
        paperConfig.strictNavigation = false;
    }
    
    startGlobalTimer();
    startAutoSave();
    loadSection(currentSectionIdx, true); // true indicates restoring question idx
}

let autoSaveInterval = null;
function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        const state = {
            answersData,
            globalSecondsLeft,
            sectionSecondsLeft,
            currentSectionIdx,
            currentQuestionIdx,
            hasSectionalTimer: paperConfig.hasSectionalTimer
        };
        localStorage.setItem(`exam_state_${paperConfig._id}`, JSON.stringify(state));
    }, 10000); // Save every 10 seconds
}

// --- Timers ---
function startGlobalTimer() {
    globalTimerInterval = setInterval(() => {
        globalSecondsLeft--;
        if (globalSecondsLeft <= 0) {
            clearInterval(globalTimerInterval);
            clearInterval(sectionTimerInterval);
            autoSubmitExam();
        } else {
            document.getElementById('globalTimeLeft').innerText = formatTime(globalSecondsLeft);
        }
    }, 1000);
}

function startSectionTimer(minutes) {
    clearInterval(sectionTimerInterval);
    document.getElementById('sectionTimerDisplay').style.display = 'flex';
    sectionSecondsLeft = minutes * 60;
    
    sectionTimerInterval = setInterval(() => {
        sectionSecondsLeft--;
        if (sectionSecondsLeft <= 0) {
            clearInterval(sectionTimerInterval);
            handleSectionTimeUp();
        } else {
            document.getElementById('sectionTimeLeft').innerText = formatTime(sectionSecondsLeft);
        }
    }, 1000);
}

function handleSectionTimeUp() {
    showAlertModal('Time Up', `Time is up for section: ${paperConfig.sections[currentSectionIdx].name}`);
    if (currentSectionIdx < paperConfig.sections.length - 1) {
        loadSection(currentSectionIdx + 1);
    } else {
        autoSubmitExam();
    }
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`;
}

// --- Section & Question Loading ---
function loadSection(secIdx, restore = false) {
    currentSectionIdx = secIdx;
    if (!restore) {
        currentQuestionIdx = 0;
    }
    
    renderTabs();
    
    if (paperConfig.hasSectionalTimer) {
        if (!restore) {
            startSectionTimer(paperConfig.sections[secIdx].durationMinutes);
        } else {
            // sectionSecondsLeft is already restored from localStorage
            clearInterval(sectionTimerInterval);
            document.getElementById('sectionTimerDisplay').style.display = 'flex';
            sectionTimerInterval = setInterval(() => {
                sectionSecondsLeft--;
                if (sectionSecondsLeft <= 0) {
                    clearInterval(sectionTimerInterval);
                    handleSectionTimeUp();
                } else {
                    document.getElementById('sectionTimeLeft').innerText = formatTime(sectionSecondsLeft);
                }
            }, 1000);
        }
    }

    loadQuestion(currentQuestionIdx);
}

function renderTabs() {
    const container = document.getElementById('sectionTabs');
    container.innerHTML = '';
    
    paperConfig.sections.forEach((sec, idx) => {
        const div = document.createElement('div');
        div.className = `tab ${idx === currentSectionIdx ? 'active' : ''}`;
        
        if (paperConfig.strictNavigation && paperConfig.hasSectionalTimer && idx !== currentSectionIdx) {
            div.classList.add('disabled');
            div.onclick = () => showAlertModal('Strict Navigation', 'You cannot jump between sections until the current section time is up.');
        } else {
            div.onclick = () => loadSection(idx);
        }
        
        div.innerHTML = `<i class="fa-solid fa-info-circle"></i> ${sec.name}`;
        container.appendChild(div);
    });
}

function stopCurrentQuestionTimer() {
    if (currentQTimerInterval) {
        clearInterval(currentQTimerInterval);
        currentQTimerInterval = null;
    }
    if (typeof currentQuestionIdx !== 'undefined' && currentQuestionIdx !== null && currentSectionIdx !== null && paperConfig) {
        const sec = paperConfig.sections[currentSectionIdx];
        const qId = sec.questions[currentQuestionIdx];
        if (answersData[qId] && currentQStartTime) {
            const elapsed = Math.floor((Date.now() - currentQStartTime) / 1000);
            answersData[qId].timeSpent += elapsed;
        }
    }
}

function loadQuestion(qIdx) {
    stopCurrentQuestionTimer(); // Save time for previous question

    currentQuestionIdx = qIdx;
    const sec = paperConfig.sections[currentSectionIdx];
    const qId = sec.questions[qIdx];
    const qData = rawMockQuestions[qId];
    const aData = answersData[qId];

    // Start timer for new question
    currentQStartTime = Date.now();
    let displaySeconds = aData.timeSpent || 0;
    
    const updateQTimerUI = (seconds) => {
        const timerElem = document.getElementById('qTimerText');
        const container = document.getElementById('currentQuestionTimer');
        if (!timerElem || !container) return;
        
        timerElem.innerText = formatTime(seconds);
        
        if (seconds > 75) {
            container.style.background = 'rgba(239, 68, 68, 0.1)';
            container.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            container.style.color = '#ef4444';
            // Blink effect
            container.style.opacity = (seconds % 2 === 0) ? '1' : '0.4';
        } else {
            container.style.background = 'rgba(16, 185, 129, 0.1)';
            container.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            container.style.color = 'var(--accent)';
            container.style.opacity = '1';
        }
    };
    
    updateQTimerUI(displaySeconds);
    
    currentQTimerInterval = setInterval(() => {
        displaySeconds++;
        updateQTimerUI(displaySeconds);
    }, 1000);

    if (aData.status === 'not_visited') {
        aData.status = 'not_answered';
    }

    document.getElementById('questionNumberHeader').innerText = `Question No. ${qIdx + 1}`;
    document.getElementById('questionLang').value = aData.lang;

    // Render Text & Image
    const langKey = aData.lang === 'hindi' ? 'hindi' : 'english';
    const imgUrl = qData.image && qData.image[langKey] ? qData.image[langKey] : (qData.image && typeof qData.image === 'string' ? qData.image : '');
    let imageHtml = imgUrl ? `<br><img src="${imgUrl}" style="max-width: 100%; margin-top: 15px; border-radius: 8px;">` : '';
    document.getElementById('questionText').innerHTML = qData.text[langKey] + imageHtml;

    // Render Options
    const optList = document.getElementById('optionsList');
    optList.innerHTML = '';
    qData.options.forEach((opt, oIdx) => {
        const li = document.createElement('li');
        li.className = 'option-item';
        
        const rId = `opt_${oIdx}`;
        const isChecked = aData.selectedOpt === oIdx ? 'checked' : '';
        const lKey = aData.lang === 'hindi' ? 'h' : 'e';
        
        let labelContent = opt[lKey];
        if (opt.img) {
            labelContent += `<br><img src="${opt.img}" style="max-height: 120px; margin-top: 10px; border-radius: 4px;">`;
        }
        
        li.innerHTML = `
            <input type="radio" name="answerOption" id="${rId}" value="${oIdx}" ${isChecked}>
            <label for="${rId}">${labelContent}</label>
        `;
        optList.appendChild(li);
    });

    renderPalette();
    
    // Render LaTeX Math
    if (window.MathJax) {
        MathJax.typesetPromise().catch((err) => console.log('MathJax error: ', err));
    }
}

function changeQuestionLang() {
    const qId = paperConfig.sections[currentSectionIdx].questions[currentQuestionIdx];
    answersData[qId].lang = document.getElementById('questionLang').value;
    loadQuestion(currentQuestionIdx);
}

// --- Zoom Logic (Eduquity Feature) ---
let currentZoomLevel = 1.0;
function zoomText(step) {
    // step is either 1 (zoom in) or -1 (zoom out)
    const container = document.getElementById('zoomableContent');
    if (!container) return;

    if (step > 0 && currentZoomLevel < 1.5) {
        currentZoomLevel += 0.1;
    } else if (step < 0 && currentZoomLevel > 0.8) {
        currentZoomLevel -= 0.1;
    }
    
    container.style.fontSize = currentZoomLevel + 'rem';
}

// --- Action Handlers ---
function getSelectedOption() {
    const radios = document.getElementsByName('answerOption');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) return parseInt(radios[i].value);
    }
    return null;
}

function saveResponseAndMove(isMarkForReview) {
    const qId = paperConfig.sections[currentSectionIdx].questions[currentQuestionIdx];
    const sel = getSelectedOption();
    
    if (sel !== null) {
        answersData[qId].selectedOpt = sel;
        answersData[qId].status = isMarkForReview ? 'answered_marked_for_review' : 'answered';
    } else {
        answersData[qId].selectedOpt = null;
        answersData[qId].status = isMarkForReview ? 'marked_for_review' : 'not_answered';
    }

    // Move to next question if possible
    const currentSecQuestions = paperConfig.sections[currentSectionIdx].questions;
    if (currentQuestionIdx >= currentSecQuestions.length - 1) {
        renderPalette();
        showAlertModal('Notice', "You have reached the last question of this section.");
        return;
    }
    loadQuestion(currentQuestionIdx + 1);
}

function saveAndNext() { saveResponseAndMove(false); }
function markForReviewAndNext() { saveResponseAndMove(true); }

function clearResponse() {
    const qId = paperConfig.sections[currentSectionIdx].questions[currentQuestionIdx];
    answersData[qId].selectedOpt = null;
    answersData[qId].status = 'not_answered';
    loadQuestion(currentQuestionIdx);
}

// --- Palette ---
function renderPalette() {
    const sec = paperConfig.sections[currentSectionIdx];
    document.getElementById('currentSectionNamePalette').innerText = sec.name;
    
    const grid = document.getElementById('questionGrid');
    grid.innerHTML = '';

    let counts = { nv: 0, na: 0, a: 0, mr: 0, amr: 0 };

    sec.questions.forEach((qId, idx) => {
        const stat = answersData[qId].status;
        if (stat === 'not_visited') counts.nv++;
        if (stat === 'not_answered') counts.na++;
        if (stat === 'answered') counts.a++;
        if (stat === 'marked_for_review') counts.mr++;
        if (stat === 'answered_marked_for_review') counts.amr++;

        const btn = document.createElement('button');
        
        let bClass = 'b-nv';
        if (stat === 'not_answered') bClass = 'b-na';
        if (stat === 'answered') bClass = 'b-a';
        if (stat === 'marked_for_review') bClass = 'b-mr';
        if (stat === 'answered_marked_for_review') bClass = 'b-amr';

        btn.className = `q-btn badge ${bClass} ${idx === currentQuestionIdx ? 'active' : ''}`;
        btn.innerText = idx + 1;
        btn.onclick = () => loadQuestion(idx);

        grid.appendChild(btn);
    });

    document.getElementById('cnt-nv').innerText = counts.nv;
    document.getElementById('cnt-na').innerText = counts.na;
    document.getElementById('cnt-a').innerText = counts.a;
    document.getElementById('cnt-mr').innerText = counts.mr;
    document.getElementById('cnt-amr').innerText = counts.amr;
}

// --- Custom Alert Modal ---
function showAlertModal(title, message) {
    document.getElementById('alertModalTitle').innerText = title;
    document.getElementById('alertModalMessage').innerText = message;
    document.getElementById('alertModal').style.display = 'flex';
}

// --- Submit Logic ---
function openSubmitModal() {
    const tbody = document.getElementById('summaryTableBody');
    tbody.innerHTML = '';

    paperConfig.sections.forEach(sec => {
        let counts = { a: 0, na: 0, mr: 0, nv: 0, amr: 0 };
        sec.questions.forEach(qId => {
            const stat = answersData[qId].status;
            if (stat === 'answered') counts.a++;
            if (stat === 'not_answered') counts.na++;
            if (stat === 'marked_for_review') counts.mr++;
            if (stat === 'not_visited') counts.nv++;
            if (stat === 'answered_marked_for_review') { counts.a++; counts.amr++; } // Usually considered answered
        });

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${sec.name}</td>
            <td>${sec.questions.length}</td>
            <td>${counts.a}</td>
            <td>${counts.na}</td>
            <td>${counts.mr + counts.amr}</td>
            <td>${counts.nv}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('submitModal').style.display = 'flex';
}

function closeSubmitModal() {
    document.getElementById('submitModal').style.display = 'none';
}

function finalSubmit() {
    autoSubmitExam();
}

async function autoSubmitExam() {
    stopCurrentQuestionTimer(); // Ensure the last question's time is tracked
    
    clearInterval(globalTimerInterval);
    clearInterval(sectionTimerInterval);
    document.getElementById('submitModal').style.display = 'none';
    
    document.body.style.cursor = 'wait';
    
    let formattedAnswers = [];
    Object.keys(answersData).forEach(qId => {
        const aData = answersData[qId];
        formattedAnswers.push({
            questionId: qId,
            selectedOptionIndex: aData.selectedOpt,
            timeSpent: aData.timeSpent || 0
        });
    });

    const timeTaken = (paperConfig.totalDurationMinutes * 60) - globalSecondsLeft;

    let userId = "000000000000000000000000"; // Fallback if not logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const userObj = JSON.parse(userStr);
            if (userObj.id) userId = userObj.id;
            else if (userObj._id) userId = userObj._id;
        } catch(e) {}
    }

    try {
        const res = await fetch(`http://localhost:5000/api/papers/${paperConfig._id}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, answers: formattedAnswers, timeTaken })
        });
        const data = await res.json();
        
        if (data.success) {
            localStorage.removeItem(`exam_state_${paperConfig._id}`);
            window.location.href = `test-analysis.html?resultId=${data.result._id}`;
        } else {
            document.body.style.cursor = 'default';
            showAlertModal('Error', 'Failed to submit test: ' + (data.message || 'Unknown error'));
        }
    } catch (err) {
        console.error(err);
        document.body.style.cursor = 'default';
        showAlertModal('Error', 'Server connection failed while submitting test.');
    }
}
