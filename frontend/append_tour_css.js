const fs = require('fs');
const css = `
/* ==========================================
   9. FEATURE TOUR (ONBOARDING)
   ========================================== */
.ca-tour-overlay {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(3px);
    z-index: 9990;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease;
}
.ca-tour-overlay.active {
    opacity: 1;
    pointer-events: all;
}

.tour-target-active {
    position: relative !important;
    z-index: 9995 !important;
    box-shadow: 0 0 0 4px var(--primary), 0 0 30px rgba(59, 130, 246, 0.6) !important;
    background: var(--bg-card) !important;
    border-radius: 12px;
    transition: all 0.3s ease;
    animation: tourPulse 2s infinite;
}

@keyframes tourPulse {
    0%, 100% { box-shadow: 0 0 0 2px var(--primary), 0 0 15px rgba(59, 130, 246, 0.4); }
    50% { box-shadow: 0 0 0 6px var(--primary), 0 0 35px rgba(59, 130, 246, 0.8); }
}

.tour-tooltip-box {
    position: absolute;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    padding: 20px;
    border-radius: 16px;
    width: 300px;
    z-index: 9999;
    box-shadow: 0 15px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.2);
    font-family: 'Inter', sans-serif;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    pointer-events: none;
}
.tour-tooltip-box.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
}

/* Tooltip Arrow */
.tour-tooltip-box::before {
    content: '';
    position: absolute;
    width: 0; height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
}

.tour-tooltip-box.pos-bottom { margin-top: 15px; }
.tour-tooltip-box.pos-bottom::before {
    top: -10px; left: 20px;
    border-bottom: 10px solid #5a6cf6;
}

.tour-tooltip-box.pos-top { margin-top: -15px; transform: translateY(-20px); }
.tour-tooltip-box.pos-top.visible { transform: translateY(0); }
.tour-tooltip-box.pos-top::before {
    bottom: -10px; left: 20px;
    border-top: 10px solid #5a6cf6;
}

.tour-tooltip-box.pos-left { margin-left: -15px; transform: translateX(-20px); }
.tour-tooltip-box.pos-left.visible { transform: translateX(0); }
.tour-tooltip-box.pos-left::before {
    top: 20px; right: -10px;
    border-left: 10px solid #5a6cf6;
    border-bottom: 10px solid transparent;
    border-top: 10px solid transparent;
    border-right: none;
}

.tour-step-count {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba(255,255,255,0.7);
    margin-bottom: 5px;
    font-weight: 700;
}
.tour-tooltip-box h4 {
    margin: 0 0 10px 0;
    font-size: 1.15rem;
    font-weight: 700;
}
.tour-tooltip-box p {
    margin: 0 0 18px 0;
    font-size: 0.9rem;
    line-height: 1.5;
    color: rgba(255,255,255,0.9);
}
.tour-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.btn-tour-skip {
    background: none; border: none;
    color: rgba(255,255,255,0.7);
    cursor: pointer; font-size: 0.85rem; font-weight: 600;
}
.btn-tour-skip:hover { color: white; }
.btn-tour-next {
    background: white; color: #3b82f6;
    border: none; padding: 8px 18px;
    border-radius: 20px; font-weight: 700;
    cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transition: transform 0.2s;
}
.btn-tour-next:hover { transform: scale(1.05); }
`;
fs.appendFileSync('c:/Users/vaibh/Desktop/Mockly_New/frontend/css/current-affairs.css', css);
console.log('CSS appended.');
