      // الكود JavaScript يبقى كما هو بدون تغييرات
        document.addEventListener('DOMContentLoaded', () => {
            // ===================================================================
            // =================  1. تحديد كل العناصر المهمة في الصفحة =================
            // ===================================================================
            const formulaNameInput = document.getElementById('formulaName');
            const formulaValueInput = document.getElementById('formulaValue');
            const addFormulaBtn = document.getElementById('addFormulaBtn');
            const formulaButtonsContainer = document.getElementById('formulaButtonsContainer');
            const selectedFormulaInput = document.getElementById('selectedFormula');
            
            // عناصر إدارة الورق
            const paperNameInput = document.getElementById('paperName');
            const paperPriceInput = document.getElementById('paperPriceInput');
            const addPaperBtn = document.getElementById('addPaperBtn');
            const paperTypesContainer = document.getElementById('paperTypesContainer');
            const paperTypeSelect = document.getElementById('paperTypeSelect');
            const paperPriceField = document.getElementById('paperPrice');
            const applyPaperPriceBtn = document.getElementById('applyPaperPriceBtn');
            const selectedPaperPrice = document.getElementById('selectedPaperPrice');

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

            // أنواع الورق الأساسية
            const basePaperTypes = {
                'paper_base_1': {
                    name: 'أصل+1',
                    price: 9.90
                },
                'paper_base_2': {
                    name: 'أصل+2',
                    price: 13.40
                },
                'paper_base_3': {
                    name: 'أصل+3',
                    price: 16.90
                },
                'paper_base_4': {
                    name: 'أصل+4',
                    price: 20.40
                },
                'paper_base_5': {
                    name: 'أصل+5',
                    price: 23.90
                }
            };

            // متغيرات لحفظ الحالة
            let customFormulas = {};
            let paperTypes = {};
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
            // =================  4. دوال إدارة أنواع الورق =================
            // ===================================================================

            // دالة لحفظ أنواع الورق
            function savePaperTypes() {
                localStorage.setItem('paperTypes', JSON.stringify(paperTypes));
            }

            // دالة لتحميل أنواع الورق
            function loadPaperTypes() {
                const saved = localStorage.getItem('paperTypes');
                if (saved) {
                    paperTypes = JSON.parse(saved);
                } else {
                    // إذا لم تكن هناك أنواع ورق محفوظة، نستخدم الأنواع الأساسية
                    paperTypes = { ...basePaperTypes };
                    savePaperTypes();
                }
                renderPaperTypes();
                updatePaperTypeSelect();
            }

            // دالة لعرض أنواع الورق
            function renderPaperTypes() {
                paperTypesContainer.innerHTML = '';
                
                for (const id in paperTypes) {
                    const paper = paperTypes[id];
                    createPaperCard(id, paper);
                }
            }

            // دالة لإنشاء بطاقة نوع ورق
            function createPaperCard(id, paper) {
                const card = document.createElement('div');
                card.className = 'paper-type-card';
                
                // معلومات الورق
                const nameDiv = document.createElement('div');
                nameDiv.className = 'paper-name';
                nameDiv.textContent = paper.name;
                
                const priceDiv = document.createElement('div');
                priceDiv.className = 'paper-price';
                priceDiv.textContent = `${paper.price.toFixed(2)} جنيه`;
                
                // أزرار التعديل والحذف
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'paper-actions';
                
                const editBtn = document.createElement('button');
                editBtn.className = 'paper-action-btn edit-btn';
                editBtn.textContent = 'تعديل';
                editBtn.onclick = () => editPaperType(id);
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'paper-action-btn delete-paper-btn';
                deleteBtn.textContent = 'حذف';
                deleteBtn.onclick = () => deletePaperType(id);
                
                actionsDiv.appendChild(editBtn);
                actionsDiv.appendChild(deleteBtn);
                
                // تجميع كل العناصر
                card.appendChild(nameDiv);
                card.appendChild(priceDiv);
                card.appendChild(actionsDiv);
                
                paperTypesContainer.appendChild(card);
            }

            // دالة لتحديث قائمة اختيار أنواع الورق
            function updatePaperTypeSelect() {
                paperTypeSelect.innerHTML = '<option value="">اختر نوع الورق</option>';
                
                for (const id in paperTypes) {
                    const paper = paperTypes[id];
                    const option = document.createElement('option');
                    option.value = id;
                    option.textContent = `${paper.name} - ${paper.price.toFixed(2)} جنيه`;
                    paperTypeSelect.appendChild(option);
                }
            }

            // ===================================================================
            // =================  5. دوال التفاعل (إضافة، حذف، اختيار) =================
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

            // دالة لإضافة نوع ورق جديد
            function addPaperType() {
                const name = paperNameInput.value.trim();
                const price = parseFloat(paperPriceInput.value);

                if (!name || isNaN(price)) {
                    alert('يرجى إدخال اسم وسعر صحيحين لنوع الورق.');
                    return;
                }

                // إنشاء معرف فريد لنوع الورق
                const id = 'paper_' + Date.now();
                
                paperTypes[id] = {
                    name: name,
                    price: price
                };
                
                savePaperTypes();
                loadPaperTypes();
                
                // مسح الحقول
                paperNameInput.value = '';
                paperPriceInput.value = '';
            }

            // دالة لتعديل نوع ورق
            function editPaperType(id) {
                const paper = paperTypes[id];
                
                const newName = prompt('أدخل الاسم الجديد:', paper.name);
                if (newName === null) return; // المستخدم ألغى
                
                const newPrice = parseFloat(prompt('أدخل السعر الجديد:', paper.price));
                if (isNaN(newPrice)) {
                    alert('يرجى إدخال سعر صحيح.');
                    return;
                }
                
                paperTypes[id] = {
                    name: newName,
                    price: newPrice
                };
                
                savePaperTypes();
                loadPaperTypes();
                
                // إذا كان هذا النوع هو المختار حالياً، قم بتحديث السعر
                if (paperTypeSelect.value === id) {
                    paperPriceField.value = newPrice;
                    selectedPaperPrice.textContent = `السعر: ${newPrice.toFixed(2)} جنيه`;
                }
            }

            // دالة لحذف نوع ورق
            function deletePaperType(id) {
                if (confirm(`هل أنت متأكد من حذف نوع الورق "${paperTypes[id].name}"؟`)) {
                    delete paperTypes[id];
                    savePaperTypes();
                    loadPaperTypes();
                    
                    // إذا كان هذا النوع هو المختار حالياً، قم بإلغاء الاختيار
                    if (paperTypeSelect.value === id) {
                        paperTypeSelect.value = '';
                        paperPriceField.value = 0;
                        selectedPaperPrice.textContent = 'السعر: 0.00 جنيه';
                    }
                }
            }

            // دالة لتطبيق السعر المحدد يدوياً
            function applyPaperPrice() {
                const price = parseFloat(paperPriceField.value);
                if (isNaN(price)) {
                    alert('يرجى إدخال سعر صحيح.');
                    return;
                }
                alert(`تم تطبيق السعر: ${price.toFixed(2)} جنيه`);
            }

            // ===================================================================
            // =================  6. دوال الحسابات =================
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
            // =================  7. ربط الأحداث والتشغيل الأولي =================
            // ===================================================================
            addFormulaBtn.addEventListener('click', addFormula);
            addPaperBtn.addEventListener('click', addPaperType);
            applyPaperPriceBtn.addEventListener('click', applyPaperPrice);
            
            // عند اختيار نوع ورق، قم بتعبئة سعر الورق تلقائياً
            paperTypeSelect.addEventListener('change', function() {
                const selectedId = this.value;
                if (selectedId && paperTypes[selectedId]) {
                    const selectedPaper = paperTypes[selectedId];
                    paperPriceField.value = selectedPaper.price;
                    selectedPaperPrice.textContent = `السعر: ${selectedPaper.price.toFixed(2)} جنيه`;
                } else {
                    paperPriceField.value = 0;
                    selectedPaperPrice.textContent = 'السعر: 0.00 جنيه';
                }
            });
            
            // تحميل كل البيانات عند بدء تشغيل الصفحة
            loadFormulas();
            loadPaperTypes();
        });