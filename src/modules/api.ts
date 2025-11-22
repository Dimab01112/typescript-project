import { User } from "../types/interfaces.js"; // .js розширення важливе для браузера!

export async function fetchUsers(): Promise<User[]> {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const users: User[] = await response.json();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Прокидаємо помилку далі, щоб обробити її в main або ui
    }
}