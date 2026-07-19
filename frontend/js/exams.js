/**
 * Mockly — Exams Catalogue (Premium JS)
 * Comprehensive exam database with dynamic rendering
 */

const examsDatabase = {
    ssc: {
        title: 'Staff Selection Commission (SSC)',
        description: 'Explore highly accurate test series for all major SSC exams including CGL, CHSL, MTS, CPO, and GD.',
        icon: 'fa-solid fa-building-columns',
        accentColor: '#3b82f6',
        categories: [
            { id: 'ssc-all', name: 'All SSC', count: 980 },
            { id: 'ssc-cgl', name: 'SSC CGL', count: 320 },
            { id: 'ssc-chsl', name: 'SSC CHSL', count: 250 },
            { id: 'ssc-mts', name: 'SSC MTS', count: 180 },
            { id: 'ssc-cpo', name: 'SSC CPO', count: 120 },
            { id: 'ssc-gd', name: 'SSC GD', count: 110 }
        ],
        tests: [
            { id: 1, title: 'SSC CGL Tier 1 Full Mock', category: 'ssc-cgl', totalTests: 150, freeTests: 5, students: 78500, languages: 'Hindi, English', syllabusCoverage: 92, isPro: true },
            { id: 2, title: 'SSC CGL Tier 2 Full Mock', category: 'ssc-cgl', totalTests: 80, freeTests: 2, students: 54200, languages: 'Hindi, English', syllabusCoverage: 88, isPro: true },
            { id: 101, title: 'SSC CGL Quant Sectional Tests', category: 'ssc-cgl', totalTests: 30, freeTests: 5, students: 62300, languages: 'Hindi, English', syllabusCoverage: 100, isPro: false },
            { id: 102, title: 'SSC CGL Reasoning Sectional Tests', category: 'ssc-cgl', totalTests: 30, freeTests: 5, students: 59100, languages: 'Hindi, English', syllabusCoverage: 100, isPro: false },
            { id: 103, title: 'SSC CGL English Sectional Tests', category: 'ssc-cgl', totalTests: 30, freeTests: 5, students: 65400, languages: 'Hindi, English', syllabusCoverage: 100, isPro: false },
            { id: 104, title: 'SSC CGL GA Sectional Tests', category: 'ssc-cgl', totalTests: 30, freeTests: 5, students: 58200, languages: 'Hindi, English', syllabusCoverage: 100, isPro: false },
            { id: 105, title: 'SSC CGL 2024 PYQ Papers', category: 'ssc-cgl', totalTests: 40, freeTests: 40, students: 91200, languages: 'Hindi, English', syllabusCoverage: 100, isPro: false },
            { id: 106, title: 'SSC CGL 2023 PYQ Papers', category: 'ssc-cgl', totalTests: 39, freeTests: 39, students: 85300, languages: 'Hindi, English', syllabusCoverage: 100, isPro: false },
            { id: 107, title: 'SSC CGL 2022 PYQ Papers', category: 'ssc-cgl', totalTests: 40, freeTests: 40, students: 78100, languages: 'Hindi, English', syllabusCoverage: 100, isPro: false },
            { id: 108, title: 'SSC CGL Quant Chapter-wise Tests', category: 'ssc-cgl', totalTests: 85, freeTests: 15, students: 45200, languages: 'Hindi, English', syllabusCoverage: 100, isPro: true },
            { id: 109, title: 'SSC CGL Reasoning Chapter-wise Tests', category: 'ssc-cgl', totalTests: 65, freeTests: 10, students: 42100, languages: 'Hindi, English', syllabusCoverage: 100, isPro: true },
            { id: 110, title: 'SSC CGL English Chapter-wise Tests', category: 'ssc-cgl', totalTests: 75, freeTests: 12, students: 48300, languages: 'Hindi, English', syllabusCoverage: 100, isPro: true },
            { id: 111, title: 'SSC CGL GA Chapter-wise Tests', category: 'ssc-cgl', totalTests: 120, freeTests: 20, students: 51200, languages: 'Hindi, English', syllabusCoverage: 100, isPro: true },
            { id: 5, title: 'SSC CHSL Tier 1 2026', category: 'ssc-chsl', totalTests: 120, freeTests: 3, students: 67800, languages: 'Hindi, English', syllabusCoverage: 90, isPro: true },
            { id: 6, title: 'SSC CHSL Descriptive', category: 'ssc-chsl', totalTests: 60, freeTests: 2, students: 31500, languages: 'Hindi, English', syllabusCoverage: 70, isPro: true },
            { id: 7, title: 'SSC CHSL Topic Tests', category: 'ssc-chsl', totalTests: 70, freeTests: 15, students: 45600, languages: 'Hindi, English', syllabusCoverage: 82, isPro: false },
            { id: 50, title: 'SSC CHSL PYQ Papers', category: 'ssc-chsl', totalTests: 25, freeTests: 25, students: 58900, languages: 'Hindi, English', syllabusCoverage: 78, isPro: false },
            { id: 51, title: 'SSC CHSL Tier 2 Maths', category: 'ssc-chsl', totalTests: 40, freeTests: 3, students: 28700, languages: 'Hindi, English', syllabusCoverage: 72, isPro: true },
            { id: 8, title: 'SSC MTS 2026 Full Length', category: 'ssc-mts', totalTests: 100, freeTests: 5, students: 89300, languages: 'Hindi, English', syllabusCoverage: 85, isPro: false },
            { id: 9, title: 'SSC MTS Chapter Tests', category: 'ssc-mts', totalTests: 80, freeTests: 20, students: 52100, languages: 'Hindi, English', syllabusCoverage: 78, isPro: true },
            { id: 52, title: 'SSC MTS Havaldar 2026', category: 'ssc-mts', totalTests: 45, freeTests: 5, students: 41200, languages: 'Hindi, English', syllabusCoverage: 80, isPro: false },
            { id: 53, title: 'SSC MTS PYQ Papers', category: 'ssc-mts', totalTests: 30, freeTests: 30, students: 63400, languages: 'Hindi, English', syllabusCoverage: 75, isPro: false },
            { id: 10, title: 'SSC CPO SI Prelims', category: 'ssc-cpo', totalTests: 80, freeTests: 2, students: 38900, languages: 'Hindi, English', syllabusCoverage: 87, isPro: true },
            { id: 11, title: 'SSC CPO SI Mains English', category: 'ssc-cpo', totalTests: 40, freeTests: 1, students: 22400, languages: 'English', syllabusCoverage: 82, isPro: true },
            { id: 54, title: 'SSC CPO Sectional Practice', category: 'ssc-cpo', totalTests: 35, freeTests: 8, students: 19600, languages: 'Hindi, English', syllabusCoverage: 68, isPro: false },
            { id: 55, title: 'SSC CPO PYQ Papers', category: 'ssc-cpo', totalTests: 20, freeTests: 20, students: 27800, languages: 'Hindi, English', syllabusCoverage: 72, isPro: false },
            { id: 12, title: 'SSC GD Constable 2026', category: 'ssc-gd', totalTests: 110, freeTests: 10, students: 95600, languages: 'Hindi, English', syllabusCoverage: 88, isPro: false },
            { id: 13, title: 'SSC GD PYQ Papers', category: 'ssc-gd', totalTests: 35, freeTests: 35, students: 72300, languages: 'Hindi, English', syllabusCoverage: 80, isPro: false },
            { id: 56, title: 'SSC GD Topic-wise Tests', category: 'ssc-gd', totalTests: 50, freeTests: 12, students: 48700, languages: 'Hindi, English', syllabusCoverage: 74, isPro: true },
            { id: 57, title: 'SSC GD Constable PYQ 2022-25', category: 'ssc-gd', totalTests: 28, freeTests: 28, students: 61200, languages: 'Hindi, English', syllabusCoverage: 76, isPro: false }
        ]
    },

    banking: {
        title: 'Banking Exams (IBPS, SBI, RBI)',
        description: 'Prepare for top banking sector exams like SBI PO, IBPS Clerk, RRB, and RBI Grade B.',
        icon: 'fa-solid fa-landmark',
        accentColor: '#10b981',
        categories: [
            { id: 'bank-all', name: 'All Banking', count: 850 },
            { id: 'bank-sbi-po', name: 'SBI PO', count: 180 },
            { id: 'bank-sbi-clerk', name: 'SBI Clerk', count: 150 },
            { id: 'bank-ibps-po', name: 'IBPS PO', count: 160 },
            { id: 'bank-ibps-clerk', name: 'IBPS Clerk', count: 140 },
            { id: 'bank-rrb', name: 'IBPS RRB', count: 120 },
            { id: 'bank-rbi', name: 'RBI', count: 100 }
        ],
        tests: [
            { id: 14, title: 'SBI PO Prelims', category: 'bank-sbi-po', totalTests: 120, freeTests: 5, students: 82400, languages: 'Hindi, English', syllabusCoverage: 93, isPro: true },
            { id: 15, title: 'SBI PO Mains', category: 'bank-sbi-po', totalTests: 60, freeTests: 2, students: 56700, languages: 'Hindi, English', syllabusCoverage: 88, isPro: true },
            { id: 16, title: 'SBI PO Sectional', category: 'bank-sbi-po', totalTests: 90, freeTests: 12, students: 47300, languages: 'Hindi, English', syllabusCoverage: 80, isPro: false },
            { id: 58, title: 'SBI PO Interview Prep', category: 'bank-sbi-po', totalTests: 25, freeTests: 5, students: 31200, languages: 'English', syllabusCoverage: 65, isPro: true },
            { id: 59, title: 'SBI PO PYQ Papers', category: 'bank-sbi-po', totalTests: 30, freeTests: 30, students: 68900, languages: 'Hindi, English', syllabusCoverage: 78, isPro: false },
            { id: 17, title: 'SBI Clerk Prelims', category: 'bank-sbi-clerk', totalTests: 100, freeTests: 5, students: 75800, languages: 'Hindi, English', syllabusCoverage: 90, isPro: false },
            { id: 18, title: 'SBI Clerk Mains', category: 'bank-sbi-clerk', totalTests: 50, freeTests: 1, students: 42100, languages: 'Hindi, English', syllabusCoverage: 85, isPro: true },
            { id: 60, title: 'SBI Clerk Sectional Tests', category: 'bank-sbi-clerk', totalTests: 65, freeTests: 10, students: 38500, languages: 'Hindi, English', syllabusCoverage: 76, isPro: false },
            { id: 61, title: 'SBI Clerk PYQ Papers', category: 'bank-sbi-clerk', totalTests: 25, freeTests: 25, students: 54200, languages: 'Hindi, English', syllabusCoverage: 72, isPro: false },
            { id: 19, title: 'IBPS PO Prelims', category: 'bank-ibps-po', totalTests: 110, freeTests: 4, students: 71200, languages: 'Hindi, English', syllabusCoverage: 91, isPro: true },
            { id: 20, title: 'IBPS PO Mains', category: 'bank-ibps-po', totalTests: 50, freeTests: 1, students: 48600, languages: 'Hindi, English', syllabusCoverage: 86, isPro: true },
            { id: 62, title: 'IBPS PO Sectional', category: 'bank-ibps-po', totalTests: 75, freeTests: 10, students: 39800, languages: 'Hindi, English', syllabusCoverage: 78, isPro: false },
            { id: 63, title: 'IBPS PO PYQ Papers', category: 'bank-ibps-po', totalTests: 28, freeTests: 28, students: 57100, languages: 'Hindi, English', syllabusCoverage: 74, isPro: false },
            { id: 21, title: 'IBPS Clerk Prelims', category: 'bank-ibps-clerk', totalTests: 90, freeTests: 6, students: 68400, languages: 'Hindi, English', syllabusCoverage: 89, isPro: false },
            { id: 22, title: 'IBPS Clerk Mains', category: 'bank-ibps-clerk', totalTests: 50, freeTests: 1, students: 35700, languages: 'Hindi, English', syllabusCoverage: 83, isPro: true },
            { id: 64, title: 'IBPS Clerk Sectional', category: 'bank-ibps-clerk', totalTests: 60, freeTests: 8, students: 31200, languages: 'Hindi, English', syllabusCoverage: 75, isPro: false },
            { id: 65, title: 'IBPS Clerk PYQ Papers', category: 'bank-ibps-clerk', totalTests: 22, freeTests: 22, students: 44500, languages: 'Hindi, English', syllabusCoverage: 70, isPro: false },
            { id: 23, title: 'RRB PO (Officer Scale I)', category: 'bank-rrb', totalTests: 70, freeTests: 3, students: 53200, languages: 'Hindi, English', syllabusCoverage: 87, isPro: true },
            { id: 24, title: 'RRB Clerk (Office Asst.)', category: 'bank-rrb', totalTests: 50, freeTests: 5, students: 61800, languages: 'Hindi, English', syllabusCoverage: 84, isPro: false },
            { id: 66, title: 'RRB PO/Clerk Sectional', category: 'bank-rrb', totalTests: 45, freeTests: 8, students: 29600, languages: 'Hindi, English', syllabusCoverage: 72, isPro: false },
            { id: 67, title: 'RRB Scale II/III Officer', category: 'bank-rrb', totalTests: 30, freeTests: 2, students: 18400, languages: 'English', syllabusCoverage: 68, isPro: true },
            { id: 25, title: 'RBI Grade B Phase 1', category: 'bank-rbi', totalTests: 60, freeTests: 2, students: 28900, languages: 'English', syllabusCoverage: 90, isPro: true },
            { id: 26, title: 'RBI Assistant', category: 'bank-rbi', totalTests: 40, freeTests: 2, students: 45600, languages: 'Hindi, English', syllabusCoverage: 85, isPro: false },
            { id: 68, title: 'RBI Grade B Phase 2', category: 'bank-rbi', totalTests: 35, freeTests: 1, students: 19200, languages: 'English', syllabusCoverage: 82, isPro: true },
            { id: 69, title: 'RBI Assistant PYQ Papers', category: 'bank-rbi', totalTests: 20, freeTests: 20, students: 37800, languages: 'Hindi, English', syllabusCoverage: 70, isPro: false }
        ]
    },

    railways: {
        title: 'Railway Exams (RRB)',
        description: 'Get ready for RRB NTPC, Group D, ALP, and JE with our strictly TCS-pattern mock tests.',
        icon: 'fa-solid fa-train',
        accentColor: '#f59e0b',
        categories: [
            { id: 'rrb-all', name: 'All Railways', count: 650 },
            { id: 'rrb-ntpc', name: 'NTPC', count: 200 },
            { id: 'rrb-group-d', name: 'Group D', count: 180 },
            { id: 'rrb-alp', name: 'ALP', count: 150 },
            { id: 'rrb-je', name: 'JE', count: 120 }
        ],
        tests: [
            { id: 27, title: 'RRB NTPC CBT 1', category: 'rrb-ntpc', totalTests: 150, freeTests: 5, students: 112000, languages: 'Hindi, English', syllabusCoverage: 94, isPro: true },
            { id: 28, title: 'RRB NTPC CBT 2', category: 'rrb-ntpc', totalTests: 50, freeTests: 2, students: 67800, languages: 'Hindi, English', syllabusCoverage: 88, isPro: true },
            { id: 29, title: 'RRB NTPC PYQs', category: 'rrb-ntpc', totalTests: 40, freeTests: 40, students: 89500, languages: 'Hindi, English', syllabusCoverage: 82, isPro: false },
            { id: 70, title: 'RRB NTPC Sectional Tests', category: 'rrb-ntpc', totalTests: 65, freeTests: 10, students: 53200, languages: 'Hindi, English', syllabusCoverage: 76, isPro: false },
            { id: 71, title: 'RRB NTPC Topic-wise Practice', category: 'rrb-ntpc', totalTests: 80, freeTests: 15, students: 46100, languages: 'Hindi, English', syllabusCoverage: 72, isPro: true },
            { id: 30, title: 'RRB Group D Level 1', category: 'rrb-group-d', totalTests: 180, freeTests: 10, students: 135000, languages: 'Hindi, English', syllabusCoverage: 90, isPro: false },
            { id: 31, title: 'RRB Group D Chapter Tests', category: 'rrb-group-d', totalTests: 90, freeTests: 20, students: 78400, languages: 'Hindi, English', syllabusCoverage: 78, isPro: true },
            { id: 72, title: 'RRB Group D PYQ Papers', category: 'rrb-group-d', totalTests: 35, freeTests: 35, students: 98700, languages: 'Hindi, English', syllabusCoverage: 80, isPro: false },
            { id: 73, title: 'RRB Group D Science Special', category: 'rrb-group-d', totalTests: 40, freeTests: 5, students: 42300, languages: 'Hindi, English', syllabusCoverage: 70, isPro: false },
            { id: 74, title: 'RRB Group D Math Marathon', category: 'rrb-group-d', totalTests: 50, freeTests: 8, students: 51600, languages: 'Hindi, English', syllabusCoverage: 74, isPro: true },
            { id: 32, title: 'RRB ALP CBT 1', category: 'rrb-alp', totalTests: 100, freeTests: 4, students: 56200, languages: 'Hindi, English', syllabusCoverage: 89, isPro: true },
            { id: 33, title: 'RRB ALP CBT 2', category: 'rrb-alp', totalTests: 50, freeTests: 1, students: 34800, languages: 'Hindi, English', syllabusCoverage: 85, isPro: true },
            { id: 75, title: 'RRB ALP Part A Practice', category: 'rrb-alp', totalTests: 45, freeTests: 8, students: 28900, languages: 'Hindi, English', syllabusCoverage: 72, isPro: false },
            { id: 76, title: 'RRB ALP Part B Trade Tests', category: 'rrb-alp', totalTests: 35, freeTests: 3, students: 21500, languages: 'Hindi, English', syllabusCoverage: 68, isPro: true },
            { id: 34, title: 'RRB JE CBT 1', category: 'rrb-je', totalTests: 80, freeTests: 3, students: 43700, languages: 'Hindi, English', syllabusCoverage: 87, isPro: true },
            { id: 35, title: 'RRB JE CBT 2', category: 'rrb-je', totalTests: 40, freeTests: 1, students: 28100, languages: 'Hindi, English', syllabusCoverage: 83, isPro: true },
            { id: 77, title: 'RRB JE Civil Engineering', category: 'rrb-je', totalTests: 30, freeTests: 3, students: 18600, languages: 'English', syllabusCoverage: 75, isPro: false },
            { id: 78, title: 'RRB JE Electrical Engineering', category: 'rrb-je', totalTests: 28, freeTests: 3, students: 16200, languages: 'English', syllabusCoverage: 74, isPro: false }
        ]
    },

    upsc: {
        title: 'UPSC & Defence',
        description: 'Top-tier mock tests for Civil Services, NDA, CDS, and AFCAT.',
        icon: 'fa-solid fa-shield-halved',
        accentColor: '#ef4444',
        categories: [
            { id: 'upsc-all', name: 'All', count: 480 },
            { id: 'upsc-cse', name: 'CSE', count: 150 },
            { id: 'upsc-cds', name: 'CDS', count: 120 },
            { id: 'upsc-nda', name: 'NDA', count: 110 },
            { id: 'upsc-afcat', name: 'AFCAT', count: 100 }
        ],
        tests: [
            { id: 36, title: 'UPSC CSE Prelims GS', category: 'upsc-cse', totalTests: 80, freeTests: 2, students: 45600, languages: 'Hindi, English', syllabusCoverage: 92, isPro: true },
            { id: 37, title: 'UPSC CSE CSAT', category: 'upsc-cse', totalTests: 40, freeTests: 1, students: 38900, languages: 'Hindi, English', syllabusCoverage: 88, isPro: true },
            { id: 38, title: 'CSE Mains Answer Writing', category: 'upsc-cse', totalTests: 30, freeTests: 0, students: 21200, languages: 'Hindi, English', syllabusCoverage: 75, isPro: true },
            { id: 79, title: 'UPSC CSE Current Affairs', category: 'upsc-cse', totalTests: 50, freeTests: 10, students: 52300, languages: 'Hindi, English', syllabusCoverage: 70, isPro: false },
            { id: 80, title: 'UPSC CSE PYQ Analysis', category: 'upsc-cse', totalTests: 35, freeTests: 35, students: 61800, languages: 'Hindi, English', syllabusCoverage: 80, isPro: false },
            { id: 39, title: 'CDS IMA/INA', category: 'upsc-cds', totalTests: 70, freeTests: 3, students: 34500, languages: 'Hindi, English', syllabusCoverage: 86, isPro: false },
            { id: 40, title: 'CDS OTA', category: 'upsc-cds', totalTests: 50, freeTests: 2, students: 28700, languages: 'Hindi, English', syllabusCoverage: 82, isPro: false },
            { id: 81, title: 'CDS English Mastery', category: 'upsc-cds', totalTests: 40, freeTests: 5, students: 22100, languages: 'English', syllabusCoverage: 78, isPro: true },
            { id: 82, title: 'CDS GK + Elementary Math', category: 'upsc-cds', totalTests: 45, freeTests: 8, students: 26300, languages: 'Hindi, English', syllabusCoverage: 74, isPro: false },
            { id: 41, title: 'NDA Math + GAT', category: 'upsc-nda', totalTests: 110, freeTests: 5, students: 48200, languages: 'Hindi, English', syllabusCoverage: 90, isPro: true },
            { id: 42, title: 'NDA PYQ Papers', category: 'upsc-nda', totalTests: 30, freeTests: 30, students: 56100, languages: 'Hindi, English', syllabusCoverage: 82, isPro: false },
            { id: 83, title: 'NDA Math Sectional', category: 'upsc-nda', totalTests: 50, freeTests: 8, students: 31700, languages: 'Hindi, English', syllabusCoverage: 76, isPro: false },
            { id: 84, title: 'NDA GAT Special Practice', category: 'upsc-nda', totalTests: 40, freeTests: 5, students: 27900, languages: 'Hindi, English', syllabusCoverage: 72, isPro: true },
            { id: 43, title: 'AFCAT 2026', category: 'upsc-afcat', totalTests: 100, freeTests: 4, students: 35800, languages: 'Hindi, English', syllabusCoverage: 88, isPro: false },
            { id: 44, title: 'AFCAT PYQ Papers', category: 'upsc-afcat', totalTests: 25, freeTests: 25, students: 41200, languages: 'Hindi, English', syllabusCoverage: 80, isPro: false },
            { id: 85, title: 'AFCAT EKT (Engineering)', category: 'upsc-afcat', totalTests: 30, freeTests: 3, students: 15800, languages: 'English', syllabusCoverage: 74, isPro: true },
            { id: 86, title: 'AFCAT Verbal + Numerical', category: 'upsc-afcat', totalTests: 35, freeTests: 5, students: 23400, languages: 'English', syllabusCoverage: 70, isPro: false }
        ]
    },

    teaching: {
        title: 'Teaching Exams',
        description: 'Ace CTET, KVS, DSSSB, and State TET exams with syllabus-aligned mocks.',
        icon: 'fa-solid fa-chalkboard-user',
        accentColor: '#8b5cf6',
        categories: [
            { id: 'teach-all', name: 'All', count: 520 },
            { id: 'ctet', name: 'CTET', count: 150 },
            { id: 'kvs', name: 'KVS', count: 120 },
            { id: 'dsssb', name: 'DSSSB', count: 130 },
            { id: 'tet', name: 'State TETs', count: 120 }
        ],
        tests: [
            { id: 45, title: 'CTET Paper 1 (Class 1-5)', category: 'ctet', totalTests: 80, freeTests: 5, students: 71200, languages: 'Hindi, English', syllabusCoverage: 91, isPro: false },
            { id: 46, title: 'CTET Paper 2 Maths & Science', category: 'ctet', totalTests: 40, freeTests: 2, students: 48600, languages: 'Hindi, English', syllabusCoverage: 86, isPro: false },
            { id: 47, title: 'CTET Paper 2 SST', category: 'ctet', totalTests: 30, freeTests: 2, students: 42300, languages: 'Hindi, English', syllabusCoverage: 84, isPro: false },
            { id: 87, title: 'CTET CDP Special', category: 'ctet', totalTests: 35, freeTests: 8, students: 38900, languages: 'Hindi, English', syllabusCoverage: 78, isPro: true },
            { id: 88, title: 'CTET PYQ Papers', category: 'ctet', totalTests: 28, freeTests: 28, students: 62400, languages: 'Hindi, English', syllabusCoverage: 80, isPro: false },
            { id: 48, title: 'KVS PRT', category: 'kvs', totalTests: 70, freeTests: 3, students: 35700, languages: 'Hindi, English', syllabusCoverage: 88, isPro: true },
            { id: 49, title: 'KVS TGT', category: 'kvs', totalTests: 50, freeTests: 1, students: 28400, languages: 'Hindi, English', syllabusCoverage: 85, isPro: true },
            { id: 89, title: 'KVS PGT General Paper', category: 'kvs', totalTests: 35, freeTests: 3, students: 19800, languages: 'Hindi, English', syllabusCoverage: 80, isPro: true },
            { id: 90, title: 'KVS Librarian / VP', category: 'kvs', totalTests: 20, freeTests: 2, students: 12500, languages: 'Hindi, English', syllabusCoverage: 72, isPro: false },
            { id: 91, title: 'DSSSB PRT', category: 'dsssb', totalTests: 80, freeTests: 4, students: 42100, languages: 'Hindi, English', syllabusCoverage: 89, isPro: true },
            { id: 92, title: 'DSSSB TGT/PGT', category: 'dsssb', totalTests: 50, freeTests: 2, students: 31600, languages: 'Hindi, English', syllabusCoverage: 84, isPro: true },
            { id: 93, title: 'DSSSB Nursery Teacher', category: 'dsssb', totalTests: 40, freeTests: 5, students: 23800, languages: 'Hindi, English', syllabusCoverage: 78, isPro: false },
            { id: 94, title: 'DSSSB PYQ Papers', category: 'dsssb', totalTests: 22, freeTests: 22, students: 35200, languages: 'Hindi, English', syllabusCoverage: 72, isPro: false },
            { id: 95, title: 'DSSSB LDC / Patwari', category: 'dsssb', totalTests: 30, freeTests: 3, students: 18700, languages: 'Hindi, English', syllabusCoverage: 70, isPro: true },
            { id: 96, title: 'UPTET Paper 1', category: 'tet', totalTests: 60, freeTests: 5, students: 54800, languages: 'Hindi, English', syllabusCoverage: 87, isPro: false },
            { id: 97, title: 'Super TET', category: 'tet', totalTests: 60, freeTests: 3, students: 47200, languages: 'Hindi, English', syllabusCoverage: 83, isPro: true },
            { id: 98, title: 'Bihar STET', category: 'tet', totalTests: 35, freeTests: 3, students: 29600, languages: 'Hindi, English', syllabusCoverage: 78, isPro: false },
            { id: 99, title: 'REET (Rajasthan TET)', category: 'tet', totalTests: 40, freeTests: 5, students: 38100, languages: 'Hindi, English', syllabusCoverage: 82, isPro: true },
            { id: 100, title: 'MPTET / CGTET', category: 'tet', totalTests: 30, freeTests: 4, students: 22400, languages: 'Hindi, English', syllabusCoverage: 76, isPro: false }
        ]
    }
};


/* ======================================================
   DOM Logic
   ====================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const sidebarBoards = document.getElementById('sidebarBoards');
    const sidebarCategories = document.getElementById('sidebarCategories');
    const examsGrid = document.getElementById('examsGrid');
    const examSearchInput = document.getElementById('examSearch');
    
    // UI Elements for header
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');

    // Mobile Sidebar Elements
    const mobileFilterToggle = document.getElementById('mobileFilterToggle');
    const filtersSidebar = document.getElementById('filtersSidebar');
    const closeFiltersBtn = document.getElementById('closeFiltersBtn');

    let currentBoard = 'ssc';
    let currentCategory = 'ssc-all';

    // ── Helpers ──
    function formatStudents(num) {
        if (num >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        return num.toString();
    }

    // ── Render Sidebar Boards ──
    function renderSidebarBoards() {
        if (!sidebarBoards) return;
        sidebarBoards.innerHTML = '';
        const boards = Object.keys(examsDatabase);

        boards.forEach(boardKey => {
            const board = examsDatabase[boardKey];
            const btn = document.createElement('button');
            btn.className = `sidebar-btn ${boardKey === currentBoard ? 'active' : ''}`;
            btn.setAttribute('data-board', boardKey);
            
            const labels = {
                ssc: 'SSC',
                banking: 'Banking',
                railways: 'Railways',
                upsc: 'UPSC & Defence',
                teaching: 'Teaching'
            };
            btn.innerHTML = `<i class="${board.icon}"></i> <span>${labels[boardKey]}</span>`;

            btn.addEventListener('click', () => {
                currentBoard = boardKey;
                currentCategory = board.categories[0].id; // Reset to "All" category
                renderSidebarBoards();
                renderSidebarCategories();
                renderCards();
            });

            sidebarBoards.appendChild(btn);
        });
    }

    // ── Render Sidebar Categories ──
    function renderSidebarCategories() {
        if (!sidebarCategories) return;
        sidebarCategories.innerHTML = '';
        const board = examsDatabase[currentBoard];

        board.categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `sidebar-btn ${cat.id === currentCategory ? 'active' : ''}`;
            btn.innerHTML = `<span>${cat.name}</span> <span style="margin-left:auto; font-size: 0.8rem; opacity: 0.6;">(${cat.count})</span>`;

            btn.addEventListener('click', () => {
                currentCategory = cat.id;
                renderSidebarCategories();
                renderCards();
            });

            sidebarCategories.appendChild(btn);
        });
    }

    // ── Get Active Checkbox Values ──
    function getCheckedValues(name) {
        return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
    }

    // Bind checkbox listeners
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', renderCards);
    });

    // ── Render Exam Cards ──
    function renderCards() {
        if (!examsGrid) return;

        const board = examsDatabase[currentBoard];
        let tests = board.tests;

        // 1. Filter by category
        if (!currentCategory.endsWith('-all') && currentCategory !== 'teach-all') {
            tests = tests.filter(t => t.category === currentCategory);
        }

        // 2. Filter by Search Query
        const query = (examSearchInput ? examSearchInput.value : '').trim().toLowerCase();
        if (query.length > 0) {
            tests = tests.filter(t => t.title.toLowerCase().includes(query));
        }

        // 3. Filter by Test Type (Checkboxes)
        const activeTypes = getCheckedValues('testType');
        if (activeTypes.length > 0) {
            tests = tests.filter(t => {
                const titleLower = t.title.toLowerCase();
                let matches = false;
                if (activeTypes.includes('chapter') && (titleLower.includes('chapter') || titleLower.includes('topic'))) matches = true;
                if (activeTypes.includes('sectional') && (titleLower.includes('section') || titleLower.includes('math') || titleLower.includes('english'))) matches = true;
                if (activeTypes.includes('pyp') && (titleLower.includes('pyq') || titleLower.includes('previous'))) matches = true;
                if (activeTypes.includes('full') && (titleLower.includes('full') || titleLower.includes('tier 1') || titleLower.includes('prelims') || titleLower.includes('cbt') || (!titleLower.includes('chapter') && !titleLower.includes('section') && !titleLower.includes('pyq')))) matches = true;
                return matches;
            });
        } else {
            // If nothing checked, show nothing or ignore filter? Let's treat no checks as "hide all" or "show all". Usually, unchecked means filtered out.
            tests = []; 
        }

        // 4. Filter by Language (Checkboxes)
        const activeLangs = getCheckedValues('language');
        if (activeLangs.length > 0) {
            tests = tests.filter(t => {
                const testLangs = t.languages.toLowerCase();
                return activeLangs.some(lang => testLangs.includes(lang));
            });
        } else {
            tests = [];
        }

        // Update UI Text
        if (resultsTitle && resultsCount) {
            const catName = getCategoryName(board, currentCategory);
            resultsTitle.textContent = query ? `Search: "${query}"` : `${catName} Exams`;
            resultsCount.textContent = `${tests.length} Tests found`;
        }

        examsGrid.innerHTML = '';

        if (tests.length === 0) {
            examsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; padding: 60px 20px; text-align: center;">
                    <i class="fa-solid fa-folder-open" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.3;"></i>
                    <h3 style="font-size: 1.2rem; margin-bottom: 8px;">No exams found</h3>
                    <p style="opacity: 0.7;">Try adjusting your filters or search query.</p>
                </div>`;
            return;
        }

        tests.forEach((test, index) => {
            const card = document.createElement('div');
            card.className = 'mock-card glass-card hover-glow';
            card.style.animationDelay = `${(index % 10) * 0.05}s`;
            card.style.opacity = '0';
            card.style.animation = 'examCardFadeIn 0.5s ease-out forwards';

            const proBadge = test.isPro
                ? `<span class="pro-tag" style="background: linear-gradient(135deg, #9333ea, #6b21a8); padding: 4px 10px; border-radius: 20px; color: white; font-size: 0.68rem; font-weight: 800; text-transform: uppercase;"><i class="fa-solid fa-crown"></i> PRO</span>`
                : `<span class="free-badge">100% Free</span>`;
            
            const avatarIds = [1, 2, 3, 6, 7, 9, 10, 11].sort(() => 0.5 - Math.random()).slice(0, 3);
            const avatarsHtml = avatarIds.map(id => `<img src="assets/avatars/memoji_${id}.png" class="avatar-sm">`).join('');

            let tabToOpen = 'full';
            const tLower = test.title.toLowerCase();
            if (tLower.includes('chapter') || tLower.includes('topic')) tabToOpen = 'chapter';
            else if (tLower.includes('section')) tabToOpen = 'sectional';
            else if (tLower.includes('pyq') || tLower.includes('previous')) tabToOpen = 'pyq';

            card.innerHTML = `
                <div class="mock-card-header">
                    <div>
                        <span class="live-badge bg-blue" style="vertical-align: middle; background: #3b82f6;"></span>
                        <span class="font-bold text-sm" style="margin-left:5px; vertical-align: middle; color: #60a5fa;">NEW PATTERN</span>
                    </div>
                    ${proBadge}
                </div>
                <div class="mock-card-body">
                    <h3 class="mock-title">${test.title}</h3>
                    <p class="mock-subtitle">${getCategoryName(board, test.category)}</p>
                    
                    <div class="mock-stats">
                        <div class="mock-stat"><i class="fa-regular fa-file-lines"></i> ${test.totalTests} Tests</div>
                        <div class="mock-stat"><i class="fa-regular fa-comment-dots"></i> ${test.languages.includes(',') ? 'Bilingual' : test.languages}</div>
                        <div class="mock-stat"><i class="fa-solid fa-gift"></i> ${test.freeTests} Free</div>
                    </div>
                    
                    <div class="mock-enrolled">
                        <div class="avatar-group-small">
                            ${avatarsHtml}
                        </div>
                        <span class="text-sm text-muted"><strong>${formatStudents(test.students)}</strong> Enrolled</span>
                    </div>
                </div>
                <div class="mock-card-footer">
                    <button class="btn-primary w-100 attempt-btn" onclick="window.location.href='test-details.html?id=${test.id}&tab=${tabToOpen}'">Explore Tests <i class="fa-solid fa-arrow-right"></i></button>
                </div>
            `;

            examsGrid.appendChild(card);
        });
    }

    // ── Helper: get category display name ──
    function getCategoryName(board, categoryId) {
        const cat = board.categories.find(c => c.id === categoryId);
        return cat ? cat.name : '';
    }

    // ── Search Listener ──
    if (examSearchInput) {
        let searchTimeout;
        examSearchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                renderCards();
            }, 300);
        });
    }

    // ── Mobile Sidebar Logic ──
    if (mobileFilterToggle && filtersSidebar) {
        mobileFilterToggle.addEventListener('click', () => {
            filtersSidebar.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    if (closeFiltersBtn && filtersSidebar) {
        closeFiltersBtn.addEventListener('click', () => {
            filtersSidebar.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // ── Parse URL Params ──
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q');
    const catParam = urlParams.get('category');

    if (catParam && catParam !== 'all' && examsDatabase[catParam]) {
        // If the category passed is a board key (e.g., 'banking')
        currentBoard = catParam;
        currentCategory = examsDatabase[catParam].categories[0].id;
    } else if (catParam && catParam !== 'all') {
        // If it's a specific sub-category (e.g., 'bank-sbi-po')
        for (const boardKey in examsDatabase) {
            const found = examsDatabase[boardKey].categories.find(c => c.id === catParam);
            if (found) {
                currentBoard = boardKey;
                currentCategory = catParam;
                break;
            }
        }
    }

    if (qParam && examSearchInput) {
        examSearchInput.value = qParam;
    }

    // ── Initialize ──
    renderSidebarBoards();
    renderSidebarCategories();
    renderCards();
});
