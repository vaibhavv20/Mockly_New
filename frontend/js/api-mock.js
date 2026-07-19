document.addEventListener('DOMContentLoaded', () => {
    
    // Function to fetch and render Live Tests
    async function loadLiveTests() {
        const container = document.getElementById('liveCardsScroll');
        
        // Safety check if we aren't on a page with this container
        if (!container) return;
        
        try {
            // Simulate an API call delay for realism (optional)
            // await new Promise(resolve => setTimeout(resolve, 500));
            
            // Fetch from the real backend
            const response = await fetch(((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://mockly-backend-fk2i.onrender.com') + '/api/papers?paperType=Live Test Series');
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            if(!data.success) throw new Error('API returned failure');
            const tests = data.papers;
            
            // Clear any loading states (if we had them)
            container.innerHTML = '';
            
            // Loop through the data and generate HTML
            tests.forEach(test => {
                
                // Determine classes based on if it is live or upcoming
                const now = new Date();
                const isLive = test.startTime ? new Date(test.startTime) <= now : true;
                const cardClass = isLive ? 'active-live' : 'upcoming-card';
                const badgeClass = isLive ? 'badge-live' : 'badge-upcoming';
                const badgeIcon = isLive ? '<span class="pulse-dot"></span>' : '<i class="fa-regular fa-calendar"></i>';
                const statusText = isLive ? 'LIVE NOW' : 'UPCOMING';
                
                // Generate calendar data based on a dummy date or start date if available
                const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
                const dateObj = test.startTime ? new Date(test.startTime) : new Date();
                if (!test.startTime && !isLive) dateObj.setDate(dateObj.getDate() + 2); // default upcoming logic
                
                const calMonth = monthNames[dateObj.getMonth()];
                const calDate = dateObj.getDate();
                const calDay = dayNames[dateObj.getDay()];

                // Determine badge tags
                const examTag = test.examName || test.category || 'SSC';
                const typeTag = isLive ? 'Test Started!' : 'Starts Soon';
                
                const diffLabel = test.difficulty || 'MODERATE';
                let activeBars = 3;
                if (diffLabel === 'EASY') activeBars = 2;
                else if (diffLabel === 'HARD') activeBars = 5;

                let diffBarsHTML = '';
                for (let i = 0; i < 5; i++) {
                    if (i < activeBars) diffBarsHTML += '<div class="diff-bar active"></div>';
                    else diffBarsHTML += '<div class="diff-bar"></div>';
                }
                
                let totalQuestions = 0;
                if (test.sections && test.sections.length > 0) {
                    totalQuestions = test.sections.reduce((acc, sec) => acc + (sec.questions ? sec.questions.length : 0), 0);
                }
                const qsCount = totalQuestions > 0 ? totalQuestions : (test.qs || 100);

                let notifiedTests = JSON.parse(localStorage.getItem('notifiedTests') || '[]');
                const isNotified = notifiedTests.includes(test._id || test.id);

                const cardHTML = `
                    <div class="live-card new-layout glass-card hover-lift">
                        <div class="tcs-verified-badge"><i class="fa-solid fa-certificate"></i> ${test.verifiedTag || 'TCS PATTERN VERIFIED'}</div>
                        
                        <div class="live-card-body-row">
                            <!-- Left Calendar Box -->
                            <div class="calendar-box">
                                <span class="cal-month">${calMonth}</span>
                                <span class="cal-date">${calDate}</span>
                                <span class="cal-day">${calDay}</span>
                            </div>
                            
                            <!-- Right Content -->
                            <div class="live-card-content">
                                <div class="badges-row">
                                    <span class="tag-badge bg-dark-blue">${examTag}</span>
                                    <span class="tag-badge bg-dark-purple">Free for All</span>
                                    ${isLive ? `<span class="status-badge status-live"><span class="pulse-dot-live"></span> Live Now</span>` : 
                                    (test.startTime ? `
                                        <div class="countdown-badge js-countdown" data-start="${test.startTime}">
                                            <i class="fa-solid fa-hourglass-half text-orange fa-spin-pulse"></i>
                                            <div class="timer-unit"><span class="timer-val d-days">00</span><span class="timer-label">Days</span></div><span class="timer-colon">:</span>
                                            <div class="timer-unit"><span class="timer-val d-hours">00</span><span class="timer-label">Hrs</span></div><span class="timer-colon">:</span>
                                            <div class="timer-unit"><span class="timer-val d-mins">00</span><span class="timer-label">Min</span></div><span class="timer-colon">:</span>
                                            <div class="timer-unit"><span class="timer-val d-secs">00</span><span class="timer-label">Sec</span></div>
                                        </div>
                                    ` : `<span class="status-badge status-soon"><i class="fa-regular fa-clock"></i> Starts Soon</span>`)}
                                </div>
                                
                                <h3 class="test-title-wide">${test.title}</h3>
                                
                                <div class="test-meta-wide">
                                    <span><i class="fa-solid fa-list-ol"></i> ${qsCount} Qs</span>
                                    <span><i class="fa-regular fa-clock"></i> ${test.duration || 60} Mins</span>
                                    <span><i class="fa-solid fa-language"></i> Eng / Hindi</span>
                                </div>
                                
                                <div class="difficulty-row">
                                    <span class="diff-label">Difficulty:</span>
                                    <div class="diff-bars">
                                        ${diffBarsHTML}
                                    </div>
                                    <span class="diff-text">${diffLabel}</span>
                                </div>
                                
                                ${test.rewardText !== '' ? `
                                <div class="reward-box">
                                    <i class="fa-solid fa-gift text-orange"></i> ${test.rewardText || 'Top 50 get 1 Month PRO Pass'}
                                </div>` : ''}
                            </div>
                        </div>
                        
                        <div class="live-card-footer-wide">
                            <div class="registered-users">
                                <div class="avatar-group-small">
                                    <img src="assets/avatars/memoji_1.png" class="avatar-sm">
                                    <img src="assets/avatars/memoji_2.png" class="avatar-sm">
                                    <img src="assets/avatars/memoji_3.png" class="avatar-sm">
                                </div>
                                <span>${((test.enrolledCount || Math.floor(Math.random() * 50000 + 10000)) / 1000).toFixed(1)}k registered</span>
                            </div>
                            
                            <div class="action-buttons">
                                <button class="btn-icon-only"><i class="fa-solid fa-share-nodes"></i></button>
                                <button class="${isLive ? 'btn-solid-primary attempt-btn' : (isNotified ? 'btn-solid-dark notified' : 'btn-solid-dark')}" data-id="${test._id || test.id}" ${isLive ? `onclick="window.location.href='tcs-exam.html?id=${test._id || test.id}'"` : `onclick="showNotifyToast('${test._id || test.id}', '${test.title.replace(/'/g, "\\'")}', this)"`} ${isNotified ? 'style="background: rgba(16, 185, 129, 0.2); color: #34d399; border-color: rgba(16, 185, 129, 0.5);"' : ''}>
                                    ${isLive ? 'Attempt Free' : (isNotified ? '<i class="fa-solid fa-bell fa-shake"></i> Notified' : '<i class="fa-regular fa-bell"></i> Notify Me')}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Inject the generated HTML into the container
                container.insertAdjacentHTML('beforeend', cardHTML);
            });
            
            startCountdowns();
            
        } catch (error) {
            console.error('Failed to load live tests:', error);
            container.innerHTML = '<p class="error-msg">Failed to load tests. Please try again later.</p>';
        }
    }

    // Initialize data fetching
    loadLiveTests();
    
    function startCountdowns() {
        setInterval(() => {
            const now = new Date().getTime();
            document.querySelectorAll('.js-countdown').forEach(badge => {
                const start = new Date(badge.getAttribute('data-start')).getTime();
                const diff = start - now;
                if (diff > 0) {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    
                    if (badge.querySelector('.d-days')) badge.querySelector('.d-days').innerText = days.toString().padStart(2, '0');
                    if (badge.querySelector('.d-hours')) badge.querySelector('.d-hours').innerText = hours.toString().padStart(2, '0');
                    if (badge.querySelector('.d-mins')) badge.querySelector('.d-mins').innerText = minutes.toString().padStart(2, '0');
                    if (badge.querySelector('.d-secs')) badge.querySelector('.d-secs').innerText = seconds.toString().padStart(2, '0');
                } else {
                    badge.innerHTML = `<span class="pulse-dot-live"></span> Live Now`;
                    badge.className = 'status-badge status-live';
                    
                    const card = badge.closest('.live-card');
                    if (card) {
                        const btn = card.querySelector('button[data-id]');
                        if (btn && btn.classList.contains('btn-solid-dark')) {
                            btn.className = 'btn-solid-primary attempt-btn';
                            btn.innerHTML = 'Attempt Free';
                            const testId = btn.getAttribute('data-id');
                            btn.onclick = () => window.location.href = `tcs-exam.html?id=${testId}`;
                        }
                    }
                }
            });
        }, 1000);
    }
});
window.showNotifyToast = async function(testId, testName, btnElement) {
    const token = localStorage.getItem('token');
    if (!token) {
        if(typeof showToast === 'function') showToast('Please log in to receive notifications.', 'error');
        else alert('Please log in to receive notifications.');
        const loginBtn = document.getElementById('nav-login-btn');
        if (loginBtn) loginBtn.click();
        return;
    }
    
    if (btnElement && btnElement.classList.contains('notified')) return;
    
    const originalHTML = btnElement ? btnElement.innerHTML : '';
    if(btnElement) btnElement.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    
    try {
        const res = await fetch(((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://mockly-backend-fk2i.onrender.com') + '/api/auth/notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ testId, testName })
        });
        const data = await res.json();
        
        if (res.ok) {
            // Save to localStorage
            let notifiedTests = JSON.parse(localStorage.getItem('notifiedTests') || '[]');
            if(!notifiedTests.includes(testId)) {
                notifiedTests.push(testId);
                localStorage.setItem('notifiedTests', JSON.stringify(notifiedTests));
            }
            
            if(btnElement) {
                btnElement.classList.add('notified');
                btnElement.innerHTML = '<i class="fa-solid fa-bell fa-shake"></i> Notified';
                btnElement.style.background = 'rgba(16, 185, 129, 0.2)';
                btnElement.style.color = '#34d399';
                btnElement.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                btnElement.style.pointerEvents = 'none';
            }
            if(typeof showToast === 'function') showToast(data.msg || `Notification set for ${testName}!`, 'success');
            else alert(data.msg || `Notification set for ${testName}!`);
        } else {
            if(btnElement) btnElement.innerHTML = originalHTML;
            if(typeof showToast === 'function') showToast(data.msg || 'Error setting notification', 'error');
            else alert(data.msg || 'Error setting notification');
        }
    } catch(err) {
        console.error(err);
        if(btnElement) btnElement.innerHTML = originalHTML;
        if(typeof showToast === 'function') showToast('Server error. Please try again later.', 'error');
        else alert('Server error.');
    }
};
