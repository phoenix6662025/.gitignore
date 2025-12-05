// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация счётчика
    initializeCounter();
    
    // Инициализация информации о посетителе
    initializeVisitorCount();
    
    // Инициализация времени загрузки
    initializeLoadTime();
    
    // Инициализация обработчиков событий
    initializeEventHandlers();
    
    // Показываем уведомление о загрузке
    showNotification('Сайт успешно загружен! Добро пожаловать!', 'success');
    
    // Инициализация API проверки
    initializeApiCheck();
});

// Счётчик
let counter = 0;

function initializeCounter() {
    // Загружаем значение из localStorage
    const savedCounter = localStorage.getItem('siteCounter');
    counter = savedCounter ? parseInt(savedCounter) : 0;
    
    // Обновляем отображение
    updateCounterDisplay();
    
    // Сохраняем в visitor count
    updateVisitorCount();
}

function updateCounterDisplay() {
    const counterElement = document.getElementById('counter');
    const counterInfo = document.getElementById('counterInfo');
    
    counterElement.textContent = counter;
    
    // Изменяем цвет в зависимости от значения
    if (counter > 0) {
        counterElement.style.color = '#60a5fa';
        counterInfo.textContent = `Счётчик увеличен до ${counter}`;
    } else if (counter < 0) {
        counterElement.style.color = '#ef4444';
        counterInfo.textContent = `Счётчик уменьшен до ${counter}`;
    } else {
        counterElement.style.color = '#94a3b8';
        counterInfo.textContent = 'Счётчик сброшен';
    }
}

function incrementCounter() {
    counter++;
    localStorage.setItem('siteCounter', counter);
    updateCounterDisplay();
    showNotification(`Счётчик увеличен: ${counter}`, 'info');
}

function decrementCounter() {
    counter--;
    localStorage.setItem('siteCounter', counter);
    updateCounterDisplay();
    showNotification(`Счётчик уменьшен: ${counter}`, 'info');
}

function resetCounter() {
    counter = 0;
    localStorage.setItem('siteCounter', counter);
    updateCounterDisplay();
    showNotification('Счётчик сброшен!', 'warning');
}

// Счётчик посетителей
function initializeVisitorCount() {
    let visitorCount = localStorage.getItem('visitorCount') || 0;
    visitorCount = parseInt(visitorCount) + 1;
    localStorage.setItem('visitorCount', visitorCount);
    
    document.getElementById('visitorCount').textContent = visitorCount;
}

function updateVisitorCount() {
    const visitorCount = localStorage.getItem('visitorCount');
    document.getElementById('visitorCount').textContent = visitorCount;
}

// Время загрузки
function initializeLoadTime() {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    document.getElementById('loadTime').textContent = `${loadTime}ms`;
    
    // Обновляем время последнего обновления
    const now = new Date();
    document.getElementById('lastUpdate').textContent = now.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// API проверка
function initializeApiCheck() {
    const checkApiBtn = document.getElementById('checkApiBtn');
    const apiResult = document.getElementById('apiResult');
    
    checkApiBtn.addEventListener('click', async () => {
        apiResult.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Проверяем соединение...';
        apiResult.className = 'api-result loading';
        
        try {
            // Используем тестовый API
            const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                apiResult.innerHTML = `<i class="fas fa-check-circle"></i> API доступен! Статус: ${response.status}`;
                apiResult.className = 'api-result';
                showNotification('API проверка успешна! Соединение стабильное.', 'success');
            } else {
                throw new Error(`HTTP error: ${response.status}`);
            }
        } catch (error) {
            apiResult.innerHTML = `<i class="fas fa-times-circle"></i> Ошибка: ${error.message}`;
            apiResult.className = 'api-result error';
            showNotification('Ошибка при проверке API. Проверьте подключение.', 'error');
        }
    });
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    // Устанавливаем цвет в зависимости от типа
    switch(type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        case 'warning':
            notification.style.background = '#f59e0b';
            break;
        default:
            notification.style.background = '#3b82f6';
    }
    
    notificationText.textContent = message;
    notification.style.display = 'block';
    
    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Обработчики событий
function initializeEventHandlers() {
    // Кнопки счётчика
    document.getElementById('incrementBtn').addEventListener('click', incrementCounter);
    document.getElementById('decrementBtn').addEventListener('click', decrementCounter);
    document.getElementById('resetBtn').addEventListener('click', resetCounter);
    
    // Навигационные ссылки
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Убираем активный класс у всех ссылок
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            
            // Добавляем активный класс текущей ссылке
            link.classList.add('active');
            
            showNotification(`Переход на: ${link.textContent}`, 'info');
        });
    });
    
    // Кнопки в футере
    document.querySelectorAll('.footer-section a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                showNotification('Это демонстрационная ссылка', 'info');
            }
        });
    });
    
    // Анимация при скролле
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.feature, .step');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform =