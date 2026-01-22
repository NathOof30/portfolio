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
        
        // Récupérer les médias (images et vidéos YouTube) depuis l'attribut data-media
        const dataMedia = projectCard.getAttribute('data-media');
        
        if (dataMedia) {
            // Les médias sont au format: "type:chemin,type:chemin"
            // Exemple: "image:photo.png,youtube:https://www.youtube.com/watch?v=VIDEO_ID"
            this.media = dataMedia.split(',').map(item => {
                const [type, ...rest] = item.trim().split(':');
                const path = rest.join(':'); // Pour supporter les URLs avec :
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
        
        if (currentMedia.type === 'youtube') {
            // Extraire l'ID YouTube et créer un iframe
            const youtubeId = this.extractYoutubeId(currentMedia.path);
            
            if (youtubeId) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
                iframe.className = 'lightbox-media lightbox-video';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                
                // STYLES IDENTIQUES AUX IMAGES
                iframe.style.width = '90vw';  // 90% de la largeur viewport
                iframe.style.maxWidth = '1200px';  // Largeur max pour grands écrans
                iframe.style.height = 'auto';
                iframe.style.aspectRatio = '16 / 9';  // Ratio YouTube standard
                iframe.style.borderRadius = 'var(--radius-medium)';
                iframe.style.boxShadow = 'var(--shadow-large)';
                iframe.style.border = 'none';
                
                this.lightboxContent.appendChild(iframe);
            }
        } else {
            // Créer un élément image
            const img = document.createElement('img');
            img.src = currentMedia.path;
            img.alt = `Image ${this.currentIndex + 1} du projet`;
            img.className = 'lightbox-media';
            img.style.maxWidth = '90vw';
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
    
    extractYoutubeId(url) {
        // Extraire l'ID YouTube depuis différents formats
        // Format: https://www.youtube.com/watch?v=VIDEO_ID
        // Format: https://youtu.be/VIDEO_ID
        // Format: https://www.youtube.com/embed/VIDEO_ID
        
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/
        ];
        
        for (let pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    }
    
    closeLightbox() {
        // Arrêter les iframes YouTube
        const iframe = this.lightboxContent.querySelector('iframe');
        if (iframe) {
            iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
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

