// Initialize Analytics Charts

let attemptChartInstance = null;
let radarChartInstance = null;

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Auth Protection
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Set default Chart.js settings for the dark glass theme
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
    Chart.defaults.plugins.tooltip.titleColor = '#fff';
    Chart.defaults.plugins.tooltip.bodyColor = '#cbd5e1';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    
    // Setup filter dropdown
    const timeFilter = document.getElementById('timeRangeFilter');
    const initialRange = timeFilter ? timeFilter.value : '7';
    
    // Load initial data
    await loadAnalyticsData(token, initialRange);
    
    if (timeFilter) {
        timeFilter.addEventListener('change', async (e) => {
            await loadAnalyticsData(token, e.target.value);
        });
    }
});

async function loadAnalyticsData(token, range) {
    try {
        const res = await fetch(`http://localhost:5000/api/analytics/dashboard/deep-dive?range=${range}`, {
            method: 'GET',
            headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Failed to fetch analytics');
        
        renderAnalytics(data);
    } catch (e) {
        console.error('Error loading deep analytics:', e);
    }
}

function renderAnalytics(data) {
    const { attemptStats, timeManagement, skillBalance, difficultyStats } = data;
    
    // Destroy existing charts to prevent overlapping when re-rendering
    if (attemptChartInstance) attemptChartInstance.destroy();
    if (radarChartInstance) radarChartInstance.destroy();
    
    // --- 1. Attempt vs Unattempted ---
    const attemptCtx = document.getElementById('attemptChart');
    if (attemptCtx) {
        const total = attemptStats.correct + attemptStats.incorrect + attemptStats.skipped;
        const attemptRate = total > 0 ? Math.round(((attemptStats.correct + attemptStats.incorrect) / total) * 100) : 0;
        
        // Update HTML Legends
        const legends = document.querySelectorAll('.an-chart-legend .legend-item span:nth-child(2)');
        if (legends.length >= 3) {
            legends[0].textContent = attemptStats.correct;
            legends[1].textContent = attemptStats.incorrect;
            legends[2].textContent = attemptStats.skipped;
        }
        
        attemptChartInstance = new Chart(attemptCtx, {
            type: 'doughnut',
            data: {
                labels: ['Attempted (Correct)', 'Attempted (Incorrect)', 'Unattempted'],
                datasets: [{
                    data: [attemptStats.correct, attemptStats.incorrect, attemptStats.skipped],
                    backgroundColor: ['#10b981', '#ef4444', 'rgba(255, 255, 255, 0.1)'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: { legend: { display: false } }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: function(chart) {
                    var width = chart.width, height = chart.height, ctx = chart.ctx;
                    ctx.restore();
                    var fontSize = (height / 114).toFixed(2);
                    ctx.font = "bold " + fontSize + "em Outfit";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = "#fff";
                    var text = attemptRate + "%",
                        textX = Math.round((width - ctx.measureText(text).width) / 2),
                        textY = height / 2 - 15;
                    ctx.fillText(text, textX, textY);
                    
                    ctx.font = "normal " + (fontSize * 0.4).toFixed(2) + "em Inter";
                    ctx.fillStyle = "#94a3b8";
                    var text2 = "Attempt Rate",
                        text2X = Math.round((width - ctx.measureText(text2).width) / 2),
                        text2Y = height / 2 + 10;
                    ctx.fillText(text2, text2X, text2Y);
                    ctx.save();
                }
            }]
        });
    }
    
    // --- 2. Time Management ---
    const timeCard = document.querySelector('.an-time-card');
    if (timeCard) {
        const timeVal = timeCard.querySelector('.time-stat .time-value');
        if (timeVal) {
            // Keep the arrow span if possible, or just overwrite
            timeVal.innerHTML = `${timeManagement.avgTime}s <span class="${timeManagement.gap > 0 ? 'text-red' : 'text-green'}" style="font-size: 1.2rem; margin-left: 4px;"><i class="fa-solid fa-arrow-${timeManagement.gap > 0 ? 'up' : 'down'}"></i></span>`;
        }
        
        const gapEl = timeCard.querySelector('.time-vs span:nth-child(2)');
        if (gapEl) {
            gapEl.textContent = `${timeManagement.gap > 0 ? '+' : ''}${timeManagement.gap}s`;
            gapEl.style.color = timeManagement.gap > 0 ? '#f87171' : '#10b981';
        }
        const hintEl = timeCard.querySelector('.time-hint');
        if (hintEl) hintEl.textContent = timeManagement.hint;
    }
    
    // --- 3. Skill Balance Radar ---
    const radarCtx = document.getElementById('radarChart');
    if (radarCtx && skillBalance.labels.length > 0) {
        const topBadge = document.querySelector('.an-radar-card .an-card-header span');
        if (topBadge) topBadge.textContent = `Top: ${skillBalance.topSkill}`;
        
        radarChartInstance = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: skillBalance.labels,
                datasets: [{
                    label: 'Your Score',
                    data: skillBalance.scores,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: '#6366f1',
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#6366f1',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderWidth: 2,
                    fill: true
                }, {
                    label: 'Topper Average',
                    data: skillBalance.topperScores,
                    backgroundColor: 'rgba(52, 211, 153, 0.1)',
                    borderColor: 'rgba(52, 211, 153, 0.5)',
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#f8fafc', font: { size: 12, family: "'Inter', sans-serif", weight: '600' } },
                        ticks: { display: false, min: 0, max: 100, stepSize: 20 }
                    }
                },
                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
            }
        });
    }
    
    // --- 4. Accuracy by Difficulty ---
    const diffCard = document.querySelector('.an-difficulty-card');
    if (diffCard) {
        const headers = diffCard.querySelectorAll('.diff-header div span:first-child');
        const fills = diffCard.querySelectorAll('.diff-fill');
        const trends = diffCard.querySelectorAll('.diff-header div span:nth-child(2)');
        
        // Hide the static fake trends since we don't have historical delta API yet
        trends.forEach(trend => trend.style.display = 'none');
        
        if (headers.length >= 3 && fills.length >= 3) {
            headers[0].textContent = `${difficultyStats.easy}%`;
            fills[0].style.width = `${difficultyStats.easy}%`;
            
            headers[1].textContent = `${difficultyStats.medium}%`;
            fills[1].style.width = `${difficultyStats.medium}%`;
            
            headers[2].textContent = `${difficultyStats.hard}%`;
            fills[2].style.width = `${difficultyStats.hard}%`;
        }
        
        const hintBox = diffCard.querySelector('.ai-insight-box p');
        if (hintBox) {
            hintBox.innerHTML = difficultyStats.hint;
        }
    }
}
