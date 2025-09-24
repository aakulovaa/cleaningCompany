// Данные отзывов
const reviewsData = [
    {
        name: "Анна",
        text: "Изначально нужно было сделать только высотный клининг, но в процессе договорились с руководителем компании на полный генеральный клининг помещения после ремонта и переезда. Задача была выполнена, все что было нужно помыли, отчистили, учитывали наши пожелания в процессе работы, уложились в срок. Рекомендую!"
    },
    {
        name: "Кристина",
        text: "Уборка после ремонта. Благодарю компанию ProfClean за качественную уборку после капитального ремонта! Команда профессионалов! За два дня тщательно удалили въевшиеся пятна (затирка, штукатурка, монтажная пена, ржавчина). Все договоренности были соблюдены четко и в срок. Цены очень демократичные! Очень довольны! Очень рекомендую!! Надеюсь на дальнейшее сотрудничество! Большое спасибо!"
    },
    {
        name: "Дмитрий",
        text: "Специалист компании не просто выполнил ту работу, которая была обговорена, но еще и проконсультировал по средствам на будущее + отмыл несколько мест, которые выявились по ходу работ. Также после себя оставил чистоту! Невероятно ценный контакт в любой записной книжке)"
    },
    {
        name: "Антон",
        text: "Это просто подарок какой-то. Я думал таких людей и фирм уже нет. Быстро договорились, приехал специалист, отмыл всю въевшуюся грязь от цементной затирки, которую мы уже и не надеялись отмыть, и еще очень подробно объяснил какими средствами пользоваться, чтобы продолжать поддерживать такую кристальную чистоту. Огромное спасибо. Что значит человек любит своё дело и хочет искренне помогать людям."
    },
    {
        name: "Борис",
        text: "Компания ProfClean - команда настоящих профи. Работа выполнена на высоком уровне, строго по договору, цена в процессе не менялась, все в оговоренные сроки! Результаты выше всяких ожиданий. Рекомендую! "
    },
    {
        name: "Андрей",
        text: "Сотрудник работу выполнил, все отмылось, кроме того прошел обои на кухне, верхнюю часть шкафов, гофру вытяжки и верхнюю часть холодильника. Спасибо за организацию работы! Однозначно рекомендую!"
    },
    {
        name: "Татьяна",
        text: "Генеральная уборка • Уборка гаража. Работа выполнена качественно от и до. Специалист компании приехал вовремя, время и дату было легко согласовать. Отмечу четкость и структуру на каждом этапе - от получения заявки до расчета по факту выполненной работы. Специалист компании приехал со своим оборудованием, освободил место от вещей, все отмыли, отчистили, вещи занесли и поставили на место. Быстро и качественно. Благодарю за сотрудничество!"
    },
    // {
    //     name: "Влад",
    //     text: "Чистка кухонной вытяжки. Необходимо было удалить желтый по всей площади заведения налет (как мне казалось жир у вентиляции, который осел со временем). В процессе работы столкнулись с тем, что с моей стороны задача была поставлена ошибочно - это оказалась смола/мазут. Только благодаря подходу к работе сотрудников компании данная ситуация решилась. В первый день была проведена колоссальная работа по всей поверхности - очистка абсолютно всей высоты, а на второй день проблему решили с помощью покраски. Покраска произведена на высоте аккуратно и результат однозначно 10 из 10. Помимо всего этого, после каждой работы за два дня была произведена после работ чистка пола (а пол наливной бежевый, была подобрана и в последующем посоветована специальная химия) с помощью которой теперь наш пол всегда будет как после ремонта. Однозначно, будем работать на постоянной основе и буду рекомендовать всем, кто нуждается в оказании качественной услуги. Исходя из своего большого опыта работы управления заведениями, впервые столкнулся с профессиональным подходом каждой структуры процесса. Абсолютно разделяю взгляды к работе! Еще раз огромное спасибо !!!"
    // }
];

// Инициализация карусели отзывов
document.addEventListener('DOMContentLoaded', function() {
    const reviewsTrack = document.querySelector('.reviews-track');
    const dotsContainer = document.querySelector('.reviews-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;
    const reviewsPerView = window.innerWidth <= 768 ? 1 : 3;
    const totalReviews = reviewsData.length;
    
    // Создание карточек отзывов
    function createReviewCards() {
        reviewsTrack.innerHTML = '';
        
        reviewsData.forEach((review, index) => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <div class="review-name">${review.name}</div>
                <div class="review-text">${review.text}</div>
            `;
            reviewsTrack.appendChild(reviewCard);
        });
    }
    
    // Создание индикаторов
    function createDots() {
        dotsContainer.innerHTML = '';
        const dotsCount = Math.ceil(totalReviews / reviewsPerView);
        
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('div');
            dot.className = `reviews-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Переход к определенному слайду
    function goToSlide(index) {
        const maxIndex = Math.ceil(totalReviews / reviewsPerView) - 1;
        
        if (index < 0) {
            currentIndex = maxIndex;
        } else if (index > maxIndex) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        updateCarousel();
    }
    
    // Обновление карусели
    function updateCarousel() {
        const trackWidth = reviewsTrack.offsetWidth;
        const cardWidth = trackWidth / reviewsPerView;
        const translateX = -currentIndex * cardWidth * reviewsPerView;
        
        reviewsTrack.style.transform = `translateX(${translateX}px)`;
        
        // Обновление активного индикатора
        document.querySelectorAll('.reviews-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Обработчики событий для кнопок
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        const newReviewsPerView = window.innerWidth <= 768 ? 1 : 3;
        
        if (newReviewsPerView !== reviewsPerView) {
            currentIndex = 0;
            createDots();
            updateCarousel();
        }
    });
    
    // Инициализация
    createReviewCards();
    createDots();
    updateCarousel();
});