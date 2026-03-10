class OmniApp {
    constructor() {
        this.state = {
            cart: [],
            services: [
                { id: 1, name: 'تطوير منصة Web3', price: 1200, icon: 'fas fa-rocket', cat: 'برمجة' },
                { id: 2, name: 'هوية بصرية سينمائية', price: 450, icon: 'fas fa-film', cat: 'تصميم' },
                { id: 3, name: 'ترجمة تقنية متخصصة', price: 80, icon: 'fas fa-microchip', cat: 'ترجمة' }
            ]
        };
        this.init();
    }

    init() {
        this.renderServices();
        this.setupSignature();
        this.navigate('home');
        console.log("Omni-Task Ultra v4.0 Active");
    }

    navigate(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    renderServices() {
        const grid = document.getElementById('services-grid');
        grid.innerHTML = this.state.services.map(s => `
            <div class="glass-card">
                <div class="brand-logo" style="margin-bottom:20px"><i class="${s.icon}"></i></div>
                <h3>${s.name}</h3>
                <p>دقة متناهية في التنفيذ مع ضمان الجودة.</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px">
                    <span style="font-weight:900; font-size:1.4rem">$${s.price}</span>
                    <button class="btn-glow" onclick="app.addToCart(${s.id})">+</button>
                </div>
            </div>
        `).join('');
    }

    addToCart(id) {
        const item = this.state.services.find(s => s.id === id);
        this.state.cart.push(item);
        this.updateUI();
        this.notify(`تمت إضافة ${item.name}`);
    }

    updateUI() {
        document.getElementById('cart-count').textContent = this.state.cart.length;
        const total = this.state.cart.reduce((sum, i) => sum + i.price, 0);
        document.getElementById('total-price').textContent = `$${total}`;
        
        const itemsList = document.getElementById('cart-items');
        itemsList.innerHTML = this.state.cart.map(i => `
            <div style="padding:15px; border-bottom:1px solid var(--glass-border); display:flex; justify-content:space-between">
                <span>${i.name}</span>
                <b>$${i.price}</b>
            </div>
        `).join('');
    }

    setupSignature() {
        const canvas = document.getElementById('signature-pad');
        const ctx = canvas.getContext('2d');
        let drawing = false;

        const start = (e) => {
            drawing = true;
            ctx.beginPath();
            const pos = this.getPos(e, canvas);
            ctx.moveTo(pos.x, pos.y);
        };

        const draw = (e) => {
            if (!drawing) return;
            const pos = this.getPos(e, canvas);
            ctx.lineTo(pos.x, pos.y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#a855f7';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#a855f7';
            ctx.stroke();
        };

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', () => drawing = false);
        
        // Touch Support
        canvas.addEventListener('touchstart', start);
        canvas.addEventListener('touchmove', draw);
    }

    getPos(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    clearSignature() {
        const canvas = document.getElementById('signature-pad');
        canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height);
    }

    notify(msg) {
        const n = document.createElement('div');
        n.className = 'notification';
        n.textContent = msg;
        document.getElementById('notifications').appendChild(n);
        setTimeout(() => n.remove(), 3000);
    }

    confirmOrder() {
        if(this.state.cart.length === 0) return this.notify("الحقيبة فارغة!");
        const total = this.state.cart.reduce((sum, i) => sum + i.price, 0);
        const phone = "967XXXXXXXXX"; // ضع رقمك هنا
        const msg = `*طلب تعاقد Omni-Task*%0Aالخدمات: ${this.state.cart.length}%0Aالإجمالي: $${total}%0Aتم التوقيع بنجاح ✅`;
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    }
}

const app = new OmniApp();
