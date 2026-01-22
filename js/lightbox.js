// ===== LIGHTBOX POUR LES IMAGES ET VIDÉOS DE PROJETS =====

class Lightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxContent = document.querySelector('.lightbox-content');
        this.lightboxCurrent = document.getElementById('lightbox-current');
        this.lightboxTotal = document.getElementById('lightbox-total');
        this.closeBtn = document.querySelector('.lightbox-close');
        this.prevBtn = document.querySelector('.lightbox-prev');
        this.nextBtn = document.querySelector('.lightbox-next');
        
        this.media = [];
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
        this.prevBtn.addEventListener('click', () => this.prevMedia());
        this.nextBtn.addEventListener('click', () => this.nextMedia());
        
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
                    this.prevMedia();
                    break;
                case 'ArrowRight':
                    this.nextMedia();
                    break;
            }
        });
    }
    
    openLightbox(index, imageElements) {
        const clickedImage = imageElements[index];
        const projectCard = clickedImage.closest('.carte-projet');
        
        // Récupérer les médias (images et vidéos) depuis l'attribut data-media
        const dataMedia = projectCard.getAttribute('data-media');
        
        if (dataMedia) {
            // Les médias sont au format: "type:chemin,type:chemin"
            // Exemple: "image:photo.png,video:video.mp4"
            this.media = dataMedia.split(',').map(item => {
                const [type, path] = item.trim().split(':');
                return { type: type.trim(), path: path.trim() };
            });
            this.currentIndex = 0;
        } else {
            // Fallback : utiliser l'image principale
            this.media = [{ type: 'image', path: clickedImage.src }];
            this.currentIndex = 0;
        }
        
        // Masquer la scrollbar IMMÉDIATEMENT
        document.body.style.overflow = 'hidden';
        
        this.showMedia();
        this.lightbox.classList.add('active');
        
        // Gérer l'affichage des boutons de navigation
        if (this.media.length <= 1) {
            this.lightbox.classList.add('single-media');
        } else {
            this.lightbox.classList.remove('single-media');
        }
    }
    
    showMedia() {
        if (this.media.length === 0) return;
        
        const currentMedia = this.media[this.currentIndex];
        
        // Vider le contenu précédent
        this.lightboxContent.innerHTML = '';
        
        if (currentMedia.type === 'video') {
            // Créer un élément vidéo
            const video = document.createElement('video');
            video.src = currentMedia.path;
            video.alt = `Vidéo ${this.currentIndex + 1} du projet`;
            video.className = 'lightbox-media';
            video.controls = true;
            video.autoplay = true;
            video.style.maxWidth = '90%';
            video.style.maxHeight = '85vh';
            video.style.borderRadius = 'var(--radius-medium)';
            video.style.boxShadow = 'var(--shadow-large)';
            
            this.lightboxContent.appendChild(video);
        } else {
            // Créer un élément image
            const img = document.createElement('img');
            img.src = currentMedia.path;
            img.alt = `Image ${this.currentIndex + 1} du projet`;
            img.className = 'lightbox-media';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '85vh';
            img.style.borderRadius = 'var(--radius-medium)';
            img.style.boxShadow = 'var(--shadow-large)';
            img.style.objectFit = 'contain';
            
            this.lightboxContent.appendChild(img);
        }
        
        // Ajouter le compteur
        const counter = document.createElement('div');
        counter.className = 'lightbox-counter';
        counter.innerHTML = `<span id="lightbox-current">${this.currentIndex + 1}</span> / <span id="lightbox-total">${this.media.length}</span>`;
        this.lightboxContent.appendChild(counter);
        
        // Mettre à jour les références des éléments
        this.lightboxCurrent = document.getElementById('lightbox-current');
        this.lightboxTotal = document.getElementById('lightbox-total');
    }
    
    nextMedia() {
        if (this.media.length <= 1) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.media.length;
        this.showMedia();
    }
    
    prevMedia() {
        if (this.media.length <= 1) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.media.length) % this.media.length;
        this.showMedia();
    }
    
    closeLightbox() {
        // Arrêter la vidéo en cours
        const video = this.lightboxContent.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        
        this.lightbox.classList.remove('active');
        // Réactiver le scroll après la fermeture
        document.body.style.overflow = '';
    }
}

// Initialiser la lightbox quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new Lightbox();
});

