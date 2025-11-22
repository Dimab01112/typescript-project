"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderUsers = renderUsers;
exports.setupModal = setupModal;
// Функція рендеру карток
function renderUsers(users, container) {
    container.innerHTML = '';
    users.forEach((user) => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <p>Phone: ${user.phone}</p>
        `;
        container.appendChild(card);
    });
}
// Функція налаштування модального вікна
function setupModal(modalId, btnId, closeClass) {
    const modal = document.getElementById(modalId);
    const btn = document.getElementById(btnId);
    const span = document.querySelector(`.${closeClass}`);
    if (btn && modal && span) {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
        span.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}
