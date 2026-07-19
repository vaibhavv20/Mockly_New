document.addEventListener('DOMContentLoaded', () => {
    async function loadCategories() {
        const container = document.getElementById('categoryCardsContainer');
        if (!container) return;

        try {
            const response = await fetch('data/categories.json');
            if (!response.ok) throw new Error('Failed to fetch categories');
            
            const categories = await response.json();
            container.innerHTML = ''; // Clear loading state

            categories.forEach(cat => {
                // Determine text/bg colors based on theme
                const bgClass = `bg-${cat.colorTheme}-light`;
                const textClass = `text-${cat.colorTheme}`;

                const cardHTML = `
                <div class="category-card glass-card hover-scale" style="--cat-theme: var(--${cat.colorTheme}-color, #6366f1)" onclick="window.location.href='exams.html?category=${cat.id}'">
                    <div class="card-top">
                        <div class="org-icon-wrapper"><i class="${cat.icon}"></i></div>
                        <span class="exam-badge ${bgClass} ${textClass}">${cat.badgeText}</span>
                    </div>
                    <h3>${cat.title}</h3>
                    <p class="exam-desc">${cat.description}</p>
                    <div class="data-row">
                        <div class="data-item"><i class="fa-solid fa-users" style="color: var(--cat-theme)"></i> ${cat.stats.aspirants} Aspirants</div>
                        <div class="data-item"><i class="fa-solid fa-file-lines" style="color: var(--cat-theme)"></i> ${cat.stats.freeMocks} Free Mocks</div>
                    </div>
                    <div class="cat-meta">
                        <span>${cat.stats.premiumTests} Premium Tests</span>
                        <div class="cat-arrow"><i class="fa-solid fa-chevron-right"></i></div>
                    </div>
                </div>`;

                container.insertAdjacentHTML('beforeend', cardHTML);
            });
        } catch (error) {
            console.error('Error loading categories:', error);
            container.innerHTML = '<p class="error-msg">Unable to load exam categories at this time.</p>';
        }
    }

    loadCategories();
});
