// Інтерфейс для користувача (User)
interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
}

// Змінні для DOM елементів з типізацією
const loadBtn = document.getElementById('loadUsersBtn') as HTMLButtonElement;
const userContainer = document.getElementById('userContainer') as HTMLDivElement;
const modal = document.getElementById('myModal') as HTMLDivElement;
const openModalBtn = document.getElementById('openModalBtn') as HTMLButtonElement;
const closeSpan = document.querySelector('.close') as HTMLElement;

// 1. Fetch даних з JSONPlaceholder
async function fetchUsers(): Promise<void> {
    try {
        loadBtn.textContent = 'Завантаження...';
        loadBtn.disabled = true;

        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users: User[] = await response.json();

        renderUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        userContainer.innerHTML = '<p>Помилка завантаження даних</p>';
    } finally {
        loadBtn.textContent = 'Завантажити користувачів';
        loadBtn.disabled = false;
    }
}

// 2. Відображення даних
function renderUsers(users: User[]): void {
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

window.addEventListener('click', (event: MouseEvent) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// 4. Event Listener (Scroll) - просто для прикладу події
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        document.body.style.backgroundColor = '#f9f9f9';
    } else {
        document.body.style.backgroundColor = '#fff';
    }
});