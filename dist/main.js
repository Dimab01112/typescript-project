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
Object.defineProperty(exports, "__esModule", { value: true });
const api_js_1 = require("./modules/api.js");
const ui_js_1 = require("./modules/ui.js");
// Отримуємо елементи
const loadBtn = document.getElementById('loadUsersBtn');
const userContainer = document.getElementById('userContainer');
// Ініціалізація модального вікна
(0, ui_js_1.setupModal)('myModal', 'openModalBtn', 'close');
// Обробник події на кнопку
loadBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        loadBtn.textContent = 'Завантаження...';
        loadBtn.disabled = true;
        // Використовуємо функцію з модуля api
        const users = yield (0, api_js_1.fetchUsers)();
        // Використовуємо функцію з модуля ui
        (0, ui_js_1.renderUsers)(users, userContainer);
    }
    catch (error) {
        userContainer.innerHTML = '<p style="color:red">Помилка завантаження</p>';
    }
    finally {
        loadBtn.textContent = 'Завантажити користувачів';
        loadBtn.disabled = false;
    }
}));
