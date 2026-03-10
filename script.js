// ===== State Management =====
const AppState = {
    cart: [],
    total: 0,
    user: null,
    currentSection: 'home',
    isDrawing: false,
    services: [
        {
            id: 1,
            name: 'الترجمة والتعريب',
            description: 'ترجمة بشرية احترافية للمواقع والوثائق الرسمية مع مراجعة دقيقة',
            price: 50,
            icon: '🌐'
        },
        {
            id: 2,
            name: 'تطوير الويب',
            description: 'بناء مواقع وتطبيقات متجاوبة بأحدث التقنيات (React, Vue, Node.js)',
            price: 499,
            icon: '💻'
        },
        {
            id: 3,
            name: 'صناعة المحتوى',
            description: 'كتابة مقالات متوافقة مع محركات البحث SEO وتسويق المحتوى',
            price: 30,
            icon: '✍️'
        },
        {
            id: 4,
            name: 'التسويق الرقمي',
            description: 'إدارة حملات إعلانية وتحسين ظهور العلامة التجارية',
            price: 299,
            icon: '📱'
        }
    ]
};

// ===== DOM Elements =====
const DOM = {
    sections: document.querySelectorAll('.section'),
    navButtons: document.querySelectorAll('[data-section]'),
    cartNum: document.getElementById('cart-num'),
    cartList: document.getElementById('cart-list'),
    totalArea: document.getElementById('total-area'),
    totalPrice: document.getElementById('total-price'),
    checkoutBtn: document.getElementById('checkout-btn'),
    userBtn: document.getElementById('user-btn'),
    toast: document.getElementById('toast'),
    servicesGrid: document.querySelector('.services-grid'),
    sigPad: document.getElementById('sig-pad'),
    clearSigBtn: document.getElementById('clear-sig'),
    finishBtn: document.getElementById('finish-project')
};

// ===== Canvas Manager =====
const CanvasManager = {
    ctx: null,
    canvas: null,
    
    init() {
        if (!DOM.sigPad) return;
        
        this.canvas = DOM.sigPad;
        this.ctx = this.canvas.getContext('2d');
        
        this.setupCanvas();
        this.addEventListeners();
    },
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        // Handle high DPI screens
        this.canvas.width = rect.width * dpr;
        this.canvas.height = 200 * dpr;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '200px';
        
        this.ctx.scale(dpr, dpr);
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = '#007bff';
    },
    
    addEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseleave', this.stopDrawing.bind(this));
        
        // Touch events
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
        
        // Window resize
        window.addEventListener('resize', this.debounce(() => {
            this.saveSignature();
            this.setupCanvas();
            this.restoreSignature();
        }, 250));
    },
    
    startDrawing(e) {
        e.preventDefault();
        AppState.isDrawing = true;
        this.ctx.beginPath();
    },
    
    draw(e) {
        if (!AppState.isDrawing) return;
        e.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
        
        // Clamp coordinates to canvas boundaries
        if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;
        
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    },
    
    stopDrawing() {
        if (AppState.isDrawing) {
            AppState.isDrawing = false;
            this.ctx.beginPath(); // Prevent line connecting on next draw
        }
    },
    
    handleTouch(e) {
        e.preventDefault();
        if (e.type === 'touchstart') {
            this.startDrawing(e);
        } else if (e.type === 'touchmove') {
            this.draw(e);
        }
    },
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.saveSignature();
    },
    
    isEmpty() {
        // Check if canvas is empty (all pixels are white/transparent)
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] > 0) return false; // Found a non-transparent pixel
        }
        return true;
    },
    
    saveSignature() {
        if (this.canvas) {
            const signatureData = this.canvas.toDataURL();
            sessionStorage.setItem('tempSignature', signatureData);
        }
    },
    
    restoreSignature() {
        const saved = sessionStorage.getItem('tempSignature');
        if (saved && this.ctx) {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            };
            img.src = saved;
        }
    },
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// ===== UI Manager =====
const UIManager = {
    showSection(sectionId) {
        // Hide all sections
        DOM.sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            AppState.currentSection = sectionId;
            
            // Initialize canvas if entering contract section
            if (sectionId === 'contract') {
                setTimeout(() => CanvasManager.init(), 100);
            }
            
            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
    
    showToast(message, type = 'info') {
        DOM.toast.textContent = message;
        DOM.toast.classList.add('show');
        
        // Set toast color based on type
        if (type === 'success') {
            DOM.toast.style.background = 'var(--success-color)';
        } else if (type === 'error') {
            DOM.toast.style.background = 'var(--danger-color)';
        } else {
            DOM.toast.style.background = 'var(--dark-text)';
        }
        
        setTimeout(() => {
            DOM.toast.classList.remove('show');
        }, 3000);
    },
    
    updateCartUI() {
        // Update cart count
        DOM.cartNum.textContent = AppState.cart.length;
        
        // Update cart list
        if (AppState.cart.length > 0) {
            DOM.cartList.innerHTML = AppState.cart.map((item, index) => `
                <div class="cart-item" role="listitem">
                    <span class="cart-item-title">${item.name}</span>
                    <span class="cart-item-price">$${item.price}</span>
                </div>
            `).join('');
            
            DOM.totalArea.classList.remove('hidden');
            DOM.totalPrice.textContent = `$${AppState.total}`;
            DOM.checkoutBtn.classList.remove('hidden');
        } else {
            DOM.cartList.innerHTML = '<p class="empty-cart-message">السلة فارغة حالياً</p>';
            DOM.totalArea.classList.add('hidden');
            DOM.checkoutBtn.classList.add('hidden');
        }
    },
    
    renderServices() {
        if (!DOM.servicesGrid) return;
        
        DOM.servicesGrid.innerHTML = AppState.services.map(service => `
            <div class="service-card" role="listitem">
                <div class="service-icon" aria-hidden="true">${service.icon}</div>
                <h3 class="service-title">${service.name}</h3>
                <p class="service-description">${service.description}</p>
                <span class="service-price">$${service.price}</span>
                <button class="btn btn-primary add-to-cart" data-service-id="${service.id}">
                    إضافة للسلة
                </button>
            </div>
        `).join('');
        
        // Add event listeners to Add to Cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const serviceId = parseInt(e.target.dataset.serviceId);
                const service = AppState.services.find(s => s.id === serviceId);
                if (service) {
                    CartManager.addToCart(service);
                }
            });
        });
    }
};

// ===== Cart Manager =====
const CartManager = {
    addToCart(service) {
        AppState.cart.push({
            name: service.name,
            price: service.price
        });
        AppState.total += service.price;
        
        UIManager.updateCartUI();
        UIManager.showToast(`تم إضافة "${service.name}" إلى السلة`, 'success');
    },
    
    clearCart() {
        AppState.cart = [];
        AppState.total = 0;
        UIManager.updateCartUI();
    }
};

// ===== Auth Manager =====
const AuthManager = {
    handleAuth() {
        const name = prompt('مرحباً بك! أدخل اسمك للتسجيل في Omni-Task:');
        
        if (name && name.trim()) {
            const trimmedName = name.trim();
            AppState.user = {
                name: trimmedName,
                joinedAt: new Date().toISOString()
            };
            
            DOM.userBtn.textContent = trimmedName;
            UIManager.showToast(`أهلاً بك يا ${trimmedName}`, 'success');
            
            // Save to localStorage
            localStorage.setItem('omniTaskUser', JSON.stringify(AppState.user));
        } else if (name === '') {
            UIManager.showToast('الرجاء إدخال اسم صحيح', 'error');
        }
    },
    
    checkSavedUser() {
        const savedUser = localStorage.getItem('omniTaskUser');
        if (savedUser) {
            try {
                AppState.user = JSON.parse(savedUser);
                DOM.userBtn.textContent = AppState.user.name;
            } catch (e) {
                console.error('Error parsing saved user:', e);
            }
        }
    }
};

// ===== Contract Manager =====
const ContractManager = {
    finishProject() {
        if (CanvasManager.isEmpty()) {
            UIManager.showToast('الرجاء التوقيع على العقد أولاً', 'error');
            return;
        }
        
        if (AppState.cart.length === 0) {
            UIManager.showToast('السلة فارغة! أضف خدمات أولاً', 'error');
            return;
        }
        
        // Show loading state
        DOM.finishBtn.classList.add('loading');
        DOM.finishBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            UIManager.showToast('✅ تم اعتماد مشروعك بنجاح! جاري التواصل معك خلال 24 ساعة', 'success');
            
            // Clear cart and signature
            CartManager.clearCart();
            CanvasManager.clear();
            sessionStorage.removeItem('tempSignature');
            
            // Navigate home
            UIManager.showSection('home');
            
            // Remove loading state
            DOM.finishBtn.classList.remove('loading');
            DOM.finishBtn.disabled = false;
        }, 1500);
    }
};

// ===== Event Listeners Setup =====
function setupEventListeners() {
    // Navigation
    DOM.navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.target.dataset.section;
            if (section) {
                UIManager.showSection(section);
            }
        });
    });
    
    // Auth button
    DOM.userBtn.addEventListener('click', () => AuthManager.handleAuth());
    
    // Clear signature
    if (DOM.clearSigBtn) {
        DOM.clearSigBtn.addEventListener('click', () => CanvasManager.clear());
    }
    
    // Finish project
    if (DOM.finishBtn) {
        DOM.finishBtn.addEventListener('click', () => ContractManager.finishProject());
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && AppState.isDrawing) {
            CanvasManager.stopDrawing();
        }
    });
    
    // Prevent default touch events on canvas to avoid page scrolling
    if (DOM.sigPad) {
        DOM.sigPad.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
        DOM.sigPad.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }
}

// ===== Initialize App =====
function initApp() {
    // Check for saved user
    AuthManager.checkSavedUser();
    
    // Render services
    UIManager.renderServices();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show welcome message
    setTimeout(() => {
        UIManager.showToast('مرحباً بك في Omni-Task 👋', 'info');
    }, 500);
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.section) {
            UIManager.showSection(e.state.section);
        }
    });
    
    // Save initial state
    history.replaceState({ section: 'home' }, '');
    
    // Push state on section change
    const originalShowSection = UIManager.showSection;
    UIManager.showSection = function(sectionId) {
        originalShowSection(sectionId);
        history.pushState({ section: sectionId }, '', `#${sectionId}`);
    };
    
    // Check URL hash on load
    const hash = window.location.hash.slice(1);
    if (hash && ['home', 'services', 'cart', 'contract', 'about'].includes(hash)) {
        UIManager.showSection(hash);
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);