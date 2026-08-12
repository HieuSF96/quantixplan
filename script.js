// Quantix Pitch Deck Controller & Financial Simulator

document.addEventListener('DOMContentLoaded', () => {
    // --- Slide Navigation System ---
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const dotsContainer = document.getElementById('dots-container');
    const currentSlideNum = document.getElementById('current-slide-num');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Initialize Navigation Dots
    function initDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot-indicator');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Main Update Slide View function
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            if (index === currentSlide) {
                slide.classList.add('active');
            } else if (index < currentSlide) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });

        // Update Dots
        const dots = document.querySelectorAll('.dot-indicator');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update Header Counter
        currentSlideNum.textContent = currentSlide + 1;

        // Update Top Navigation Menu Active State
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            if (index === currentSlide) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Hide keyboard guide toast after slide moves
        const guide = document.querySelector('.keyboard-guide');
        if (guide && currentSlide > 0) {
            guide.style.opacity = '0';
        }

        // Draw org chart lines if we are on slide 7 (index 6)
        if (currentSlide === 6) {
            setTimeout(drawOrgChartLines, 100);
        }
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlides();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlides();
        }
    }

    window.goToSlide = function(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlide = index;
            updateSlides();
        }
    };

    // Navigation Button Bindings
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Keyboard Arrow Controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    initDots();
    updateSlides();


    // --- Slide 3: Service Cards Expansion ---
    window.toggleServiceDetail = function(id) {
        const targetCard = document.querySelector(`.service-card:nth-child(${id})`);
        const isExpanded = targetCard.classList.contains('expanded');
        
        // Collapse all first
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('expanded');
        });

        // Toggle clicked
        if (!isExpanded) {
            targetCard.classList.add('expanded');
        }
    };


    // --- Slide 9: Shareholder Financial Simulator ---
    // Sliders & Inputs
    const inputClientCount = document.getElementById('client-count');
    const inputMonthlyFee = document.getElementById('monthly-fee');
    const inputConsultingRev = document.getElementById('consulting-rev');

    const inputCountLeader = document.getElementById('count-leader');
    const inputSalaryLeader = document.getElementById('salary-leader');
    const inputCountAccountant = document.getElementById('count-accountant');
    const inputSalaryAccountant = document.getElementById('salary-accountant');
    const inputCountLegal = document.getElementById('count-legal');
    const inputSalaryLegal = document.getElementById('salary-legal');
    const inputCountAdmin = document.getElementById('count-admin');
    const inputSalaryAdmin = document.getElementById('salary-admin');
    const inputCountHr = document.getElementById('count-hr');
    const inputSalaryHr = document.getElementById('salary-hr');
    const inputCountQa = document.getElementById('count-qa');
    const inputSalaryQa = document.getElementById('salary-qa');

    const inputRentCost = document.getElementById('rent-cost');
    const inputAdminPercent = document.getElementById('admin-percent');

    // Values on UI
    const valClientCount = document.getElementById('val-client-count');
    const valMonthlyFee = document.getElementById('val-monthly-fee');
    const valConsultingRev = document.getElementById('val-consulting-rev');

    const valSalaryLeader = document.getElementById('val-salary-leader');
    const valSalaryAccountant = document.getElementById('val-salary-accountant');
    const valSalaryLegal = document.getElementById('val-salary-legal');
    const valSalaryAdmin = document.getElementById('val-salary-admin');
    const valSalaryHr = document.getElementById('val-salary-hr');
    const valSalaryQa = document.getElementById('val-salary-qa');

    const valRentCost = document.getElementById('val-rent-cost');
    const valAdminPercent = document.getElementById('val-admin-percent');

    // Result Nodes
    const resTotalRev = document.getElementById('res-total-rev');
    const resTotalCost = document.getElementById('res-total-cost');
    const resNetProfit = document.getElementById('res-net-profit');
    const resRoi = document.getElementById('res-roi');

    // Chart Nodes
    const barRev = document.getElementById('bar-rev');
    const barCost = document.getElementById('bar-cost');
    const barProfit = document.getElementById('bar-profit');
    const barValRev = document.getElementById('bar-val-rev');
    const barValCost = document.getElementById('bar-val-cost');
    const barValProfit = document.getElementById('bar-val-profit');

    // Helper: Currency Formatter
    function formatCurrencyVN(value) {
        if (value >= 1000000000) {
            return (value / 1000000000).toFixed(2).replace(/\.00$/, '') + ' tỷ';
        } else if (value >= 1000000) {
            return (value / 1000000).toFixed(0) + ' triệu';
        }
        return value.toLocaleString('vi-VN') + ' đ';
    }

    // Helper: Simple currency label for charts
    function formatChartLabel(value) {
        if (value >= 1000000000) {
            return (value / 1000000000).toFixed(2) + 'B';
        } else {
            return (value / 1000000).toFixed(0) + 'M';
        }
    }

    function calculateFinance() {
        // 1. Get raw inputs
        const clients = parseInt(inputClientCount.value) || 0;
        const fee = parseFloat(inputMonthlyFee.value) || 0;
        const consulting = parseFloat(inputConsultingRev.value) || 0;

        const countLeader = parseInt(inputCountLeader.value) || 0;
        const salaryLeader = parseFloat(inputSalaryLeader.value) || 0;
        const countAccountant = parseInt(inputCountAccountant.value) || 0;
        const salaryAccountant = parseFloat(inputSalaryAccountant.value) || 0;
        const countLegal = parseInt(inputCountLegal.value) || 0;
        const salaryLegal = parseFloat(inputSalaryLegal.value) || 0;
        const countAdmin = parseInt(inputCountAdmin.value) || 0;
        const salaryAdmin = parseFloat(inputSalaryAdmin.value) || 0;
        const countHr = parseInt(inputCountHr.value) || 0;
        const salaryHr = parseFloat(inputSalaryHr.value) || 0;
        const countQa = parseInt(inputCountQa.value) || 0;
        const salaryQa = parseFloat(inputSalaryQa.value) || 0;

        const rentMonthly = parseFloat(inputRentCost.value) || 0;
        const adminPercent = parseFloat(inputAdminPercent.value) || 0;

        // Update Slider Labels
        valClientCount.textContent = clients;
        valMonthlyFee.textContent = fee.toLocaleString('vi-VN') + ' đ';
        valConsultingRev.textContent = formatCurrencyVN(consulting);

        valSalaryLeader.textContent = formatCurrencyVN(salaryLeader);
        valSalaryAccountant.textContent = formatCurrencyVN(salaryAccountant);
        valSalaryLegal.textContent = formatCurrencyVN(salaryLegal);
        valSalaryAdmin.textContent = formatCurrencyVN(salaryAdmin);
        valSalaryHr.textContent = formatCurrencyVN(salaryHr);
        valSalaryQa.textContent = formatCurrencyVN(salaryQa);

        valRentCost.textContent = formatCurrencyVN(rentMonthly);
        valAdminPercent.textContent = adminPercent + ' %';

        // 2. Calculations
        const periodicalRev = clients * fee * 12;
        const totalRevenue = periodicalRev + consulting;

        const monthlyStaffPayroll = (countLeader * salaryLeader) + 
                                     (countAccountant * salaryAccountant) + 
                                     (countLegal * salaryLegal) + 
                                     (countAdmin * salaryAdmin) + 
                                     (countHr * salaryHr) + 
                                     (countQa * salaryQa);
        const annualStaffPayroll = monthlyStaffPayroll * 12;
        const annualRent = rentMonthly * 12;
        const baseExpenses = annualStaffPayroll + annualRent;

        const otherMgmtCost = baseExpenses * (adminPercent / 100);
        const totalExpenses = baseExpenses + otherMgmtCost;

        const profitBeforeTax = totalRevenue - totalExpenses;
        const corporateTax = profitBeforeTax > 0 ? profitBeforeTax * 0.17 : 0; // 17% tax rate
        const netProfit = profitBeforeTax - corporateTax;

        const roi = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

        // 3. Update Result Cards
        resTotalRev.textContent = formatCurrencyVN(totalRevenue) + ' đ';
        resTotalCost.textContent = formatCurrencyVN(totalExpenses) + ' đ';
        resNetProfit.textContent = netProfit > 0 ? formatCurrencyVN(netProfit) + ' đ' : '0 đ (Lỗ)';
        resRoi.textContent = netProfit > 0 ? roi.toFixed(1) + '%' : '0%';

        // Dynamic styling for Net Profit Card based on profit/loss
        const netProfitCard = resNetProfit.closest('.metric-card');
        if (profitBeforeTax < 0) {
            netProfitCard.style.borderLeftColor = 'var(--danger)';
            resNetProfit.style.color = 'var(--danger)';
        } else {
            netProfitCard.style.borderLeftColor = 'var(--accent-emerald)';
            resNetProfit.style.color = 'var(--accent-emerald)';
        }

        // 4. Update Graphic Bars
        const maxBarValue = Math.max(totalRevenue, totalExpenses, Math.max(0, netProfit), 1);
        
        const revHeight = (totalRevenue / maxBarValue) * 100;
        const costHeight = (totalExpenses / maxBarValue) * 100;
        const profitHeight = netProfit > 0 ? (netProfit / maxBarValue) * 100 : 0;

        barRev.style.height = `${Math.max(5, revHeight)}%`;
        barCost.style.height = `${Math.max(5, costHeight)}%`;
        barProfit.style.height = `${Math.max(2, profitHeight)}%`;

        barValRev.textContent = formatChartLabel(totalRevenue);
        barValCost.textContent = formatChartLabel(totalExpenses);
        barValProfit.textContent = netProfit > 0 ? formatChartLabel(netProfit) : '0';
    }

    // Attach Event Listeners to all sliders and inputs
    const inputsToBind = [
        inputClientCount, inputMonthlyFee, inputConsultingRev,
        inputCountLeader, inputSalaryLeader,
        inputCountAccountant, inputSalaryAccountant,
        inputCountLegal, inputSalaryLegal,
        inputCountAdmin, inputSalaryAdmin,
        inputCountHr, inputSalaryHr,
        inputCountQa, inputSalaryQa,
        inputRentCost, inputAdminPercent
    ];
    inputsToBind.forEach(input => {
        if (input) {
            input.addEventListener('input', calculateFinance);
            if (input.tagName === 'INPUT' && input.type === 'number') {
                input.addEventListener('change', calculateFinance);
            }
        }
    });

        // Stepper adjust logic for employee count (horizontal button stepper)
    window.adjustStepper = function(inputId, amount) {
        const input = document.getElementById(inputId);
        if (!input) return;
        let val = parseInt(input.value) || 0;
        val += amount;
        const min = parseInt(input.min) || 0;
        const max = parseInt(input.max) || 99;
        if (val >= min && val <= max) {
            input.value = val;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    // --- Slide 7: Org Chart Interaction ---
    const deptData = {
        ceo: {
            name: "Ban Giám Đốc",
            icon: "👑",
            desc: "Phụ trách hoạch định chiến lược kinh doanh toàn cục, phát triển công nghệ AI, quản lý quan hệ đối tác chiến lược và đàm phán cấp cao với cổ đông/khách hàng VIP."
        },
        hr: {
            name: "Phòng Nhân Sự",
            icon: "👥",
            desc: "Tính lương, thưởng, đánh giá, phê bình, tổ chức đào tạo nâng cao nghiệp vụ chuyên môn, hỗ trợ tâm lý nhân sự và tổ chức các sự kiện kết nối team building nhằm nâng cao tinh thần đoàn kết."
        },
        qa: {
            name: "Phòng Kiểm Soát Nội Bộ",
            icon: "🛡️",
            desc: "Định kỳ hàng tháng bóc mẫu ngẫu nhiên và kiểm tra chuyên sâu sổ sách kế toán, rà soát hóa đơn rủi ro, đồng thời đánh giá thái độ phục vụ và chất lượng chăm sóc khách hàng của từng nhân viên."
        },
        accounting: {
            name: "Phòng Nghiệp Vụ Kế Toán - Thuế",
            icon: "📊",
            desc: "Gồm các Trưởng nhóm và các Kế toán viên. Trưởng nhóm phụ trách quản lý tài khoản khách hàng, tư vấn nghiệp vụ, kiểm tra công việc và đôn đốc tiến độ. Kế toán viên chỉ việc tập trung nhập liệu, xử lý chứng từ và lên báo cáo kế toán - thuế định kỳ."
        },
        legal: {
            name: "Phòng Nghiệp Vụ BHXH & Pháp Lý",
            icon: "⚖️",
            desc: "Phụ trách thực hiện toàn bộ các thủ tục liên quan đến bảo hiểm xã hội (tăng giảm lao động, chế độ BHXH...) và các thủ tục pháp lý liên quan đến đăng ký kinh doanh cho doanh nghiệp."
        },
        admin: {
            name: "Phòng Admin",
            icon: "✉️",
            desc: "Phụ trách tiếp nhận các ý kiến phản ánh của khách hàng, hỗ trợ các phòng ban nghiệp vụ soạn thảo văn bản, quản lý xuất hóa đơn đầu ra, theo dõi thu hồi công nợ và gửi nhận thư từ tài liệu trực tiếp."
        }
    };

    window.showDeptDetails = function(deptKey) {
        const placeholder = document.getElementById('dept-placeholder');
        const content = document.getElementById('dept-content');
        const iconSpan = document.getElementById('dept-icon');
        const nameSpan = document.getElementById('dept-name-text');
        const descSpan = document.getElementById('dept-desc-text');
        
        // Remove active class from all cards
        document.querySelectorAll('.org-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active class to clicked card
        if (window.event && window.event.currentTarget) {
            window.event.currentTarget.classList.add('active');
        }

        const data = deptData[deptKey];
        if (data) {
            placeholder.style.display = 'none';
            content.style.display = 'block';
            iconSpan.textContent = data.icon;
            nameSpan.textContent = data.name;
            descSpan.textContent = data.desc;
            
            // Add fade-in animation trigger
            content.classList.remove('animate-fade-in');
            void content.offsetWidth; // trigger reflow
            content.classList.add('animate-fade-in');
        }
    };

    function drawOrgChartLines() {
        const svg = document.getElementById('org-svg-lines');
        if (!svg) return;
        
        // Clear old lines
        svg.innerHTML = '';
        
        const tree = document.querySelector('.org-chart-tree');
        if (!tree) return;
        
        const treeRect = tree.getBoundingClientRect();
        
        const cards = {
            ceo: document.querySelector('.org-card.leader'),
            hr: document.querySelector('.org-card.support:not(.qa)'),
            qa: document.querySelector('.org-card.support.qa'),
            accounting: document.querySelector('.org-row.row-bottom .org-card:nth-child(1)'),
            legal: document.querySelector('.org-row.row-bottom .org-card:nth-child(2)'),
            admin: document.querySelector('.org-row.row-bottom .org-card:nth-child(3)')
        };
        
        // Check if all cards exist and are rendered
        if (!cards.ceo || !cards.hr || !cards.qa || !cards.accounting || !cards.legal || !cards.admin) {
            return;
        }
        
        const getCenterTop = (el) => {
            const r = el.getBoundingClientRect();
            return {
                x: r.left + r.width / 2 - treeRect.left,
                y: r.top - treeRect.top
            };
        };
        
        const getCenterBottom = (el) => {
            const r = el.getBoundingClientRect();
            return {
                x: r.left + r.width / 2 - treeRect.left,
                y: r.bottom - treeRect.top
            };
        };
        
        const getCenterLeft = (el) => {
            const r = el.getBoundingClientRect();
            return {
                x: r.left - treeRect.left,
                y: r.top + r.height / 2 - treeRect.top
            };
        };
        
        const getCenterRight = (el) => {
            const r = el.getBoundingClientRect();
            return {
                x: r.right - treeRect.left,
                y: r.top + r.height / 2 - treeRect.top
            };
        };
        
        // Positions
        const ceoBottom = getCenterBottom(cards.ceo);
        const hrRight = getCenterRight(cards.hr);
        const qaLeft = getCenterLeft(cards.qa);
        
        const accountingTop = getCenterTop(cards.accounting);
        const legalTop = getCenterTop(cards.legal);
        const adminTop = getCenterTop(cards.admin);
        
        // Midpoint Y level for HR & QA horizontal line
        const midY = hrRight.y;
        
        // Paths list
        let paths = [];
        
        // 1. CEO Bottom to the intersection point at midY
        paths.push(`M ${ceoBottom.x} ${ceoBottom.y} L ${ceoBottom.x} ${midY}`);
        
        // 2. HR right edge to QA left edge (horizontal connector line)
        paths.push(`M ${hrRight.x} ${midY} L ${qaLeft.x} ${midY}`);
        
        // 3. Central trunk Y going down from midY to the fork Y above bottom row
        // Bottom branch Y is halfway between middle row bottom and bottom row top
        const bottomBranchY = midY + (accountingTop.y - midY) / 2;
        paths.push(`M ${ceoBottom.x} ${midY} L ${ceoBottom.x} ${bottomBranchY}`);
        
        // 4. Horizontal branch line for bottom row spanning from Left Card Center to Right Card Center
        paths.push(`M ${accountingTop.x} ${bottomBranchY} L ${adminTop.x} ${bottomBranchY}`);
        
        // 5. Three vertical drops down to bottom row cards
        paths.push(`M ${accountingTop.x} ${bottomBranchY} L ${accountingTop.x} ${accountingTop.y}`);
        paths.push(`M ${legalTop.x} ${bottomBranchY} L ${legalTop.x} ${legalTop.y}`);
        paths.push(`M ${adminTop.x} ${bottomBranchY} L ${adminTop.x} ${adminTop.y}`);
        
        // Draw path elements on SVG
        paths.forEach(pStr => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pStr);
            path.setAttribute('stroke', 'rgba(0, 242, 254, 0.3)'); // Cyan semi-transparent lines
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            svg.appendChild(path);
        });
    }

    // Attach resize listener to redrawing org-chart lines
    window.addEventListener('resize', () => {
        if (currentSlide === 6) {
            drawOrgChartLines();
        }
    });

    // Run initial calculation
    calculateFinance();
});
