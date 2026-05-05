// Artisan Showcase JavaScript

document.addEventListener('DOMContentLoaded', function() {
    renderArtisans();
    renderProducts();
    renderCategories();
});

function renderArtisans() {
    const grid = document.getElementById('artisanGrid');
    if (!grid || !ARTISANS) return;

    grid.innerHTML = ARTISANS.map(artisan => {
        const initial = (artisan.name || 'A').charAt(0).toUpperCase();
        const avatarContent = artisan.profile_photo 
            ? `<img src="/${artisan.profile_photo}" alt="${escapeHtml(artisan.name)}">`
            : initial;

        return `
            <div class="artisan-card">
                <div class="artisan-header">
                    <div class="artisan-avatar">${avatarContent}</div>
                </div>
                <div class="artisan-body">
                    <h3 class="artisan-name">${escapeHtml(artisan.name || 'Artisan')}</h3>
                    <div class="artisan-specialty"><i class="fas fa-star"></i> ${escapeHtml(artisan.specialty || artisan.specialization || 'Craftsman')}</div>
                    <p class="artisan-bio">${escapeHtml(artisan.bio || 'Skilled artisan from Gloria, Oriental Mindoro.')}</p>
                    <div class="artisan-stats">
                        <div class="artisan-stat">
                            <div class="value">${artisan.product_count || 0}</div>
                            <div class="label">Products</div>
                        </div>
                        <div class="artisan-stat">
                            <div class="value">${artisan.experience_years || '10+'}${artisan.experience_years ? '' : ''}</div>
                            <div class="label">Years Exp.</div>
                        </div>
                        ${artisan.rating ? `
                        <div class="artisan-stat">
                            <div class="value"><i class="fas fa-star" style="color: #f59e0b; font-size: 0.9rem;"></i> ${artisan.rating}</div>
                            <div class="label">Rating</div>
                        </div>` : ''}
                    </div>
                    <div class="artisan-actions">
                        <a href="/showcase/artisans/${artisan.id || artisan.user_id}" class="btn btn-primary btn-sm"><i class="fas fa-user"></i> View Profile</a>
                        <button class="btn btn-secondary btn-sm" onclick="messageArtisan(${artisan.id || artisan.user_id}, '${escapeHtml(artisan.name)}')"><i class="fas fa-envelope"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid || !PRODUCTS) return;

    grid.innerHTML = PRODUCTS.map(product => {
        const categoryName = CATEGORIES?.find(c => c.id === product.category)?.name || product.category || 'Handcraft';
        
        return `
            <a href="/showcase/products/${product.id}" class="product-card" style="text-decoration: none;">
                <div class="product-image">
                    ${product.images && product.images[0] 
                        ? `<img src="${product.images[0]}" alt="${escapeHtml(product.name)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"><i class="fas fa-box" style="display:none;"></i>`
                        : `<i class="fas fa-box"></i>`}
                    ${product.featured ? '<span class="product-badge"><i class="fas fa-star"></i> Featured</span>' : ''}
                    ${product.stock_status === 'made_to_order' ? '<span class="product-badge" style="background: var(--primary);">Made to Order</span>' : ''}
                </div>
                <div class="product-body">
                    <div class="product-category">${escapeHtml(categoryName)}</div>
                    <h3 class="product-name">${escapeHtml(product.name)}</h3>
                    <div class="product-artisan"><i class="fas fa-user-circle"></i> ${escapeHtml(product.artisan_name || 'Local Artisan')}</div>
                    <div class="product-footer">
                        <span class="product-price">₱${formatPrice(product.price)}</span>
                        ${product.rating ? `<span class="product-rating"><i class="fas fa-star"></i> ${product.rating}</span>` : ''}
                    </div>
                </div>
            </a>
        `;
    }).join('');
}

function renderCategories() {
    const grid = document.getElementById('categoryGrid');
    if (!grid || !CATEGORIES) return;

    grid.innerHTML = CATEGORIES.map(cat => `
        <a href="/showcase/products?category=${cat.id}" class="category-card">
            <div class="category-icon"><i class="fas ${cat.icon}"></i></div>
            <div class="category-name">${escapeHtml(cat.name)}</div>
        </a>
    `).join('');
}

function messageArtisan(artisanId, artisanName) {
    // Check if user is logged in by making a test request
    fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
    }).then(res => res.json()).then(data => {
        if (data.needsRelogin) {
            // User not logged in
            if (confirm('Please login to message ' + artisanName + '. Would you like to login now?')) {
                window.location.href = '/login';
            }
        } else {
            // User is logged in, show message modal
            showMessageModal(artisanId, artisanName);
        }
    }).catch(() => {
        // Assume not logged in on error
        if (confirm('Please login to message ' + artisanName + '. Would you like to login now?')) {
            window.location.href = '/login';
        }
    });
}

function showMessageModal(artisanId, artisanName) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;padding:1rem;';
    overlay.innerHTML = `
        <div style="background:white;border-radius:1rem;padding:2rem;max-width:500px;width:100%;box-shadow:0 20px 40px rgba(0,0,0,0.2);">
            <h3 style="margin:0 0 1rem;color:#064e3b;"><i class="fas fa-envelope"></i> Message ${escapeHtml(artisanName)}</h3>
            <div id="msgStatus" style="margin-bottom:1rem;padding:0.75rem;border-radius:0.5rem;display:none;"></div>
            <div style="margin-bottom:1rem;">
                <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Subject</label>
                <input id="msgSubject" type="text" placeholder="e.g., Inquiry about custom order" style="width:100%;padding:0.75rem;border:2px solid #d1fae5;border-radius:0.5rem;box-sizing:border-box;">
            </div>
            <div style="margin-bottom:1.5rem;">
                <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Message</label>
                <textarea id="msgText" rows="5" placeholder="Write your message..." style="width:100%;padding:0.75rem;border:2px solid #d1fae5;border-radius:0.5rem;box-sizing:border-box;resize:vertical;"></textarea>
            </div>
            <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
                <button onclick="this.closest('div').parentElement.remove()" style="padding:0.75rem 1.5rem;border:none;border-radius:0.5rem;background:#6b7280;color:white;font-weight:600;cursor:pointer;">Cancel</button>
                <button onclick="sendMessageToArtisan(${artisanId})" style="padding:0.75rem 1.5rem;border:none;border-radius:0.5rem;background:#ff6b35;color:white;font-weight:600;cursor:pointer;"><i class="fas fa-paper-plane"></i> Send</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

async function sendMessage(artisanId) {
    const subject = document.getElementById('msgSubject').value.trim();
    const message = document.getElementById('msgText').value.trim();
    const status = document.getElementById('msgStatus');

    if (!subject || !message) {
        status.style.display = 'block';
        status.style.background = '#fee2e2';
        status.style.color = '#991b1b';
        status.textContent = 'Please fill in both subject and message';
        return;
    }

    try {
        const res = await fetch('/api/messages/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiver_id: artisanId, subject, message })
        });
        const data = await res.json();

        if (res.ok && data.success) {
            status.style.display = 'block';
            status.style.background = '#d1fae5';
            status.style.color = '#065f46';
            status.textContent = '✓ Message sent successfully!';
            setTimeout(() => document.querySelector('[style*="position:fixed"]')?.remove(), 2000);
        } else {
            throw new Error(data.message || 'Failed to send');
        }
    } catch (err) {
        status.style.display = 'block';
        status.style.background = '#fee2e2';
        status.style.color = '#991b1b';
        status.textContent = err.message || 'Failed to send message. Please login first.';
    }
}

async function sendMessageToArtisan(artisanId) {
    const subject = document.getElementById('msgSubject').value.trim();
    const message = document.getElementById('msgText').value.trim();
    const status = document.getElementById('msgStatus');

    if (!subject || !message) {
        status.style.display = 'block';
        status.style.background = '#fee2e2';
        status.style.color = '#991b1b';
        status.textContent = 'Please fill in both subject and message';
        return;
    }

    try {
        const res = await fetch('/api/messages/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiver_id: artisanId, subject, message })
        });
        const data = await res.json();

        if (res.ok && data.success) {
            status.style.display = 'block';
            status.style.background = '#d1fae5';
            status.style.color = '#065f46';
            status.textContent = '✓ Message sent successfully!';
            setTimeout(() => {
                document.querySelector('[style*="position:fixed"]')?.remove();
                // Redirect to messages page to see the conversation
                window.location.href = '/user/messages?conversation=' + artisanId;
            }, 1500);
        } else {
            throw new Error(data.message || 'Failed to send');
        }
    } catch (err) {
        status.style.display = 'block';
        status.style.background = '#fee2e2';
        status.style.color = '#991b1b';
        status.textContent = err.message || 'Failed to send message. Please try again.';
    }
}

function formatPrice(price) {
    return Number(price || 0).toLocaleString('en-PH');
}

function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
