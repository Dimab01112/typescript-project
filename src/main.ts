import { fetchUsers } from "./modules/api.js";
import { renderUsers, setupModal } from "./modules/ui.js";

// Отримуємо елементи
const loadBtn = document.getElementById('loadUsersBtn') as HTMLButtonElement;
const userContainer = document.getElementById('userContainer') as HTMLDivElement;

// Ініціалізація модального вікна
setupModal('myModal', 'openModalBtn', 'close');

// Обробник події на кнопку
loadBtn.addEventListener('click', async () => {
    try {
        loadBtn.textContent = 'Завантаження...';
        loadBtn.disabled = true;

        // Використовуємо функцію з модуля api
        const users = await fetchUsers();
        
        // Використовуємо функцію з модуля ui
        renderUsers(users, userContainer);
    } catch (error) {
        userContainer.innerHTML = '<p style="color:red">Помилка завантаження</p>';
    } finally {
        loadBtn.textContent = 'Завантажити користувачів';
        loadBtn.disabled = false;
    }
});