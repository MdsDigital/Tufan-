class OmniEliteApp {
    constructor() {
        this.cart = [];
        this.services = [
            { id: 1, name: 'تطبيق جوال متكامل', price: 2500, cat: 'برمجة', icon: 'fa-mobile-screen' },
            { id: 2, name: 'هوية تجارية (لوغو)', price: 600, cat: 'تصميم', icon: 'fa-bezier-curve' },
            { id: 3, name: 'متجر إلكتروني Salla', price: 1200, cat: 'برمجة', icon: 'fa-shopping-bag' },
            { id: 4, name: 'إدارة حملات إعلانية', price: 800, cat: 'تسويق', icon: 'fa-ad' }
        ];
        this.init();
    }

    init() {
        this.renderServices('all');
        this.setupSignature();
        this.hideLoader();
        console.log("Omni-Task Elite Engine Started...");
    }

    hideLoader() {
        setTimeout(() => document.getElementById('loader').style.opacity = '0', 1000);
        setTimeout(() => document.getElementById('loader').style.display = 'none', 1500);
    }

    showPage(id) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        
        document.querySelectorAll('.nav-links li').forEach(l => {
            l.classList.toggle('active', l.dataset.page === id);
        });
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    renderServices(filter) {
        const container = document.getElementById('services-container');
        const filtered = filter === 'all' ? this.services : this.services.filter(s => s.cat === filter);
        
        container.innerHTML = filtered.map(s => `
            <div class="service-card">
                <div style="font-size: 2.5rem; color: var(--s); margin-bottom: 15px;"><i class="fas ${s.icon}"></i></div>
                <h3>${s.name}</h3>
                <p>تنفيذ احترافي بواسطة خبراء Omni-Task.</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:25px">
                    <span style="font-size: 1.5rem; font-weight: 900;">$${s.price}</span>
                    <button class="btn-main" style="padding: 10px 20px" onclick="app.addToCart(${s.id})">أضف للسلة</button>
                </div>
            </div>
        `).join('');
    }

    addToCart(id) {
        const item = this.services.find(s => s.id === id);
        this.cart.push(item);
        this.updateUI();
        this.toast(`تمت إضافة ${item.name} بنجاح`);
    }

    updateUI() {
        document.getElementById('cart-badge').textContent = this.cart.length;
        const total = this.cart.reduce((sum, i) => sum + i.price, 0);
        document.getElementById('final-price').textContent = `$${total}`;
        
        const list = document.getElementById('cart-list');
        list.innerHTML = this.cart.map((i, idx) => `
            <div style="display:flex; justify-content:space-between; padding:15px 0; border-bottom:1px solid var(--border)">
                <span>${i.name}</span>
                <b>$${i.price}</b>
            </div>
        `).join('');
    }

    setupSignature() {
        const canvas = document.getElementById('signature-canvas');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;

        const start = (e) => {
            isDrawing = true;
            ctx.beginPath();
            const pos = this.getMousePos(canvas, e);
            ctx.moveTo(pos.x, pos.y);
        };

        const draw = (e) => {
            if (!isDrawing) return;
            const pos = this.getMousePos(canvas, e);
            ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 3;
            ctx.stroke();
        };

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', () => isDrawing = false);
        
        // Mobile Support
        canvas.addEventListener('touchstart', start);
        canvas.addEventListener('touchmove', draw);
    }

    getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        const clientX = evt.clientX || evt.touches[0].clientX;
        const clientY = evt.clientY || evt.touches[0].clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    clearCanvas() {
        const c = document.getElementById('signature-canvas');
        c.getContext('2d').clearRect(0,0,c.width,c.height);
    }

    toast(msg) {
        const t = document.getElementById('toast-notif');
        t.textContent = msg; t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    }

    finalizeOrder() {
        const name = document.getElementById('client-name').value;
        if(!name || this.cart.length === 0) return alert("يرجى ملء البيانات وإضافة خدمات للسلة");
        
        const total = this.cart.reduce((sum, i) => sum + i.price, 0);
        const msg = `*طلب تعاقد رسمي - Omni-Task*%0A` +
                    `👤 العميل: ${name}%0A` +
                    `📦 الخدمات: ${this.cart.length}%0A` +
                    `💰 الإجمالي: $${total}%0A` +
                    `✅ تم التوقيع رقمياً والحالة: جاهز للتنفيذ.`;
        
        window.open(`https://wa.me/967XXXXXXXXX?text=${msg}`, '_blank');
    }
}

const app = new OmniEliteApp();
