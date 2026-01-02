// ===== CHARGEMENT ET AFFICHAGE DES DONNÉES DU PORTFOLIO =====
// Compatible avec GitHub Pages (hébergement statique)

class PortfolioDataLoader {
    constructor() {
        this.data = null;
    }

    async loadData() {
        try {
            const response = await fetch('data/portfolio-data.json');
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des données');
            }
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error('Erreur:', error);
            // En cas d'erreur, on garde le contenu HTML par défaut
            return null;
        }
    }

    // Charger les données personnelles dans le header
    loadPersonalInfo() {
        if (!this.data || !this.data.personal) return;

        const personal = this.data.personal;
        
        // Nom et prénom
        const nomPrenom = document.querySelector('.nom-prenom');
        if (nomPrenom) {
            nomPrenom.innerHTML = `${personal.firstName} <span class="nom">${personal.lastName}</span>`;
        }

        // Statut
        const statut = document.querySelector('.statut');
        if (statut) {
            statut.textContent = personal.status;
        }

        // Phrase d'accroche
        const tagline = document.querySelector('.phrase-accroche');
        if (tagline) {
            tagline.textContent = personal.tagline;
        }

        // Photo de profil
        const photo = document.querySelector('.photo-rond');
        if (photo && personal.photo) {
            photo.src = personal.photo;
            photo.alt = `Photo de ${personal.firstName} ${personal.lastName}`;
        }
    }

    // Charger la section "Qui suis-je"
    loadAboutSection() {
        if (!this.data || !this.data.personal) return;

        const aboutText = document.querySelector('.presentation-courte p');
        if (aboutText && this.data.personal.about) {
            aboutText.textContent = this.data.personal.about;
        }
    }

    // Charger les compétences
    loadSkills() {
        if (!this.data || !this.data.skills) return;

        // Compétences Web
        const iconesWeb = document.querySelector('.icones-web');
        if (iconesWeb && this.data.skills.web) {
            iconesWeb.innerHTML = this.data.skills.web.map(skill => 
                `<img src="${skill.icon}" alt="${skill.name}" class="icone">`
            ).join('');
        }

        // Compétences Adobe
        const iconesAdobe = document.querySelector('.icones-adobe');
        if (iconesAdobe && this.data.skills.adobe) {
            iconesAdobe.innerHTML = this.data.skills.adobe.map(skill => 
                `<img src="${skill.icon}" alt="${skill.name}" class="icone">`
            ).join('');
        }
    }

    // Charger les projets de la page d'accueil
    loadHomepageProjects() {
        if (!this.data || !this.data.projects || !this.data.projects.homepage) return;

        const grilleProjets = document.querySelector('.section-projets .grille-projets');
        if (!grilleProjets) return;

        // Remplacer complètement le contenu de la grille avec des liens
        grilleProjets.innerHTML = this.data.projects.homepage.map(project => `
            <a href="${project.link}" class="projet-card-link">
                <article class="projet-card">
                    <img class="projet-image" src="${project.image}" alt="${project.alt}" loading="lazy" decoding="async">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </article>
            </a>
        `).join('');
    }

    // Charger les projets de la page projets
    loadProjectsPage() {
        if (!this.data || !this.data.projects || !this.data.projects.categories) return;

        const pageProjets = document.querySelector('.page-projets');
        if (!pageProjets) return;

        pageProjets.innerHTML = this.data.projects.categories.map(category => {
            const projectsHTML = category.projects.map(project => {
                // Construire l'attribut data-images avec les images full quality
                const allImages = [project.imageFullQuality || project.image];
                if (project.additionalImages && project.additionalImages.length > 0) {
                    allImages.push(...project.additionalImages);
                }
                const dataImages = allImages.length > 0
                    ? `data-images="${allImages.join(',')}"`
                    : '';

                // Construire les icônes de technologies
                const technologiesHTML = project.technologies && project.technologies.length > 0
                    ? `<div class="icones-techno">
                        ${project.technologies.map(tech => 
                            `<img src="${tech.icon}" alt="${tech.name}">`
                        ).join('')}
                    </div>`
                    : '';

                // Ajouter un ID unique pour chaque carte projet
                return `
                    <article class="carte-projet" id="projet-${project.id}" ${dataImages}>
                        <img src="${project.image}" alt="${project.alt}" class="img-projet">
                        <div class="contenu-projet">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            ${technologiesHTML}
                        </div>
                    </article>
                `;
            }).join('');

            return `
                <section class="categorie-projets">
                    <h2 class="titre-categorie">${category.name}</h2>
                    <div class="grille-projets">
                        ${projectsHTML}
                    </div>
                </section>
            `;
        }).join('');

        // Déclencher un événement pour indiquer que les données sont chargées
        const event = new CustomEvent('portfolioDataLoaded');
        document.dispatchEvent(event);
    }

    // Charger le footer
    loadFooter() {
        if (!this.data || !this.data.footer) return;

        const texteFooter = document.querySelector('.texte-footer');
        if (texteFooter) {
            texteFooter.innerHTML = `
                <p>${this.data.footer.text}</p>
                <p>Dernière mise à jour : ${this.data.footer.updateDate}</p>
            `;
        }

        const reseauxSociaux = document.querySelector('.reseaux-sociaux');
        if (reseauxSociaux && this.data.footer.socialMedia) {
            reseauxSociaux.innerHTML = this.data.footer.socialMedia.map(social => 
                `<a href="${social.url}" class="icone-reseau" target="_blank" rel="noopener noreferrer">
                    <img src="${social.icon}" alt="${social.name}">
                </a>`
            ).join('');
        }
    }

    // Initialiser selon la page
    async init() {
        await this.loadData();
        if (!this.data) {
            console.warn('Impossible de charger les données JSON. Le contenu HTML par défaut sera utilisé.');
            return;
        }

        // Charger les éléments communs
        this.loadPersonalInfo();
        this.loadAboutSection();
        this.loadSkills();
        this.loadFooter();

        // Charger les éléments spécifiques selon la page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (currentPage === 'index.html' || currentPage === '' || currentPage.includes('index')) {
            this.loadHomepageProjects();
        } else if (currentPage === 'projets.html' || currentPage.includes('projets')) {
            this.loadProjectsPage();
        }
    }
}

// Initialiser le chargement des données
document.addEventListener('DOMContentLoaded', async () => {
    const loader = new PortfolioDataLoader();
    await loader.init();
});

