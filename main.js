document.addEventListener('DOMContentLoaded', () => {
    // ===================================================================
    // =================  1. تحديد كل العناصر المهمة في الصفحة =================
    // ===================================================================
    const formulaNameInput = document.getElementById('formulaName');
    const formulaValueInput = document.getElementById('formulaValue');
    const addFormulaBtn = document.getElementById('addFormulaBtn');
    const formulaButtonsContainer = document.getElementById('formulaButtonsContainer');
    const selectedFormulaInput = document.getElementById('selectedFormula');
    
    // ===================================================================
    // =================  2. تعريف المعادلات الأساسية والثابتة =================
    // ===================================================================
    const baseFormulas = {
        '11*2': '(50 / 2) / 11',
        '20*30': '50 / 11',
        '11*4': '(50 / 4) / 11',
        '2*9': '(50 / 9) / 2',
        '9': '50 / 9',
        '9*4': '(50 / 9) / 4',
        '2*8': '(50 / 8) / 2',
        '8': '50 / 8',
        '4*8': '(50 / 8) / 4'
    };

    // متغيرات لحفظ الحالة
    let customFormulas = {};
    let currentFormulaName = '';
    let allFormulas = {};

    // ===================================================================
    // =================  3. دوال إدارة المعادلات (حفظ، تحميل، عرض) =================
    // ===================================================================

    // دالة لحفظ المعادلات المخصصة فقط
    function saveCustomFormulas() {
        localStorage.setItem('savedCustomFormulas', JSON.stringify(customFormulas));
    }

    // دالة لتحميل المعادلات المخصصة ودمجها مع الأساسية
    function loadFormulas() {
        const saved = localStorage.getItem('savedCustomFormulas');
        if (saved) {
            customFormulas = JSON.parse(saved);
        }
        // دمج المعادلات الأساسية والمخصصة في مكان واحد للعرض
        allFormulas = { ...baseFormulas, ...customFormulas };
        renderFormulaButtons();
    }

    // دالة لعرض كل أزرار المعادلات على الشاشة
    function renderFormulaButtons() {
        formulaButtonsContainer.innerHTML = '';
        // عرض المعادلات الأساسية أولاً
        for (const name in baseFormulas) {
            createButton(name, false); // false = غير قابل للحذف
        }
        // عرض المعادلات المخصصة ثانيًا
        for (const name in customFormulas) {
            createButton(name, true); // true = قابل للحذف
        }
    }

    // دالة لإنشاء زر معادلة (أساسي أو مخصص)
    function createButton(name, isDeletable) {
        const wrapper = document.createElement('div');
        wrapper.className = 'formula-btn-wrapper';

        const button = document.createElement('button');
        button.className = 'formula-btn';
        button.classList.add(isDeletable ? 'custom-formula' : 'base-formula');
        button.textContent = name;
        button.onclick = () => setFormula(name);

        wrapper.appendChild(button);

        if (isDeletable) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteFormula(name);
            };
            wrapper.appendChild(deleteBtn);
        }
        
        formulaButtonsContainer.appendChild(wrapper);
    }

    // ===================================================================
    // =================  4. دوال التفاعل (إضافة، حذف، اختيار) =================
    // ===================================================================

    // دالة لإضافة معادلة مخصصة جديدة
    function addFormula() {
        const name = formulaNameInput.value.trim();
        const value = formulaValueInput.value.trim();

        if (!name || !value) {
            alert('يرجى إدخال اسم ومعادلة.');
            return;
        }
        if (baseFormulas[name]) {
            alert('لا يمكن استخدام اسم معادلة أساسية. يرجى اختيار اسم آخر.');
            return;
        }

        customFormulas[name] = value;
        saveCustomFormulas();
        loadFormulas(); // إعادة تحميل وعرض كل شيء

        formulaNameInput.value = '';
        formulaValueInput.value = '';
    }

    // دالة لحذف معادلة مخصصة فقط
    function deleteFormula(name) {
        if (confirm(`هل أنت متأكد من حذف معادلة "${name}"؟`)) {
            delete customFormulas[name];
            saveCustomFormulas();
            loadFormulas(); // إعادة تحميل وعرض كل شيء
            if (currentFormulaName === name) {
                currentFormulaName = '';
                selectedFormulaInput.value = '';
            }
        }
    }

    // دالة لاختيار معادلة
    window.setFormula = function(name) {
        currentFormulaName = name;
        selectedFormulaInput.value = name;
        document.querySelectorAll('.formula-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.textContent === name) {
                btn.classList.add('selected');
            }
        });
    }

    // ===================================================================
    // =================  5. دوال الحسابات (بدون تغيير) =================
    // ===================================================================

    window.calculateFormula = function() {
        if (!currentFormulaName) {
            alert('برجاء اختيار معادلة أولاً');
            return;
        }
        const numberOfBooks = parseFloat(document.getElementById('numberOfBooks').value) || 0;
        const formulaString = allFormulas[currentFormulaName];
        try {
            const result = eval(formulaString);
            const finalResult = result * numberOfBooks;
            document.getElementById('formulaResult').textContent = finalResult.toFixed(2);
            document.getElementById('formulaDisplay').textContent = `(${formulaString}) × ${numberOfBooks} = ${finalResult.toFixed(2)}`;
        } catch (error) {
            alert('خطأ في المعادلة المدخلة. يرجى مراجعتها.');
            console.error("Formula Error:", error);
        }
    }

    window.calculateTotal = function() {
        const numberOfPapers = parseFloat(document.getElementById('numberOfPapers').value) || 0;
        const paperPrice = parseFloat(document.getElementById('paperPrice').value) || 0;
        const numberOfZinc = parseFloat(document.getElementById('numberOfZinc').value) || 0;
        const numberOfPrints = parseFloat(document.getElementById('numberOfPrints').value) || 0;
        const bindingPrice = parseFloat(document.getElementById('bindingPrice').value) || 0;
        const totalPaperCost = numberOfPapers * paperPrice;
        const totalZincCost = numberOfZinc * 50;
        const totalPrintCost = numberOfPrints * 75;
        const total = totalPaperCost + totalZincCost + totalPrintCost + bindingPrice;
        document.getElementById('totalResult').textContent = total.toFixed(2) + ' جنيه';
    }

    // ===================================================================
    // =================  6. ربط الأحداث والتشغيل الأولي =================
    // ===================================================================
    addFormulaBtn.addEventListener('click', addFormula);
    loadFormulas(); // تحميل كل المعادلات عند بدء تشغيل الصفحة
});
