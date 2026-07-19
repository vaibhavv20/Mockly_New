const fs = require('fs');
const path = 'c:/Users/vaibh/Desktop/Mockly_New/frontend/current-affairs.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Remove everything between <!-- Timeline --> and <!-- Load More -->
const timelineRegex = /<!-- Timeline -->[\s\S]*?<!-- Load More -->/;
html = html.replace(timelineRegex, `<!-- Timeline (Dynamically Rendered) -->
                    <div class="ca-timeline" id="ca-feed-container">
                        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
                            <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--primary); margin-bottom: 15px;"></i>
                            <p>Connecting to backend... fetching latest updates.</p>
                        </div>
                    </div>

                    <!-- Load More -->`);

// 2. Remove the contents of .archive-calendar
const calendarRegex = /<div class="archive-calendar">[\s\S]*?<\/div>(\s*<\/div>)/;
html = html.replace(calendarRegex, `<div class="archive-calendar" id="ca-calendar-container">
                            <!-- Calendar injected by JS -->
                        </div>
                    </div>`);

// 3. Add the script tag for the new JS
html = html.replace('<script src="js/script.js"></script>', '<script src="js/script.js"></script>\n    <script src="js/current-affairs-api.js"></script>');

fs.writeFileSync(path, html);
console.log("HTML successfully cleaned and prepared for dynamic rendering.");
