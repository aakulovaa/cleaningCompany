document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Функция для показа слайда
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active-dot'));

        if (n >= totalSlides) currentSlide = 0;
        else if (n < 0) currentSlide = totalSlides - 1;
        else currentSlide = n;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active-dot');
    }

    // Обработчики событий
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Автопрокрутка (опционально)
    let slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);

    // Остановка автопрокрутки при наведении
    const slider = document.querySelector('.slider-container');
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
    });
});