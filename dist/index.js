"use strict";
// ---------------------------------------------------------------------------
// 1. ENUMS (Перелічення)
// ---------------------------------------------------------------------------
// Статус студента
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic_Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
// Тип курсу
var CourseType;
(function (CourseType) {
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
// Семестр
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
})(Semester || (Semester = {}));
// Оцінки (з числовими значеннями для розрахунку середнього балу)
var Grade;
(function (Grade) {
    Grade[Grade["Excellent"] = 5] = "Excellent";
    Grade[Grade["Good"] = 4] = "Good";
    Grade[Grade["Satisfactory"] = 3] = "Satisfactory";
    Grade[Grade["Unsatisfactory"] = 2] = "Unsatisfactory";
})(Grade || (Grade = {}));
// Факультети
var Faculty;
(function (Faculty) {
    Faculty["Computer_Science"] = "Computer_Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
// ---------------------------------------------------------------------------
// 3. CLASS IMPLEMENTATION (Реалізація класу)
// ---------------------------------------------------------------------------
class UniversityManagementSystem {
    constructor() {
        // "База даних" у пам'яті
        this.students = [];
        this.courses = [];
        this.grades = [];
        this.registrations = [];
        this.nextStudentId = 1;
        this.nextCourseId = 1;
    }
    // --- Метод додавання курсів (допоміжний, щоб система не була порожньою) ---
    addCourse(courseData) {
        const newCourse = Object.assign(Object.assign({}, courseData), { id: this.nextCourseId++ });
        this.courses.push(newCourse);
        return newCourse;
    }
    /**
     * Зараховує студента до університету.
     * Генерує унікальний ID.
     */
    enrollStudent(studentData) {
        const newStudent = Object.assign(Object.assign({}, studentData), { id: this.nextStudentId++ });
        this.students.push(newStudent);
        console.log(`Студента ${newStudent.fullName} успішно зараховано (ID: ${newStudent.id}).`);
        return newStudent;
    }
    /**
     * Реєструє студента на курс.
     * Перевірки: наявність студента/курсу, співпадіння факультету, ліміт місць.
     */
    registerForCourse(studentId, courseId) {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        if (!student)
            throw new Error(`Студента з ID ${studentId} не знайдено.`);
        if (!course)
            throw new Error(`Курс з ID ${courseId} не знайдено.`);
        // Перевірка статусу студента
        if (student.status !== StudentStatus.Active) {
            throw new Error(`Студент не активний (Статус: ${student.status}). Реєстрація заборонена.`);
        }
        // Перевірка відповідності факультету (якщо курс не загальний, припустимо перевірку строго по факультету)
        if (student.faculty !== course.faculty) {
            throw new Error(`Факультет студента (${student.faculty}) не відповідає факультету курсу (${course.faculty}).`);
        }
        // Перевірка кількості студентів
        const currentlyEnrolledCount = this.registrations.filter(r => r.courseId === courseId).length;
        if (currentlyEnrolledCount >= course.maxStudents) {
            throw new Error(`На курсі "${course.name}" немає вільних місць.`);
        }
        // Перевірка, чи студент вже не зареєстрований
        const alreadyRegistered = this.registrations.some(r => r.studentId === studentId && r.courseId === courseId);
        if (alreadyRegistered) {
            throw new Error(`Студент вже зареєстрований на цей курс.`);
        }
        // Успішна реєстрація
        this.registrations.push({ studentId, courseId });
        console.log(`Студент ${student.fullName} зареєстрований на курс "${course.name}".`);
    }
    /**
     * Виставляє оцінку студенту.
     * Перевіряє, чи зареєстрований студент на цей курс.
     */
    setGrade(studentId, courseId, grade) {
        const isRegistered = this.registrations.some(r => r.studentId === studentId && r.courseId === courseId);
        if (!isRegistered) {
            throw new Error(`Неможливо виставити оцінку: студент не зареєстрований на цей курс.`);
        }
        const course = this.courses.find(c => c.id === courseId);
        if (!course)
            throw new Error("Курс не знайдено.");
        const newGrade = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };
        this.grades.push(newGrade);
        console.log(`Оцінка ${grade} виставлена студенту ID:${studentId} за курс ID:${courseId}.`);
    }
    /**
     * Оновлює статус студента.
     * Валідація: не можна перевести "Виключеного" в "Активні" без повторного зарахування (приклад логіки).
     */
    updateStudentStatus(studentId, newStatus) {
        const student = this.students.find(s => s.id === studentId);
        if (!student)
            throw new Error("Студента не знайдено.");
        // Приклад валідації
        if (student.status === StudentStatus.Expelled && newStatus === StudentStatus.Active) {
            console.warn("Попередження: Відновлення відрахованого студента вимагає окремого наказу.");
        }
        if (student.status === StudentStatus.Graduated) {
            throw new Error("Неможливо змінити статус студента, який вже випустився.");
        }
        student.status = newStatus;
        console.log(`Статус студента ${student.fullName} змінено на ${newStatus}.`);
    }
    /**
     * Повертає список студентів певного факультету.
     */
    getStudentsByFaculty(faculty) {
        return this.students.filter(s => s.faculty === faculty);
    }
    /**
     * Повертає всі оцінки конкретного студента.
     */
    getStudentGrades(studentId) {
        return this.grades.filter(g => g.studentId === studentId);
    }
    /**
     * Повертає доступні курси для факультету та семестру,
     * де ще є вільні місця.
     */
    getAvailableCourses(faculty, semester) {
        return this.courses.filter(course => {
            const isMatch = course.faculty === faculty && course.semester === semester;
            if (!isMatch)
                return false;
            const enrolledCount = this.registrations.filter(r => r.courseId === course.id).length;
            return enrolledCount < course.maxStudents;
        });
    }
    /**
     * Розраховує середній бал студента.
     */
    calculateAverageGrade(studentId) {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0)
            return 0;
        const sum = studentGrades.reduce((acc, curr) => acc + curr.grade, 0);
        return parseFloat((sum / studentGrades.length).toFixed(2));
    }
    /**
     * Додаткова вимога: Отримати список відмінників по факультету.
     * Відмінник - середній бал 5.0 (або просто всі оцінки Excellent).
     */
    getTopStudentsByFaculty(faculty) {
        const facultyStudents = this.getStudentsByFaculty(faculty);
        return facultyStudents.filter(student => {
            const avg = this.calculateAverageGrade(student.id);
            // Перевіряємо, чи є оцінки взагалі, і чи дорівнює середнє 5
            const hasGrades = this.getStudentGrades(student.id).length > 0;
            return hasGrades && avg === Grade.Excellent;
        });
    }
}
// ---------------------------------------------------------------------------
// 4. DEMONSTRATION (Демонстрація роботи)
// ---------------------------------------------------------------------------
try {
    const uniSystem = new UniversityManagementSystem();
    // 1. Створення курсів
    const jsCourse = uniSystem.addCourse({
        name: "TypeScript Basics",
        type: CourseType.Mandatory,
        credits: 5,
        semester: Semester.First,
        faculty: Faculty.Computer_Science,
        maxStudents: 30
    });
    const econCourse = uniSystem.addCourse({
        name: "Macroeconomics",
        type: CourseType.Mandatory,
        credits: 4,
        semester: Semester.First,
        faculty: Faculty.Economics,
        maxStudents: 50
    });
    // 2. Зарахування студентів
    const student1 = uniSystem.enrollStudent({
        fullName: "Іван Петренко",
        faculty: Faculty.Computer_Science,
        year: 1,
        status: StudentStatus.Active,
        enrollmentDate: new Date(),
        groupNumber: "CS-101"
    });
    const student2 = uniSystem.enrollStudent({
        fullName: "Марія Коваленко",
        faculty: Faculty.Economics,
        year: 1,
        status: StudentStatus.Active,
        enrollmentDate: new Date(),
        groupNumber: "ECO-101"
    });
    // 3. Реєстрація на курси
    // Успішна
    uniSystem.registerForCourse(student1.id, jsCourse.id);
    // Помилка (не той факультет)
    // uniSystem.registerForCourse(student1.id, econCourse.id); 
    // 4. Виставлення оцінок
    uniSystem.setGrade(student1.id, jsCourse.id, Grade.Excellent);
    // 5. Отримання даних
    console.log("Середній бал студента 1:", uniSystem.calculateAverageGrade(student1.id));
    console.log("Доступні курси CS, 1 семестр:", uniSystem.getAvailableCourses(Faculty.Computer_Science, Semester.First));
    console.log("Відмінники CS:", uniSystem.getTopStudentsByFaculty(Faculty.Computer_Science));
    // 6. Зміна статусу
    uniSystem.updateStudentStatus(student1.id, StudentStatus.Academic_Leave);
}
catch (error) {
    console.error("Error:", error.message);
}
