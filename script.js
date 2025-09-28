

document.addEventListener('DOMContentLoaded', function() {
    const likeButton = document.getElementById('likeButton');
    const likeCount = document.getElementById('likeCount');
    const heart = likeButton.querySelector('.heart');
    
    // Inicializa o contador de likes no localStorage se não existir
    if (!localStorage.getItem('likeCount')) {
        localStorage.setItem('likeCount', '0');
    }
    
    // Verifica se o usuário já curtiu
    let hasLiked = localStorage.getItem('hasLiked') === 'true';
    
    // Atualiza a interface
    function updateUI() {
        likeCount.textContent = localStorage.getItem('likeCount');
        
        if (hasLiked) {
            heart.textContent = '❤️';
            likeButton.classList.add('liked');
        } else {
            heart.textContent = '🤍';
            likeButton.classList.remove('liked');
        }
    }
    
    // Toggle like on click
    likeButton.addEventListener('click', function() {
        let currentCount = parseInt(localStorage.getItem('likeCount'));
        
        if (hasLiked) {
            // Remove o like
            currentCount = Math.max(0, currentCount - 1);
            localStorage.setItem('likeCount', currentCount);
            localStorage.setItem('hasLiked', 'false');
            hasLiked = false;
        } else {
            // Adiciona o like
            currentCount++;
            localStorage.setItem('likeCount', currentCount);
            localStorage.setItem('hasLiked', 'true');
            hasLiked = true;
        }
        
        // Atualiza a interface
        updateUI();
        
        // Adiciona animação
        likeButton.classList.add('animate-like');
        setTimeout(() => {
            likeButton.classList.remove('animate-like');
        }, 300);
    });
    
    // Carrega os dados iniciais
    updateUI();
});
