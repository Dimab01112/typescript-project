import { User } from "../types/interfaces.js";

// Функція рендеру карток
export function renderUsers(users: User[], container: HTMLDivElement): void {
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
export function setupModal(modalId: string, btnId: string, closeClass: string): void {
    const modal = document.getElementById(modalId) as HTMLDivElement;
    const btn = document.getElementById(btnId) as HTMLButtonElement;
    const span = document.querySelector(`.${closeClass}`) as HTMLElement;

    if (btn && modal && span) {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        span.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event: MouseEvent) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}