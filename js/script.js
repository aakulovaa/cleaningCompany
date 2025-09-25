import { TELEGRAM_CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Конфигурация Telegram бота
    const TELEGRAM_BOT_TOKEN = TELEGRAM_CONFIG.BOT_TOKEN; 
    
    // Массив chat_id пользователей, которым отправлять сообщения
    const TELEGRAM_CHAT_IDS = TELEGRAM_CONFIG.CHAT_IDS;
    
    // Элементы модального окна
    const modal = document.getElementById('orderModal');
    const orderForm = document.getElementById('orderForm');
    const closeModal = document.getElementById('closeModal');
    const modalMessage = document.getElementById('modalMessage');
    const orderCallBtn = document.getElementById('orderCallBtn');
    const heroOrderBtn = document.getElementById('heroOrderBtn');
    const ctaOrderBtn = document.getElementById('ctaOrderBtn');
    const modalService = document.getElementById('modalService');
    const selectedServiceInput = document.getElementById('selectedServiceInput');

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Закрытие меню при клике на ссылку
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            });
        });
        
        // Закрытие меню при клике вне его области
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.header-content') && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            }
        });
    }

    // Добавляем data-атрибуты к карточкам услуг
    const serviceCards = document.querySelectorAll('.services-card');
    const serviceMapping = {
        'profHighRiseCeiling': 'Профессиональный высотный клининг потолочного пространства любой сложности.',
        'highRiseCleanOfWindow': 'Высотная мойка окон и фасадов зданий.',
        'postConstruction': 'Послестроительная уборка',
        'industrialPremises': 'Уборка производственных и непроизводственных помещений.',
        'deepCleaning': 'Глубокая чистка напольных покрытий с помощью роторного оборудования.',
        'profDry': 'Профессиональная химчистка напольных покрытий и мягкой мебели',
        'generalCleaning': 'Генеральная уборка офисов, коттеджей.',
        'eventsCleaninig': 'Уборка на мероприятиях.',
        'profCleanBoats': 'Профессиональный клининг катеров, лодок, яхт.',
        'generalFitnessSpa': 'Генеральная уборка Fitness, Wellness, SPA центров.',
        'cleanGarage': 'Уборка гаражей'
    };

    //Добавляем обработчики кликов на карточки услуг
    serviceCards.forEach((card, index) => {
        const serviceKeys = Object.keys(serviceMapping);
        if (index < serviceKeys.length) {
            const serviceKey = serviceKeys[index];
            card.setAttribute('data-service', serviceKey);
            
            card.addEventListener('click', function() {
                const serviceValue = this.getAttribute('data-service');
                openModalWithService(serviceValue);
            });
            
            // Добавляем курсор pointer для карточек
            card.style.cursor = 'pointer';
        }
    });

    // Функция открытия модального окна с выбранной услугой
    function openModalWithService(serviceValue) {
        openModal();
        
        // Устанавливаем выбранную услугу в select
        if (modalService && serviceValue) {
            modalService.value = serviceValue;
            selectedServiceInput.value = serviceValue;
        }
    }

    
    // Открытие модального окна
    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Закрытие модального окна
    function closeModalWindow() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        orderForm.reset();
        modalMessage.style.display = 'none';
    }
    
    // Обработчики открытия модального окна
    if (orderCallBtn) orderCallBtn.addEventListener('click', openModal);
    if (heroOrderBtn) heroOrderBtn.addEventListener('click', openModal);
    if (ctaOrderBtn) ctaOrderBtn.addEventListener('click', openModal);
    
    // Обработчик закрытия модального окна
    if (closeModal) closeModal.addEventListener('click', closeModalWindow);
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalWindow();
        }
    });

    // Обработчик изменения выбора услуги
    if (modalService) {
        modalService.addEventListener('change', function() {
            if (selectedServiceInput) {
                selectedServiceInput.value = this.value;
            }
        });
    }
    
    // Обработка отправки формы
    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(orderForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const time = formData.get('time');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Проверяем, что все обязательные поля заполнены
            if (!name || !phone) {
                showModalMessage('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            
            // Проверяем валидность телефона
            if (!isValidPhone(phone)) {
                showModalMessage('Пожалуйста, введите корректный номер телефона', 'error');
                return;
            }
            
            // Блокируем кнопку отправки
            const submitBtn = orderForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            try {
                // Формируем текст сообщения для Telegram
                const timeText = time ? `\n🕰️ *Удобное время для связи:* ${getComfortTime(time)}` : '';
                const serviceText = service ? `\n🏷️ *Услуга:* ${getServiceName(service)}` : '';
                const messageText = message ? `\n💬 *Сообщение:* ${message}` : '';
                
                const telegramMessage = `
                        🧹 *Новая заявка на уборку*
                                        
👤 *Имя:* ${name}
📞 *Телефон:* ${phone}

${timeText}${serviceText}${messageText}

⏰ *Время отправки:* ${new Date().toLocaleString('ru-RU')}
                `;
                
                // Отправляем сообщение всем пользователям из массива
                const results = await sendToMultipleTelegram(telegramMessage);
                
                // Проверяем результаты отправки
                const successfulSends = results.filter(result => result.success).length;
                const failedSends = results.filter(result => !result.success).length;
                
                if (successfulSends > 0) {
                    showModalMessage(`Заявка успешно отправлена!${failedSends > 0 ? ` Не удалось отправить ${failedSends} получателям.` : ''}`, 'success');
                    orderForm.reset();
                    
                    // Автоматическое скрытие формы через 3 секунды
                    setTimeout(closeModalWindow, 3000);
                } else {
                    showModalMessage('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте ещё раз.', 'error');
                }
            } catch (error) {
                // Ошибка сети или другая ошибка
                console.error('Ошибка отправки:', error);
                showModalMessage('Произошла ошибка при отправке заявки. Пожалуйста, проверьте подключение к интернету и попробуйте ещё раз.', 'error');
            } finally {
                // Разблокируем кнопку отправки
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
    
    // Функция отправки сообщения нескольким пользователям в Telegram
    async function sendToMultipleTelegram(message) {
        const results = [];
        
        for (const chatId of TELEGRAM_CHAT_IDS) {
            try {
                const response = await sendToTelegram(message, chatId);
                results.push({
                    success: response.ok,
                    chatId: chatId,
                    error: response.ok ? null : response.description
                });
                
                // Добавляем задержку между отправками (1 секунда)
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                results.push({
                    success: false,
                    chatId: chatId,
                    error: error.message
                });
            }
        }
        
        return results;
    }
    
    // Функция отправки сообщения в Telegram для конкретного chat_id
    async function sendToTelegram(message, chatId) {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const data = {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        return await response.json();
    }
    
    // Функция проверки телефона
    function isValidPhone(phone) {
        const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
        return phoneRegex.test(phone);
    }

    // Функция получения названия услуги
    function getServiceName(serviceKey) {
        const services = {
            'profHighRiseCeiling': 'Профессиональный высотный клининг потолочного пространства любой сложности.',
            'highRiseCleanOfWindow': 'Высотная мойка окон и фасадов зданий.',
            'postConstruction': 'Послестроительная уборка',
            'industrialPremises': 'Уборка производственных и непроизводственных помещений.',
            'deepCleaning': 'Глубокая чистка напольных покрытий с помощью роторного оборудования.',
            'profDry': 'Профессиональная химчистка напольных покрытий и мягкой мебели',
            'generalCleaning': 'Генеральная уборка офисов, коттеджей.',
            'eventsCleaninig': 'Уборка на мероприятиях.',
            'profCleanBoats': 'Профессиональный клининг катеров, лодок, яхт.',
            'generalFitnessSpa': 'Генеральная уборка Fitness, Wellness, SPA центров.',
            'cleanGarage': 'Уборка гаражей'
        };
        return services[serviceKey] || serviceKey;
    }

    // Функция получения удобного времени звонка
    function getComfortTime(timeKey) {
        const times = {
            'at6to7': 'с 6:00 до 7:00',
            'at7to8': 'с 7:00 до 8:00',
            'at8to9': 'с 8:00 до 9:00',
            'at9to10': 'с 9:00 до 10:00',
            'at10to11': 'с 10:00 до 11:00',
            'at11to12': 'с 11:00 до 12:00',
            'at12to13': 'с 12:00 до 13:00',
            'at13to14': 'с 13:00 до 14:00',
            'at14to15': 'с 14:00 до 15:00',
            'at15to16': 'с 15:00 до 16:00',
            'at16to17': 'с 16:00 до 17:00',
            'at17to18': 'с 17:00 до 18:00',
            'at18to19': 'с 18:00 до 19:00',
            'at19to20': 'с 19:00 до 20:00',
            'at20to21': 'с 20:00 до 21:00',
            'at21to22': 'с 21:00 до 22:00',
            'at22to23': 'с 22:00 до 23:00',
            'at23to24': 'с 23:00 до 24:00',
        };
        return times[timeKey] || timeKey;
    }
    
    // Функция показа сообщения в модальном окне
    function showModalMessage(text, type) {
        modalMessage.textContent = text;
        modalMessage.className = 'form-message ' + type;
        modalMessage.style.display = 'block';
    }
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Подсветка активного пункта меню при прокрутке
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});