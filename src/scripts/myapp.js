import Project from './project.js';
import dataProjects from '../data/projects.json';
import dataProfil from '../data/profil.json';
import cvPdf from '../images/CV.pdf';

import Swiper from 'swiper';
import { Navigation, FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

import projectTemplate from '../templates/project.handlebars';
import profilTemplate from '../templates/profilCard.handlebars';
import contactTemplate from '../templates/contact.handlebars';
import technoTemplate from '../templates/technologie.handlebars';
import Background from './background.js';

class MyApp{
    #document;
    //Liste de projet qui est dans le carousel de projets
    #projects;
    //Liste des technologies du profil
    #technologies;
    //Background
    #background;

    constructor(document){
        this.#document = document;
        this.#projects = new Array();
        this.#technologies = new Array();
        this.#background = null;
    }

    //loadProjects qui charge la liste de projet grâce aux données dans le JSON mit en param
    #loadProjects(data)
    {
        data.projects.forEach(element => {
            this.#projects.push(new Project(element.title,element.description,element.short,element.images,element.competences));
        });
    }

    #printProject(project){
        // Supprimer une fenêtre projet si elle existe
        let existingWindow = this.#document.querySelector('.projet');
        if (existingWindow) existingWindow.remove();

        const data = {
            "title" : project.title,
            "desc" : project.description,
            "competences" : project.competences
        }

        let projectWindow = this.#document.createElement("div");
        projectWindow.className = "projet";
        projectWindow.innerHTML = projectTemplate(data);

        let imageSwiper = this.#createSwiper();
        let swiperWrapper = imageSwiper.querySelector('.swiper-wrapper');
        
        project.img.forEach(src => {
            //Création de la slide
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            //Création de l'image
            const img = this.#document.createElement('img');
            img.src = require(`../images/${src}`);
            slide.appendChild(img);

            swiperWrapper.appendChild(slide);
        });

        let projectSwiper = projectWindow.querySelector(".swiper");
        projectSwiper.appendChild(imageSwiper);
        
        let closeBtn = projectWindow.querySelector(".close-btn");
        closeBtn.addEventListener('click', () => projectWindow.remove());

        this.#document.body.appendChild(projectWindow);
       
        const swiper = new Swiper('.mySwiper', {
            modules: [Navigation, FreeMode, Mousewheel],  // Ajouter Mousewheel
            slidesPerView: 'auto',  // Pas de centeredSlides
            spaceBetween: 30,
            grabCursor: true,
            freeMode: {
                enabled: true,
                sticky: true,  // S'arrête sur les cartes
            },
            mousewheel: {
                forceToAxis: true,
                sensitivity: 1,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                addIcons: true
            }
        });
    }

    // Créé le swiper des projets
    #buildProjectSwiper(){
        let projectSwiper = this.#createSwiper();
        let swiperWrapper = projectSwiper.querySelector('.swiper-wrapper');

        this.#projects.forEach(project => {
            let slide = this.#createProjectSlide(project);
            swiperWrapper.appendChild(slide);
        });

        let divProjects = this.#document.body.querySelector("#projets");
        divProjects.appendChild(projectSwiper);

        const swiper = new Swiper('.mySwiper', {
            modules: [Navigation, FreeMode, Mousewheel],  // Ajouter Mousewheel
            slidesPerView: 'auto',  // Pas de centeredSlides
            spaceBetween: 30,
            grabCursor: true,
            freeMode: {
                enabled: true,
                sticky: true,  // S'arrête sur les cartes
            },
            mousewheel: {
                forceToAxis: true,
                sensitivity: 1,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                addIcons: true
            }
        });
    }

    #createProjectSlide(project) {
        //Création de la slide
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        //Création de l'image
        const img = this.#document.createElement('img');
        img.src = require(`../images/${project.img[0]}`);
        img.alt = project.title;
        //Création du titre
        const h3 = this.#document.createElement('h3');
        h3.textContent = project.title;
        h3.setAttribute('data-swiper-parallax', '-100');
        //Création de la petite desc
        const p = this.#document.createElement('p');
        p.textContent = project.short_desc;
        p.setAttribute('data-swiper-parallax', '-100');
        //Ajout des éléments à la slide
        slide.appendChild(img);
        slide.appendChild(h3);
        slide.appendChild(p);

        slide.addEventListener("click", () => {
            console.log(`Slide cliquée : ${project.title}`);
            this.#printProject(project);
        });

        return slide;
    }

    #createSwiper() {
        const swiperContainer = document.createElement('div');
        swiperContainer.className = 'swiper mySwiper';

        const swiperWrapper = document.createElement('div');
        swiperWrapper.className = 'swiper-wrapper';

        const prevButton = document.createElement('div');
        prevButton.className = 'swiper-button-prev';

        const nextButton = document.createElement('div');
        nextButton.className = 'swiper-button-next';

        swiperContainer.appendChild(swiperWrapper);
        swiperContainer.appendChild(prevButton);
        swiperContainer.appendChild(nextButton);
       
        return swiperContainer;
    }

    #loadProfil(data){
        //Chargement des technologies
        data.technologies.forEach(tech => {
            this.#technologies.push({
                nom: tech.nom,
                type: tech.type,
                desc: tech.desc,
                img: tech.img
            });
        
        });

        let divProfil = this.#document.querySelector(".profil-content");

        const profilObject = {
            "image" : require(`../images/${data.img}`),
            "desc" : data.description,
            "technologies": data.technologies.map(tech => ({
                img: require(`../images/${tech.img}`)
            }))
        }

        divProfil.innerHTML = profilTemplate(profilObject);

        let techs = this.#document.querySelectorAll('.tech-item');
        techs.forEach((techElement, index) => {
            techElement.addEventListener('click', () => {
                const tech = data.technologies[index];
                this.#printTechno(tech);
            });
        });
    }

    #printContact(data){
        let divContact = this.#document.querySelector(".contact-content");

        const contactObject = {
            "email" : data.email,
            "phone" : data.phone,
            "CV" : cvPdf
        }

        divContact.innerHTML = contactTemplate(contactObject);
    }

    #printTechno(tech){
        console.log(tech);       
        // Créer le conteneur s'il n'existe pas
        let dialogContainer = this.#document.querySelector('.tech-dialog-container');
        
        if (!dialogContainer) {
            dialogContainer = this.#document.createElement('div');
            dialogContainer.className = 'tech-dialog-container';
            this.#document.body.appendChild(dialogContainer);
        }
        
        console.log(tech.nom);
        // Rendre le template avec les données
        const techObject = {
            "type" : tech.type,
            "name" : tech.nom,
            "desc" : tech.desc,
            "img" : require(`../images/${tech.img}`),
            "links" : tech.links ? tech.links : []
        }

        dialogContainer.innerHTML = technoTemplate(techObject);

        // Fonction pour fermer la dialog
        const closeDialog = () => {
            dialogContainer.innerHTML = '';
        };
        
        // Fermer avec le bouton X
        const closeBtn = dialogContainer.querySelector('.tech-dialog-close');
        closeBtn.addEventListener('click', closeDialog);
        
        // Fermer en cliquant sur l'overlay
        const overlay = dialogContainer.querySelector('.tech-dialog-overlay');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeDialog();
            }
        });
    }

    #updateBackground(isDark){
        const canvas = document.querySelector('#canvas');
        this.#background = new Background(canvas, window, document, isDark);
        this.#background.launch();
    }

    #initializeDarkModeToggle(){
        // Récupérer la topnav
        const darkModeToggle = this.#document.querySelector('.dark-mode-toggle');
        
        // Ajouter l'écouteur
        darkModeToggle.addEventListener('click', () => {
            this.#document.body.classList.toggle('dark-mode');
            // Sauvegarder la préférence
            localStorage.setItem('darkMode', this.#document.body.classList.contains('dark-mode'));
            // Changer l'emoji du bouton
            darkModeToggle.textContent = this.#document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            // Mettre à jour le fond
            const isDark = this.#document.body.classList.contains('dark-mode');
            this.#updateBackground(isDark);
        });
        
        // Restaurer la préférence sauvegardée
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            this.#document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️';
        } else {
            darkModeToggle.textContent = '🌙';
        }

        // Créer et initialiser le Background avec l'état correct
        const canvas = this.#document.querySelector('#canvas');
        this.#background = new Background(canvas, window, this.#document, isDarkMode);
        this.#background.launch();
    }

    launch(){
        // Initialiser le toggle dark mode
        this.#initializeDarkModeToggle();

        // Vérifier si le contenu est déjà affiché
        const swiperExists = this.#document.querySelector('#projets .mySwiper');
        if (swiperExists) {
            return; // Contenu déjà affiché, ne rien faire
        }
        
        this.#loadProjects(dataProjects);
        this.#buildProjectSwiper();
        this.#loadProfil(dataProfil);
        this.#printContact(dataProfil.contact);
    }
}

export default MyApp;