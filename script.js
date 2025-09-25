// Like button functionality
document.addEventListener('DOMContentLoaded', function() {
    const likeButton = document.getElementById('likeButton');
    const likeCount = document.getElementById('likeCount');
    
    // Load saved likes from localStorage
    let likes = parseInt(localStorage.getItem('profileLikes')) || 0;
    likeCount.textContent = likes;
    
    // Toggle like on click
    likeButton.addEventListener('click', function() {
        const heart = likeButton.querySelector('.heart');
        
        if (likeButton.classList.contains('liked')) {
            // Unlike
            likes--;
            heart.textContent = '🤍';
            likeButton.classList.remove('liked');
        } else {
            // Like
            likes++;
            heart.textContent = '❤️';
            likeButton.classList.add('liked');
        }
        
        // Update counter and save to localStorage
        likeCount.textContent = likes;
        localStorage.setItem('profileLikes', likes);
        
        // Add animation class
        likeButton.classList.add('animate-like');
        setTimeout(() => {
            likeButton.classList.remove('animate-like');
        }, 300);
    });
    
    // Check if already liked
    if (likes > 0) {
        likeButton.querySelector('.heart').textContent = '❤️';
        likeButton.classList.add('liked');
    }
});
