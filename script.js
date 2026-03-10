/**
 * OMNI-TASK PRO ENGINE v5.0
 * Structured, Modular, and Secure
 */

// 1. Database Mockup
const DB = {
    services: [
        { id: 's1', title: 'برمجيات الـ ERP السحابية', price: 4500, cat: 'dev', icon: 'fa-server' },
        { id: 's2', title: 'تطوير تطبيقات FinTech', price: 3200, cat: 'dev', icon: 'fa-mobile-v' },
        { id: 's3', title: 'هوية بصرية للشركات', price: 850, cat: 'design', icon: 'fa-pen-fancy' },
        { id: 's4', title: 'واجهات UI/UX معقدة', price: 1500, cat: 'design', icon: 'fa-wand-magic-sparkles' }
    ]
};

// 2. Navigation Logic
const Router = {
    go(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
        
        document.querySelectorAll('.nav-links button').forEach(b => {
            b.classList.toggle('active', b.getAttribute('onclick').includes(viewId));
        });
        
        if(viewId === 'cart') Sign.init();
        window.scrollTo(0,0);
    }
};

// 3. Cart System
const Cart = {
    items: [],
    
    add(id) {
        const product = DB.services.find(s => s.id === id);
        this.items.push(product);
        this.sync();
        UI.notify(`تمت إضافة ${product.title} إلى السلة`);
    },
    
    sync() {
        document.getElementById('cart-counter').textContent = this.items.length;
        const total = this.items.reduce((acc, curr) => acc + curr.price, 0);
        document.getElementById('grand-total').textContent = `$${total.toLocaleString()}`;
        
        const list = document.getElementById('cart-list-pro');
        list.innerHTML = this.items.map((item, idx) => `
            <div class="cart-row">
                <span>${item.title}</span>
                <b>$${item.price}</b>
            </div>
        `).join('');
    }
};

// 4. Signature Logic (Advanced)
const Sign = {
    init() {
        this.canvas = document.getElementById('pad');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        
        // Match canvas size to container
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        this.ctx.strokeStyle = '#2563eb';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';

        this.canvas.onmousedown = (e) => { this.isDrawing = true; this.ctx.beginPath(); this.ctx.moveTo(e.offsetX, e.offsetY); };
        this.canvas.onmousemove = (e) => { if(this.isDrawing) { this.ctx.lineTo(e.offsetX, e.offsetY); this.ctx.stroke(); } };
        window.onmouseup = () => this.isDrawing = false;
    },
    clear() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
};

// 5. Order Management
const Order = {
    process() {
        const name = document.getElementById('user-name').value;
        if(!name || Cart.items.length === 0) {
            UI.notify("يرجى إكمال البيانات واختيار الخدمات أولاً");
            return;
        }

        const total = Cart.items.reduce((acc, curr) => acc + curr.price, 0);
        const waLink = `https://wa.me/967XXXXXXXXX?text=` + 
            encodeURIComponent(`*عقد عمل جديد من: ${name}*\n\nالخدمات المطلوبة:\n${Cart.items.map(i => '- ' + i.title).join('\n')}\n\n*الإجمالي:* $${total}\n*التوثيق:* تم التوقيع رقمياً ✅`);
        
        UI.notify("جاري إنشاء العقد الرسمي...");
        setTimeout(() => window.open(waLink, '_blank'), 1500);
    }
};

// 6. UI Helpers
const UI = {
    renderServices() {
        const container = document.getElementById('services-render');
        container.innerHTML = DB.services.map(s => `
            <div class="service-item">
                <div class="icon-box"><i class="fa-solid ${s.icon} fa-2x"></i></div>
                <h4>${s.title}</h4>
                <div class="price-tag">$${s.price.toLocaleString()}</div>
                <button class="primary-btn" onclick="Cart.add('${s.id}')" style="width:100%">حجز الخدمة</button>
            </div>
        `).join('');
    },
    
    notify(msg) {
        const wrapper = document.getElementById('toast-wrapper');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = msg;
        wrapper.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }
};

// 7. Initialization
document.addEventListener('DOMContentLoaded', () => {
    UI.renderServices();
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.getElementById('loader').style.display = 'none';
    }, 1000);
});
