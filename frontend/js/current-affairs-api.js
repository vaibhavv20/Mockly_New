/**
 * Current Affairs API — Premium V2
 * Newspaper-Magazine layout with Featured/Standard/Compact cards
 */

const MockDatabase = {
    newsFeed: []
};

let apiDataCache = [];
let isHindi = false;
let flashcardArticles = [];
let currentFlashcardIndex = 0;

// --- Utility Functions ---
function estimateReadingTime(text) {
    if (!text) return 1;
    const words = text.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

function getRelativeDate(dateStr) {
    const today = new Date();
    const targetDate = new Date(dateStr);
    
    // Normalize to midnight UTC for accurate day difference
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const utcTarget = Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const diffTime = utcToday - utcTarget;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays === -1) return 'Tomorrow';
    if (diffDays < 0) return `In ${Math.abs(diffDays)} days`;
    return `${diffDays} days ago`;
}

function getFullDateLabel(dateStr) {
    const date = new Date(dateStr);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getCategoryLabel(cat) {
    const labels = {
        'economy': 'Economy',
        'polity': 'Polity',
        'science': 'Science & Tech',
        'environment': 'Environment',
        'sports': 'Sports',
        'international': 'International'
    };
    return labels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
}

function getCategoryIcon(cat) {
    const icons = {
        'economy': 'fa-chart-line',
        'polity': 'fa-landmark',
        'science': 'fa-atom',
        'environment': 'fa-leaf',
        'sports': 'fa-trophy',
        'international': 'fa-globe'
    };
    return icons[cat] || 'fa-newspaper';
}

// Actual Fetch Call to Backend
async function fetchNews(dateFilter = null) {
    try {
        if (apiDataCache.length === 0) {
            const response = await fetch(((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://mockly-backend-fk2i.onrender.com') + '/api/current-affairs');
            if (response.ok) {
                const dbData = await response.json();
                apiDataCache = dbData.map(item => {
                    const dateObj = new Date(item.date);
                    return {
                        id: item._id,
                        type: item.itemType || 'article',
                        dateStr: dateObj.toISOString().split('T')[0], // Backend-ready full date format
                        fullDateObj: dateObj,
                        category: item.category.toLowerCase().split(' ')[0] || 'general',
                        titleEn: item.title,
                        titleHi: item.titleHi || item.title,
                        descEn: item.content,
                        descHi: item.contentHi || item.content,
                        tags: [item.category.split(',')[0]],
                        customTags: item.customTags || [],
                        question: item.question,
                        options: item.options || [],
                        thumb: item.image ? ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://mockly-backend-fk2i.onrender.com') + '' + item.image : null,
                        icon: 'fa-newspaper'
                    };
                });
            }
        }
    } catch (e) {
        console.error('Failed to fetch from real API. Falling back to MockDatabase.');
    }
    
    // Fallback to mock data if API fails
    if (apiDataCache.length === 0) {
        apiDataCache = [...MockDatabase.newsFeed];
    }

    let data = [...apiDataCache];

    if (dateFilter) {
        data = data.filter(item => item.dateStr === dateFilter);
    }
    
    // Group by Date for rendering date markers
    const grouped = {};
    data.forEach(item => {
        if (!grouped[item.dateStr]) grouped[item.dateStr] = [];
        grouped[item.dateStr].push(item);
    });
    return grouped;
}


// --- Card Renderers ---

function renderTagsHtml(item) {
    let html = item.tags.map(tag => `<span class="ca-micro-tag">${tag}</span>`).join('');
    if (item.customTags && item.customTags.length > 0) {
        html += item.customTags.map(tag => `<span class="ca-micro-tag" style="background-color: ${tag.color}20; color: ${tag.color}; border: 1px solid ${tag.color}40;">${tag.name}</span>`).join('');
    }
    return html;
}

function getTitle(item) {
    return isHindi ? (item.titleHi || item.titleEn || item.title) : (item.titleEn || item.title);
}

function getDesc(item) {
    const raw = isHindi ? (item.descHi || item.descEn || item.desc) : (item.descEn || item.desc);
    return typeof marked !== 'undefined' ? marked.parse(raw) : raw;
}

function renderFeaturedCard(item, articleNum, totalArticles) {
    const tagsHtml = renderTagsHtml(item);
    const titleToUse = getTitle(item);
    const parsedDesc = getDesc(item);
    const readTime = estimateReadingTime(item.descEn || item.desc);
    const cat = item.category;
    const catLabel = getCategoryLabel(cat);
    const catIcon = getCategoryIcon(cat);

    return `
        <div class="ca-featured-card ca-animate-in ${!item.thumb ? 'no-image' : ''}" data-category="${cat}" data-date="${item.dateStr}">
            ${item.thumb ? `
            <div class="ca-featured-image">
                <img src="${item.thumb.replace('w=200&h=150', 'w=800&h=400')}" alt="${titleToUse}" onerror="this.src='https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800&h=400'" onclick="openImageModal(this.src)" style="cursor: pointer;">
                <div class="ca-featured-image-overlay"></div>
                <div class="ca-featured-category">
                    <span class="ca-tag-v2 tag-${cat}"><i class="fa-solid ${catIcon}"></i> ${catLabel}</span>
                </div>
            </div>` : `
            <div class="ca-featured-category" style="position: relative; top: 0; left: 0; padding: 25px 25px 0 25px;">
                <span class="ca-tag-v2 tag-${cat}"><i class="fa-solid ${catIcon}"></i> ${catLabel}</span>
            </div>
            `}
            <div class="ca-featured-body">
                <div class="ca-featured-meta">
                    <span class="ca-article-number">#${articleNum} of ${totalArticles} today</span>
                    <span class="ca-reading-time-pill"><i class="fa-regular fa-clock"></i> ${readTime} min read</span>
                </div>
                <h3>${titleToUse}</h3>
                <div class="ca-featured-desc ca-card-desc-content">${parsedDesc}</div>
                <div class="ca-featured-footer">
                    <div class="ca-featured-tags">${tagsHtml}</div>
                    <div class="ca-featured-actions">
                        <a href="#" class="read-more" onclick="toggleReadMore(event, this)">Read More <i class="fa-solid fa-arrow-right"></i></a>
                        <button class="ca-bookmark-btn-v2" title="Bookmark" onclick="toggleBookmarkV2(this)"><i class="fa-regular fa-bookmark"></i></button>
                        <button class="ca-share-btn" title="Share" onclick="shareArticle('${titleToUse}')"><i class="fa-solid fa-share-nodes"></i></button>
                        <button class="ca-copy-btn" title="Copy link" onclick="copyArticleLink(this, '${titleToUse}')"><i class="fa-regular fa-copy"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderStandardCard(item, articleNum, totalArticles) {
    const tagsHtml = renderTagsHtml(item);
    const titleToUse = getTitle(item);
    const parsedDesc = getDesc(item);
    const readTime = estimateReadingTime(item.descEn || item.desc);
    const cat = item.category;
    const catLabel = getCategoryLabel(cat);
    const catIcon = getCategoryIcon(cat);

    return `
        <div class="ca-standard-card glass-card ca-animate-in ${!item.thumb ? 'no-image' : ''}" data-category="${cat}" data-date="${item.dateStr}">
            ${item.thumb ? `
            <div class="ca-standard-thumb">
                <img src="${item.thumb.replace('w=200&h=150', 'w=400&h=250')}" alt="${titleToUse}" onerror="this.src='https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=250'" onclick="openImageModal(this.src)" style="cursor: pointer;">
            </div>` : ''}
            <div class="ca-standard-body">
                <div class="ca-standard-header">
                    <div class="ca-standard-header-left">
                        <span class="ca-tag-v2 tag-${cat}"><i class="fa-solid ${catIcon}"></i> ${catLabel}</span>
                        <span class="ca-reading-time-pill"><i class="fa-regular fa-clock"></i> ${readTime} min</span>
                    </div>
                    <button class="ca-bookmark-btn-v2" title="Bookmark" onclick="toggleBookmarkV2(this)"><i class="fa-regular fa-bookmark"></i></button>
                </div>
                <h3>${titleToUse}</h3>
                <div class="ca-standard-desc ca-card-desc-content">${parsedDesc}</div>
                <div class="ca-standard-footer">
                    <div class="ca-standard-tags">${tagsHtml}</div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <a href="#" class="read-more" onclick="toggleReadMore(event, this)">Read More <i class="fa-solid fa-arrow-right"></i></a>
                        <button class="ca-share-btn" title="Share" onclick="shareArticle('${titleToUse}')"><i class="fa-solid fa-share-nodes"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderCompactCard(item) {
    const titleToUse = getTitle(item);
    const parsedDesc = getDesc(item);
    const cat = item.category;
    const catLabel = getCategoryLabel(cat);
    const catIcon = getCategoryIcon(cat);

    return `
        <div class="ca-compact-card ca-animate-in" data-category="${cat}" data-date="${item.dateStr}" onclick="toggleCompactCard(this)">
            <div class="ca-compact-icon icon-${cat}"><i class="fa-solid ${catIcon}"></i></div>
            <div class="ca-compact-content">
                <h4>${titleToUse}</h4>
                <div class="ca-compact-desc-hidden" style="display:none;">${parsedDesc}</div>
            </div>
            <div class="ca-compact-right">
                <span class="ca-compact-tag ca-tag-v2 tag-${cat}">${catLabel}</span>
                <span class="ca-compact-time">${getRelativeDate(item.dateStr)}</span>
            </div>
        </div>
    `;
}

function renderQuizCard(item, date) {
    const optionsHtml = item.options.map((opt) =>
        `<button class="ca-quiz-opt-v2" data-correct="${opt.correct}" onclick="handleQuizV2(this)">${opt.text}</button>`
    ).join('');

    return `
        <div class="ca-quiz-card-v2 ca-animate-in" data-date="${date}">
            <div class="ca-quiz-header-v2">
                <div class="ca-quiz-header-v2-left">
                    <i class="fa-solid fa-brain"></i>
                    <span>Quick Quiz</span>
                </div>
                <span class="ca-quiz-difficulty medium">Medium</span>
            </div>
            <p class="ca-quiz-question-v2">${item.question}</p>
            <div class="ca-quiz-options-v2" id="${item.id}">
                ${optionsHtml}
            </div>
            <div class="ca-quiz-feedback-v2"></div>
        </div>
    `;
}

function renderFactCard(item, date) {
    return `
        <div class="ca-fact-card-v2 ca-animate-in" data-category="all" data-date="${date}">
            <div class="fact-header"><i class="fa-solid fa-lightbulb"></i> Fact of the Day</div>
            <div class="fact-content">${item.content}</div>
            <div class="fact-meta"><i class="fa-solid fa-link"></i> ${item.linkText}</div>
        </div>
    `;
}


// --- Main Render ---
async function renderTimeline(dateFilter = null) {
    const container = document.getElementById('ca-feed-container');
    
    container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--primary); margin-bottom: 15px;"></i>
            <p>Fetching latest current affairs...</p>
        </div>
    `;

    const data = await fetchNews(dateFilter);
    let html = '';

    const sortedDates = Object.keys(data).sort((a, b) => new Date(b) - new Date(a));

    if (sortedDates.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <i class="fa-regular fa-folder-open" style="font-size: 2.5rem; margin-bottom: 15px;"></i>
                <p>No news found for this date.</p>
            </div>
        `;
        return;
    }

    // Collect articles for flashcard mode
    flashcardArticles = [];

    const todayDate = new Date();
    const utcToday = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

    sortedDates.forEach((date, dateIdx) => {
        const items = data[date];
        const articles = items.filter(i => i.type === 'article');
        const quizzes = items.filter(i => i.type === 'quiz');
        const facts = items.filter(i => i.type === 'fact');
        const totalArticles = articles.length;
        
        const targetDate = new Date(date);
        const utcTarget = Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        const diffDays = Math.floor((utcToday - utcTarget) / (1000 * 60 * 60 * 24));
        const isOlderDate = diffDays >= 2;

        const dayNum = targetDate.getDate();
        const monthNamesShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const monthShort = monthNamesShort[targetDate.getMonth()];

        // Collect for flashcards
        articles.forEach(a => flashcardArticles.push(a));

        // --- Date Section Header ---
        html += `<div class="ca-date-section" data-date="${date}">`;
        html += `
            <div class="ca-date-section-header ca-animate-in">
                <div class="ca-date-badge">
                    <span class="date-num">${dayNum}</span>
                    <span class="date-month">${monthShort}</span>
                </div>
                <div class="ca-date-info">
                    <div class="ca-date-title">${getRelativeDate(date)} — ${getFullDateLabel(date)}</div>
                    <div class="ca-date-subtitle">
                        <span class="article-count-badge"><i class="fa-solid fa-newspaper"></i> ${totalArticles} article${totalArticles !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>
        `;

        // --- Quick Revision Strip ---
        if (articles.length > 0) {
            const revisionBullets = articles.map(a => {
                const title = getTitle(a);
                return `<li>${title}</li>`;
            }).join('');
            html += `
                <div class="ca-quick-revision ca-animate-in">
                    <div class="ca-quick-revision-header" onclick="toggleQuickRevision(this)">
                        <div class="ca-quick-revision-label"><i class="fa-solid fa-bolt"></i> Quick Revision</div>
                        <button class="ca-quick-revision-toggle"><i class="fa-solid fa-chevron-down"></i></button>
                    </div>
                    <div class="ca-quick-revision-body">
                        <ul class="ca-quick-revision-list">
                            ${revisionBullets}
                        </ul>
                    </div>
                </div>
            `;
        }

        // --- Render Articles ---
        if (isOlderDate) {
            // Compact mode for older dates
            html += `<div class="ca-compact-list">`;
            articles.forEach(item => {
                html += renderCompactCard(item);
            });
            html += `</div>`;
        } else {
            // Featured + Grid for recent dates
            let articleIndex = 0;

            // Featured card (first article)
            if (articles.length > 0) {
                articleIndex++;
                html += renderFeaturedCard(articles[0], articleIndex, totalArticles);
            }

            // Standard grid (remaining articles)
            if (articles.length > 1) {
                html += `<div class="ca-articles-grid">`;
                for (let i = 1; i < articles.length; i++) {
                    articleIndex++;
                    html += renderStandardCard(articles[i], articleIndex, totalArticles);
                }
                html += `</div>`;
            }
        }

        // --- Render Quizzes ---
        quizzes.forEach(item => {
            html += renderQuizCard(item, date);
        });

        // --- Render Facts ---
        facts.forEach(item => {
            html += renderFactCard(item, date);
        });

        html += `</div>`; // close .ca-date-section
    });

    // --- Flashcard Items (hidden by default, shown in flashcard mode) ---
    if (flashcardArticles.length > 0) {
        html += `
            <div class="ca-flashcard-nav">
                <button class="ca-flashcard-nav-btn" onclick="navigateFlashcard(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                <span class="ca-flashcard-progress"><span id="flashcard-current">1</span> / <span id="flashcard-total">${flashcardArticles.length}</span></span>
                <button class="ca-flashcard-nav-btn" onclick="navigateFlashcard(1)"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
        `;
        flashcardArticles.forEach((a, idx) => {
            const title = getTitle(a);
            const desc = getDesc(a);
            html += `
                <div class="ca-flashcard-item ${idx === 0 ? 'active-flashcard' : ''}" data-index="${idx}" onclick="flipFlashcard(this)">
                    <div class="ca-flashcard-inner">
                        <div class="ca-flashcard-front">
                            <span class="ca-tag-v2 tag-${a.category}" style="margin-bottom: 16px;"><i class="fa-solid ${getCategoryIcon(a.category)}"></i> ${getCategoryLabel(a.category)}</span>
                            <h3>${title}</h3>
                            <div class="ca-flashcard-hint"><i class="fa-solid fa-hand-pointer"></i> Tap to reveal details</div>
                        </div>
                        <div class="ca-flashcard-back">
                            <div class="ca-flashcard-answer-label"><i class="fa-solid fa-check-circle"></i> Key Details</div>
                            ${desc}
                        </div>
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = html;

    // --- Initialize IntersectionObserver for scroll animations ---
    initScrollAnimations();
}


// --- Scroll Animations ---
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.ca-animate-in');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(el => observer.observe(el));
}


// --- Interaction Handlers ---

// Quiz handler V2
window.handleQuizV2 = function(btn) {
    const parent = btn.closest('.ca-quiz-options-v2');
    const feedbackEl = parent.nextElementSibling;
    const isCorrect = btn.dataset.correct === 'true';

    parent.querySelectorAll('.ca-quiz-opt-v2').forEach(opt => {
        opt.classList.add('answered');
        if (opt.dataset.correct === 'true') {
            opt.classList.add('correct');
        } else if (opt === btn && !isCorrect) {
            opt.classList.add('wrong');
        }
    });

    if (feedbackEl) {
        if (isCorrect) {
            feedbackEl.className = 'ca-quiz-feedback-v2 correct-feedback';
            feedbackEl.innerHTML = '<i class="fa-solid fa-check-circle"></i> Correct! Great job staying on top of current affairs.';
            // Mini confetti burst
            spawnConfetti(btn);
        } else {
            feedbackEl.className = 'ca-quiz-feedback-v2 wrong-feedback';
            feedbackEl.innerHTML = '<i class="fa-solid fa-times-circle"></i> Incorrect. Review the article above for the correct answer.';
        }
    }
};

function spawnConfetti(target) {
    const rect = target.getBoundingClientRect();
    const container = target.closest('.ca-quiz-card-v2');
    if (!container) return;
    
    const colors = ['#34d399', '#60a5fa', '#facc15', '#f472b6', '#a78bfa'];
    for (let i = 0; i < 12; i++) {
        const piece = document.createElement('div');
        piece.className = 'ca-quiz-confetti-piece';
        piece.style.background = colors[i % colors.length];
        const angle = (i / 12) * Math.PI * 2;
        const dist = 40 + Math.random() * 30;
        piece.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        piece.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
        piece.style.left = '50%';
        piece.style.top = '50%';
        piece.style.position = 'absolute';
        container.style.position = 'relative';
        container.appendChild(piece);
        setTimeout(() => piece.remove(), 800);
    }
}

// Bookmark V2
window.toggleBookmarkV2 = function(btn) {
    btn.classList.toggle('bookmarked');
    const icon = btn.querySelector('i');
    if (btn.classList.contains('bookmarked')) {
        icon.className = 'fa-solid fa-bookmark';
    } else {
        icon.className = 'fa-regular fa-bookmark';
    }
};

// Share
window.shareArticle = function(title) {
    if (navigator.share) {
        navigator.share({ title: title, text: title, url: window.location.href });
    } else {
        navigator.clipboard.writeText(title + ' — ' + window.location.href);
        showToast('Link copied to clipboard!');
    }
};

// Copy link
window.copyArticleLink = function(btn, title) {
    navigator.clipboard.writeText(title + ' — ' + window.location.href).then(() => {
        btn.classList.add('copied');
        const icon = btn.querySelector('i');
        icon.className = 'fa-solid fa-check';
        setTimeout(() => {
            btn.classList.remove('copied');
            icon.className = 'fa-regular fa-copy';
        }, 2000);
    });
};

// Quick Revision Toggle
window.toggleQuickRevision = function(header) {
    const parent = header.closest('.ca-quick-revision');
    parent.classList.toggle('expanded');
};

// Compact Card Toggle
window.toggleCompactCard = function(card) {
    card.classList.toggle('expanded');
    const hiddenDesc = card.querySelector('.ca-compact-desc-hidden');
    const contentDiv = card.querySelector('.ca-compact-content');
    if (card.classList.contains('expanded') && hiddenDesc) {
        let pEl = contentDiv.querySelector('.ca-compact-expanded-desc');
        if (!pEl) {
            pEl = document.createElement('div');
            pEl.className = 'ca-compact-expanded-desc';
            pEl.style.cssText = 'font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-top: 8px;';
            pEl.innerHTML = hiddenDesc.innerHTML;
            contentDiv.appendChild(pEl);
        }
        pEl.style.display = 'block';
    } else {
        const pEl = contentDiv.querySelector('.ca-compact-expanded-desc');
        if (pEl) pEl.style.display = 'none';
    }
};

// Flashcard Mode
window.flipFlashcard = function(card) {
    card.classList.toggle('flipped');
};

window.navigateFlashcard = function(dir) {
    const items = document.querySelectorAll('.ca-flashcard-item');
    if (!items.length) return;
    
    items[currentFlashcardIndex].classList.remove('active-flashcard', 'flipped');
    currentFlashcardIndex = (currentFlashcardIndex + dir + items.length) % items.length;
    items[currentFlashcardIndex].classList.add('active-flashcard');
    items[currentFlashcardIndex].classList.remove('flipped');
    
    const currentEl = document.getElementById('flashcard-current');
    if (currentEl) currentEl.textContent = currentFlashcardIndex + 1;
};

// Read More Toggle (updated for new cards)
window.toggleReadMore = function(e, btn) {
    e.preventDefault();
    const container = btn.closest('.ca-featured-body') || btn.closest('.ca-standard-body');
    if (!container) return;
    const contentDiv = container.querySelector('.ca-card-desc-content');
    if (!contentDiv) return;
    
    if (!contentDiv.classList.contains('expanded')) {
        contentDiv.classList.add('expanded');
        contentDiv.style.maxHeight = 'none';
        contentDiv.style.webkitLineClamp = 'unset';
        btn.innerHTML = 'Show Less <i class="fa-solid fa-arrow-up"></i>';
    } else {
        contentDiv.classList.remove('expanded');
        contentDiv.style.maxHeight = '';
        contentDiv.style.webkitLineClamp = '';
        btn.innerHTML = 'Read More <i class="fa-solid fa-arrow-right"></i>';
    }
};

// Toast helper
function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-check-circle" style="color: #34d399;"></i> ${msg}`;
    toast.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: var(--bg-card, #1e293b); border: 1px solid var(--border-glass, rgba(255,255,255,0.08)); border-radius: 12px; color: var(--text-main, #fff); font-size: 0.88rem; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: slideInToast 0.3s ease;';
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2500);
}


// --- Live Search ---
window.liveSearchCA = function(query) {
    const q = query.toLowerCase().trim();
    const counter = document.getElementById('ca-search-results-count');

    // Get all searchable cards
    const sections = document.querySelectorAll('.ca-date-section');
    const allCards = document.querySelectorAll('.ca-featured-card, .ca-standard-card, .ca-compact-card, .ca-quiz-card-v2, .ca-fact-card-v2');

    if (!q) {
        // Show everything
        sections.forEach(s => s.style.display = '');
        allCards.forEach(c => c.style.display = '');
        document.querySelectorAll('.ca-articles-grid, .ca-compact-list, .ca-quick-revision, .ca-date-section-header').forEach(el => el.style.display = '');
        if (counter) counter.innerHTML = '';
        return;
    }

    let matchCount = 0;

    allCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(q)) {
            card.style.display = '';
            matchCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Hide empty sections
    sections.forEach(section => {
        const visibleCards = section.querySelectorAll('.ca-featured-card:not([style*="display: none"]), .ca-standard-card:not([style*="display: none"]), .ca-compact-card:not([style*="display: none"]), .ca-quiz-card-v2:not([style*="display: none"]), .ca-fact-card-v2:not([style*="display: none"])');
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = '';
        }
    });

    if (counter) {
        counter.innerHTML = `<span>${matchCount}</span> result${matchCount !== 1 ? 's' : ''} found`;
    }
};


// Calendar State
const todayDate = new Date();
let currentCalYear = todayDate.getFullYear();
let currentCalMonth = todayDate.getMonth();
let selectedDateStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

// Render Calendar dynamically
function renderCalendar() {
    const calContainer = document.getElementById('ca-calendar-container');
    const calMonthLabel = document.getElementById('cal-month-label');
    if (!calContainer || !calMonthLabel) return;
    
    // Update Month Label
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    calMonthLabel.textContent = `${monthNames[currentCalMonth]} ${currentCalYear}`;
    
    // Get number of days and starting day
    const daysInMonth = new Date(currentCalYear, currentCalMonth + 1, 0).getDate();
    const firstDay = new Date(currentCalYear, currentCalMonth, 1).getDay(); // 0 = Sunday
    
    // Adjust starting day so Monday is 0
    let startingDay = firstDay - 1;
    if (startingDay === -1) startingDay = 6; // Sunday becomes 6

    const newsDates = [...new Set(apiDataCache.map(item => item.dateStr))];
    
    let html = `
        <div class="cal-day-header">Mo</div><div class="cal-day-header">Tu</div><div class="cal-day-header">We</div>
        <div class="cal-day-header">Th</div><div class="cal-day-header">Fr</div><div class="cal-day-header">Sa</div>
        <div class="cal-day-header">Su</div>
    `;

    // Empty slots for alignment
    for (let i = 0; i < startingDay; i++) {
        html += `<div class="cal-date empty"></div>`;
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const monthStr = String(currentCalMonth + 1).padStart(2, '0');
        const dayStr = String(i).padStart(2, '0');
        const dateStr = `${currentCalYear}-${monthStr}-${dayStr}`;

        const hasNews = newsDates.includes(dateStr);
        const isActive = (dateStr === selectedDateStr);
        const activeClass = isActive ? 'active' : '';
        const newsClass = hasNews ? 'has-news' : '';

        html += `<div class="cal-date ${newsClass} ${activeClass}" data-date="${dateStr}">${i}</div>`;
    }
    
    const totalCells = startingDay + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
        html += `<div class="cal-date empty"></div>`;
    }

    calContainer.innerHTML = html;

    // Bind Calendar Click Events
    document.querySelectorAll('.cal-date').forEach(calDate => {
        if (calDate.classList.contains('empty')) return;
        
        calDate.addEventListener('click', function() {
            const isCurrentlyActive = this.classList.contains('active');
            document.querySelectorAll('.cal-date').forEach(d => d.classList.remove('active'));
            
            if (isCurrentlyActive) {
                selectedDateStr = null;
                renderTimeline(null);
            } else {
                this.classList.add('active');
                selectedDateStr = this.dataset.date;
                renderTimeline(selectedDateStr);
            }
        });
    });
}

function initCalendarNav() {
    document.getElementById('cal-prev')?.addEventListener('click', () => {
        currentCalMonth--;
        if (currentCalMonth < 0) {
            currentCalMonth = 11;
            currentCalYear--;
        }
        renderCalendar();
    });
    document.getElementById('cal-next')?.addEventListener('click', () => {
        currentCalMonth++;
        if (currentCalMonth > 11) {
            currentCalMonth = 0;
            currentCalYear++;
        }
        renderCalendar();
    });
}

// Initial Load
document.addEventListener('DOMContentLoaded', async () => {
    // Hindi Toggle Listener
    const hindiToggle = document.getElementById('hindi-toggle');
    if (hindiToggle) {
        hindiToggle.addEventListener('change', function() {
            isHindi = this.checked;
            renderTimeline(null);
        });
    }

    // Search Input Live Filtering
    const searchInput = document.querySelector('.ca-search-bar input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                liveSearchCA(this.value);
            }, 250);
        });
    }

    // Flashcard Mode
    const flashcardToggle = document.getElementById('flashcard-toggle');
    const timeline = document.querySelector('.ca-timeline');
    if (flashcardToggle && timeline) {
        flashcardToggle.addEventListener('change', function() {
            if (this.checked) {
                timeline.classList.add('flashcard-mode');
                currentFlashcardIndex = 0;
                // Show first flashcard
                const items = document.querySelectorAll('.ca-flashcard-item');
                items.forEach((item, idx) => {
                    item.classList.remove('active-flashcard', 'flipped');
                    if (idx === 0) item.classList.add('active-flashcard');
                });
                const currentEl = document.getElementById('flashcard-current');
                if (currentEl) currentEl.textContent = '1';
            } else {
                timeline.classList.remove('flashcard-mode');
            }
        });
    }

    // Keyboard navigation for flashcards
    document.addEventListener('keydown', function(e) {
        if (!document.querySelector('.flashcard-mode')) return;
        if (e.key === 'ArrowLeft') navigateFlashcard(-1);
        if (e.key === 'ArrowRight') navigateFlashcard(1);
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            const active = document.querySelector('.ca-flashcard-item.active-flashcard');
            if (active) flipFlashcard(active);
        }
    });

    initCalendarNav();

    // Await API data first so Calendar knows which dates have news
    await fetchNews(null);
    renderCalendar();
    renderTimeline(null);
});
