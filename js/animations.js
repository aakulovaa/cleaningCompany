// Функции для полноэкранного просмотра
function openFullscreen(imageSrc) {
    const modal = document.getElementById('fullscreenModal');
    const modalImg = document.getElementById('fullscreenImage');
    
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    
    // Блокируем прокрутку страницы при открытом модальном окне
    document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
    const modal = document.getElementById('fullscreenModal');
    modal.style.display = 'none';
    
    // Восстанавливаем прокрутку страницы
    document.body.style.overflow = 'auto';
}

// Закрытие модального окна по клику вне изображения
document.getElementById('fullscreenModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeFullscreen();
    }
});

// Закрытие модального окна по клавише Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeFullscreen();
    }
});