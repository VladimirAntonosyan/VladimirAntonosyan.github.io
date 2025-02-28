import AOS from "aos"

AOS.init({
    once: true,
    disable: "phone"
});



let currentQuestion = 1;
const answers = {};

function updateSubmitButton() {
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const companyName = document.getElementById('companyName').value.trim();
    const submitBtn = document.getElementById('submitBtn');

    // Кнопка активна, только если все поля заполнены
    submitBtn.disabled = !(fullName && phone && companyName);
}

document.getElementById('fullName').addEventListener('input', updateSubmitButton);
document.getElementById('phone').addEventListener('input', updateSubmitButton);
document.getElementById('companyName').addEventListener('input', updateSubmitButton);

// Функция для сброса радио-кнопок и выбора "Свой вариант"
function handleCustomEnterpriseInput(event) {
    const customInput = event.target;
    const radios = document.querySelectorAll('input[name="enterprise"]');
    const customRadio = document.querySelector('input[name="enterprise"][value="Свой вариант"]');

    // Если введен текст, сбрасываем все радио-кнопки и выбираем "Свой вариант"
    if (customInput.value.trim()) {
        radios.forEach(radio => radio.checked = false);
        customRadio.checked = true;
    }
    updateButtons(); // Обновляем состояние кнопки "Далее"
}

// Обработчик для текстового поля "Свой вариант"
document.getElementById('customEnterprise').addEventListener('input', function (event) {
    handleCustomEnterpriseInput(event);
});

// Очистка поля "Свой вариант" при выборе другого ответа
document.querySelectorAll('input[name="enterprise"]').forEach(radio => {
    radio.addEventListener('change', function () {
        if (this.value !== "Свой вариант") {
            document.getElementById('customEnterprise').value = ""; // Очищаем поле
            document.getElementById('customEnterprise').setAttribute("value", "") ; // Очищаем поле
            console.log(document.getElementById('customEnterprise'))

        }
        updateButtons(); // Обновляем состояние кнопки "Далее"
    });
});

function updateButtons() {
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');

    backBtn.disabled = currentQuestion === 1;

    const question = document.querySelector(`#question${currentQuestion}`);
    if (!question) {
        nextBtn.disabled = true;
        return;
    }

    // Логика для второго вопроса (тип предприятия)
    if (currentQuestion === 2) {
        const selectedRadio = question.querySelector('input[name="enterprise"]:checked');
        const customInput = question.querySelector('#customEnterprise');

        if (selectedRadio) {
            // Если выбран "Свой вариант", проверяем, заполнено ли поле
            if (selectedRadio.value === "Свой вариант") {
                nextBtn.disabled = !customInput.value.trim();
            } else {
                // Если выбран другой вариант, кнопка доступна
                nextBtn.disabled = false;
            }
        } else {
            // Если ничего не выбрано, кнопка недоступна
            nextBtn.disabled = true;
        }
    } else {
        // Логика для других вопросов
        const input = question.querySelector('input[type="text"]');
        const radio = question.querySelector('input[type="radio"]:checked');

        if (input) {
            nextBtn.disabled = !input.value.trim();
        } else if (radio) {
            nextBtn.disabled = false;
        } else {
            nextBtn.disabled = true;
        }
    }
}

window.addEventListener("click", (e) => {
    if (e.target?.tagName === "A" && e.target.hasAttribute("data-navigate")) {
        const target = e.target.getAttribute("data-navigate")
        document.getElementById(target).scrollIntoView({ block: "start", behavior: "smooth" });
    }
})

window.addEventListener("input", (e) => {
    if (e.target?.tagName === "INPUT" && e.target?.type === "text") {
        e.target.setAttribute("value", e.target.value);
    }
});

document.getElementById('survey').addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.querySelectorAll('.survey__question input').forEach(input => {
    input.addEventListener('change', updateButtons);
    input.addEventListener('input', updateButtons);
});

document.getElementById('backBtn').addEventListener('click', () => {
    if (currentQuestion > 1) {
        document.getElementById(`question${currentQuestion}`).classList.remove('active');
        currentQuestion--;
        document.getElementById(`question${currentQuestion}`).classList.add('active');
        updateButtons();
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentQuestion < 3) {
        saveAnswer();
        document.getElementById(`question${currentQuestion}`).classList.remove('active');
        currentQuestion++;
        document.getElementById(`question${currentQuestion}`).classList.add('active');
        updateButtons();
    } else {
        saveAnswer();
        document.getElementById('popup').classList.add("show");
        document.body.style.overflow = "hidden";
    }
});

document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('popup').classList.remove("show");
    document.body.style.overflow = "auto";
});

document.getElementById('showSurveyBtn').addEventListener('click', () => {
    document.getElementById('survey').classList.add("show");
    document.getElementById("survey").scrollIntoView({ block: "start", behavior: "smooth" });
});

document.getElementById('submitBtn').addEventListener('click', () => {
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const companyName = document.getElementById('companyName').value;
    answers['Имя'] = fullName;
    answers['Номер телефона'] = phone;
    answers['Название компании'] = companyName;

    document.getElementById('popup').classList.remove("show");
    document.body.style.overflow = "auto";
    console.log(answers);
});

function saveAnswer() {
    const question = document.querySelector(`#question${currentQuestion}`);
    if (!question) return;

    const questionTitle = question.querySelector('.survey__question__title').textContent;
    const input = question.querySelector('input[type="text"]');
    const radio = question.querySelector('input[type="radio"]:checked');

    if (radio && radio.value === "Свой вариант" && input && input.value.trim()) {
        answers[questionTitle] = input.value;
    } else if (radio) {
        answers[questionTitle] = radio.value;
    } else if (input) {
        answers[questionTitle] = input.value;
    } else {
        answers[questionTitle] = '';
    }
}