"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Змінні для DOM елементів з типізацією
const loadBtn = document.getElementById('loadUsersBtn');
const userContainer = document.getElementById('userContainer');
const modal = document.getElementById('myModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeSpan = document.querySelector('.close');
// 1. Fetch даних з JSONPlaceholder
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            loadBtn.textContent = 'Завантаження...';
            loadBtn.disabled = true;
            const response = yield fetch('https://jsonplaceholder.typicode.com/users');
            const users = yield response.json();
            renderUsers(users);
        }
        catch (error) {
            console.error('Error fetching users:', error);
            userContainer.innerHTML = '<p>Помилка завантаження даних</p>';
        }
        finally {
            loadBtn.textContent = 'Завантажити користувачів';
            loadBtn.disabled = false;
        }
    });
}
// 2. Відображення даних
function renderUsers(users) {
    userContainer.innerHTML = ''; // Очищення контейнера
    users.forEach((user) => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <p>Phone: ${user.phone}</p>
        `;
        userContainer.appendChild(card);
    });
}
// 3. Event Listeners (Клік)
loadBtn.addEventListener('click', fetchUsers);
openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});
closeSpan.addEventListener('click', () => {
    modal.style.display = 'none';
});
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
// 4. Event Listener (Scroll) - просто для прикладу події
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        document.body.style.backgroundColor = '#f9f9f9';
    }
    else {
        document.body.style.backgroundColor = '#fff';
    }
});
