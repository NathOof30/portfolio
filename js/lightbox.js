// ===== LIGHTBOX POUR LES IMAGES DE PROJETS =====

class Lightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightbox-image');
        this.lightboxCurrent = document.getElementById('lightbox-current');
        this.lightboxTotal = document.getElementById('lightbox-total');
        this.closeBtn = document.querySelector('.lightbox-close');
        this.prevBtn = document.querySelector('.lightbox-prev');
        this.nextBtn = document.querySelector('.lightbox-next');
        
        this.images = [];
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        // Récupérer toutes les images de projets
        const projectImages = document.querySelectorAll('.img-projet');
        
        projectImages.forEach((img, index) => {
            // Rendre l'image cliquable
            img.style.cursor = 'pointer';
            
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(index, projectImages);
            });
        });
        
        // Événements pour les boutons
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.prevBtn.addEventListener('click', () => this.prevImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());
        
        // Fermer en cliquant sur le fond
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Navigation au clavier
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });
        
        // Empêcher le scroll du body quand la lightbox est ouverte
        this.lightbox.addEventListener('transitionend', () => {
            if (this.lightbox.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    openLightbox(index, imageElements) {
        const clickedImage = imageElements[index];
        const projectCard = clickedImage.closest('.carte-projet');
        
        // Récupérer les images full quality depuis l'attribut data-images
        const dataImages = projectCard.getAttribute('data-images');
        
        if (dataImages) {
            // Les images sont déjà en full quality dans data-images
            this.images = dataImages.split(',').map(img => img.trim());
            this.currentIndex = 0; // Toujours commencer par la première image
        } else {
            // Fallback : utiliser l'image principale
            this.images = [clickedImage.src];
            this.currentIndex = 0;
        }
        
        this.showImage();
        this.lightbox.classList.add('active');
        
        // Gérer l'affichage des boutons de navigation
        if (this.images.length <= 1) {
            this.lightbox.classList.add('single-image');
        } else {
            this.lightbox.classList.remove('single-image');
        }
    }
    
    showImage() {
        if (this.images.length === 0) return;
        
        this.lightboxImage.src = this.images[this.currentIndex];
        this.lightboxImage.alt = `Image ${this.currentIndex + 1} du projet`;
        this.lightboxCurrent.textContent = this.currentIndex + 1;
        this.lightboxTotal.textContent = this.images.length;
    }
    
    nextImage() {
        if (this.images.length <= 1) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.showImage();
    }
    
    prevImage() {
        if (this.images.length <= 1) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showImage();
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialiser la lightbox quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new Lightbox();
});

