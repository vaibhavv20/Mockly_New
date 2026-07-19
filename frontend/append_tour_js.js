const fs = require('fs');

const jsCode = `
/* ==========================================
   FEATURE TOUR (ONBOARDING)
   ========================================== */
function startFeatureTour() {
    // Check if tour already taken (commented out for demo purposes so it always shows)
    // if (sessionStorage.getItem('ca-tour-completed')) return;
    
    // Create overlay
    let overlay = document.getElementById('tour-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'tour-overlay';
        overlay.className = 'ca-tour-overlay';
        document.body.appendChild(overlay);
    }
    
    // Create tooltip box
    let tooltip = document.getElementById('tour-tooltip-box');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tour-tooltip-box';
        tooltip.className = 'tour-tooltip-box';
        document.body.appendChild(tooltip);
    }

    const steps = [
        {
            selector: '.flashcard-toggle-wrap',
            title: '⚡ Flashcard Mode',
            text: 'Short on time? Toggle this to instantly collapse all articles into bite-sized summaries for rapid revision.',
            position: 'pos-bottom'
        },
        {
            selector: '#ca-calendar-container',
            title: '📅 Interactive Calendar',
            text: 'Click on any highlighted date to instantly filter the timeline and view news specifically from that day.',
            position: 'pos-left'
        },
        {
            selector: '.fact-of-the-day',
            title: '💡 Daily Facts',
            text: 'We now seamlessly integrate Static GK facts into the timeline, directly linking them to current events.',
            position: 'pos-top'
        }
    ];

    let currentStep = 0;
    let activeTarget = null;

    function renderStep() {
        const step = steps[currentStep];
        const target = document.querySelector(step.selector);
        
        if (!target) {
            // Skip if element not found
            nextFeatureTourStep();
            return;
        }

        // Clean up previous target
        if (activeTarget) {
            activeTarget.classList.remove('tour-target-active');
        }

        activeTarget = target;
        activeTarget.classList.add('tour-target-active');
        
        // Position tooltip
        const rect = target.getBoundingClientRect();
        
        tooltip.className = \`tour-tooltip-box \${step.position}\`;
        tooltip.innerHTML = \`
            <div class="tour-step-count">Step \${currentStep + 1} of \${steps.length}</div>
            <h4>\${step.title}</h4>
            <p>\${step.text}</p>
            <div class="tour-footer">
                <button class="btn-tour-skip" onclick="endFeatureTour()">Skip Tour</button>
                <button class="btn-tour-next" onclick="nextFeatureTourStep()">\${currentStep === steps.length - 1 ? 'Finish' : 'Next <i class="fa-solid fa-arrow-right"></i>'}</button>
            </div>
        \`;

        if (step.position === 'pos-bottom') {
            tooltip.style.top = (rect.bottom + window.scrollY) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - 150) + 'px'; // 150 is half tooltip width
        } else if (step.position === 'pos-left') {
            tooltip.style.top = (rect.top + window.scrollY + rect.height / 2 - 100) + 'px';
            tooltip.style.left = (rect.left - 320) + 'px';
        } else if (step.position === 'pos-top') {
            tooltip.style.top = (rect.top + window.scrollY - 200) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - 150) + 'px';
        }

        // Smooth scroll to element if not in view
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Show
        overlay.classList.add('active');
        
        // Small delay before showing tooltip to allow scroll
        setTimeout(() => {
            tooltip.classList.add('visible');
        }, 300);
    }

    window.nextFeatureTourStep = function() {
        tooltip.classList.remove('visible');
        setTimeout(() => {
            currentStep++;
            if (currentStep >= steps.length) {
                endFeatureTour();
            } else {
                renderStep();
            }
        }, 300);
    };

    window.endFeatureTour = function() {
        if (activeTarget) activeTarget.classList.remove('tour-target-active');
        overlay.classList.remove('active');
        tooltip.classList.remove('visible');
        sessionStorage.setItem('ca-tour-completed', 'true');
    };

    // Start
    renderStep();
}

// Hook into initial load, wait for fetch to complete
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the simulated fetch (500ms) + buffer
    setTimeout(() => {
        startFeatureTour();
    }, 1200);
});
`;

fs.appendFileSync('c:/Users/vaibh/Desktop/Mockly_New/frontend/js/current-affairs-api.js', jsCode);
console.log('JS appended.');
