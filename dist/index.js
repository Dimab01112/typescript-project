"use strict";
// --- 1. Визначення базових типів ---
// --- 3. Робота з масивами даних ---
// a) Глобальні масиви (імітація бази даних)
let professors = [];
let classrooms = [];
let courses = [];
let schedule = [];
// b) Додавання професора
function addProfessor(professor) {
    professors.push(professor);
    console.log(`Professor ${professor.name} added.`);
}
// b) Перевірка конфліктів
function validateLesson(lesson) {
    // Перевірка: чи зайнятий професор у цей час
    const professorConflict = schedule.find(l => l.professorId === lesson.professorId &&
        l.dayOfWeek === lesson.dayOfWeek &&
        l.timeSlot === lesson.timeSlot);
    if (professorConflict) {
        return { type: "ProfessorConflict", lessonDetails: lesson };
    }
    // Перевірка: чи зайнята аудиторія у цей час
    const classroomConflict = schedule.find(l => l.classroomNumber === lesson.classroomNumber &&
        l.dayOfWeek === lesson.dayOfWeek &&
        l.timeSlot === lesson.timeSlot);
    if (classroomConflict) {
        return { type: "ClassroomConflict", lessonDetails: lesson };
    }
    return null;
}
// --- Продовження секції 3 (addLesson) ---
// c) Додавання заняття
function addLesson(lesson) {
    const conflict = validateLesson(lesson);
    if (conflict) {
        console.error(`Failed to add lesson. Conflict: ${conflict.type}`);
        return false;
    }
    schedule.push(lesson);
    console.log(`Lesson added successfully for ${lesson.dayOfWeek} at ${lesson.timeSlot}`);
    return true;
}
// --- 4. Функції пошуку та фільтрації ---
// a) Пошук вільних аудиторій
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    // Знаходимо всі зайняті аудиторії в цей час
    const occupiedClassrooms = schedule
        .filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
        .map(lesson => lesson.classroomNumber);
    // Відфільтровуємо ті, яких немає в списку зайнятих
    const available = classrooms
        .filter(room => !occupiedClassrooms.includes(room.number))
        .map(room => room.number);
    return available;
}
// b) Розклад професора
function getProfessorSchedule(professorId) {
    return schedule.filter(lesson => lesson.professorId === professorId);
}
// --- 6. Аналіз та звіти ---
// a) Використання аудиторії
function getClassroomUtilization(classroomNumber) {
    // Всього можливих слотів на тиждень: 5 днів * 5 слотів = 25
    const totalSlots = 25;
    const lessonsInRoom = schedule.filter(l => l.classroomNumber === classroomNumber).length;
    if (lessonsInRoom === 0)
        return 0;
    const percentage = (lessonsInRoom / totalSlots) * 100;
    return parseFloat(percentage.toFixed(2)); // Округлення до 2 знаків
}
// b) Найпопулярніший тип занять
function getMostPopularCourseType() {
    const counts = {
        "Lecture": 0,
        "Seminar": 0,
        "Lab": 0,
        "Practice": 0
    };
    // Рахуємо типи курсів, які є в розкладі
    schedule.forEach(lesson => {
        const course = courses.find(c => c.id === lesson.courseId);
        if (course) {
            counts[course.type]++;
        }
    });
    // Знаходимо максимум
    let maxCount = -1;
    let mostPopular = "Lecture"; // Значення за замовчуванням
    for (const key in counts) {
        // Type assertion для ключів, оскільки ми впевнені в ключах
        const typeKey = key;
        if (counts[key] > maxCount) {
            maxCount = counts[key];
            mostPopular = typeKey;
        }
    }
    return mostPopular;
}
// --- 7. Модифікація даних ---
// a) Зміна аудиторії
function reassignClassroom(lessonId, newClassroomNumber) {
    const lessonIndex = schedule.findIndex(l => l.id === lessonId);
    if (lessonIndex === -1) {
        console.log("Lesson not found.");
        return false;
    }
    const oldLesson = schedule[lessonIndex];
    // Створюємо тимчасовий об'єкт для перевірки валідності нової аудиторії
    // Ми повинні ігнорувати поточний урок при перевірці конфліктів (або перевірити вручну)
    // Тут простіше перевірити, чи вільна нова аудиторія в цей час
    const isRoomBusy = schedule.some(l => l.classroomNumber === newClassroomNumber &&
        l.dayOfWeek === oldLesson.dayOfWeek &&
        l.timeSlot === oldLesson.timeSlot &&
        l.id !== lessonId // Важливо: не конфліктувати з самим собою
    );
    if (isRoomBusy) {
        console.log("New classroom is occupied.");
        return false;
    }
    // Оновлюємо аудиторію
    schedule[lessonIndex].classroomNumber = newClassroomNumber;
    console.log(`Lesson ${lessonId} moved to room ${newClassroomNumber}`);
    return true;
}
// b) Скасування заняття
function cancelLesson(lessonId) {
    const initialLength = schedule.length;
    schedule = schedule.filter(l => l.id !== lessonId);
    if (schedule.length < initialLength) {
        console.log(`Lesson ${lessonId} cancelled.`);
    }
    else {
        console.log(`Lesson ${lessonId} not found.`);
    }
}
// ==========================================
// ПРИКЛАД ВИКОРИСТАННЯ (ТЕСТУВАННЯ)
// ==========================================
// 1. Ініціалізація даних
addProfessor({ id: 1, name: "Dr. Smith", department: "CS" });
classrooms.push({ number: "101", capacity: 30, hasProjector: true });
classrooms.push({ number: "102", capacity: 20, hasProjector: false });
courses.push({ id: 10, name: "Intro to TypeScript", type: "Lecture" });
courses.push({ id: 11, name: "Advanced JS", type: "Seminar" });
// 2. Створення та додавання уроку
const lesson1 = {
    id: 1,
    courseId: 10,
    professorId: 1,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00"
};
addLesson(lesson1);
// 3. Спроба додати конфліктний урок (той самий час і аудиторія)
const lessonConflict = {
    id: 2,
    courseId: 11,
    professorId: 1, // Той самий професор (конфлікт)
    classroomNumber: "102",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00"
};
addLesson(lessonConflict); // Має вивести помилку
// 4. Перевірка вільних аудиторій
console.log("Available rooms Mon 8:30:", findAvailableClassrooms("8:30-10:00", "Monday"));
// Очікується ["102"], бо 101 зайнята
// 5. Зміна аудиторії
reassignClassroom(1, "102");
// 6. Аналіз
console.log("Room 102 Utilization:", getClassroomUtilization("102"), "%");
console.log("Most popular type:", getMostPopularCourseType());
// 7. Видалення
cancelLesson(1);
console.log("Schedule size after cancel:", schedule.length);
