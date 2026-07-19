/**
 * Mockly – Test Details Page (Next-Level)
 * Enhanced: Animated counters, search, difficulty meters,
 * streak heatmap, FAQ accordion, scroll animations, toast
 */

const testCategories = {
    full: {
        name: 'Full Length Mocks',
        icon: 'fa-file-lines',
        iconClass: 'icon-full',
        count: 50,
        tests: [
            { id: 101, title: 'SSC CGL Tier 1 Mock Test 1', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: true, difficulty: 3, attempted: 45200 },
            { id: 102, title: 'SSC CGL Tier 1 Mock Test 2', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: true, difficulty: 3, attempted: 38700 },
            { id: 103, title: 'SSC CGL Tier 1 Mock Test 3', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: true, difficulty: 4, attempted: 32100 },
            { id: 104, title: 'SSC CGL Tier 1 Mock Test 4', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: false, difficulty: 4, attempted: 28400 },
            { id: 105, title: 'SSC CGL Tier 1 Mock Test 5', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: false, difficulty: 3, attempted: 24800 },
            { id: 106, title: 'SSC CGL Tier 1 Mock Test 6', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: false, difficulty: 5, attempted: 21300 },
            { id: 107, title: 'SSC CGL Tier 1 Mock Test 7', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: false, difficulty: 4, attempted: 18900 },
            { id: 108, title: 'SSC CGL Tier 1 Mock Test 8', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: false, difficulty: 3, attempted: 15200 }
        ]
    },

    sectional: {
        name: 'Sectional Tests',
        icon: 'fa-layer-group',
        iconClass: 'icon-sectional',
        count: 40,
        tests: [
            { id: 201, title: 'Quantitative Aptitude Sectional 1', qs: 25, marks: 50, time: 15, negative: -0.50, isFree: true, difficulty: 2, attempted: 28300 },
            { id: 202, title: 'Quantitative Aptitude Sectional 2', qs: 25, marks: 50, time: 15, negative: -0.50, isFree: true, difficulty: 3, attempted: 22100 },
            { id: 203, title: 'General Intelligence & Reasoning 1', qs: 25, marks: 50, time: 15, negative: -0.50, isFree: false, difficulty: 3, attempted: 19800 },
            { id: 204, title: 'General Intelligence & Reasoning 2', qs: 25, marks: 50, time: 15, negative: -0.50, isFree: false, difficulty: 4, attempted: 16500 },
            { id: 205, title: 'English Comprehension 1', qs: 25, marks: 50, time: 15, negative: -0.50, isFree: false, difficulty: 2, attempted: 21400 },
            { id: 206, title: 'English Comprehension 2', qs: 25, marks: 50, time: 15, negative: -0.50, isFree: false, difficulty: 3, attempted: 17200 },
            { id: 207, title: 'General Awareness 1', qs: 25, marks: 50, time: 15, negative: -0.50, isFree: false, difficulty: 2, attempted: 24600 },
            { id: 208, title: 'General Awareness 2', qs: 25, marks: 50, time: 15, negative: -0.50, isFree: false, difficulty: 3, attempted: 19100 }
        ]
    },

    chapter: {
        name: 'Chapter-wise Tests',
        icon: 'fa-book-open',
        iconClass: 'icon-chapter',
        count: 100,
        tests: [
            { id: 301, title: 'Percentages',          qs: 20, marks: 40, time: 20, negative: null, isFree: true, difficulty: 2, attempted: 31200 },
            { id: 302, title: 'Profit & Loss',        qs: 20, marks: 40, time: 20, negative: null, isFree: true, difficulty: 2, attempted: 28700 },
            { id: 303, title: 'Time & Work',          qs: 20, marks: 40, time: 20, negative: null, isFree: true, difficulty: 3, attempted: 25400 },
            { id: 304, title: 'Algebra',              qs: 20, marks: 40, time: 20, negative: null, isFree: true, difficulty: 3, attempted: 22100 },
            { id: 305, title: 'Geometry',             qs: 20, marks: 40, time: 20, negative: null, isFree: false, difficulty: 4, attempted: 18900 },
            { id: 306, title: 'Trigonometry',         qs: 20, marks: 40, time: 20, negative: null, isFree: false, difficulty: 4, attempted: 16300 },
            { id: 307, title: 'Error Spotting',        qs: 20, marks: 40, time: 20, negative: null, isFree: false, difficulty: 3, attempted: 19800 },
            { id: 308, title: 'Cloze Test',           qs: 20, marks: 40, time: 20, negative: null, isFree: false, difficulty: 2, attempted: 17500 },
            { id: 309, title: 'Number Series',        qs: 20, marks: 40, time: 20, negative: null, isFree: false, difficulty: 3, attempted: 15200 },
            { id: 310, title: 'Coding-Decoding',      qs: 20, marks: 40, time: 20, negative: null, isFree: false, difficulty: 3, attempted: 14100 },
            { id: 311, title: 'Indian Polity',        qs: 20, marks: 40, time: 20, negative: null, isFree: false, difficulty: 2, attempted: 21500 },
            { id: 312, title: 'Indian History',       qs: 20, marks: 40, time: 20, negative: null, isFree: false, difficulty: 2, attempted: 20300 }
        ]
    },

    pyq: {
        name: 'Previous Year Papers',
        icon: 'fa-clock-rotate-left',
        iconClass: 'icon-pyq',
        count: 20,
        tests: [
            { id: 401, title: 'SSC CGL Tier 1 (14 July 2023 Shift 1)', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: true, difficulty: 4, attempted: 52300 },
            { id: 402, title: 'SSC CGL Tier 1 (14 July 2023 Shift 2)', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: true, difficulty: 3, attempted: 48100 },
            { id: 403, title: 'SSC CGL Tier 1 (17 July 2023 Shift 1)', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: false, difficulty: 4, attempted: 35600 },
            { id: 404, title: 'SSC CGL Tier 1 (17 July 2023 Shift 2)', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: false, difficulty: 3, attempted: 31200 },
            { id: 405, title: 'SSC CGL Tier 1 (26 July 2023 Shift 1)', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: false, difficulty: 5, attempted: 28700 },
            { id: 406, title: 'SSC CGL Tier 1 (26 July 2023 Shift 2)', qs: 100, marks: 200, time: 60, negative: -0.50, isFree: false, difficulty: 4, attempted: 25400 }
        ]
    }
};

/* ── Utility Functions ─────────────────────── */
function formatNumber(num) {
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
}

function getDifficultyInfo(level) {
    if (level <= 2) return { text: 'Easy', cls: 'easy' };
    if (level <= 3) return { text: 'Moderate', cls: 'moderate' };
    return { text: 'Hard', cls: 'hard' };
}

function showToast(message, icon = 'fa-solid fa-check-circle text-green') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${icon}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('hiding'); }, 2500);
    setTimeout(() => { toast.remove(); }, 3000);
}

/* ── DOM Ready ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
    const tabsContainer   = document.getElementById('tdTabs');
    const testListContainer = document.getElementById('testList');
    const searchInput      = document.getElementById('testSearchInput');
    const searchCount      = document.getElementById('searchCount');

    const urlParams = new URLSearchParams(window.location.search);
    const requestedTab = urlParams.get('tab');
    let currentTab = (requestedTab && testCategories[requestedTab]) ? requestedTab : 'full';
    let searchQuery = '';

    /* ── Initialise ────────────────────────── */
    async function init() {
        await fetchRealTests(); // Fetch from backend API first
        renderTabs();
        renderSectionHeader();
        renderTests(currentTab);
        initScrollAnimations();
        initAnimatedCounters();
        initStreakGrid();
        initFaqAccordion();
        initOfferCountdown();
        initSearchBar();
    }

    /* ── API Fetching ────────────────────────── */
    async function fetchRealTests() {
        try {
            const response = await fetch('http://localhost:5000/api/papers?category=ssc-cgl');
            const data = await response.json();
            if (data.success && data.papers) {
                // Clear old mock data
                testCategories.full.tests = [];
                testCategories.sectional.tests = [];
                testCategories.chapter.tests = [];
                testCategories.pyq.tests = [];

                data.papers.forEach(p => {
                    const testObj = {
                        id: p._id,
                        title: p.title,
                        qs: p.totalMarks / 2 || 100, // Rough estimate if we don't have totalQs
                        marks: p.totalMarks || 200,
                        time: p.duration || 60,
                        negative: -0.5,
                        isFree: true,
                        difficulty: 3,
                        attempted: Math.floor(Math.random() * 50000) + 10000
                    };

                    const type = p.paperType || 'Full Length Mock';
                    if (type === 'Full Length Mock') testCategories.full.tests.push(testObj);
                    else if (type === 'Sectional') testCategories.sectional.tests.push(testObj);
                    else if (type === 'Chapter-wise') testCategories.chapter.tests.push(testObj);
                    else if (type === 'PYP') testCategories.pyq.tests.push(testObj);
                    else testCategories.full.tests.push(testObj);
                });

                // Update counts
                testCategories.full.count = testCategories.full.tests.length;
                testCategories.sectional.count = testCategories.sectional.tests.length;
                testCategories.chapter.count = testCategories.chapter.tests.length;
                testCategories.pyq.count = testCategories.pyq.tests.length;
            }
        } catch (e) {
            console.warn('API Error, falling back to mock data', e);
        }
    }

    /* ── Tabs ───────────────────────────────── */
    function renderTabs() {
        tabsContainer.innerHTML = '';
        Object.keys(testCategories).forEach(key => {
            const cat = testCategories[key];
            const btn = document.createElement('button');
            btn.className = `td-tab${key === currentTab ? ' active' : ''}`;
            btn.setAttribute('data-tab', key);
            btn.innerHTML = `
                <span class="tab-icon ${cat.iconClass}"><i class="fa-solid ${cat.icon}"></i></span>
                <span class="tab-text">${cat.name}</span>
                <span class="tab-count">${cat.count}</span>
            `;
            btn.addEventListener('click', () => {
                if (currentTab === key) return;
                document.querySelectorAll('.td-tab').forEach(el => el.classList.remove('active'));
                btn.classList.add('active');
                currentTab = key;
                searchQuery = '';
                if (searchInput) searchInput.value = '';
                updateSectionHeader();
                renderTests(currentTab);
            });
            tabsContainer.appendChild(btn);
        });
    }

    /* ── Section Header ────────────────────── */
    function renderSectionHeader() {
        const wrapper = document.querySelector('.td-tabs-wrapper');
        if (!wrapper) return;
        const header = document.createElement('div');
        header.className = 'td-section-header';
        header.id = 'tdSectionHeader';
        // Insert after search bar
        const searchBar = document.querySelector('.td-search-bar');
        if (searchBar) {
            searchBar.parentNode.insertBefore(header, searchBar.nextSibling);
        } else {
            wrapper.parentNode.insertBefore(header, wrapper.nextSibling);
        }
        updateSectionHeader();
    }

    function updateSectionHeader() {
        const header = document.getElementById('tdSectionHeader');
        if (!header) return;
        const cat = testCategories[currentTab];
        const shown = getFilteredTests().length;
        header.innerHTML = `
            <div class="td-section-info">
                <h3 class="td-section-title">${cat.name}</h3>
                <span class="td-section-count">Showing ${shown} of ${cat.count} tests</span>
            </div>
            <div class="td-sort-dropdown">
                <select aria-label="Sort tests" id="sortSelect">
                    <option value="default">Sort: Default</option>
                    <option value="name">Sort: A – Z</option>
                    <option value="qs-asc">Sort: Questions ↑</option>
                    <option value="qs-desc">Sort: Questions ↓</option>
                    <option value="free-first">Free First</option>
                    <option value="popular">Most Popular</option>
                </select>
            </div>
        `;
        // Sort handler
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => renderTests(currentTab));
        }
    }

    /* ── Search ────────────────────────────── */
    function initSearchBar() {
        if (!searchInput) return;
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            updateSectionHeader();
            renderTests(currentTab);
        });
    }

    function getFilteredTests() {
        let tests = [...testCategories[currentTab].tests];
        if (searchQuery) {
            tests = tests.filter(t => t.title.toLowerCase().includes(searchQuery));
        }
        return tests;
    }

    function getSortedTests(tests) {
        const sortSelect = document.getElementById('sortSelect');
        const sortVal = sortSelect ? sortSelect.value : 'default';
        const sorted = [...tests];
        switch (sortVal) {
            case 'name': sorted.sort((a, b) => a.title.localeCompare(b.title)); break;
            case 'qs-asc': sorted.sort((a, b) => a.qs - b.qs); break;
            case 'qs-desc': sorted.sort((a, b) => b.qs - a.qs); break;
            case 'free-first': sorted.sort((a, b) => (b.isFree ? 1 : 0) - (a.isFree ? 1 : 0)); break;
            case 'popular': sorted.sort((a, b) => b.attempted - a.attempted); break;
        }
        return sorted;
    }

    /* ── Test Rows ─────────────────────────── */
    function renderTests(tabKey) {
        let tests = getFilteredTests();
        tests = getSortedTests(tests);
        testListContainer.innerHTML = '';

        if (searchCount) {
            searchCount.textContent = searchQuery ? `${tests.length} found` : '';
        }

        if (tests.length === 0) {
            testListContainer.innerHTML = `
                <div class="no-results">
                    <i class="fa-solid fa-search"></i>
                    <p>No tests found matching "${searchQuery}"</p>
                </div>
            `;
            return;
        }

        const avatars = ['memoji_1.png', 'memoji_2.png', 'memoji_3.png', 'memoji_6.png'];

        tests.forEach((test, index) => {
            const row = document.createElement('div');
            row.className = 'premium-test-card glass-card';
            row.style.animationDelay = `${index * 0.06}s`;

            const isLocked = !test.isFree;
            const statusIcon = isLocked
                ? '<div class="test-status locked"><i class="fa-solid fa-lock"></i></div>'
                : '<div class="test-status unlocked"><i class="fa-solid fa-unlock"></i></div>';
            
            const tag = isLocked
                ? '<span class="test-badge badge-pro"><i class="fa-solid fa-crown"></i> PRO</span>'
                : '<span class="test-badge badge-free">Free</span>';

            const buttonClass = isLocked ? 'btn-locked' : 'btn-primary btn-glow';
            const buttonText = isLocked
                ? '<i class="fa-solid fa-lock"></i> Unlock PRO'
                : 'Start Test <i class="fa-solid fa-arrow-right"></i>';

            let negativeMarkup = test.negative !== null && test.negative !== undefined 
                ? `<i class="fa-solid fa-circle-minus"></i> ${test.negative} Neg.`
                : `<i class="fa-solid fa-circle-check text-green"></i> No Neg.`;

            // Difficulty
            const diff = getDifficultyInfo(test.difficulty || 3);
            let diffBars = '';
            for (let i = 1; i <= 5; i++) {
                diffBars += `<span class="diff-bar${i <= (test.difficulty || 3) ? ' filled' : ''}"></span>`;
            }

            // Attempt count with mini avatar stack
            const randomAvatars = avatars.slice(0, 3).map(a => 
                `<img src="assets/avatars/${a}" alt="">`
            ).join('');

            row.innerHTML = `
                ${statusIcon}
                <div class="test-content">
                    <div class="test-header">
                        <h4 class="test-title">${test.title}</h4>
                        ${tag}
                    </div>
                    <div class="test-meta">
                        <span class="meta-item"><i class="fa-solid fa-list-ol"></i> ${test.qs} Qs</span>
                        <span class="meta-item"><i class="fa-solid fa-star"></i> ${test.marks} Marks</span>
                        <span class="meta-item"><i class="fa-regular fa-clock"></i> ${test.time} Mins</span>
                        <span class="meta-item">${negativeMarkup}</span>
                    </div>
                    <div class="card-difficulty">
                        <span class="difficulty-label">Difficulty:</span>
                        <div class="difficulty-meter">${diffBars}</div>
                        <span class="difficulty-text ${diff.cls}">${diff.text}</span>
                    </div>
                    <div class="test-attempt-count">
                        <div class="mini-avatar-stack">${randomAvatars}</div>
                        <span>${formatNumber(test.attempted)} attempted</span>
                    </div>
                </div>
                <div class="test-actions">
                    <a href="tcs-exam.html?id=${test.id}" class="${buttonClass}">
                        ${buttonText}
                    </a>
                    ${!isLocked ? '<div class="test-progress"><div class="progress-bar"><div class="fill" style="width:0%"></div></div><span class="progress-text">Not Attempted</span></div>' : ''}
                </div>
            `;

            testListContainer.appendChild(row);
        });
    }

    /* ── Animated Counters ─────────────────── */
    function initAnimatedCounters() {
        const counters = document.querySelectorAll('.counter-animate');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => observer.observe(c));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const value = Math.round(target * eased);
            el.textContent = value.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    /* ── Scroll Animations ─────────────────── */
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        elements.forEach(el => observer.observe(el));
    }

    /* ── Study Streak Heatmap ──────────────── */
    function initStreakGrid() {
        const grid = document.getElementById('streakGrid');
        if (!grid) return;
        
        // Generate 4 weeks x 7 days = 28 cells
        const today = new Date();
        const dayOfWeek = (today.getDay() + 6) % 7; // Mon=0, Sun=6

        for (let week = 3; week >= 0; week--) {
            for (let day = 0; day < 7; day++) {
                const cell = document.createElement('div');
                cell.className = 'streak-cell';
                
                const daysAgo = week * 7 + (6 - day);
                const isToday = (week === 0 && day === dayOfWeek);
                const isFuture = (week === 0 && day > dayOfWeek);

                if (isToday) {
                    cell.classList.add('today');
                } else if (!isFuture) {
                    // Random activity for demo
                    const rand = Math.random();
                    if (rand > 0.7) cell.classList.add('level-3');
                    else if (rand > 0.4) cell.classList.add('level-2');
                    else if (rand > 0.2) cell.classList.add('level-1');
                }
                
                grid.appendChild(cell);
            }
        }
    }

    /* ── FAQ Accordion ─────────────────────── */
    function initFaqAccordion() {
        const questions = document.querySelectorAll('.faq-question');
        questions.forEach(q => {
            q.addEventListener('click', () => {
                const item = q.closest('.faq-item');
                const isActive = item.classList.contains('active');
                
                // Close all
                document.querySelectorAll('.faq-item.active').forEach(faq => {
                    faq.classList.remove('active');
                });
                
                // Toggle clicked
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    /* ── Offer Countdown ───────────────────── */
    function initOfferCountdown() {
        const el = document.getElementById('offerCountdown');
        if (!el) return;

        // Set to midnight tonight
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(23, 59, 59, 0);

        function updateTimer() {
            const diff = midnight - new Date();
            if (diff <= 0) {
                el.textContent = 'Expired!';
                return;
            }
            const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
            const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
            el.textContent = `${h}:${m}:${s}`;
        }
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    /* ── Syllabus Modal Logic ──────────────── */
    const syllabusModal = document.getElementById('syllabus-modal');
    const closeSyllabusBtn = document.getElementById('close-syllabus');
    const modalTestTitle = document.getElementById('modal-test-title');

    window.openSyllabusModal = function(title) {
        if (modalTestTitle) modalTestTitle.textContent = title;
        if (syllabusModal) syllabusModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    if (closeSyllabusBtn) {
        closeSyllabusBtn.addEventListener('click', () => {
            syllabusModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    if (syllabusModal) {
        syllabusModal.addEventListener('click', (e) => {
            if (e.target === syllabusModal) {
                syllabusModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    /* ── PRO Upsell Toast ──────────────────── */
    const proBtn = document.getElementById('proUpsellBtn');
    if (proBtn) {
        proBtn.addEventListener('click', () => {
            showToast('🎉 Redirecting to checkout...', 'fa-solid fa-crown text-purple');
        });
    }

    /* ── Boot ───────────────────────────────── */
    init();
});
