// ============================================
// Mockly Test Analysis — JS
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resultId = urlParams.get('resultId');

    if (!resultId) {
        console.error("Invalid Result ID.");
        return;
    }

    try {
        // Fetch Result
        const res1 = await fetch(`http://localhost:5000/api/papers/result/${resultId}`);
        const data1 = await res1.json();
        
        if (!data1.success) {
            console.error("Failed to fetch result: " + data1.message);
            return;
        }

        const result = data1.result;
        const paperId = result.paperId._id || result.paperId;

        // Fetch Paper (to get full questions data)
        const res2 = await fetch(`http://localhost:5000/api/papers/${paperId}`);
        const data2 = await res2.json();

        if (!data2.success) {
            console.error("Failed to fetch paper details.");
            return;
        }

        const paper = data2.paper;
        
        renderAnalysis(result, paper);

    } catch (err) {
        console.error(err);
    }
});

function renderAnalysis(result, paper) {
    // 1. Exam Title
    document.getElementById('examTitle').innerText = paper.title || 'Mock Test';
    
    // 2. Candidate Name
    let candidateName = "Candidate";
    if (result.userId && result.userId.name) {
        candidateName = result.userId.name;
    } else {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                if (userObj.name) candidateName = userObj.name;
            } catch(e) {}
        }
    }
    document.getElementById('candidateName').innerText = candidateName;

    // 3. Attempt Date
    const attemptDate = result.submittedAt ? new Date(result.submittedAt) : new Date();
    document.getElementById('attemptDate').innerText = attemptDate.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    }) + ', ' + attemptDate.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit'
    });

    // 4. Time Taken
    if (result.timeTaken) {
        const mins = Math.floor(result.timeTaken / 60);
        const secs = result.timeTaken % 60;
        document.getElementById('timeTaken').innerText = `${mins}m ${secs}s`;
    } else {
        const mockTime = paper.duration ? Math.floor(paper.duration * 0.85) : 48;
        document.getElementById('timeTaken').innerText = `${mockTime}m 15s`;
    }

    // 5. Calculate Scores and Stats
    let totalScore = 0;
    let maxScore = 0;
    
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    let totalQuestions = 0;
    
    paper.sections.forEach(sec => {
        sec.questions.forEach(q => {
            totalQuestions++;
            maxScore += (q.marks || 1);
            
            const userAns = result.answers.find(a => a.questionId === q._id);
            if (userAns && userAns.selectedOptionIndex !== null && userAns.selectedOptionIndex !== undefined) {
                if (userAns.selectedOptionIndex === q.correctOptionIndex) {
                    correct++;
                    totalScore += (q.marks || 1);
                } else {
                    incorrect++;
                    totalScore -= (q.negativeMarks || 0);
                }
            } else {
                unattempted++;
            }
        });
    });

    totalScore = Math.max(0, totalScore);

    document.getElementById('totalScore').innerText = totalScore;
    document.getElementById('maxScore').innerText = maxScore;
    
    // Update Stat Cards
    document.getElementById('statCorrect').innerText = correct;
    document.getElementById('statIncorrect').innerText = incorrect;
    document.getElementById('statUnattempted').innerText = unattempted;
    
    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
    document.getElementById('statAccuracy').innerText = accuracy + '%';

    // 6. Animate Ring
    const ring = document.querySelector('.ring-progress');
    if (ring) {
        const circumference = 2 * Math.PI * 85;
        const percent = maxScore > 0 ? (totalScore / maxScore) : 0;
        const offset = circumference - (percent * circumference);
        setTimeout(() => {
            ring.style.strokeDashoffset = offset;
        }, 100);
    }

    // 7. Render Section-wise Breakdown
    const sectionsGrid = document.getElementById('sectionsGrid');
    if (sectionsGrid && paper.sections && paper.sections.length > 0) {
        sectionsGrid.innerHTML = '';
        paper.sections.forEach(sec => {
            let secMax = 0;
            let secScore = 0;
            let secCorrect = 0;
            let secIncorrect = 0;
            
            sec.questions.forEach(q => {
                secMax += (q.marks || 1);
                const userAns = result.answers.find(a => a.questionId === q._id);
                if (userAns && userAns.selectedOptionIndex !== null && userAns.selectedOptionIndex !== undefined) {
                    if (userAns.selectedOptionIndex === q.correctOptionIndex) {
                        secCorrect++;
                        secScore += (q.marks || 1);
                    } else {
                        secIncorrect++;
                        secScore -= (q.negativeMarks || 0);
                    }
                }
            });
            
            secScore = Math.max(0, secScore);
            const secAccuracy = (secCorrect + secIncorrect) > 0 ? Math.round((secCorrect / (secCorrect + secIncorrect)) * 100) : 0;
            const secUnattempted = sec.questions.length - (secCorrect + secIncorrect);
            
            const card = document.createElement('div');
            card.className = 'section-perf-card';
            
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px;">
                    <h3 style="font-size: 20px; color: var(--text-primary); font-weight: 800; line-height: 1.3; font-family: var(--font-heading); max-width: 70%;">${sec.name || 'Section'}</h3>
                    <div style="background: var(--bg-card-hover); padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border-medium); font-size: 12px; font-weight: 700; color: var(--text-secondary); box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));">
                        ${sec.questions.length} Qs
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px;">
                    <div class="section-perf-tile">
                        <div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Score</div>
                        <div style="display: flex; align-items: baseline; gap: 4px;">
                            <span class="text-gradient" style="font-size: 28px; font-weight: 900; font-family: var(--font-heading); line-height: 1;">${secScore}</span>
                            <span style="font-size: 14px; color: var(--text-tertiary); font-weight: 600;">/ ${secMax}</span>
                        </div>
                    </div>
                    <div class="section-perf-tile">
                        <div style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Accuracy</div>
                        <div style="font-size: 28px; font-weight: 900; color: var(--text-primary); font-family: var(--font-heading); line-height: 1;">${secAccuracy}%</div>
                    </div>
                </div>
                
                <!-- Detailed Breakdown Row -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 13px; font-weight: 600; color: var(--text-secondary);">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px rgba(5, 205, 153, 0.4);"></div>
                        ${secCorrect} Correct
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-red); box-shadow: 0 0 10px rgba(238, 93, 80, 0.4);"></div>
                        ${secIncorrect} Wrong
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--text-tertiary);"></div>
                        ${secUnattempted} Skip
                    </div>
                </div>

                <!-- Progress Bar -->
                <div style="width: 100%; height: 8px; background: var(--border-medium); border-radius: 4px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="width: ${secAccuracy}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 4px; box-shadow: 0 0 10px rgba(124, 106, 255, 0.3);"></div>
                </div>
            `;
            sectionsGrid.appendChild(card);
        });
        
        // Render Charts using Chart.js
        renderCharts(paper.sections, result.answers);
        
        // Generate AI Action Plan
        generateAIActionPlan(paper.sections, result.answers);
    }

    // 8. Render Time Analytics
    const totalTimeInSeconds = result.timeTaken || 0;
    
    // Calculate average time ONLY for questions the user actually spent time on, 
    // or fallback to total time / total questions if none.
    let totalTimeSpentOnQuestions = 0;
    let questionsWithTime = 0;
    
    result.answers.forEach(a => {
        if (a.timeSpent > 0) {
            totalTimeSpentOnQuestions += a.timeSpent;
            questionsWithTime++;
        }
    });

    let avgTimeOverall = 0;
    if (questionsWithTime > 0) {
        avgTimeOverall = Math.round(totalTimeSpentOnQuestions / questionsWithTime);
    } else if (totalTimeInSeconds > 0) {
        avgTimeOverall = Math.round(totalTimeInSeconds / Math.max(1, totalQuestions));
    }

    document.getElementById('avgTimeOverall').innerText = `${avgTimeOverall}s`;

    let allQStats = [];
    paper.sections.forEach(sec => {
        sec.questions.forEach((q, idx) => {
            const userAns = result.answers.find(a => a.questionId === q._id);
            if (!userAns) return;
            
            // Only consider questions that were actually attempted or spent time on
            if (userAns.timeSpent === 0 && userAns.selectedOptionIndex === null) return;
            
            const isCorrect = userAns.selectedOptionIndex === q.correctOptionIndex;
            const timeSpent = userAns.timeSpent || 0;
            
            let plainText = `Question from ${sec.name}`;
            if (q.questionText && q.questionText.english) {
                plainText = q.questionText.english.replace(/<[^>]+>/g, '').trim() || plainText;
            }
            
            allQStats.push({
                questionText: plainText,
                timeSpent: timeSpent,
                isCorrect: isCorrect
            });
        });
    });

    // Time Sinks: Incorrect and took longer than average + 10s (minimum 30s)
    const timeSinks = allQStats.filter(q => !q.isCorrect && q.timeSpent > Math.max(avgTimeOverall + 10, 30)).sort((a,b) => b.timeSpent - a.timeSpent).slice(0, 3);
    
    // Quick Wins: Correct and took less than average - 5s (but must have spent some time, e.g. > 2s)
    const quickWins = allQStats.filter(q => q.isCorrect && q.timeSpent > 2 && q.timeSpent < Math.max(avgTimeOverall - 5, 45)).sort((a,b) => a.timeSpent - b.timeSpent).slice(0, 3);

    const timeSinksContainer = document.getElementById('timeSinksList');
    if (timeSinks.length > 0) {
        timeSinksContainer.innerHTML = '';
        timeSinks.forEach(q => {
            timeSinksContainer.innerHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); transition: all 0.3s ease; cursor: default;" onmouseover="this.style.borderColor='rgba(239, 68, 68, 0.4)'; this.style.transform='translateX(4px)'" onmouseout="this.style.borderColor='rgba(239, 68, 68, 0.15)'; this.style.transform='translateX(0)'">
                    <div style="font-size: 13px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%; font-weight: 500;">${q.questionText}</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-arrow-trend-up" style="color: rgba(239, 68, 68, 0.8); font-size: 12px;"></i>
                        <span style="font-size: 16px; font-weight: 800; color: var(--color-incorrect); filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.3));">${q.timeSpent}s</span>
                    </div>
                </div>
            `;
        });
    } else {
        timeSinksContainer.innerHTML = `<div style="color: var(--text-tertiary); font-size: 14px; text-align: center; padding: 20px; background: rgba(0,0,0,0.02); border-radius: 12px;">No major time sinks found! Great job.</div>`;
    }

    const quickWinsContainer = document.getElementById('quickWinsList');
    if (quickWins.length > 0) {
        quickWinsContainer.innerHTML = '';
        quickWins.forEach(q => {
            quickWinsContainer.innerHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%); border: 1px solid rgba(16, 185, 129, 0.15); border-radius: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); transition: all 0.3s ease; cursor: default;" onmouseover="this.style.borderColor='rgba(16, 185, 129, 0.4)'; this.style.transform='translateX(4px)'" onmouseout="this.style.borderColor='rgba(16, 185, 129, 0.15)'; this.style.transform='translateX(0)'">
                    <div style="font-size: 13px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%; font-weight: 500;">${q.questionText}</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-bolt" style="color: rgba(16, 185, 129, 0.8); font-size: 12px;"></i>
                        <span style="font-size: 16px; font-weight: 800; color: var(--color-correct); filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.3));">${q.timeSpent}s</span>
                    </div>
                </div>
            `;
        });
    } else {
        quickWinsContainer.innerHTML = `<div style="color: var(--text-tertiary); font-size: 14px; text-align: center; padding: 20px; background: rgba(255,255,255,0.02); border-radius: 12px;">No significantly fast correct answers recorded.</div>`;
    }

    // 9. Render Detailed Question Review
    renderDetailedReview(result, paper);
}

function renderDetailedReview(result, paper) {
    if (!paper || !paper.sections || paper.sections.length === 0) return;

    const sidebar = document.getElementById('reviewSidebar');
    const gridContainer = document.getElementById('questionGrid');
    
    if (!sidebar || !gridContainer) return;

    sidebar.innerHTML = '';
    
    // Create tabs for each section
    paper.sections.forEach((sec, index) => {
        const tab = document.createElement('div');
        tab.className = 'review-tab';
        tab.innerHTML = `
            <span>${sec.name || 'Section ' + (index + 1)}</span>
            <span style="background: rgba(0,0,0,0.1); padding: 2px 8px; border-radius: 12px; font-size: 11px;">${sec.questions.length}</span>
        `;
        
        tab.addEventListener('click', () => {
            // Remove active class from all
            document.querySelectorAll('.review-tab').forEach(t => t.classList.remove('active'));
            // Add active to current
            tab.classList.add('active');
            // Render grid for this section
            renderGridForSection(sec, result.answers);
        });
        
        sidebar.appendChild(tab);
        
        // Select the first tab by default
        if (index === 0) {
            tab.click();
        }
    });

    // Setup Filters
    setupFilters();
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.q-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filter = e.target.getAttribute('data-filter');
            const squares = document.querySelectorAll('.q-square');
            
            squares.forEach(sq => {
                if (filter === 'all') {
                    sq.style.display = 'flex';
                } else {
                    if (sq.classList.contains(filter)) {
                        sq.style.display = 'flex';
                    } else {
                        sq.style.display = 'none';
                    }
                }
            });
        });
    });
}

function renderGridForSection(section, answers = []) {
    const gridContainer = document.getElementById('questionGrid');
    gridContainer.innerHTML = '';
    
    section.questions.forEach((q, index) => {
        // Find if user answered this question
        const userAns = answers.find(a => String(a.questionId) === String(q._id));
        
        let statusClass = 'unattempted';
        
        if (userAns) {
            if (userAns.markedForReview) {
                statusClass = 'marked';
            } else if (userAns.selectedOptionIndex !== null && userAns.selectedOptionIndex !== undefined) {
                // Check if correct
                if (userAns.selectedOptionIndex === q.correctOptionIndex) {
                    statusClass = 'correct';
                } else {
                    statusClass = 'incorrect';
                }
            }
        }
        
        const square = document.createElement('div');
        square.className = `q-square ${statusClass}`;
        square.textContent = index + 1;
        square.title = `Question ${index + 1}`;
        
        square.addEventListener('click', () => {
            showQuestionDetail(q, index + 1, userAns, statusClass);
        });
        gridContainer.appendChild(square);
        
        // Auto-select the first question
        if (index === 0) {
            showQuestionDetail(q, index + 1, userAns, statusClass);
        }
    });
}

let currentLanguage = 'english';
let currentQ = null;
let currentQNumber = null;
let currentUserAns = null;
let currentQStatus = null;

window.switchLanguage = function(lang) {
    currentLanguage = lang;
    
    const engBtn = document.getElementById('langBtnEng');
    const hinBtn = document.getElementById('langBtnHin');
    if (engBtn) engBtn.classList.toggle('active', lang === 'english');
    if (hinBtn) hinBtn.classList.toggle('active', lang === 'hindi');
    
    if (currentQ) {
        showQuestionDetail(currentQ, currentQNumber, currentUserAns, currentQStatus);
    }
}

function showQuestionDetail(q, questionNumber, userAns, statusClass) {
    const detailView = document.getElementById('questionDetailView');
    const titleEl = document.getElementById('qdTitle');
    const badgeEl = document.getElementById('qdStatusBadge');
    const textEl = document.getElementById('qdText');
    const optionsEl = document.getElementById('qdOptions');
    
    if (!detailView) return;
    
    // Save current state for language toggling
    currentQ = q;
    currentQNumber = questionNumber;
    currentUserAns = userAns;
    currentQStatus = statusClass;
    
    const langKey = currentLanguage;
    const fallbackKey = currentLanguage === 'english' ? 'en' : 'hi';
    
    // Set Title
    titleEl.textContent = `Question ${questionNumber}`;
    
    // Set Badge
    badgeEl.className = `qd-status-badge ${statusClass}`;
    let badgeText = 'Unattempted';
    if (statusClass === 'correct') badgeText = 'Correct';
    if (statusClass === 'incorrect') badgeText = 'Incorrect';
    if (statusClass === 'marked') badgeText = 'Marked for Review';
    badgeEl.textContent = badgeText;
    
    // Set Time Spent
    const timeEl = document.getElementById('qdTime');
    const timeTextEl = document.getElementById('qdTimeText');
    if (timeEl && timeTextEl) {
        if (userAns && userAns.timeSpent !== undefined) {
            let timeInSec = userAns.timeSpent || 0;
            let timeStr = timeInSec < 60 ? `${timeInSec}s` : `${Math.floor(timeInSec/60)}m ${timeInSec%60}s`;
            timeTextEl.textContent = timeStr;
            timeEl.style.display = 'flex';
        } else {
            timeEl.style.display = 'none';
        }
    }
    
    // Set Peer Stat
    const peerStatEl = document.getElementById('qdPeerStat');
    const peerStatTextEl = document.getElementById('qdPeerStatText');
    if (peerStatEl && peerStatTextEl) {
        // Mock Peer Stats based on difficulty / correctness
        let peerPercent = 0;
        if (statusClass === 'correct') {
            peerPercent = Math.floor(Math.random() * (95 - 40 + 1) + 40); // 40-95%
        } else if (statusClass === 'incorrect') {
            peerPercent = Math.floor(Math.random() * (60 - 10 + 1) + 10); // 10-60%
        } else {
            peerPercent = Math.floor(Math.random() * (80 - 20 + 1) + 20); // 20-80%
        }
        
        peerStatTextEl.textContent = `${peerPercent}% got this right`;
        peerStatEl.style.display = 'flex';
    }
    
    // Set Score
    const scoreEl = document.getElementById('qdScore');
    const scoreTextEl = document.getElementById('qdScoreText');
    if (scoreEl && scoreTextEl) {
        // Only show score if the user actually attempted the question
        if (userAns && userAns.selectedOptionIndex !== null && typeof userAns.marksAwarded !== 'undefined') {
            let marks = userAns.marksAwarded;
            let scoreStr = marks > 0 ? `+${marks}` : `${marks}`;
            scoreTextEl.textContent = `Score: ${scoreStr}`;
            
            scoreEl.style.color = marks > 0 ? 'var(--accent)' : (marks < 0 ? 'var(--accent-red)' : 'var(--text-secondary)');
            scoreEl.style.background = marks > 0 ? 'rgba(5, 205, 153, 0.1)' : (marks < 0 ? 'rgba(238, 93, 80, 0.1)' : 'rgba(0,0,0,0.05)');
            
            scoreEl.style.display = 'flex';
        } else {
            scoreEl.style.display = 'none';
        }
    }
    
    // Set Text (Fix for [object Object] bug)
    let finalQText = 'Question text not available.';
    if (q.questionText) {
        finalQText = typeof q.questionText === 'object' ? (q.questionText[langKey] || q.questionText[fallbackKey] || q.questionText.english || JSON.stringify(q.questionText)) : q.questionText;
    } else if (q.text) {
        finalQText = typeof q.text === 'object' ? (q.text[langKey] || q.text[fallbackKey] || q.text.english || JSON.stringify(q.text)) : q.text;
    }
    
    let qImageHtml = '';
    let qImage = q.questionImage || q.image;
    if (qImage) {
        let imgUrl = typeof qImage === 'object' ? (qImage[langKey] || qImage[fallbackKey] || qImage.english) : qImage;
        if (imgUrl) qImageHtml = `<img src="${imgUrl}" alt="Question Image" />`;
    }
    
    textEl.innerHTML = finalQText + qImageHtml;
    
    // Set Options
    optionsEl.innerHTML = '';
    if (q.options && Array.isArray(q.options)) {
        const letters = ['A', 'B', 'C', 'D'];
        q.options.forEach((opt, idx) => {
            const optDiv = document.createElement('div');
            optDiv.className = 'qd-option';
            
            // Highlight logic and Badges
            let isCorrectOption = (idx === q.correctOptionIndex);
            let isUserOption = (userAns && userAns.selectedOptionIndex === idx);
            let badgesHtml = '';
            
            if (isCorrectOption) {
                optDiv.classList.add('correct-option');
                if (isUserOption) {
                    badgesHtml += `<span class="opt-badge yours-correct"><i class="fa-solid fa-check"></i> Your Answer (Correct)</span>`;
                } else {
                    badgesHtml += `<span class="opt-badge correct"><i class="fa-solid fa-check"></i> Correct Answer</span>`;
                }
            } else if (isUserOption) {
                optDiv.classList.add('user-incorrect');
                badgesHtml += `<span class="opt-badge yours"><i class="fa-solid fa-xmark"></i> Your Answer</span>`;
            }
            
            // Parse Option Text
            let optText = 'Option text missing';
            let optImageHtml = '';
            
            if (opt) {
                if (typeof opt === 'object') {
                    optText = opt[langKey] || opt[fallbackKey] || opt.english || (opt.text ? (typeof opt.text === 'object' ? (opt.text[langKey] || opt.text[fallbackKey] || opt.text.english) : opt.text) : JSON.stringify(opt));
                    
                    let optImg = opt.image || opt.img;
                    if (optImg) {
                        let imgUrl = typeof optImg === 'object' ? (optImg[langKey] || optImg[fallbackKey] || optImg.english) : optImg;
                        if (imgUrl) optImageHtml = `<img src="${imgUrl}" alt="Option Image" />`;
                    }
                } else {
                    optText = opt;
                }
            }
            
            optDiv.innerHTML = `
                <div class="qd-option-letter">${letters[idx] || idx+1}</div>
                <div style="flex: 1;">
                    ${optText}${optImageHtml}
                    ${badgesHtml ? `<div style="margin-top: 6px;">${badgesHtml}</div>` : ''}
                </div>
            `;
            optionsEl.appendChild(optDiv);
        });
    }
    
    // Render Explanation
    const explView = document.getElementById('qdExplanation');
    const explContent = document.getElementById('qdExplanationContent');
    if (explView && explContent) {
        let explText = '';
        let explImage = '';
        
        if (q.solution) {
            let solObj = q.solution;
            explText = typeof solObj === 'object' ? (solObj[langKey] || solObj[fallbackKey] || solObj.english || solObj.text?.[langKey]) : solObj;
            
            if (solObj.image) {
                let imgUrl = typeof solObj.image === 'object' ? (solObj.image[langKey] || solObj.image[fallbackKey] || solObj.image.english) : solObj.image;
                if (imgUrl) explImage = `<img src="${imgUrl}" alt="Explanation Image" />`;
            }
        } else if (q.explanation) {
            explText = typeof q.explanation === 'object' ? (q.explanation[langKey] || q.explanation[fallbackKey] || q.explanation.english) : q.explanation;
        }
        
        if (typeof explText === 'object' && explText !== null) explText = JSON.stringify(explText);
        
        if (explText || explImage) {
            explContent.innerHTML = (explText && explText !== '[object Object]' ? explText : '') + explImage;
            explView.style.display = 'block';
        } else {
            explView.style.display = 'none';
        }
    }
    
    // Show View (if it was hidden)
    detailView.style.display = 'flex';
    
    // Trigger MathJax to render LaTeX equations
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([detailView]).catch((err) => console.log('MathJax error:', err));
    }
}

// ==========================================
// NEW FEATURES: Charts & AI Plan
// ==========================================

let radarChartInstance = null;
let barChartInstance = null;

function renderCharts(sections, answers) {
    const radarCanvas = document.getElementById('radarChart');
    const barCanvas = document.getElementById('barChart');
    if (!radarCanvas || !barCanvas) return;

    const labels = [];
    const accuracyData = [];
    
    const correctData = [];
    const incorrectData = [];
    const unattemptedData = [];

    sections.forEach(sec => {
        labels.push(sec.name || 'Section');
        
        let secCorrect = 0;
        let secIncorrect = 0;
        
        sec.questions.forEach(q => {
            const userAns = answers.find(a => String(a.questionId) === String(q._id));
            if (userAns && userAns.selectedOptionIndex !== null && userAns.selectedOptionIndex !== undefined) {
                if (userAns.selectedOptionIndex === q.correctOptionIndex) {
                    secCorrect++;
                } else {
                    secIncorrect++;
                }
            }
        });
        
        const secUnattempted = sec.questions.length - (secCorrect + secIncorrect);
        const secAccuracy = (secCorrect + secIncorrect) > 0 ? Math.round((secCorrect / (secCorrect + secIncorrect)) * 100) : 0;
        
        accuracyData.push(secAccuracy);
        correctData.push(secCorrect);
        incorrectData.push(secIncorrect);
        unattemptedData.push(secUnattempted);
    });

    // Radar Chart (Strength Polygon)
    if (radarChartInstance) radarChartInstance.destroy();
    radarChartInstance = new Chart(radarCanvas, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Accuracy %',
                data: accuracyData,
                backgroundColor: 'rgba(67, 24, 255, 0.2)',
                borderColor: '#4318FF',
                pointBackgroundColor: '#d946ef',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#d946ef',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    pointLabels: {
                        font: { family: 'Inter', size: 12, weight: 'bold' },
                        color: '#475569'
                    },
                    ticks: {
                        display: false,
                        min: 0,
                        max: 100
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Stacked Bar Chart (Accuracy Distribution)
    if (barChartInstance) barChartInstance.destroy();
    barChartInstance = new Chart(barCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Correct',
                    data: correctData,
                    backgroundColor: '#05cd99',
                    borderRadius: 4
                },
                {
                    label: 'Incorrect',
                    data: incorrectData,
                    backgroundColor: '#ee5d50',
                    borderRadius: 4
                },
                {
                    label: 'Unattempted',
                    data: unattemptedData,
                    backgroundColor: '#cbd5e1',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: { display: false }
                },
                y: {
                    stacked: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, boxWidth: 8 }
                }
            }
        }
    });
}

function generateAIActionPlan(sections, answers) {
    const aiTimeline = document.getElementById('aiTimeline');
    const aiWeakestDesc = document.getElementById('aiWeakestDesc');
    if (!aiTimeline || !aiWeakestDesc) return;

    let weakestSection = null;
    let lowestAccuracy = 101;

    sections.forEach(sec => {
        let secCorrect = 0;
        let secAttempted = 0;
        
        sec.questions.forEach(q => {
            const userAns = answers.find(a => String(a.questionId) === String(q._id));
            if (userAns && userAns.selectedOptionIndex !== null && userAns.selectedOptionIndex !== undefined) {
                secAttempted++;
                if (userAns.selectedOptionIndex === q.correctOptionIndex) {
                    secCorrect++;
                }
            }
        });
        
        const accuracy = secAttempted > 0 ? (secCorrect / secAttempted) * 100 : 0;
        if (accuracy < lowestAccuracy && secAttempted > 0) {
            lowestAccuracy = accuracy;
            weakestSection = sec.name || 'General';
        }
    });

    if (!weakestSection) {
        weakestSection = sections[0] ? sections[0].name : 'General Concepts';
    }

    aiWeakestDesc.innerHTML = `Based on this test, your accuracy in <strong>${weakestSection}</strong> was only ${Math.round(lowestAccuracy)}%. Here is your custom 3-day recovery plan.`;

    const planData = [
        {
            day: "Day 1",
            tag: "Theory & Concepts",
            desc: `Focus on reviewing foundational concepts and formulas for <strong>${weakestSection}</strong>. Read the chapter summaries and clear any theoretical doubts.`
        },
        {
            day: "Day 2",
            tag: "Targeted Practice",
            desc: `Solve 50 easy to medium level questions specifically in <strong>${weakestSection}</strong> to build confidence and reinforce the theory.`
        },
        {
            day: "Day 3",
            tag: "Sectional Mock",
            desc: `Take a 30-minute sectional test on <strong>${weakestSection}</strong>. Aim for at least 80% accuracy before moving on to full mocks.`
        }
    ];

    aiTimeline.innerHTML = '';
    planData.forEach(p => {
        aiTimeline.innerHTML += `
            <div class="ai-day-card">
                <div class="ai-day-title">
                    <span>${p.day}</span>
                    <span class="ai-day-tag">${p.tag}</span>
                </div>
                <div class="ai-day-desc">${p.desc}</div>
            </div>
        `;
    });
}
