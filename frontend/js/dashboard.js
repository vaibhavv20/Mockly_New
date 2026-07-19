document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://mockly-backend-fk2i.onrender.com') + '/api/auth';
    
    // 1. Auth Protection
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Fetch User Data & Update UI
    try {
        const res = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: { 'x-auth-token': token }
        });

        if (res.ok) {
            const user = await res.json();
            
            // Extract fields based on backend schema
            const firstName = user.firstName || 'Aspirant';
            const lastName = user.lastName || '';
            const fullName = `${firstName} ${lastName}`.trim();
            const email = user.email || 'candidate@example.com';
            const avatarId = user.avatar || '1'; // Default to memoji_1
            
            // Update Top Navbar & Overview Greeting
            const greetingEl = document.getElementById('user-greeting');
            if (greetingEl) greetingEl.textContent = firstName;
            
            const ovNameSpan = document.getElementById('ov-name-span');
            if (ovNameSpan) ovNameSpan.textContent = firstName;
            
            const navAvatar = document.getElementById('nav-avatar');
            if (navAvatar) navAvatar.src = `assets/avatars/memoji_${avatarId}.webp`;
            
            // Update Sidebar Profile Name, Email, & Avatar
            const sidebarUsername = document.getElementById('sidebar-username');
            if (sidebarUsername) sidebarUsername.textContent = fullName;
            
            const sidebarEmail = document.getElementById('sidebar-email');
            if (sidebarEmail) sidebarEmail.textContent = email;
            
            const sidebarAvatar = document.getElementById('sidebar-avatar');
            if (sidebarAvatar) sidebarAvatar.src = `assets/avatars/memoji_${avatarId}.webp`;

            // Premium Logic
            const isPremium = user.isPremium || false; 
            const roleEl = document.getElementById('sidebar-role');
            const avatarWrapper = document.getElementById('sidebar-avatar-wrapper');

            if (roleEl && avatarWrapper) {
                if (isPremium) {
                    roleEl.textContent = 'Premium Member';
                    roleEl.classList.add('premium');
                    avatarWrapper.classList.add('premium');
                } else {
                    roleEl.textContent = 'Free Member';
                    roleEl.classList.remove('premium');
                    avatarWrapper.classList.remove('premium');
                }
            }
            
            // Show user menu, hide login/signup in Navbar
            const navLogin = document.getElementById('nav-login-btn');
            const navSignup = document.getElementById('nav-signup-btn');
            const userMenu = document.getElementById('user-menu');
            
            if (navLogin) navLogin.style.display = 'none';
            if (navSignup) navSignup.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';

            // 3. Fetch Analytics
            let summary = null;
            let cognitive = null;
            let insights = null;
            
            try {
                const analyticsUrl = API_URL.replace('/auth', '/analytics');
                const [sumRes, cogRes, insRes] = await Promise.all([
                    fetch(`${analyticsUrl}/dashboard/summary`, { headers: { 'x-auth-token': token } }),
                    fetch(`${analyticsUrl}/dashboard/cognitive`, { headers: { 'x-auth-token': token } }),
                    fetch(`${analyticsUrl}/dashboard/insights`, { headers: { 'x-auth-token': token } })
                ]);
                
                if (sumRes.ok) summary = await sumRes.json();
                if (cogRes.ok) cognitive = await cogRes.json();
                if (insRes.ok) insights = await insRes.json();
            } catch (err) {
                console.error('Error fetching analytics:', err);
            }
            
            // Check for empty state
            const hasTakenTests = summary ? summary.hasTakenTests : false; 
            const populatedContainer = document.getElementById('overview-view');
            const emptyStateContainer = document.getElementById('db-empty-state');
            
            if (populatedContainer && emptyStateContainer) {
                if (!hasTakenTests) {
                    populatedContainer.style.display = 'none';
                    emptyStateContainer.style.display = 'flex';
                } else {
                    populatedContainer.style.display = 'block';
                    emptyStateContainer.style.display = 'none';
                }
            }
            
            // Update DOM with Summary
            if (summary) {
                const updateStat = (selector, value, isPercentage = false) => {
                    const el = document.querySelector(selector);
                    if (el) el.setAttribute('data-target', value);
                };
                
                updateStat('.bento-item:nth-child(2) .count-up', summary.globalRank); // Rank
                updateStat('.bento-item:nth-child(3) .count-up', summary.accuracy);   // Accuracy
                updateStat('.bento-item:nth-child(4) .count-up', summary.avgSpeed);   // Speed
                updateStat('.bento-item:nth-child(5) .count-up', summary.predictedScore); // Predicted Score
                
                // Update dynamic Speed bars
                const topperSpeed = 36;
                const userSpeed = summary.avgSpeed || 0;
                const maxSpeed = Math.max(userSpeed, topperSpeed, 60);
                const userPct = userSpeed > 0 ? (userSpeed / maxSpeed) * 100 : 0;
                const topperPct = (topperSpeed / maxSpeed) * 100;

                const userBar = document.querySelector('.user-speed');
                const userTime = document.querySelectorAll('.speed-time')[0];
                if(userBar && userTime) {
                    userBar.style.width = `${userPct}%`;
                    userTime.textContent = `${userSpeed}s`;
                }
                const topperBar = document.querySelector('.topper-speed');
                if(topperBar) {
                    topperBar.style.width = `${topperPct}%`;
                }
                // Update Hero Stats (Coverage, Tests Taken, Target Gap)
                const gapVal = document.getElementById('hero-gap-val');
                const gapSub = document.getElementById('hero-gap-sub');
                const covVal = document.getElementById('hero-cov-val');
                const testsVal = document.getElementById('hero-tests-val');
                const testsSub = document.getElementById('hero-tests-sub');

                if (gapVal) gapVal.textContent = summary.targetGap > 0 ? `+${summary.targetGap}` : summary.targetGap;
                if (gapSub) {
                    const targetGoal = summary.predictedScore - summary.targetGap;
                    gapSub.textContent = `Next Goal: ${targetGoal}`;
                }
                
                if (covVal) covVal.textContent = summary.coverage + '%';
                
                if (testsVal) testsVal.textContent = summary.testsTaken;
                if (testsSub) {
                    const recent = Math.max(1, Math.ceil(summary.testsTaken * 0.15));
                    testsSub.textContent = summary.testsTaken > 0 ? `+${recent} this week` : 'Start your first test!';
                }
                
                // Set AI Predictor Guage text
                const predictedScoreEl = document.querySelector('.predicted-score');
                if (predictedScoreEl) {
                    predictedScoreEl.innerHTML = `${summary.predictedScore}<span class="total">/200</span>`;
                }

                // Animate Score Gauge
                const scoreFill = document.getElementById('score-gauge-fill');
                if (scoreFill) {
                    const score = summary.predictedScore || 0;
                    const maxOffset = 125.6;
                    const offset = maxOffset - (score / 200) * maxOffset;
                    // Small delay to allow CSS transition to happen after render
                    setTimeout(() => {
                        scoreFill.style.strokeDashoffset = offset;
                    }, 100);
                }
            } // END if(summary)

            // Render dynamic charts
            renderCharts(summary, cognitive, insights);
            renderInsights(insights);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        }
    } catch (err) {
        console.error('Error fetching user data:', err);
    }

    // Sidebar Logout Logic
    const sidebarLogout = document.getElementById('sidebar-logout');
    if (sidebarLogout) {
        sidebarLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }

function renderCharts(summary, cognitive, insights) {
    // --- HEART & BRAIN OVERVIEW CHARTS ---
    
    // 1. Rank Sparkline (Card 1)
    const rankCtx = document.getElementById('rankSparkline');
    if (rankCtx) {
        let historyData = [3500, 2100, 1500, 800, 300, 94];
        if (summary && summary.rankHistory && summary.rankHistory.length > 0) {
            historyData = summary.rankHistory;
        }

        const worstVal = Math.max(...historyData);
        const bestVal = Math.min(...historyData);

        new Chart(rankCtx, {
            type: 'line',
            data: {
                labels: historyData.map((_, i) => `T${i+1}`),
                datasets: [{
                    data: historyData,
                    borderColor: '#818cf8',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: (ctx) => {
                        const val = ctx.raw;
                        return (val === worstVal || val === bestVal) ? 5 : 0;
                    },
                    pointBackgroundColor: (ctx) => {
                        const val = ctx.raw;
                        if (val === bestVal) return '#34d399'; // Green for best (lowest number)
                        if (val === worstVal) return '#ef4444'; // Red for worst (highest number)
                        return '#818cf8';
                    },
                    pointBorderColor: '#0f172a',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#818cf8',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false }, 
                    tooltip: { 
                        enabled: true,
                        backgroundColor: '#0f172a',
                        titleColor: '#cbd5e1',
                        bodyColor: '#f8fafc',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return 'Rank ' + context.raw;
                            }
                        }
                    } 
                },
                scales: { x: { display: false }, y: { display: false, reverse: true } },
                layout: { padding: { top: 6, bottom: 6, left: 6, right: 6 } }
            }
        });
    }

    // 2. Accuracy Sparkline (Card 2)
    const accCtx = document.getElementById('accuracySparkline');
    if (accCtx && summary) {
        let accHistoryData = [45, 52, 60, 68, 75, 82];
        if (summary.accuracyHistory && summary.accuracyHistory.length > 0) {
            accHistoryData = summary.accuracyHistory;
        }

        const bestAcc = Math.max(...accHistoryData);
        const worstAcc = Math.min(...accHistoryData);

        new Chart(accCtx, {
            type: 'line',
            data: {
                labels: accHistoryData.map((_, i) => `T${i+1}`),
                datasets: [{
                    data: accHistoryData,
                    borderColor: '#34d399',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: (ctx) => {
                        const val = ctx.raw;
                        return (val === bestAcc || val === worstAcc) ? 5 : 0;
                    },
                    pointBackgroundColor: (ctx) => {
                        const val = ctx.raw;
                        if (val === bestAcc) return '#34d399'; // Green for highest
                        if (val === worstAcc) return '#ef4444'; // Red for lowest
                        return '#34d399';
                    },
                    pointBorderColor: '#0f172a',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#34d399',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false }, 
                    tooltip: { 
                        enabled: true,
                        backgroundColor: '#0f172a',
                        titleColor: '#cbd5e1',
                        bodyColor: '#f8fafc',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return context.raw + '% Accuracy';
                            }
                        }
                    } 
                },
                scales: { x: { display: false }, y: { display: false } },
                layout: { padding: { top: 6, bottom: 6, left: 6, right: 6 } }
            }
        });
    }

    // 4. Cognitive Profile Radar Chart (The "Brain")
    const radarCtx = document.getElementById('cognitiveRadarChart');
    if (radarCtx && cognitive) {
        new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['Speed', 'Accuracy', 'Endurance', 'Strategy', 'Knowledge'],
                datasets: [{
                    label: 'Your Profile',
                    data: cognitive.userProfile,
                    fill: true,
                    backgroundColor: 'rgba(168, 85, 247, 0.35)',
                    borderColor: '#a855f7',
                    pointBackgroundColor: '#c084fc',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#a855f7',
                    borderWidth: 2,
                    tension: 0.3 // Smooth curves!
                }, {
                    label: 'Topper Average',
                    data: cognitive.topperAverage,
                    fill: true,
                    backgroundColor: 'rgba(52, 211, 153, 0.15)',
                    borderColor: 'rgba(52, 211, 153, 0.6)',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    borderWidth: 1.5,
                    tension: 0.3 // Smooth curves!
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)', circular: true }, // Circular spider web
                        pointLabels: {
                            color: '#e2e8f0',
                            font: { family: 'Outfit', size: 12, weight: '700' }
                        },
                        ticks: { display: false, min: 0, max: 100, stepSize: 20 }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0', font: { size: 12, family: 'Outfit' }, usePointStyle: true, boxWidth: 8 },
                        position: 'bottom'
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#0f172a',
                        titleColor: '#cbd5e1',
                        titleFont: { family: 'Outfit', size: 14, weight: '700' },
                        bodyColor: '#f8fafc',
                        bodyFont: { family: 'Outfit', size: 13 },
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.r !== null) {
                                    label += context.parsed.r + ' / 100';
                                }
                                return label;
                            },
                            afterBody: function(context) {
                                const metric = context[0].label;
                                if (metric === 'Speed') return '\nBased on your average time per question.';
                                if (metric === 'Accuracy') return '\nYour raw correct vs answered precision.';
                                if (metric === 'Endurance') return '\nYour stamina and completion rate.';
                                if (metric === 'Strategy') return '\nYour ability to avoid negative marks.';
                                if (metric === 'Knowledge') return '\nYour overall understanding depth.';
                                return '';
                            }
                        }
                    }
                }
            }
        });
    }

    // --- AI Score Predictor Gauge (Card 1) ---
    const gaugeCtx = document.getElementById('predictorGaugeChart');
    if (gaugeCtx && summary) {
        new Chart(gaugeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Predicted', 'Remaining'],
                datasets: [{
                    data: [summary.predictedScore, 200 - summary.predictedScore], 
                    backgroundColor: [
                        '#8b5cf6', // Purple fill
                        '#27272a'  // Dark background for remainder
                    ],
                    borderWidth: 0,
                    circumference: 180, // Half circle
                    rotation: 270, // Start from left
                    cutout: '80%' // Thin gauge
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                animation: {
                    animateRotate: true,
                    animateScale: false
                }
            }
        });
    }
}

function renderInsights(insights) {
    if (!insights) return;
    
    // Update Micro Weakness
    const cwText = document.querySelector('.cw-text');
    if (cwText && insights.criticalWeakness) {
        cwText.innerHTML = `
            <div style="margin-bottom: 6px;"><span class="mac-badge" style="background: rgba(255, 255, 255, 0.1); color: #94a3b8; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; border: 1px solid rgba(255, 255, 255, 0.05);">${insights.criticalWeakness.topic}</span></div>
            <h4>Critical Weakness: ${insights.criticalWeakness.subTopic}</h4>
            <p>You spend <strong>+${insights.criticalWeakness.extraTime}s extra</strong> per question compared to toppers, with only <strong>${insights.criticalWeakness.accuracy}% accuracy</strong>.</p>
        `;
        const rescueBtn = document.getElementById('generateRescueMockBtn');
        if (rescueBtn) rescueBtn.dataset.topic = insights.criticalWeakness.topic;
    }
    
    // Update Time Leaks
    const leakContainer = document.querySelector('.mac-card:nth-child(3) .mac-content');
    if (leakContainer && insights.timeLeaks) {
        // Find header to insert after
        const heading = leakContainer.querySelector('.strategy-heading');
        // Clear old leaks
        leakContainer.querySelectorAll('.leak-item').forEach(el => el.remove());
        
        let html = '';
        insights.timeLeaks.forEach(leak => {
            html += `
            <div class="leak-item mb-3">
                <div class="leak-header">
                    <span class="leak-topic">${leak.subTopic || leak.topic} <span style="font-size:0.6rem; color:#64748b; margin-left:4px; font-weight:normal;">${leak.subTopic && leak.subTopic !== leak.topic ? `(${leak.topic})` : ''}</span></span>
                    <span class="leak-impact ${leak.impactClass}">${leak.impact}</span>
                </div>
                <p class="leak-desc text-xs text-gray-400">${leak.desc}</p>
                <div class="leak-bar-bg mt-1"><div class="leak-bar-fill" style="width: ${leak.fillPercent}%; background: ${leak.fillColor};"></div></div>
            </div>`;
        });
        
        if (heading) heading.insertAdjacentHTML('afterend', html);
    }
    
    // Update Subject Vitals in Overview
    const vitalsContainer = document.querySelector('.insights-grid');
    if (vitalsContainer && insights.strongestAreas) {
        vitalsContainer.innerHTML = '';
        insights.strongestAreas.forEach(area => {
            vitalsContainer.innerHTML += `
            <div class="insight-status-item">
                <div class="status-indicator ${area.status}"></div>
                <div class="status-details">
                    <span class="subject">${area.topic}</span>
                    <span class="score">${area.score}</span>
                </div>
                <div class="leak-info ${area.leakClass}">${area.leakInfo}</div>
            </div>`;
        });
    }
}


    // --- AI Rescue Mock Generator (Card 2) ---
    const rescueBtn = document.getElementById('generateRescueMockBtn');
    const rescueProgress = document.getElementById('rescueMockProgress');
    
    if (rescueBtn && rescueProgress) {
        rescueBtn.addEventListener('click', () => {
            // Hide button, show progress
            rescueBtn.style.display = 'none';
            rescueProgress.style.display = 'block';
            
            const steps = rescueProgress.querySelectorAll('.progress-steps li');
            const percentText = rescueProgress.querySelector('.progress-percent');
            const barFill = rescueProgress.querySelector('.progress-bar-fill');
            
            // Reset state
            barFill.style.width = '0%';
            percentText.textContent = '0%';
            steps.forEach(step => {
                step.className = 'pending';
                step.innerHTML = '<i class="fa-solid fa-circle-dot" style="color: #52525b;"></i> ' + step.innerText;
            });

            // Simulate AI building process
            let progress = 0;
            const interval = setInterval(async () => {
                progress += Math.floor(Math.random() * 15) + 5;
                if (progress > 100) progress = 100;
                
                barFill.style.width = progress + '%';
                percentText.textContent = progress + '%';

                if (progress > 30 && steps[0].className === 'pending') {
                    steps[0].className = 'done';
                    steps[0].innerHTML = '<i class="fa-solid fa-check text-green"></i> ' + steps[0].innerText;
                }
                if (progress > 60 && steps[1].className === 'pending') {
                    steps[1].className = 'done';
                    steps[1].innerHTML = '<i class="fa-solid fa-check text-green"></i> ' + steps[1].innerText;
                }
                if (progress > 80 && steps[2].className === 'pending') {
                    steps[2].className = 'loading';
                    steps[2].innerHTML = '<i class="fa-solid fa-spinner fa-spin text-purple"></i> ' + steps[2].innerText;
                }

                if (progress === 100) {
                    clearInterval(interval);
                    steps[2].className = 'done';
                    steps[2].innerHTML = '<i class="fa-solid fa-check text-green"></i> ' + steps[2].innerText;
                    
                    try {
                        const token = localStorage.getItem('token');
                        const targetTopic = rescueBtn.dataset.topic || 'Reasoning';
                        const res = await fetch(((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://mockly-backend-fk2i.onrender.com') + '/api/papers/generate-rescue', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'x-auth-token': token 
                            },
                            body: JSON.stringify({ topic: targetTopic })
                        });
                        
                        const data = await res.json();
                        
                        setTimeout(() => {
                            percentText.textContent = 'Ready!';
                            rescueProgress.querySelector('.progress-title').textContent = 'Rescue Mock Generated';
                            
                            if (data.success && data.paperId) {
                                // Redirect to the test details page for the new rescue mock
                                window.location.href = `test-details.html?id=${data.paperId}`;
                            } else {
                                alert(data.message || "Failed to generate mock.");
                                rescueBtn.style.display = 'block';
                                rescueProgress.style.display = 'none';
                            }
                        }, 500);
                        
                    } catch (e) {
                        console.error('Failed to generate rescue mock:', e);
                        alert("Network error. Could not generate Rescue Mock.");
                        rescueBtn.style.display = 'block';
                        rescueProgress.style.display = 'none';
                    }
                }
            }, 400);
        });
    }

    // --- Tab Switching Logic (Overview vs AI Analysis) ---
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-target]');
    const views = document.querySelectorAll('.view-container');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all tabs
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active to clicked tab
            link.classList.add('active');
            
            // Hide all views
            views.forEach(view => {
                view.style.display = 'none';
                view.classList.remove('active-view');
            });
            
            // Show target view
            const targetId = link.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.style.display = 'block';
                // Small timeout to allow display:block to apply before adding class (for fade effects)
                setTimeout(() => targetView.classList.add('active-view'), 10);
            }
        });
    });

    // Check URL parameters to auto-switch tabs
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'ai') {
        const aiLink = Array.from(sidebarLinks).find(l => l.getAttribute('data-target') === 'ai-analysis-view');
        if (aiLink) {
            aiLink.click();
            // Optional: clean up the URL without refreshing
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
    // --- Bento Count Up Animations ---
    const counters = document.querySelectorAll('.count-up');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            // Remove any non-numeric characters for the math, but preserve the small tag
            let currentStr = counter.innerHTML.split('<')[0];
            const current = +currentStr || 0;
            const inc = target / 50; // Speed of counting

            if (current < target) {
                const smallTag = counter.querySelector('small');
                const smallHTML = smallTag ? `<small>${smallTag.innerHTML}</small>` : '';
                counter.innerHTML = Math.ceil(current + inc) + smallHTML;
                setTimeout(updateCount, 20);
            } else {
                const smallTag = counter.querySelector('small');
                const smallHTML = smallTag ? `<small>${smallTag.innerHTML}</small>` : '';
                counter.innerHTML = target + smallHTML;
            }
        };
        updateCount();
    });

    // --- Global Rank Modal Logic ---
    const rankCard = document.getElementById('global-rank-card');
    const rankModal = document.getElementById('rank-summary-modal');
    const closeRankModal = document.getElementById('close-rank-modal');
    let detailedChartInstance = null;

    if (rankCard && rankModal) {
        rankCard.addEventListener('click', async () => {
            rankModal.style.display = 'flex';
            
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://mockly-backend-fk2i.onrender.com') + '/api/analytics/dashboard/summary', {
                    headers: { 'x-auth-token': token }
                });
                const summary = await res.json();
                
                let historyData = [3500, 2100, 1500, 800, 300, 94];
                if (summary.rankHistory && summary.rankHistory.length > 0) {
                    historyData = summary.rankHistory;
                }

                const peak = Math.min(...historyData);
                const first = historyData[0];
                const last = historyData[historyData.length - 1];
                const growth = first - last; // e.g. 3500 - 94 = +3406 rank improvement

                document.getElementById('modal-peak-rank').innerHTML = `${peak}`;
                document.getElementById('modal-growth-val').textContent = growth >= 0 ? `+${growth}` : growth;
                document.getElementById('modal-growth-val').style.color = growth >= 0 ? '#34d399' : '#ef4444';

                const ctx = document.getElementById('detailedRankChart');
                if (detailedChartInstance) detailedChartInstance.destroy();
                
                detailedChartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: historyData.map((_, i) => `Test ${i+1}`),
                        datasets: [{
                            label: 'Global Rank',
                            data: historyData,
                            borderColor: '#818cf8',
                            backgroundColor: 'rgba(129, 140, 248, 0.2)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointBackgroundColor: '#c084fc',
                            pointBorderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: { reverse: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                        }
                    }
                });

            } catch (e) {
                console.error("Failed to load detailed rank history", e);
            }
        });

        closeRankModal.addEventListener('click', () => {
            rankModal.style.display = 'none';
        });

        rankModal.addEventListener('click', (e) => {
            if (e.target === rankModal) {
                rankModal.style.display = 'none';
            }
        });
    }

    // --- Accuracy Modal Logic ---
    const accCard = document.getElementById('accuracy-heat-card');
    const accModal = document.getElementById('accuracy-summary-modal');
    const closeAccModal = document.getElementById('close-acc-modal');
    let detailedAccChartInstance = null;

    if (accCard && accModal) {
        accCard.addEventListener('click', async () => {
            accModal.style.display = 'flex';
            
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://mockly-backend-fk2i.onrender.com') + '/api/analytics/dashboard/summary', {
                    headers: { 'x-auth-token': token }
                });
                const summary = await res.json();
                
                let accHistoryData = [45, 52, 60, 68, 75, 82];
                if (summary.accuracyHistory && summary.accuracyHistory.length > 0) {
                    accHistoryData = summary.accuracyHistory;
                }

                const peak = Math.max(...accHistoryData);
                const first = accHistoryData[0];
                const last = accHistoryData[accHistoryData.length - 1];
                const growth = last - first;

                document.getElementById('modal-peak-acc').innerHTML = `${peak}<small style="font-size: 1rem; color: #94a3b8;">%</small>`;
                document.getElementById('modal-acc-growth-val').textContent = growth >= 0 ? `+${growth}%` : `${growth}%`;
                document.getElementById('modal-acc-growth-val').style.color = growth >= 0 ? '#34d399' : '#ef4444';

                const ctx = document.getElementById('detailedAccuracyChart');
                if (detailedAccChartInstance) detailedAccChartInstance.destroy();
                
                detailedAccChartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: accHistoryData.map((_, i) => `Test ${i+1}`),
                        datasets: [{
                            label: 'Accuracy %',
                            data: accHistoryData,
                            borderColor: '#34d399',
                            backgroundColor: 'rgba(52, 211, 153, 0.2)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointBackgroundColor: '#10b981',
                            pointBorderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                        }
                    }
                });

            } catch (e) {
                console.error("Failed to load detailed accuracy history", e);
            }
        });

        closeAccModal.addEventListener('click', () => {
            accModal.style.display = 'none';
        });

        accModal.addEventListener('click', (e) => {
            if (e.target === accModal) {
                accModal.style.display = 'none';
            }
        });
    }

    // --- Cognitive Profile Modal Logic ---
    const cogCard = document.getElementById('cognitive-card');
    const cogModal = document.getElementById('cognitive-summary-modal');
    const closeCogModal = document.getElementById('close-cognitive-modal');

    if (cogCard && cogModal) {
        cogCard.addEventListener('click', async () => {
            cogModal.style.display = 'flex';
            
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://mockly-backend-fk2i.onrender.com') + '/api/analytics/dashboard/cognitive', {
                    headers: { 'x-auth-token': token }
                });
                const cognitive = await res.json();
                
                if (cognitive && cognitive.userProfile) {
                    const [speed, accuracy, endurance, strategy, knowledge] = cognitive.userProfile;
                    document.getElementById('modal-cog-speed').textContent = speed;
                    document.getElementById('modal-cog-accuracy').textContent = accuracy;
                    document.getElementById('modal-cog-endurance').textContent = endurance;
                    document.getElementById('modal-cog-strategy').textContent = strategy;
                    document.getElementById('modal-cog-knowledge').textContent = knowledge;
                }
            } catch (err) {
                console.error("Failed to fetch detailed cognitive data for modal", err);
            }
        });

        closeCogModal.addEventListener('click', () => {
            cogModal.style.display = 'none';
        });

        cogModal.addEventListener('click', (e) => {
            if (e.target === cogModal) {
                cogModal.style.display = 'none';
            }
        });
    }
});
