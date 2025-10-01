import { log, LOG_TYPE } from './logger.js';
import * as Sfx from './sfx.js';

const DIRECTION = {
    Left: -1,
    Right: 1,
    Up: 1,
    Down: -1
}

const HORIZONTAL_MOVEMENT_AMOUNT = 170;
const VERTICAL_MOVEMENT_AMOUNT = 120;
const VERTICAL_MOVEMENT_OFFSET = 250;
const NO_SUB_MENU_ITEM_COUNT = -1

let isTransitioningHorizontally = false;
let isTransitioningVertically = false;
let isStatusBarVisible = false;
let activeMenuItemIndex = 0;
let isBannerVisible = true;
const menuItemsData = [];

// Konami code tracking
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Language system
let currentLanguage = 'en';
const languages = {
    en: {
        name: 'English',
        flag: '🇺🇸'
    },
    es: {
        name: 'Español',
        flag: '🇪🇸'
    },
    fr: {
        name: 'Français',
        flag: '🇫🇷'
    },
    de: {
        name: 'Deutsch',
        flag: '🇩🇪'
    }
};

// Translation data
const translations = {
    en: {
        // Banner content
        'terminal-title': 'FERNANDO_FRANCO_JR',
        'terminal-subtitle': 'AI_ENGINEER & SOFTWARE_DEVELOPER',
        'profile-text-1': 'Hello! I\'m Fernando Franco Jr., an AI Engineer and Software Developer based in Oklahoma.',
        'profile-text-2': 'I\'m passionate about building intelligent systems that solve real-world problems. Currently working on AI research and developing innovative software solutions.',
        'profile-text-3': 'When I\'m not coding, you\'ll find me exploring new technologies, contributing to open-source projects, and working on research in AI-human interaction.',
        'continue-prompt': 'PRESS_ENTER_TO_ACCESS_PORTFOLIO',
        
        // Menu items
        'home': 'Home',
        'about-me': 'About Me',
        'settings': 'Settings',
        'experience': 'Experience',
        'projects': 'Projects',
        'network': 'Network',
        'awards': 'Awards',
        
        // Sub-menu items
        'create-user': 'Create New User',
        'fernando-profile': 'Fernando Franco Jr.',
        'change-language': 'Change Language',
        'change-theme': 'Change Theme',
        'ai-engineer': 'xVector.us - AI Engineer',
        'software-engineer': 'xVector.us - Software Engineer',
        'research': 'Research - AI Human Interaction',
        'overleaf': 'Overleaf Development',
        'calorie-calc': 'Calorie Calculator',
        'ai-bot': 'AI Bot',
        'web-scraper': 'Web Scraper',
        'resume': 'Resume',
        'linkedin': 'LinkedIn',
        'github': 'Github',
        'youtube': 'Music I Enjoy',
        'favorite-eats': 'Favorite Eats',
        'hsf-scholar': 'HISPANIC SCHOLARSHIP FUND SCHOLAR',
        'cs-scholar': 'CS INCLUDES SCHOLAR',
        'boeing-scholar': 'BOEING SCHOLAR',
        'edward-grisso-scholar': 'EDWARD GRISSO SCHOLAR',
        'loyle-miller-scholar': 'LOYLE P & VELMA MILLER SCHOLAR',
        'sooner-traditions-scholar': 'SOONER TRADITIONS SCHOLAR',
        
        // Navigation legend
        'nav-left-right': 'Navigate Menu',
        'nav-up-down': 'Navigate Items',
        'nav-enter': 'Press Enter to Select',
        'nav-status': 'T - Toggle Status Bar',
        'nav-reset': 'R - Reset Checklist',
        'nav-reset-all': 'U - Reset All Data',
        'nav-reset-lang': 'L - Reset to English',
        
        // Marquee message
        'marquee-message': 'Thank you for visiting! Don\'t forget to connect with me on LinkedIn! Happy Coding!',
        
        // Checklist
        'checklist-title': 'ACHIEVEMENT CHECKLIST',
        'create-user-task': 'Create New User Account',
        'music-discovery-task': 'Discover Music Preferences',
        'find-city-task': 'Find My Favorite City',
        'konami-master-task': 'Konami Master',
        'corgi-hunter-task': 'Corgi Hunter',
        'social-butterfly-task': 'Social Butterfly',
        'city-placeholder': 'Type city name...'
    },
    es: {
        // Banner content
        'terminal-title': 'FERNANDO_FRANCO_JR',
        'terminal-subtitle': 'INGENIERO_IA & DESARROLLADOR_SOFTWARE',
        'profile-text-1': '¡Hola! Soy Fernando Franco Jr., un Ingeniero de IA y Desarrollador de Software basado en Oklahoma.',
        'profile-text-2': 'Me apasiona construir sistemas inteligentes que resuelven problemas del mundo real. Actualmente trabajo en investigación de IA y desarrollo de soluciones de software innovadoras.',
        'profile-text-3': 'Cuando no estoy programando, me encontrarás explorando nuevas tecnologías, contribuyendo a proyectos de código abierto, y trabajando en investigación de interacción humano-IA.',
        'continue-prompt': 'PRESIONA_ENTER_PARA_ACCEDER_AL_PORTFOLIO',
        
        // Menu items
        'home': 'Inicio',
        'about-me': 'Acerca de Mí',
        'settings': 'Configuración',
        'experience': 'Experiencia',
        'projects': 'Proyectos',
        'network': 'Red',
        'awards': 'Premios',
        
        // Sub-menu items
        'create-user': 'Crear Nuevo Usuario',
        'fernando-profile': 'Fernando Franco Jr.',
        'change-language': 'Cambiar Idioma',
        'change-theme': 'Cambiar Tema',
        'ai-engineer': 'xVector.us - Ingeniero IA',
        'software-engineer': 'xVector.us - Ingeniero Software',
        'research': 'Investigación - Interacción Humano-IA',
        'overleaf': 'Desarrollo Overleaf',
        'calorie-calc': 'Calculadora de Calorías',
        'ai-bot': 'Bot IA',
        'web-scraper': 'Web Scraper',
        'resume': 'Currículum',
        'linkedin': 'LinkedIn',
        'github': 'Github',
        'youtube': 'Música que Disfruto',
        'favorite-eats': 'Comidas Favoritas',
        'hsf-scholar': 'BECARIO FONDO DE BECAS HISPANAS',
        'cs-scholar': 'BECARIO CS INCLUDES',
        'boeing-scholar': 'BECARIO BOEING',
        'edward-grisso-scholar': 'BECARIO EDWARD GRISSO',
        'loyle-miller-scholar': 'BECARIO LOYLE P & VELMA MILLER',
        'sooner-traditions-scholar': 'BECARIO TRADICIONES SOONER',
        
        // Navigation legend
        'nav-left-right': 'Navegar Menú',
        'nav-up-down': 'Navegar Elementos',
        'nav-enter': 'Presiona Enter para Seleccionar',
        'nav-status': 'T - Alternar Barra de Estado',
        'nav-reset': 'R - Reiniciar Lista',
        'nav-reset-all': 'U - Reiniciar Todos los Datos',
        'nav-reset-lang': 'L - Reiniciar a Inglés',
        
        // Marquee message
        'marquee-message': '¡Gracias por visitar! ¡No olvides conectar conmigo en LinkedIn! ¡Feliz Programación!',
        
        // Checklist
        'checklist-title': 'LISTA DE LOGROS',
        'create-user-task': 'Crear Nueva Cuenta de Usuario',
        'music-discovery-task': 'Descubrir Preferencias Musicales',
        'find-city-task': 'Encuentra Mi Ciudad Favorita',
        'konami-master-task': 'Maestro Konami',
        'corgi-hunter-task': 'Cazador de Corgis',
        'social-butterfly-task': 'Mariposa Social',
        'city-placeholder': 'Escribe el nombre de la ciudad...'
    },
    fr: {
        // Banner content
        'terminal-title': 'FERNANDO_FRANCO_JR',
        'terminal-subtitle': 'INGENIEUR_IA & DEVELOPPEUR_LOGICIEL',
        'profile-text-1': 'Bonjour ! Je suis Fernando Franco Jr., un Ingénieur IA et Développeur de Logiciels basé en Oklahoma.',
        'profile-text-2': 'Je suis passionné par la construction de systèmes intelligents qui résolvent des problèmes du monde réel. Je travaille actuellement sur la recherche en IA et le développement de solutions logicielles innovantes.',
        'profile-text-3': 'Quand je ne code pas, vous me trouverez en train d\'explorer de nouvelles technologies, contribuer à des projets open-source, et travailler sur la recherche en interaction humain-IA.',
        'continue-prompt': 'APPUYEZ_SUR_ENTREE_POUR_ACCEDER_AU_PORTFOLIO',
        
        // Menu items
        'home': 'Accueil',
        'about-me': 'À Propos de Moi',
        'settings': 'Paramètres',
        'experience': 'Expérience',
        'projects': 'Projets',
        'network': 'Réseau',
        'awards': 'Récompenses',
        
        // Sub-menu items
        'create-user': 'Créer un Nouvel Utilisateur',
        'fernando-profile': 'Fernando Franco Jr.',
        'change-language': 'Changer de Langue',
        'change-theme': 'Changer de Thème',
        'ai-engineer': 'xVector.us - Ingénieur IA',
        'software-engineer': 'xVector.us - Ingénieur Logiciel',
        'research': 'Recherche - Interaction Humain-IA',
        'overleaf': 'Développement Overleaf',
        'calorie-calc': 'Calculateur de Calories',
        'ai-bot': 'Bot IA',
        'web-scraper': 'Web Scraper',
        'resume': 'CV',
        'linkedin': 'LinkedIn',
        'github': 'Github',
        'youtube': 'Musique que J\'aime',
        'favorite-eats': 'Nourriture Préférée',
        'hsf-scholar': 'BOURSIER FONDS DE BOURSES HISPANIQUES',
        'cs-scholar': 'BOURSIER CS INCLUDES',
        'boeing-scholar': 'BOURSIER BOEING',
        'edward-grisso-scholar': 'BOURSIER EDWARD GRISSO',
        'loyle-miller-scholar': 'BOURSIER LOYLE P & VELMA MILLER',
        'sooner-traditions-scholar': 'BOURSIER TRADITIONS SOONER',
        
        // Navigation legend
        'nav-left-right': 'Naviguer Menu',
        'nav-up-down': 'Naviguer Éléments',
        'nav-enter': 'Appuyez sur Entrée pour Sélectionner',
        'nav-status': 'T - Basculer Barre d\'État',
        'nav-reset': 'R - Réinitialiser Liste',
        'nav-reset-all': 'U - Réinitialiser Toutes les Données',
        'nav-reset-lang': 'L - Réinitialiser en Anglais',
        
        // Marquee message
        'marquee-message': 'Merci de votre visite ! N\'oubliez pas de me connecter sur LinkedIn ! Bon Code !',
        
        // Checklist
        'checklist-title': 'LISTE DE RÉALISATIONS',
        'create-user-task': 'Créer un Nouveau Compte Utilisateur',
        'music-discovery-task': 'Découvrir Préférences Musicales',
        'find-city-task': 'Trouve Ma Ville Préférée',
        'konami-master-task': 'Maître Konami',
        'corgi-hunter-task': 'Chasseur de Corgis',
        'social-butterfly-task': 'Papillon Social',
        'city-placeholder': 'Tapez le nom de la ville...'
    },
    de: {
        // Banner content
        'terminal-title': 'FERNANDO_FRANCO_JR',
        'terminal-subtitle': 'KI_INGENIEUR & SOFTWARE_ENTWICKLER',
        'profile-text-1': 'Hallo! Ich bin Fernando Franco Jr., ein KI-Ingenieur und Software-Entwickler aus Oklahoma.',
        'profile-text-2': 'Ich bin leidenschaftlich daran interessiert, intelligente Systeme zu entwickeln, die reale Probleme lösen. Derzeit arbeite ich an KI-Forschung und entwickle innovative Software-Lösungen.',
        'profile-text-3': 'Wenn ich nicht programmiere, findest du mich beim Erkunden neuer Technologien, Beitragen zu Open-Source-Projekten und Arbeiten an der Forschung in der KI-Mensch-Interaktion.',
        'continue-prompt': 'ENTER_DRÜCKEN_UM_PORTFOLIO_ZU_ÖFFNEN',
        
        // Menu items
        'home': 'Startseite',
        'about-me': 'Über Mich',
        'settings': 'Einstellungen',
        'experience': 'Erfahrung',
        'projects': 'Projekte',
        'network': 'Netzwerk',
        'awards': 'Auszeichnungen',
        
        // Sub-menu items
        'create-user': 'Neuen Benutzer Erstellen',
        'fernando-profile': 'Fernando Franco Jr.',
        'change-language': 'Sprache Ändern',
        'change-theme': 'Design Ändern',
        'ai-engineer': 'xVector.us - KI-Ingenieur',
        'software-engineer': 'xVector.us - Software-Ingenieur',
        'research': 'Forschung - KI-Mensch-Interaktion',
        'overleaf': 'Overleaf Entwicklung',
        'calorie-calc': 'Kalorienrechner',
        'ai-bot': 'KI-Bot',
        'web-scraper': 'Web Scraper',
        'resume': 'Lebenslauf',
        'linkedin': 'LinkedIn',
        'github': 'Github',
        'youtube': 'Musik die ich mag',
        'favorite-eats': 'Lieblingsessen',
        'hsf-scholar': 'HISPANISCHES STIPENDIENFONDS STIPENDIAT',
        'cs-scholar': 'CS INCLUDES STIPENDIAT',
        'boeing-scholar': 'BOEING STIPENDIAT',
        'edward-grisso-scholar': 'EDWARD GRISSO STIPENDIAT',
        'loyle-miller-scholar': 'LOYLE P & VELMA MILLER STIPENDIAT',
        'sooner-traditions-scholar': 'SOONER TRADITIONEN STIPENDIAT',
        
        // Navigation legend
        'nav-left-right': 'Menü Navigieren',
        'nav-up-down': 'Elemente Navigieren',
        'nav-enter': 'Enter Drücken zum Auswählen',
        'nav-status': 'T - Statusleiste Umschalten',
        'nav-reset': 'R - Liste Zurücksetzen',
        'nav-reset-all': 'U - Alle Daten Zurücksetzen',
        'nav-reset-lang': 'L - Auf Englisch Zurücksetzen',
        
        // Marquee message
        'marquee-message': 'Danke für Ihren Besuch! Vergessen Sie nicht, sich mit mir auf LinkedIn zu vernetzen! Viel Erfolg beim Programmieren!',
        
        // Checklist
        'checklist-title': 'ERFOLGS-CHECKLISTE',
        'create-user-task': 'Neues Benutzerkonto Erstellen',
        'music-discovery-task': 'Musikpräferenzen Entdecken',
        'find-city-task': 'Finde Meine Lieblingsstadt',
        'konami-master-task': 'Konami Meister',
        'corgi-hunter-task': 'Corgi Jäger',
        'social-butterfly-task': 'Gesellige Seele',
        'city-placeholder': 'Stadtname eingeben...'
    }
};

/**
 * Builds menu items data. 
 * It is used to keep track of menu items and sub menu items
 */
function buildMenuItemsData() {
    // Get all menu items
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach((menuItem, index) => {
        // Get sub menu item count
        // First get sub menu items container
        const subMenuItemContainer = menuItem.querySelector('.sub-menu-item-container');
        let subMenuItemCount = subMenuItemContainer ?
            subMenuItemContainer.children.length
            : NO_SUB_MENU_ITEM_COUNT;

        // Get menu item index
        const menuItemIndex = index;
        // By default active sub menu item index is 0
        // This is used to keep track of active sub menu item index
        const activeSubMenuItemIndex = 0;

        menuItemsData.push(
            {
                subMenuItemCount,
                menuItemIndex,
                activeSubMenuItemIndex,
                subMenuItemContainer,
            });
    });
}

/**
 * Adds event listener to the body
 * All interactions are handled here
 */
function addBodyListener() {
    document.body.addEventListener('keydown', async (event) => {
        // If any modal is open, suppress global navigation/Enter handling
        if (isAnyModalOpen()) {
            return;
        }

        // Only handle navigation keys if banner is not visible
        if (!isBannerVisible) {
            let direction;

            if (event.key === 'ArrowLeft') {
                direction = DIRECTION.Left;
                await moveMenuItemsHorizontally(direction);
            }
            else if (event.key === 'ArrowRight') {
                direction = DIRECTION.Right;
                await moveMenuItemsHorizontally(direction);

            } else if (event.key === 'ArrowUp') {
                direction = DIRECTION.Up;
                await moveSubMenuItemsVertically(direction);

            } else if (event.key === 'ArrowDown') {
                direction = DIRECTION.Down;
                await moveSubMenuItemsVertically(direction);
            }
            

            if (event.key === 't') {
                toggleStatusBar();
            }

            if (event.key === 'r') {
                // Don't reset if user is typing in an input field
                if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
                    resetChecklist();
                }
            }

            if (event.key === 'u') {
                // Don't reset if user is typing in an input field
                if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
                    resetAllData();
                }
            }

            if (event.key === 'l' || event.key === 'L') {
                // Don't reset if user is typing in an input field
                if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
                    resetToEnglish();
                }
            }

            updateStatusBar();
        }

        // Allow pressing 'u' to reset even when the banner is visible
        if (isBannerVisible && (event.key === 'u' || event.key === 'U')) {
            if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
                resetAllData();
            }
        }

        // Check for Konami code (always check, regardless of modal state)
        checkKonamiCode(event.key);

        if (event.key === 'Enter') {
            if (isBannerVisible) {
                hideBanner();
            } else {
                // Check if music video container is visible and handle Enter there
                if (musicVideoManager && musicVideoManager.isVisible) {
                    musicVideoManager.openCurrentVideo();
                } else if (foodManager && foodManager.isVisible) {
                    // Check if food container is visible and handle Enter there
                    foodManager.openCurrentRestaurant();
                } else {
                    // Handle Enter key for menu navigation or go back to intro
                    // If no active menu item, go back to intro page
                    if (activeMenuItemIndex === -1 || !getActiveMenuItem()) {
                        showBanner();
                    } else {
                        handleEnterPress();
                    }
                }
            }
        }
    });

    // Add focus restoration when window regains focus
    window.addEventListener('focus', () => {
        // Ensure the document body has focus for keyboard events
        document.body.focus();
        log(LOG_TYPE.INFO, 'Window focus restored, navigation should work');
    });

    // Add visibility change listener to handle tab switching
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Tab became visible, ensure focus is restored
            setTimeout(() => {
                document.body.focus();
                log(LOG_TYPE.INFO, 'Tab became visible, focus restored');
            }, 100);
        }
    });

    // Ensure body can receive focus for keyboard events
    document.body.setAttribute('tabindex', '-1');
    document.body.focus();

    // Add click handler to restore focus when user clicks anywhere
    document.addEventListener('click', (event) => {
        // Only restore focus if no interactive element was clicked
        if (!event.target.closest('button') && !event.target.closest('input') && !event.target.closest('a')) {
            document.body.focus();
        }
    });
}

// Helper to know if any modal is currently open
function isAnyModalOpen() {
    const createUser = document.getElementById('create-user-modal');
    const language = document.getElementById('language-modal');
    const theme = document.getElementById('theme-modal');
    return (
        (createUser && createUser.classList.contains('show')) ||
        (language && language.classList.contains('show')) ||
        (theme && theme.classList.contains('show'))
    );
}

async function moveMenuItemsHorizontally(direction) {

    // Check can move horizontally
    if (!(direction === DIRECTION.Right && activeMenuItemIndex < menuItemsData.length - 1 || direction === DIRECTION.Left && activeMenuItemIndex > 0)) {
        log(LOG_TYPE.WARNING, 'Can not move horizontally');

        return;
    }

    // Allow immediate subsequent moves without waiting for transition end

    // Change active menu item index
    changeActiveMenuItemIndex(direction);

    // Change style of active menu item
    updateStyleActiveMenuItem();

    Sfx.playClick();

    // Get all menu items
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach((menuItem) => {
        const currentTranslateX = getTranslateX(menuItem);
        menuItem.style.transform = `translateX(${currentTranslateX + (HORIZONTAL_MOVEMENT_AMOUNT * -direction)}px)`;
    });

    // Do not wait for transition end; enable rapid navigation
}

async function moveSubMenuItemsVertically(direction) {
    const activeMenuItem = menuItemsData.find(item => item.menuItemIndex === activeMenuItemIndex);
    const subMenuItemsCount = activeMenuItem.subMenuItemCount;
    const activeSubMenuItemIndex = activeMenuItem.activeSubMenuItemIndex;

    //Check if menu item has sub menu items
    if (activeMenuItem.subMenuItemCount === NO_SUB_MENU_ITEM_COUNT) {
        log(LOG_TYPE.WARNING, 'No sub menu items');

        return;
    }

    if (!(direction === DIRECTION.Down && activeSubMenuItemIndex < subMenuItemsCount - 1 || direction === DIRECTION.Up && activeSubMenuItemIndex > 0)) {
        log(LOG_TYPE.WARNING, 'Can not move vertically');

        return;
    }

    // Allow immediate subsequent moves without waiting for transition end

    changeActiveSubMenuItemIndex(direction);
    updateActiveSubMenuItemStyle();

    Sfx.playClick();

    //Get selected menu item's children (sub menu items)
    const subMenuItems = Array.from(activeMenuItem.subMenuItemContainer.children);
    subMenuItems.forEach((selectionItem, index) => {
        const currentTranslateY = getTranslateY(selectionItem);
        let applyOffsetIndex;
        if (direction === DIRECTION.Down) {
            applyOffsetIndex = activeSubMenuItemIndex;
        }
        else if (direction === DIRECTION.Up) {
            applyOffsetIndex = activeSubMenuItemIndex - 1;
        }
        const applyOffset = index === applyOffsetIndex;
        let transformAmount = applyOffset ?
            currentTranslateY + ((VERTICAL_MOVEMENT_AMOUNT + VERTICAL_MOVEMENT_OFFSET) * direction)
            : currentTranslateY + (VERTICAL_MOVEMENT_AMOUNT * direction);
        selectionItem.style.transform = `translateY(${transformAmount}px)`;
    });

    // Do not wait for transition end; enable rapid navigation
}

/**
 * 
 * @param {Element} element 
 * @returns x coordinate of the element
 */
function getTranslateX(element) {
    const style = window.getComputedStyle(element);
    const matrix = new WebKitCSSMatrix(style.transform);
    return matrix.m41;
}

/**
 * 
 * @param {Element} element 
 * @returns y coordinate of the element
 */
function getTranslateY(element) {
    const style = window.getComputedStyle(element);
    const matrix = new WebKitCSSMatrix(style.transform);
    return matrix.m42;
}

function changeActiveMenuItemIndex(direction) {
    if (direction === 1 && activeMenuItemIndex < menuItemsData.length - 1) {
        activeMenuItemIndex++;
    } else if (direction === -1 && activeMenuItemIndex > 0) {
        activeMenuItemIndex--;
    }
}

function changeActiveSubMenuItemIndex(direction) {
    //Get active sub menu item index
    const activeMenuItem = menuItemsData.find(item => item.menuItemIndex === activeMenuItemIndex);

    if (direction === DIRECTION.Down) {
        activeMenuItem.activeSubMenuItemIndex++;
    } else if (direction === DIRECTION.Up) {
        activeMenuItem.activeSubMenuItemIndex--;
    }
}

function updateStatusBar() {
    //Update active menu item index display
    const activeMenuItemIndexDisplay = document.querySelector('#active-menu-item-index-display');
    activeMenuItemIndexDisplay.innerHTML = activeMenuItemIndex;

    //Update active sub menu item index display
    const activeSubMenuItemIndexDisplayElement = document.querySelector('#active-sub-menu-item-index-display');
    const activeMenuItem = getActiveMenuItem();
    activeSubMenuItemIndexDisplayElement.innerHTML = activeMenuItem.activeSubMenuItemIndex;
}

function updateStyleActiveMenuItem() {
    const menuItems = document.querySelectorAll('.menu-item');

    // remove active class from all menu items
    menuItems.forEach(menuItem => {
        menuItem.classList.remove('active-menu-item');
    })

    // add active class to the active menu item
    menuItems[activeMenuItemIndex].classList.add('active-menu-item');
    
    // Check if this is the About Me menu item and handle containers immediately
    if (activeMenuItemIndex === 1) { // About Me is the second menu item (index 1)
        handleAboutMeContainers();
    } else {
        // Hide containers when not on About Me
        if (musicVideoManager) {
            musicVideoManager.hide();
        }
        if (foodManager) {
            foodManager.hide();
        }
    }

    // Always refresh sub-menu visuals and related containers for the newly active menu
    // This ensures Experience popups (e.g., AI Engineer) appear immediately on horizontal navigation
    updateActiveSubMenuItemStyle();
}

function updateActiveSubMenuItemStyle() {

    //Get active menu item
    const activeMenuItem = getActiveMenuItem();
    if (activeMenuItem.subMenuItemCount === NO_SUB_MENU_ITEM_COUNT) {
        log(LOG_TYPE.WARNING, 'No sub menu items');

        return;
    }

    //Get all sub menu items
    const subMenuItems = Array.from(activeMenuItem.subMenuItemContainer.children);

    //Remove active class from all menu items
    subMenuItems.forEach(subMenuItem => {
        subMenuItem.classList.remove('active-sub-menu-item');
    })

    //Add active class to the active menu item
    const activeSubMenuItem = subMenuItems[activeMenuItem.activeSubMenuItemIndex];
    activeSubMenuItem.classList.add('active-sub-menu-item');

    // Apply theme colors to the active sub-menu item
    const colors = themeManager.getCurrentThemeColors();
    const header = activeSubMenuItem.querySelector('.sub-menu-item-header');
    if (header) {
        header.style.textShadow = `0 0 10px ${colors.glow}`;
    }
    
    // Handle container visibility
    handleContainerVisibility(activeMenuItem, activeSubMenuItem);
}

/**
 * Handle container visibility based on active sub-menu item
 */
function handleContainerVisibility(activeMenuItem, activeSubMenuItem) {
    if (!musicVideoManager && !foodManager) return;
    
    // Check if this is the "Music I Enjoy" sub-menu item
    const header = activeSubMenuItem.querySelector('.sub-menu-item-header');
    const headerText = header ? header.textContent : '';
    
    const isMusicItem = header && (
        headerText.includes('Music I Enjoy') ||
        headerText.includes('Música que Disfruto') ||
        headerText.includes('Musique que J\'aime') ||
        headerText.includes('Musik die ich mag')
    );
    
    // Check if this is the "Favorite Eats" sub-menu item
    const isFoodItem = header && (
        headerText.includes('Favorite Eats') ||
        headerText.includes('Comidas Favoritas') ||
        headerText.includes('Nourriture Préférée') ||
        headerText.includes('Plats Favoris') ||
        headerText.includes('Lieblingsessen') ||
        headerText.includes('Lieblingsgerichte')
    );
    
    // Check if this is the AI Engineer experience item
    const isAIEngineer = header && (
        headerText.includes('AI Engineer') ||
        headerText.includes('Ingeniero IA') ||
        headerText.includes('Ingénieur IA') ||
        headerText.includes('KI-Ingenieur')
    );
    
    // Check if this is the Software Engineer experience item
    const isSoftwareEngineer = header && (
        headerText.includes('Software Engineer') ||
        headerText.includes('Ingeniero Software') ||
        headerText.includes('Ingénieur Logiciel') ||
        headerText.includes('Software-Ingenieur')
    );
    
    // Check if this is the Research experience item
    const isResearch = header && (
        headerText.includes('Research') ||
        headerText.includes('Investigación') ||
        headerText.includes('Recherche') ||
        headerText.includes('Forschung')
    );
    
    log(LOG_TYPE.INFO, `Container visibility check - Header: "${headerText}", isMusic: ${isMusicItem}, isFood: ${isFoodItem}`);
    
    if (isMusicItem) {
        // Show music video container, hide food container
        if (musicVideoManager) {
            musicVideoManager.show();
            log(LOG_TYPE.INFO, 'Showing music video container');
        }
        if (foodManager) {
            foodManager.hide();
            log(LOG_TYPE.INFO, 'Hiding food container');
        }
        experiencePopupManager.hideAI();
    } else if (isFoodItem) {
        // Show food container, hide music video container
        if (foodManager) {
            foodManager.show();
            log(LOG_TYPE.INFO, 'Showing food container');
        }
        if (musicVideoManager) {
            musicVideoManager.hide();
            log(LOG_TYPE.INFO, 'Hiding music video container');
        }
        experiencePopupManager.hideAI();
    } else if (isAIEngineer) {
        // Hide About Me containers and show AI experience popup
        if (musicVideoManager) musicVideoManager.hide();
        if (foodManager) foodManager.hide();
        experiencePopupManager.showAI();
        log(LOG_TYPE.INFO, 'Showing AI Engineer experience popup');
        experiencePopupManager.hideSE();
    } else if (isSoftwareEngineer) {
        // Hide About Me containers and show Software Engineer experience popup
        if (musicVideoManager) musicVideoManager.hide();
        if (foodManager) foodManager.hide();
        experiencePopupManager.showSE();
        log(LOG_TYPE.INFO, 'Showing Software Engineer experience popup');
        experiencePopupManager.hideAI();
        experiencePopupManager.hideResearch();
    } else if (isResearch) {
        // Hide About Me containers and show Research experience popup
        if (musicVideoManager) musicVideoManager.hide();
        if (foodManager) foodManager.hide();
        experiencePopupManager.showResearch();
        log(LOG_TYPE.INFO, 'Showing Research experience popup');
        experiencePopupManager.hideAI();
        experiencePopupManager.hideSE();
    } else {
        // Hide both containers
        if (musicVideoManager) {
            musicVideoManager.hide();
            log(LOG_TYPE.INFO, 'Hiding music video container (no match)');
        }
        if (foodManager) {
            foodManager.hide();
            log(LOG_TYPE.INFO, 'Hiding food container (no match)');
        }
        experiencePopupManager.hideAI();
        experiencePopupManager.hideSE();
        experiencePopupManager.hideResearch();
    }
}

/**
 * Handle container visibility for About Me menu
 */
function handleAboutMeContainers() {
    if (!musicVideoManager && !foodManager) return;
    
    // Ensure both managers are initialized and loaded
    if (musicVideoManager && !musicVideoManager.videos.length) {
        musicVideoManager.loadVideos();
    }
    if (foodManager && !foodManager.restaurants.length) {
        foodManager.loadRestaurants();
    }
    
    // Get the active sub-menu item to determine which container to show
    const activeMenuItem = getActiveMenuItem();
    if (!activeMenuItem || activeMenuItem.subMenuItemCount === NO_SUB_MENU_ITEM_COUNT) {
        return;
    }
    
    // Derive the active sub-menu item directly from DOM and tracked index
    const subMenuItems = Array.from(activeMenuItem.subMenuItemContainer?.children || []);
    const activeSubMenuItem = subMenuItems[activeMenuItem.activeSubMenuItemIndex] || subMenuItems[0];
    if (!activeSubMenuItem) {
        return;
    }
    
    // Call the container visibility handler to show the appropriate container
    handleContainerVisibility(activeMenuItem, activeSubMenuItem);
}

function toggleStatusBar() {
    isStatusBarVisible = !isStatusBarVisible;
    const statusBar = document.querySelector('.status-bar');
    statusBar.style.display = isStatusBarVisible ? 'block' : 'none';
}

function resetChecklist() {
    console.log('Reset checklist function called');
    checklistManager.resetChecklist();
    
    // Force refresh of checklist colors after reset
    const colors = themeManager.getCurrentThemeColors();
    checklistManager.updateChecklistColors(colors);
    
    Sfx.playClick();
    alert('Checklist reset! Press OK to continue.');
}

// Expose to global scope for inline onclick in index.html
window.resetChecklist = resetChecklist;

function resetAllData() {
    console.log('Reset all data function called');
    checklistManager.resetChecklist();
    userManager.resetUsers();
    try { localStorage.removeItem('portfolio-last-created-user'); } catch (e) {}
    try { localStorage.removeItem('portfolio-platinum-achieved'); } catch (e) {}
    
    // Reset theme to blue and force refresh
    themeManager.applyTheme('blue');
    
    // Force refresh of all UI colors after theme reset
    setTimeout(() => {
        const colors = themeManager.getCurrentThemeColors();
        themeManager.applyThemeColors(colors);
        checklistManager.updateChecklistColors(colors);
    }, 100);
    
    // Remove all user sub-menu items from the Home menu
    const homeMenuItem = document.querySelector('.menu-item:first-child');
    const subMenuContainer = homeMenuItem.querySelector('.sub-menu-item-container');
    if (subMenuContainer) {
        const userSubItems = subMenuContainer.querySelectorAll('.sub-menu-item[data-user-id]');
        userSubItems.forEach(item => item.remove());
        
        // Reset menu data structure
        const homeMenuData = menuItemsData[0];
        if (homeMenuData) {
            homeMenuData.subMenuItemCount = 2; // Reset to original count (Create New User + Fernando Franco Jr.)
        }
    }
    
    Sfx.playClick();
    log(LOG_TYPE.INFO, 'All data reset successfully');
    alert('All data reset! Theme, users, and checklist have been restored to defaults.');
}

/**
 * Page transition helper: slide panels in, show loader, then slide out
 * @param {Function} onMidpoint callback executed when panels are closed (safe to swap views)
 */
async function runPageTransition(onMidpoint) {
    const overlay = document.getElementById('page-transition');
    const topPanel = document.querySelector('.transition-panel--top');
    const bottomPanel = document.querySelector('.transition-panel--bottom');
    const loader = document.getElementById('transition-loader');

    if (!overlay || !topPanel || !bottomPanel || !loader) {
        if (typeof onMidpoint === 'function') onMidpoint();
        return;
    }

    overlay.classList.add('is-active');

    // Close panels (longer duration for visibility)
    topPanel.style.transition = 'transform 350ms ease-out';
    bottomPanel.style.transition = 'transform 350ms ease-out';
    topPanel.style.transform = 'translateY(0)';
    bottomPanel.style.transform = 'translateY(0)';

    await new Promise(r => setTimeout(r, 370));

    // Show loader
    loader.style.transition = 'opacity 220ms ease-out';
    loader.style.opacity = '1';

    // Hold loader a bit longer
    await new Promise(r => setTimeout(r, 1200));

    // Midpoint action (swap views)
    if (typeof onMidpoint === 'function') onMidpoint();

    // Hide loader
    loader.style.opacity = '0';
    await new Promise(r => setTimeout(r, 200));

    // Open panels
    topPanel.style.transform = 'translateY(-100%)';
    bottomPanel.style.transform = 'translateY(100%)';
    await new Promise(r => setTimeout(r, 370));

    overlay.classList.remove('is-active');
}

/**
 * Hides the loading banner and shows the main content
 */
function hideBanner() {
    if (!isBannerVisible) return;
    
    isBannerVisible = false;
    
    // Play click sound
    Sfx.playClick();
    
    runPageTransition(() => {
        // Swap views at midpoint
        const banner = document.querySelector('#loading-banner');
        if (banner) banner.classList.add('hidden');
        const mainContent = document.querySelector('#main-content');
        if (mainContent) mainContent.classList.add('show');
        initializeMainContent();
        const backBtn = document.getElementById('back-to-intro-btn');
        if (backBtn) {
            backBtn.style.display = 'block';
            backBtn.tabIndex = 0;
        }
    });
    
    log(LOG_TYPE.INFO, 'Banner hidden, main content shown');
}

/**
 * Shows the loading banner and hides the main content (go back to intro)
 */
function showBanner() {
    if (isBannerVisible) return;
    isBannerVisible = true;
    
    // Play click sound
    Sfx.playClick();
    
    runPageTransition(() => {
        const mainContent = document.querySelector('#main-content');
        if (mainContent) mainContent.classList.remove('show');
        const banner = document.querySelector('#loading-banner');
        if (banner) banner.classList.remove('hidden');
        const backBtn = document.getElementById('back-to-intro-btn');
        if (backBtn) {
            backBtn.blur();
            backBtn.style.display = 'none';
            backBtn.tabIndex = -1;
        }
        try { document.body.focus(); } catch (e) {}
    });
    
    log(LOG_TYPE.INFO, 'Banner shown, main content hidden');
}

function getActiveMenuItem() {
    return menuItemsData.find(item => item.menuItemIndex === activeMenuItemIndex);
}

/**
 * Checklist system for tracking user achievements
 */
class ChecklistManager {
    constructor() {
        this.completedTasks = this.loadCompletedTasks();
        this.initializeChecklist();
        
        // Check for platinum trophy after loading completed tasks
        setTimeout(() => {
            this.checkForPlatinumTrophy();
        }, 100);
    }

    loadCompletedTasks() {
        const saved = localStorage.getItem('portfolio-checklist');
        return saved ? JSON.parse(saved) : {};
    }

    saveCompletedTasks() {
        localStorage.setItem('portfolio-checklist', JSON.stringify(this.completedTasks));
    }

    initializeChecklist() {
        const checklistItems = document.querySelectorAll('.checklist-item');
        checklistItems.forEach(item => {
            const taskId = item.dataset.task;
            if (this.completedTasks[taskId]) {
                item.classList.add('completed');
            }
        });
    }

    completeTask(taskId) {
        this.completedTasks[taskId] = true;
        this.saveCompletedTasks();
        
        const checklistItem = document.querySelector(`[data-task="${taskId}"]`);
        if (checklistItem && !checklistItem.classList.contains('completed')) {
            checklistItem.classList.add('completed');
            // Play achievement sound
            Sfx.playClick();
            log(LOG_TYPE.INFO, `Task completed: ${taskId}`);
            
            // Check if all achievements are completed for platinum trophy
            this.checkForPlatinumTrophy();
        }
    }

    isTaskCompleted(taskId) {
        return this.completedTasks[taskId] || false;
    }

    checkForPlatinumTrophy() {
        // All possible achievement task IDs
        const allTasks = [
            'create-user',
            'music-discovery', 
            'find-city',
            'konami-master',
            'corgi-hunter',
            'social-butterfly'
        ];
        
        // Check if all tasks are completed
        const allCompleted = allTasks.every(taskId => this.completedTasks[taskId]);
        
        if (allCompleted && !this.hasShownPlatinumTrophy()) {
            this.showPlatinumTrophy();
            this.setPlatinumTrophyShown();
        }
    }

    hasShownPlatinumTrophy() {
        return localStorage.getItem('portfolio-platinum-trophy-shown') === 'true';
    }

    setPlatinumTrophyShown() {
        localStorage.setItem('portfolio-platinum-trophy-shown', 'true');
    }

    showPlatinumTrophy() {
        // Show trophy notification
        showTrophyNotification();
        
        // Do not show any badge on the start screen profile photo
        hideProfileTrophyBadge();
        
        // Persist platinum achieved and assign star
        try { localStorage.setItem('portfolio-platinum-achieved', 'true'); } catch (e) {}
        // Ensure the star shows on the last created user's avatar
        triggerNewUserStar();
        
        log(LOG_TYPE.SUCCESS, '🎉 PLATINUM TROPHY UNLOCKED! All achievements completed!');
    }

    resetChecklist() {
        // Clear localStorage
        localStorage.removeItem('portfolio-checklist');
        localStorage.removeItem('portfolio-platinum-trophy-shown');
        localStorage.removeItem('portfolio-platinum-achieved');
        this.completedTasks = {};
        
        // Remove completed class from all checklist items
        const checklistItems = document.querySelectorAll('.checklist-item');
        checklistItems.forEach(item => {
            item.classList.remove('completed');
            
            // Reset checkbox visual state
            const checkbox = item.querySelector('.checklist-checkbox');
            if (checkbox) {
                checkbox.style.backgroundColor = 'transparent';
                checkbox.style.boxShadow = 'none';
            }
        });
        
        // Reset city input field specifically
        const cityInput = document.querySelector('.city-guess-input');
        if (cityInput) {
            cityInput.value = '';
            cityInput.disabled = false;
            cityInput.style.color = '#fff';
            cityInput.style.borderColor = '#0096ff';
        }
        
        log(LOG_TYPE.INFO, 'Checklist reset successfully');
        console.log('Checklist reset - localStorage cleared and UI updated');
    }
}

/**
 * User management system
 */
class UserManager {
    constructor() {
        this.users = this.loadUsers();
    }

    loadUsers() {
        const saved = localStorage.getItem('portfolio-users');
        return saved ? JSON.parse(saved) : [];
    }

    saveUsers() {
        localStorage.setItem('portfolio-users', JSON.stringify(this.users));
    }

    createUser(userData) {
        const user = {
            id: Date.now().toString(),
            name: userData.name,
            icon: userData.icon || 'assets/icons/avatars/book-new.png',
            createdAt: new Date().toISOString()
        };
        
        this.users.push(user);
        this.saveUsers();
        log(LOG_TYPE.INFO, `User created: ${user.name}`);
        return user;
    }

    getUserCount() {
        return this.users.length;
    }

    getUsers() {
        return this.users;
    }

    resetUsers() {
        // Clear localStorage
        localStorage.removeItem('portfolio-users');
        this.users = [];
        log(LOG_TYPE.INFO, 'User data reset successfully');
        console.log('User data reset - localStorage cleared');
    }
}

/**
 * Theme management system
 */
class ThemeManager {
    constructor() {
        this.currentTheme = this.loadCurrentTheme();
        this.availableThemes = [
            { 
                name: 'blue', 
                file: 'assets/video/blue.mp4', 
                displayName: 'Blue',
                colors: {
                    primary: '#0096ff',
                    secondary: '#00bfff',
                    accent: '#0080cc',
                    text: '#ffffff',
                    border: '#0096ff',
                    glow: 'rgba(0, 150, 255, 0.6)'
                }
            },
            { 
                name: 'black', 
                file: 'assets/video/black.mp4', 
                displayName: 'Black',
                colors: {
                    primary: '#ffffff',
                    secondary: '#cccccc',
                    accent: '#999999',
                    text: '#ffffff',
                    border: '#ffffff',
                    glow: 'rgba(255, 255, 255, 0.6)'
                }
            },
            { 
                name: 'brown', 
                file: 'assets/video/brown.mp4', 
                displayName: 'Brown',
                colors: {
                    primary: '#8B4513',
                    secondary: '#A0522D',
                    accent: '#D2691E',
                    text: '#ffffff',
                    border: '#8B4513',
                    glow: 'rgba(139, 69, 19, 0.6)'
                }
            },
            { 
                name: 'gray', 
                file: 'assets/video/gray.mp4', 
                displayName: 'Gray',
                colors: {
                    primary: '#808080',
                    secondary: '#A9A9A9',
                    accent: '#696969',
                    text: '#ffffff',
                    border: '#808080',
                    glow: 'rgba(128, 128, 128, 0.6)'
                }
            },
            { 
                name: 'green', 
                file: 'assets/video/green.mp4', 
                displayName: 'Green',
                colors: {
                    primary: '#00ff00',
                    secondary: '#32cd32',
                    accent: '#228b22',
                    text: '#ffffff',
                    border: '#00ff00',
                    glow: 'rgba(0, 255, 0, 0.6)'
                }
            },
            { 
                name: 'orange', 
                file: 'assets/video/orange.mp4', 
                displayName: 'Orange',
                colors: {
                    primary: '#ff8c00',
                    secondary: '#ffa500',
                    accent: '#ff6347',
                    text: '#ffffff',
                    border: '#ff8c00',
                    glow: 'rgba(255, 140, 0, 0.6)'
                }
            },
            { 
                name: 'red', 
                file: 'assets/video/red.mp4', 
                displayName: 'Red',
                colors: {
                    primary: '#ff0000',
                    secondary: '#ff4444',
                    accent: '#cc0000',
                    text: '#ffffff',
                    border: '#ff0000',
                    glow: 'rgba(255, 0, 0, 0.6)'
                }
            },
            { 
                name: 'turquois', 
                file: 'assets/video/turquois.mp4', 
                displayName: 'Turquois',
                colors: {
                    primary: '#40e0d0',
                    secondary: '#00ced1',
                    accent: '#20b2aa',
                    text: '#ffffff',
                    border: '#40e0d0',
                    glow: 'rgba(64, 224, 208, 0.6)'
                }
            },
            { 
                name: 'violet', 
                file: 'assets/video/violet.mp4', 
                displayName: 'Violet',
                colors: {
                    primary: '#8a2be2',
                    secondary: '#9370db',
                    accent: '#6a0dad',
                    text: '#ffffff',
                    border: '#8a2be2',
                    glow: 'rgba(138, 43, 226, 0.6)'
                }
            },
            { 
                name: 'yellow', 
                file: 'assets/video/yellow.mp4', 
                displayName: 'Yellow',
                colors: {
                    primary: '#ffff00',
                    secondary: '#ffd700',
                    accent: '#daa520',
                    text: '#000000',
                    border: '#ffff00',
                    glow: 'rgba(255, 255, 0, 0.6)'
                }
            },
            { 
                name: 'japanese', 
                file: 'assets/cb-dither.png', 
                displayName: 'Japanese',
                type: 'image',
                colors: {
                    primary: '#ff6b6b',
                    secondary: '#ff8e8e',
                    accent: '#ff5252',
                    text: '#ffffff',
                    border: '#ff6b6b',
                    glow: 'rgba(255, 107, 107, 0.6)'
                }
            }
        ];
        this.applyTheme(this.currentTheme);
    }

    loadCurrentTheme() {
        const saved = localStorage.getItem('portfolio-theme');
        return saved || 'blue'; // Default to blue theme
    }

    saveCurrentTheme(themeName) {
        localStorage.setItem('portfolio-theme', themeName);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getAvailableThemes() {
        return this.availableThemes;
    }

    getCurrentThemeColors() {
        const theme = this.availableThemes.find(t => t.name === this.currentTheme);
        return theme ? theme.colors : this.availableThemes[0].colors; // Fallback to blue
    }

    applyTheme(themeName) {
        const theme = this.availableThemes.find(t => t.name === themeName);
        if (theme) {
            const videoElement = document.querySelector('.video-container video');
            const videoContainer = document.querySelector('.video-container');
            
            if (videoElement && videoContainer) {
                if (theme.type === 'image') {
                    // Hide video and show image background
                    videoElement.style.display = 'none';
                    videoContainer.style.backgroundImage = `url(${theme.file})`;
                    videoContainer.style.backgroundSize = 'cover';
                    videoContainer.style.backgroundPosition = 'center';
                    videoContainer.style.backgroundRepeat = 'no-repeat';
                } else {
                    // Show video and hide image background
                    videoElement.style.display = 'block';
                    videoContainer.style.backgroundImage = 'none';
                    videoElement.src = theme.file;
                }
                
                this.currentTheme = themeName;
                this.saveCurrentTheme(themeName);
                
                // Apply theme colors to UI elements
                this.applyThemeColors(theme.colors);
                
                // Apply theme-specific enhancements
                this.applyThemeEnhancements(theme);
                
                log(LOG_TYPE.INFO, `Theme changed to: ${theme.displayName}`);
            }
        }
    }

    applyThemeColors(colors) {
        // Apply colors to CSS custom properties
        const root = document.documentElement;
        root.style.setProperty('--theme-primary', colors.primary);
        root.style.setProperty('--theme-secondary', colors.secondary);
        root.style.setProperty('--theme-accent', colors.accent);
        root.style.setProperty('--theme-text', colors.text);
        root.style.setProperty('--theme-border', colors.border);
        root.style.setProperty('--theme-glow', colors.glow);

        // Apply colors to specific elements that need immediate updates
        this.updateSubMenuColors(colors);
        this.updateModalColors(colors);
        this.updateNavigationColors(colors);
        this.updateChecklistColors(colors);
    }

    applyThemeEnhancements(theme) {
        // Apply theme-specific visual enhancements
        if (theme.name === 'japanese') {
            // Add black outlines to icons for better visibility
            const menuItemIcons = document.querySelectorAll('.menu-item-icon');
            const subMenuItemIcons = document.querySelectorAll('.sub-menu-item-icon');
            
            menuItemIcons.forEach(icon => {
                icon.style.filter = 'drop-shadow(2px 2px 0px #000) drop-shadow(-2px -2px 0px #000) drop-shadow(2px -2px 0px #000) drop-shadow(-2px 2px 0px #000)';
            });
            
            subMenuItemIcons.forEach(icon => {
                icon.style.filter = 'drop-shadow(1px 1px 0px #000) drop-shadow(-1px -1px 0px #000) drop-shadow(1px -1px 0px #000) drop-shadow(-1px 1px 0px #000)';
            });
            
            // Add black outlines to all text elements
            const textElements = document.querySelectorAll('.menu-item-description, .sub-menu-item-header, .legend-line, .checklist-text, .checklist-title, .terminal-title, .terminal-subtitle, .profile-text, .continue-prompt, .modal-title, .theme-name, .language-name, .date-time, .taskbar-time, .banner-title-text, .banner-window-control');
            textElements.forEach(element => {
                element.style.textShadow = '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 0px 2px 0px #000, 0px -2px 0px #000, 2px 0px 0px #000, -2px 0px 0px #000';
            });
            
            // Make navigation legend and date/time less transparent for better visibility
            const navigationLegend = document.querySelector('.navigation-legend');
            if (navigationLegend) {
                navigationLegend.style.opacity = '1';
                navigationLegend.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            }
            
            const gameChecklist = document.querySelector('.game-checklist');
            if (gameChecklist) {
                gameChecklist.style.opacity = '1';
                gameChecklist.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            }
        } else {
            // Reset filters and text shadows for other themes
            const allIcons = document.querySelectorAll('.menu-item-icon, .sub-menu-item-icon');
            allIcons.forEach(icon => {
                icon.style.filter = '';
            });
            
            const textElements = document.querySelectorAll('.menu-item-description, .sub-menu-item-header, .legend-line, .checklist-text, .checklist-title, .terminal-title, .terminal-subtitle, .profile-text, .continue-prompt, .modal-title, .theme-name, .language-name, .date-time, .taskbar-time, .banner-title-text, .banner-window-control');
            textElements.forEach(element => {
                element.style.textShadow = '';
            });
            
            // Reset navigation legend and checklist transparency
            const navigationLegend = document.querySelector('.navigation-legend');
            if (navigationLegend) {
                navigationLegend.style.opacity = '';
                navigationLegend.style.backgroundColor = '';
            }
            
            const gameChecklist = document.querySelector('.game-checklist');
            if (gameChecklist) {
                gameChecklist.style.opacity = '';
                gameChecklist.style.backgroundColor = '';
            }
        }
    }

    updateSubMenuColors(colors) {
        // Update active sub-menu item colors
        const activeSubMenuItems = document.querySelectorAll('.active-sub-menu-item');
        activeSubMenuItems.forEach(item => {
            const header = item.querySelector('.sub-menu-item-header');
            if (header) {
                header.style.textShadow = `0 0 10px ${colors.glow}`;
            }
        });

        // Hide profile trophy badge on reset
        hideProfileTrophyBadge();

        // Remove persistent star from any user
        const stars = document.querySelectorAll('.menu-item:first-child .sub-menu-item .new-user-star.show');
        stars.forEach(s => s.classList.remove('show'));
    }

    updateModalColors(colors) {
        // Update modal borders and accents
        const modals = document.querySelectorAll('.modal-content');
        modals.forEach(modal => {
            modal.style.borderColor = colors.border;
            modal.style.boxShadow = `0 0 30px ${colors.glow}, inset 0 0 30px ${colors.glow}`;
        });

        const modalHeaders = document.querySelectorAll('.modal-header');
        modalHeaders.forEach(header => {
            header.style.borderBottomColor = colors.border;
            header.style.backgroundColor = `${colors.primary}20`; // 20% opacity
        });

        const modalTitles = document.querySelectorAll('.modal-title');
        modalTitles.forEach(title => {
            title.style.color = colors.primary;
            title.style.textShadow = `0 0 8px ${colors.glow}`;
        });

        const modalCloses = document.querySelectorAll('.modal-close');
        modalCloses.forEach(close => {
            close.style.color = colors.primary;
        });

        const modalFooters = document.querySelectorAll('.modal-footer');
        modalFooters.forEach(footer => {
            footer.style.borderTopColor = colors.border;
            footer.style.backgroundColor = `${colors.primary}10`; // 10% opacity
        });

        const modalButtons = document.querySelectorAll('.btn-cancel, .btn-create');
        modalButtons.forEach(button => {
            button.style.borderColor = colors.border;
            button.style.color = colors.primary;
        });

        const modalInputs = document.querySelectorAll('.modal-body input, .modal-body textarea');
        modalInputs.forEach(input => {
            input.style.borderColor = colors.border;
        });

        // Update form labels
        const formLabels = document.querySelectorAll('.form-group label');
        formLabels.forEach(label => {
            label.style.color = colors.primary;
            label.style.textShadow = `0 0 5px ${colors.glow}`;
        });

        // Update theme selection grid
        const themeSelectionGrid = document.querySelector('.theme-selection-grid');
        if (themeSelectionGrid) {
            themeSelectionGrid.style.borderColor = colors.border;
        }

        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.style.borderColor = colors.border;
        });

        // Update language selection grid
        const languageSelectionGrid = document.querySelector('.language-selection-grid');
        if (languageSelectionGrid) {
            languageSelectionGrid.style.borderColor = colors.border;
        }

        const languageOptions = document.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            option.style.borderColor = colors.border;
        });

        // Update icon selection grid
        const iconSelectionGrid = document.querySelector('.icon-selection-grid');
        if (iconSelectionGrid) {
            iconSelectionGrid.style.borderColor = colors.border;
        }

        const iconOptions = document.querySelectorAll('.icon-option');
        iconOptions.forEach(option => {
            option.style.borderColor = colors.border;
        });
    }

    updateNavigationColors(colors) {
        // Update navigation legend
        const navigationLegend = document.querySelector('.navigation-legend');
        if (navigationLegend) {
            navigationLegend.style.borderColor = colors.border;
        }

        // Update date/time display
        const dateTime = document.querySelector('.date-time');
        if (dateTime) {
            dateTime.style.color = colors.text;
        }
    }

    updateChecklistColors(colors) {
        // Update checklist container border
        const gameChecklist = document.querySelector('.game-checklist');
        if (gameChecklist) {
            gameChecklist.style.borderColor = colors.border;
        }

        // Update checklist header border
        const checklistHeaders = document.querySelectorAll('.checklist-header');
        checklistHeaders.forEach(header => {
            header.style.borderBottomColor = colors.border;
        });

        // Update checklist colors
        const checklistTitles = document.querySelectorAll('.checklist-title');
        checklistTitles.forEach(title => {
            title.style.color = colors.primary;
            title.style.textShadow = `0 0 5px ${colors.glow}`;
        });

        const checklistCheckboxes = document.querySelectorAll('.checklist-checkbox');
        checklistCheckboxes.forEach(checkbox => {
            checkbox.style.borderColor = colors.border;
        });

        const completedCheckboxes = document.querySelectorAll('.checklist-item.completed .checklist-checkbox');
        completedCheckboxes.forEach(checkbox => {
            checkbox.style.backgroundColor = colors.primary;
            checkbox.style.boxShadow = `0 0 8px ${colors.glow}`;
        });

        const completedTexts = document.querySelectorAll('.checklist-item.completed .checklist-text');
        completedTexts.forEach(text => {
            text.style.color = colors.primary;
            text.style.textShadow = `0 0 5px ${colors.glow}`;
        });

        const cityInput = document.querySelector('.city-guess-input');
        if (cityInput) {
            cityInput.style.borderColor = colors.border;
            cityInput.style.color = colors.text;
        }

        // Update reset button
        const resetButtons = document.querySelectorAll('.checklist-reset-btn');
        resetButtons.forEach(button => {
            button.style.borderColor = colors.border;
            button.style.color = colors.primary;
        });
    }
}

// Initialize managers
const checklistManager = new ChecklistManager();
const userManager = new UserManager();
const themeManager = new ThemeManager();

// Initialize trophy system
initializeTrophySystem();

// Back to intro page button handler
document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('back-to-intro-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showBanner();
        });
    }
});

/**
 * Music Video Manager for animated scrolling videos
 */
class MusicVideoManager {
    constructor() {
        this.videos = [];
        this.currentIndex = 0;
        this.isAutoScrolling = false;
        this.autoScrollInterval = null;
        this.scrollDuration = 3500; // 3.5 seconds
        this.container = null;
        this.scrollElement = null;
        this.trackElement = null;
        this.titleElement = null;
        this.counterElement = null;
        this.isVisible = false;
        
        // Real music videos from your playlist
        this.sampleVideos = [
            {
                id: 'xnP7qKxwzjg',
                title: 'Tame Impala - Dracula',
                thumbnail: 'https://img.youtube.com/vi/xnP7qKxwzjg/maxresdefault.jpg',
                url: 'https://www.youtube.com/watch?v=xnP7qKxwzjg&list=RDxnP7qKxwzjg&start_radio=1'
            },
            {
                id: '2kjolTLZ_Mg',
                title: 'The Weekend - Sao Paulo',
                thumbnail: 'https://img.youtube.com/vi/2kjolTLZ_Mg/maxresdefault.jpg',
                url: 'https://www.youtube.com/watch?v=2kjolTLZ_Mg&list=RD2kjolTLZ_Mg&start_radio=1'
            },
            {
                id: '1mB0tP1I-14',
                title: 'Lady Gaga - Love Game',
                thumbnail: 'https://img.youtube.com/vi/1mB0tP1I-14/maxresdefault.jpg',
                url: 'https://www.youtube.com/watch?v=1mB0tP1I-14&list=RD1mB0tP1I-14&start_radio=1'
            },
            {
                id: 'Yf_Lwe6p-Cg',
                title: 'Wham! - Everything She Wants',
                thumbnail: 'https://img.youtube.com/vi/Yf_Lwe6p-Cg/maxresdefault.jpg',
                url: 'https://www.youtube.com/watch?v=Yf_Lwe6p-Cg&list=RDYf_Lwe6p-Cg&start_radio=1'
            },
            {
                id: 'fuV4yQWdn_4',
                title: 'squabble up - Kendrick Lamar',
                thumbnail: 'https://img.youtube.com/vi/fuV4yQWdn_4/maxresdefault.jpg',
                url: 'https://www.youtube.com/watch?v=fuV4yQWdn_4&list=RDfuV4yQWdn_4&start_radio=1'
            },
            {
                id: 'tG35R8F2j8k',
                title: 'Childish Gambino - 3005',
                thumbnail: 'https://img.youtube.com/vi/tG35R8F2j8k/maxresdefault.jpg',
                url: 'https://www.youtube.com/watch?v=tG35R8F2j8k&list=RDtG35R8F2j8k&start_radio=1'
            },
            {
                id: 'Dst9gZkq1a8',
                title: 'Travis Scott - Goosebumps',
                thumbnail: 'https://img.youtube.com/vi/Dst9gZkq1a8/maxresdefault.jpg',
                url: 'https://www.youtube.com/watch?v=Dst9gZkq1a8&list=RDDst9gZkq1a8&start_radio=1'
            },
            {
                id: 'bnFa4Mq5PAM',
                title: 'Lil Uzi Vert - 20 Min',
                thumbnail: 'https://img.youtube.com/vi/bnFa4Mq5PAM/maxresdefault.jpg',
                url: 'https://www.youtube.com/watch?v=bnFa4Mq5PAM&list=RDbnFa4Mq5PAM&start_radio=1'
            },
            {
                id: '7aUZtDaxS60',
                title: 'Metro Boomin ft. A$AP Rocky - Am I Dreaming',
                thumbnail: 'https://img.youtube.com/vi/7aUZtDaxS60/maxresdefault.jpg',
                url: 'https://www.youtube.com/watch?v=7aUZtDaxS60&list=PLc6njbSPwsMzI9yibh9pkA1pnlPI12fEm&index=2'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.container = document.getElementById('music-video-container');
        this.scrollElement = document.getElementById('music-video-scroll');
        this.trackElement = this.scrollElement?.querySelector('.music-video-track');
        this.titleElement = document.getElementById('music-video-title');
        
        if (!this.container || !this.scrollElement) {
            log(LOG_TYPE.WARNING, 'Music video container elements not found');
            return;
        }
        
        this.setupEventListeners();
        this.loadVideos();
    }
    
    setupEventListeners() {
        // Pause auto-scroll on hover
        if (this.scrollElement) {
            this.scrollElement.addEventListener('mouseenter', () => this.pauseAutoScroll());
            this.scrollElement.addEventListener('mouseleave', () => this.resumeAutoScroll());
        }
    }
    
    loadVideos() {
        // For now, use sample videos. In production, you would load from your provided URLs
        this.videos = [...this.sampleVideos];
        this.renderVideos();
        this.updateDisplay();
    }
    
    setVideos(videoUrls) {
        // Method to set custom video URLs
        this.videos = videoUrls.map((url, index) => {
            const videoId = this.extractVideoId(url);
            return {
                id: videoId,
                title: `Music Video ${index + 1}`,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                url: url
            };
        });
        this.renderVideos();
        this.updateDisplay();
    }
    
    extractVideoId(url) {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
        const match = url.match(regex);
        return match ? match[1] : 'dQw4w9WgXcQ'; // fallback
    }
    
    renderVideos() {
        if (!this.trackElement) return;
        
        this.trackElement.innerHTML = '';
        
        this.videos.forEach((video, index) => {
            const videoItem = document.createElement('div');
            videoItem.className = 'music-video-item';
            videoItem.dataset.index = index;
            
            videoItem.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}" class="music-video-thumbnail" onerror="this.src='https://via.placeholder.com/280x120/000000/0096ff?text=Video+${index + 1}'">
                <div class="music-video-overlay">
                    <div class="music-video-title-overlay">${video.title}</div>
                </div>
                <div class="music-video-play-icon">▶</div>
            `;
            
            videoItem.addEventListener('click', () => {
                this.currentIndex = index;
                this.updateDisplay();
                this.openCurrentVideo();
            });
            
            this.trackElement.appendChild(videoItem);
        });
    }
    
    show() {
        if (this.container) {
            this.container.classList.add('show');
            this.isVisible = true;
            this.startAutoScroll();
            log(LOG_TYPE.INFO, 'Music video container shown');
        }
    }
    
    hide() {
        if (this.container) {
            this.container.classList.remove('show');
            this.isVisible = false;
            this.stopAutoScroll();
            log(LOG_TYPE.INFO, 'Music video container hidden');
        }
    }
    
    nextVideo() {
        if (this.videos.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.videos.length;
        this.updateDisplay();
    }
    
    updateDisplay() {
        if (this.videos.length === 0) return;
        
        const currentVideo = this.videos[this.currentIndex];
        
        // Update track position
        if (this.trackElement) {
            const translateX = -this.currentIndex * 276; // 276px is the width of each video item
            this.trackElement.style.transform = `translateX(${translateX}px)`;
        }
        
        // Update active video
        const videoItems = this.trackElement?.querySelectorAll('.music-video-item');
        videoItems?.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update title
        if (this.titleElement) {
            this.titleElement.textContent = currentVideo.title;
        }
    }
    
    openCurrentVideo() {
        if (this.videos.length === 0) return;
        
        const currentVideo = this.videos[this.currentIndex];
        log(LOG_TYPE.INFO, `Opening video: ${currentVideo.title}`);
        
        // Play click sound
        this.playClickSound();
        
        // Open video in new tab
        window.open(currentVideo.url, '_blank');
        
        // Track for checklist
        checklistManager.completeTask('music-discovery');
    }
    
    startAutoScroll() {
        if (this.videos.length <= 1) return;
        
        this.stopAutoScroll(); // Clear any existing interval
        
        this.autoScrollInterval = setInterval(() => {
            this.nextVideo();
        }, this.scrollDuration);
        
        this.isAutoScrolling = true;
        log(LOG_TYPE.INFO, 'Music video auto-scroll started');
    }
    
    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
        this.isAutoScrolling = false;
        log(LOG_TYPE.INFO, 'Music video auto-scroll stopped');
    }
    
    pauseAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }
    
    resumeAutoScroll() {
        if (this.isAutoScrolling && this.videos.length > 1) {
            this.startAutoScroll();
        }
    }
    
    playClickSound() {
        Sfx.playClick();
    }
    
    setScrollDuration(duration) {
        this.scrollDuration = duration;
        if (this.isAutoScrolling) {
            this.startAutoScroll(); // Restart with new duration
        }
    }
}

// Initialize music video manager
const musicVideoManager = new MusicVideoManager();

/**
 * Food Manager Class - Similar to MusicVideoManager but for food places
 */
class FoodManager {
    constructor() {
        this.restaurants = [];
        this.currentIndex = 0;
        this.isAutoScrolling = false;
        this.autoScrollInterval = null;
        this.scrollDuration = 3500; // 3.5 seconds
        this.container = null;
        this.scrollElement = null;
        this.trackElement = null;
        this.titleElement = null;
        this.isVisible = false;
        
        // Food places from the provided URLs with logo images
        this.sampleRestaurants = [
            {
                id: 'texas-roadhouse',
                name: 'Texas Roadhouse',
                thumbnail: 'assets/logos/texas-roadhouse-logo.png', // Replace with actual logo
                fallbackThumbnail: 'https://via.placeholder.com/276x120/8B4513/FFFFFF?text=Texas+Roadhouse&font-size=16&font-weight=bold',
                url: 'https://www.texasroadhouse.com/'
            },
            {
                id: 'the-halls-kitchen',
                name: 'The Halls Kitchen',
                thumbnail: 'assets/logos/halls-kitchen-logo.png', // Replace with actual logo
                fallbackThumbnail: 'https://via.placeholder.com/276x120/FF6347/FFFFFF?text=The+Halls+Kitchen&font-size=16&font-weight=bold',
                url: 'https://thehallskitchen.com/'
            },
            {
                id: 'house-of-nanking',
                name: 'House of Nanking',
                thumbnail: 'assets/logos/house-of-nanking-logo.png', // Replace with actual logo
                fallbackThumbnail: 'https://via.placeholder.com/276x120/FFD700/000000?text=House+of+Nanking&font-size=16&font-weight=bold',
                url: 'https://www.houseofnankingsf.com/'
            },
            {
                id: 'in-n-out',
                name: 'In-N-Out Burger',
                thumbnail: 'assets/logos/in-n-out-logo.png', // Replace with actual logo
                fallbackThumbnail: 'https://via.placeholder.com/276x120/FF0000/FFFFFF?text=In-N-Out+Burger&font-size=16&font-weight=bold',
                url: 'https://www.in-n-out.com/'
            },
            {
                id: 'kitchen-324',
                name: 'Kitchen 324',
                thumbnail: 'assets/logos/kitchen-324-logo.png', // Replace with actual logo
                fallbackThumbnail: 'https://via.placeholder.com/276x120/32CD32/FFFFFF?text=Kitchen+324&font-size=16&font-weight=bold',
                url: 'https://www.kitchen324.com/'
            },
            {
                id: 'baked-bear',
                name: 'The Baked Bear',
                thumbnail: 'assets/logos/baked-bear-logo.png', // Replace with actual logo
                fallbackThumbnail: 'https://via.placeholder.com/276x120/8B4513/FFFFFF?text=The+Baked+Bear&font-size=16&font-weight=bold',
                url: 'https://www.thebakedbear.com/locations/norman/'
            },
            {
                id: 'tizos-pops',
                name: 'Tizos Pops',
                thumbnail: 'assets/logos/tizos-pops-logo.png', // Replace with actual logo
                fallbackThumbnail: 'https://via.placeholder.com/276x120/FF69B4/FFFFFF?text=Tizos+Pops&font-size=16&font-weight=bold',
                url: 'https://tizospops.com/'
            },
            {
                id: 'chick-fil-a',
                name: 'Chick-fil-A',
                thumbnail: 'assets/logos/chick-fil-a-logo.png', // Replace with actual logo
                fallbackThumbnail: 'https://via.placeholder.com/276x120/FF0000/FFFFFF?text=Chick-fil-A&font-size=16&font-weight=bold',
                url: 'https://www.chick-fil-a.com/'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.container = document.getElementById('food-container');
        this.scrollElement = document.getElementById('food-scroll');
        this.trackElement = this.scrollElement?.querySelector('.food-track');
        this.titleElement = document.getElementById('food-title');
        
        if (!this.container || !this.scrollElement) {
            log(LOG_TYPE.WARNING, 'Food container elements not found');
            return;
        }
        
        this.setupEventListeners();
        this.loadRestaurants();
    }
    
    setupEventListeners() {
        // Pause auto-scroll on hover
        if (this.scrollElement) {
            this.scrollElement.addEventListener('mouseenter', () => this.pauseAutoScroll());
            this.scrollElement.addEventListener('mouseleave', () => this.resumeAutoScroll());
        }
    }
    
    loadRestaurants() {
        // Use sample restaurants from the provided URLs
        this.restaurants = [...this.sampleRestaurants];
        this.renderRestaurants();
        this.updateDisplay();
    }
    
    setRestaurants(restaurantUrls) {
        // Method to set custom restaurant URLs
        this.restaurants = restaurantUrls.map((url, index) => {
            return {
                id: `restaurant-${index}`,
                name: `Restaurant ${index + 1}`,
                thumbnail: `https://via.placeholder.com/276x120/0096ff/FFFFFF?text=Restaurant+${index + 1}`,
                url: url
            };
        });
        this.renderRestaurants();
        this.updateDisplay();
    }
    
    renderRestaurants() {
        if (!this.trackElement) return;
        
        this.trackElement.innerHTML = '';
        
        this.restaurants.forEach((restaurant, index) => {
            const restaurantItem = document.createElement('div');
            restaurantItem.className = 'food-item';
            restaurantItem.dataset.index = index;
            
            restaurantItem.innerHTML = `
                <img src="${restaurant.thumbnail}" alt="${restaurant.name}" class="food-thumbnail" onerror="this.src='${restaurant.fallbackThumbnail}'">
                <div class="food-overlay">
                    <div class="food-title-overlay">${restaurant.name}</div>
                </div>
                <div class="food-visit-icon">🌐</div>
            `;
            
            restaurantItem.addEventListener('click', () => {
                this.currentIndex = index;
                this.updateDisplay();
                this.openCurrentRestaurant();
            });
            
            this.trackElement.appendChild(restaurantItem);
        });
    }
    
    show() {
        if (this.container) {
            this.container.classList.add('show');
            this.isVisible = true;
            this.startAutoScroll();
            log(LOG_TYPE.INFO, 'Food container shown');
        }
    }
    
    hide() {
        if (this.container) {
            this.container.classList.remove('show');
            this.isVisible = false;
            this.stopAutoScroll();
            log(LOG_TYPE.INFO, 'Food container hidden');
        }
    }
    
    nextRestaurant() {
        if (this.restaurants.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.restaurants.length;
        this.updateDisplay();
    }
    
    updateDisplay() {
        if (this.restaurants.length === 0) return;
        
        const currentRestaurant = this.restaurants[this.currentIndex];
        
        // Update track position
        if (this.trackElement) {
            const translateX = -this.currentIndex * 276; // 276px is the width of each food item
            this.trackElement.style.transform = `translateX(${translateX}px)`;
        }
        
        // Update active restaurant
        const restaurantItems = this.trackElement?.querySelectorAll('.food-item');
        restaurantItems?.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update title
        if (this.titleElement) {
            this.titleElement.textContent = currentRestaurant.name;
        }
    }
    
    openCurrentRestaurant() {
        if (this.restaurants.length === 0) return;
        
        const currentRestaurant = this.restaurants[this.currentIndex];
        if (currentRestaurant.url) {
            this.playClickSound();
            window.open(currentRestaurant.url, '_blank');
            log(LOG_TYPE.INFO, `Opening restaurant: ${currentRestaurant.name}`);
        }
    }
    
    pauseAutoScroll() {
        this.stopAutoScroll();
    }
    
    resumeAutoScroll() {
        if (this.isAutoScrolling && this.restaurants.length > 1) {
            this.startAutoScroll();
        }
    }
    
    startAutoScroll() {
        if (this.restaurants.length <= 1) return;
        
        this.stopAutoScroll(); // Clear any existing interval
        
        this.autoScrollInterval = setInterval(() => {
            this.nextRestaurant();
        }, this.scrollDuration);
        
        this.isAutoScrolling = true;
        log(LOG_TYPE.INFO, 'Food auto-scroll started');
    }
    
    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
        this.isAutoScrolling = false;
    }
    
    resumeAutoScroll() {
        if (this.isAutoScrolling && this.restaurants.length > 1) {
            this.startAutoScroll();
        }
    }
    
    playClickSound() {
        Sfx.playClick();
    }
    
    setScrollDuration(duration) {
        this.scrollDuration = duration;
        if (this.isAutoScrolling) {
            this.startAutoScroll(); // Restart with new duration
        }
    }
}

// Initialize food manager
const foodManager = new FoodManager();

// Experience popup manager for Experience -> AI Engineer
class ExperiencePopupManager {
    constructor() {
        this.aiContainer = null;
        this.seContainer = null;
        this.researchContainer = null;
    }

    init() {
        this.aiContainer = document.getElementById('experience-ai-container');
        this.seContainer = document.getElementById('experience-se-container');
        this.researchContainer = document.getElementById('experience-research-container');
    }

    showAI() {
        if (!this.aiContainer) this.init();
        if (this.aiContainer) {
            this.aiContainer.classList.add('show');
        }
    }

    hideAI() {
        if (!this.aiContainer) this.init();
        if (this.aiContainer) {
            this.aiContainer.classList.remove('show');
        }
    }

    showSE() {
        if (!this.seContainer) this.init();
        if (this.seContainer) {
            this.seContainer.classList.add('show');
        }
    }

    hideSE() {
        if (!this.seContainer) this.init();
        if (this.seContainer) {
            this.seContainer.classList.remove('show');
        }
    }

    showResearch() {
        if (!this.researchContainer) this.init();
        if (this.researchContainer) {
            this.researchContainer.classList.add('show');
        }
    }

    hideResearch() {
        if (!this.researchContainer) this.init();
        if (this.researchContainer) {
            this.researchContainer.classList.remove('show');
        }
    }
}

const experiencePopupManager = new ExperiencePopupManager();

/**
 * URL mapping for sub-menu items
 * Add your URLs here for each sub-menu item
 */
const SUB_MENU_URLS = {
    // Home sub-menu items
    'create-user': 'modal', // Special action to open modal
    'fernando-profile': 'profile', // Special action for profile view
    
    // Settings sub-menu items
    'change-language': 'language-toggle', // Special action to toggle language
    'change-theme': 'theme-toggle', // Special action to open theme modal
    
    // Experience sub-menu items
    'ai-engineer': 'https://xvector.us/',
    'software-engineer': 'https://xvector.us/',
    'research': 'https://cs.ou.edu/~mabdulhak/bookproject.html',
    
    // Network sub-menu items
    'resume': 'assets/docs/Fernando Franco Jr - SWE_Cloud_AI.pdf?v=' + Date.now(),
    'linkedin': 'https://www.linkedin.com/in/fernando-franco-jr/',
    'github': 'https://github.com/fernandofrancojr811',
    'internet-browser': null, // No action
    'overleaf': 'https://github.com/emanuelhix/overleaf-ou',
    'calorie-calc': 'https://github.com/fernandofrancojr811/CalorieTrackerApp',
    'ai-bot': null, // No action
    'web-scraper': 'https://github.com/fernandofrancojr811/fovus',

    
    // About Me sub-menu items
    'youtube': 'https://www.youtube.com/watch?v=xnP7qKxwzjg&list=RDxnP7qKxwzjg&start_radio=1',
    'favorite-eats': null, // No action
    
    // Awards sub-menu items
    'hsf-scholar': 'https://www.hsf.net/',
    'cs-scholar': 'https://cs-includes.oucreate.com/',
    'boeing-scholar': 'https://www.oklahoman.com/story/business/columns/2019/12/17/boeing-grants-45000-to-support-concurrent-enrollment/60413658007/',
    'edward-grisso-scholar': null, // No action
    'loyle-miller-scholar': null, // No action
    'sooner-traditions-scholar': null, // No action
};

/**
 * Handles Enter key press to navigate to URLs
 */
function handleEnterPress() {
    const activeMenuItem = getActiveMenuItem();
    
    // Check if there are sub-menu items
    if (activeMenuItem.subMenuItemCount === NO_SUB_MENU_ITEM_COUNT) {
        log(LOG_TYPE.WARNING, 'No sub menu items to navigate');
        return;
    }
    
    // Get the active sub-menu item
    const subMenuItems = Array.from(activeMenuItem.subMenuItemContainer.children);
    const activeSubMenuItem = subMenuItems[activeMenuItem.activeSubMenuItemIndex];
    if (!activeSubMenuItem) {
        log(LOG_TYPE.WARNING, 'No active sub-menu item found');
        return;
    }
    
    // Get the data-translate attribute or text content as fallback
    const subMenuItemHeader = activeSubMenuItem.querySelector('.sub-menu-item-header');
    const translateKey = subMenuItemHeader.getAttribute('data-translate');
    const itemText = subMenuItemHeader.textContent.trim();
    
    // Use translate key if available, otherwise use text content
    const lookupKey = translateKey || itemText;
    
    // Get the URL for this item
    let url = SUB_MENU_URLS[lookupKey];

    // Fallback: detect action from visible text across supported languages
    if (!url) {
        const lowerText = itemText.toLowerCase();
        const isLanguage = (
            lowerText.includes('language') || // EN
            lowerText.includes('idioma')   || // ES
            lowerText.includes('langue')   || // FR
            lowerText.includes('sprache')     // DE
        );
        const isTheme = (
            lowerText.includes('theme')   || // EN
            lowerText.includes('tema')    || // ES
            lowerText.includes('thème')   || // FR
            lowerText.includes('design')     // DE (Design)
        );

        if (isLanguage) {
            url = 'language-toggle';
        } else if (isTheme) {
            url = 'theme-toggle';
        }
    }
    
    if (url === 'modal') {
        // Special case for modal
        if (lookupKey === 'create-user' || itemText.includes('Create New User') || itemText.includes('Crear') || itemText.includes('Créer') || itemText.includes('Erstellen')) {
            openCreateUserModal();
        }
    } else if (url === 'language-toggle') {
        // Special case for language toggle
        openLanguageModal();
    } else if (url === 'theme-toggle') {
        // Special case for theme toggle
        console.log('Theme toggle triggered');
        openThemeModal();
    } else if (url === 'profile') {
        // Special case for profile view
        const userId = activeSubMenuItem.dataset.userId;
        if (userId) {
            // Handle user profile click
            handleUserProfileClick(userId, itemText);
        } else {
            // Handle Fernando Franco Jr. profile
            handleUserProfileClick(null, itemText);
        }
    } else if (url) {
        log(LOG_TYPE.INFO, `Navigating to: ${url}`);
        // Play click sound
        Sfx.playClick();
        // Track external link visits for checklist
        trackExternalLinkVisit(lookupKey);
        // Open URL in new tab
        window.open(url, '_blank');
    } else {
        log(LOG_TYPE.INFO, `No URL defined for: ${lookupKey}`);
        // Play click sound even if no action
        Sfx.playClick();
    }
}

/**
 * Handle user profile click
 */
function handleUserProfileClick(userId, userName) {
    if (userId) {
        // Find the user by ID
        const users = userManager.getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
            log(LOG_TYPE.INFO, `Viewing profile: ${user.name}`);
            Sfx.playClick();
            alert(`Profile: ${user.name}\nIcon: ${user.icon}\nCreated: ${new Date(user.createdAt).toLocaleDateString()}`);
        }
    } else {
        // Handle Fernando Franco Jr. profile
        log(LOG_TYPE.INFO, `Viewing profile: ${userName}`);
        Sfx.playClick();
        alert(`Profile: ${userName}\nThis is the main portfolio profile.`);
    }
}

/**
 * Track external link visits for checklist completion
 */
function trackExternalLinkVisit(lookupKey) {
    const linkMapping = {
        'research': 'visit-research',
        'youtube': 'music-discovery',
        'linkedin': 'linkedin-visit',
        'github': 'github-visit'
    };
    
    const taskId = linkMapping[lookupKey];
    if (taskId) {
        setTimeout(() => {
            checklistManager.completeTask(taskId);
            // Check for Social Butterfly achievement
            checkSocialButterflyAchievement();
        }, 1000); // Delay to ensure the link opens
    }
}

/**
 * Check if Social Butterfly achievement should be unlocked
 * Tracks LinkedIn and GitHub visits directly
 */
function checkSocialButterflyAchievement() {
    const linkedinVisited = checklistManager.isTaskCompleted('linkedin-visit');
    const githubVisited = checklistManager.isTaskCompleted('github-visit');
    
    if (linkedinVisited && githubVisited && !checklistManager.isTaskCompleted('social-butterfly')) {
        checklistManager.completeTask('social-butterfly');
        log(LOG_TYPE.INFO, 'Social Butterfly achievement unlocked!');
        
        // Show achievement notification
        setTimeout(() => {
            alert('🦋 Achievement Unlocked!\n\nSocial Butterfly\nYou visited both LinkedIn and GitHub!');
        }, 1000);
    }
}

/**
 * Modal management functions
 */
function openCreateUserModal() {
    const modal = document.getElementById('create-user-modal');
    if (modal) {
        modal.classList.add('show');
        
        // Apply current theme colors to the modal
        const colors = themeManager.getCurrentThemeColors();
        themeManager.updateModalColors(colors);
        
        // Populate icon grid
        populateIconGrid();
        
        // Focus on first input
        const firstInput = modal.querySelector('input[type="text"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
        Sfx.playClick();
        log(LOG_TYPE.INFO, 'Create User modal opened');
    }
}

function closeCreateUserModal() {
    const modal = document.getElementById('create-user-modal');
    if (modal) {
        modal.classList.remove('show');
        
        // Reset form
        const form = document.getElementById('user-form');
        if (form) {
            form.reset();
        }
        
        // Reset icon selection
        const selectedIconInput = document.getElementById('selected-icon');
        if (selectedIconInput) {
            selectedIconInput.value = '';
        }
        
        // Remove selected class from all icon options
        const allIconOptions = document.querySelectorAll('.icon-option');
        allIconOptions.forEach(option => option.classList.remove('selected'));
        
        Sfx.playClick();
        log(LOG_TYPE.INFO, 'Create User modal closed');
    }
}

function handleUserCreation() {
    const form = document.getElementById('user-form');
    const formData = new FormData(form);
    
    const userData = {
        name: formData.get('username'),
        icon: formData.get('selected-icon')
    };
    
    // Basic validation
    if (!userData.name) {
        log(LOG_TYPE.WARNING, 'Name is required');
        alert('Please enter your name!');
        return;
    }
    
    // Check if icon is selected
    if (!userData.icon) {
        log(LOG_TYPE.WARNING, 'Please select an icon');
        alert('Please select a profile icon!');
        return;
    }
    
    // Check if name already exists
    const existingUsers = userManager.getUsers();
    if (existingUsers.some(user => user.name === userData.name)) {
        log(LOG_TYPE.WARNING, 'Name already exists');
        alert('This name is already taken! Please choose a different name.');
        return;
    }
    
    try {
        // Create the user
        const newUser = userManager.createUser(userData);
        
        // Add user to the menu
        const subMenuItem = addUserToMenu(newUser);
        
        // Remember the last created user's id for trophy star animation later
        try { localStorage.setItem('portfolio-last-created-user', newUser.id); } catch (e) {}
        
        // Complete the checklist task
        checklistManager.completeTask('create-user');
        
        // Close modal
        closeCreateUserModal();
        
        // Show success message
        log(LOG_TYPE.INFO, `User created successfully: ${newUser.name}`);
        alert(`Welcome ${newUser.name}! Your profile has been created successfully.`);
        
    } catch (error) {
        log(LOG_TYPE.ERROR, `Error creating user: ${error.message}`);
        alert('Error creating user. Please try again.');
    }
}

/**
 * Create a sub-menu item for a user
 */
function createUserSubMenuItem(user) {
    const subMenuItem = document.createElement('div');
    subMenuItem.className = 'sub-menu-item';
    subMenuItem.dataset.userId = user.id;
    
    // Icon container to hold icon and star badge
    const iconContainer = document.createElement('div');
    iconContainer.className = 'sub-menu-item-icon-container';
    
    const icon = document.createElement('img');
    icon.className = 'sub-menu-item-icon';
    icon.src = user.icon;
    icon.alt = user.name;
    
    // Gold star badge for newly created profile
    const star = document.createElement('div');
    star.className = 'new-user-star';
    star.id = `new-user-star-${user.id}`;
    star.textContent = '★';
    
    iconContainer.appendChild(icon);
    iconContainer.appendChild(star);
    
    const header = document.createElement('div');
    header.className = 'sub-menu-item-header';
    header.textContent = user.name;
    
    subMenuItem.appendChild(iconContainer);
    subMenuItem.appendChild(header);
    
    return subMenuItem;
}

/**
 * Add user to the Home menu
 */
function addUserToMenu(user) {
    const homeMenuItem = document.querySelector('.menu-item:first-child');
    const subMenuContainer = homeMenuItem.querySelector('.sub-menu-item-container');
    
    if (subMenuContainer) {
        // Create the user sub-menu item
        const userSubMenuItem = createUserSubMenuItem(user);
        
        // Insert before the "Create New User" item (which should be first)
        const createUserItem = subMenuContainer.querySelector('.sub-menu-item:first-child');
        if (createUserItem) {
            subMenuContainer.insertBefore(userSubMenuItem, createUserItem);
        } else {
            subMenuContainer.appendChild(userSubMenuItem);
        }
        
        // Update menu data structure
        const homeMenuData = menuItemsData[0]; // Home is the first menu item
        if (homeMenuData) {
            homeMenuData.subMenuItemCount++;
        }
        
        log(LOG_TYPE.INFO, `User ${user.name} added to menu`);
        return userSubMenuItem;
    }
}

/**
 * Load existing users into the menu
 */
function loadUsersIntoMenu() {
    // Clear existing dynamically added user sub-menu items to avoid duplicates
    try {
        const homeMenuItem = document.querySelector('.menu-item:first-child');
        const subMenuContainer = homeMenuItem?.querySelector('.sub-menu-item-container');
        if (subMenuContainer) {
            const existingUserItems = subMenuContainer.querySelectorAll('.sub-menu-item[data-user-id]');
            existingUserItems.forEach(item => item.remove());
            // Reset subMenuItemCount to account for the two static entries (Create New User + Fernando Franco Jr.)
            const homeMenuData = menuItemsData[0];
            if (homeMenuData) {
                homeMenuData.subMenuItemCount = 2;
            }
        }
    } catch (e) {}

    const users = userManager.getUsers();
    users.forEach(user => {
        addUserToMenu(user);
    });
}

/**
 * Populate icon selection grid with available icons
 */
function populateIconGrid() {
    const iconGrid = document.getElementById('icon-selection-grid');
    if (!iconGrid) return;
    
    // List of available avatar icons
    const availableIcons = [
        'assets/icons/avatars/apple.png',
        'assets/icons/avatars/bee.png',
        'assets/icons/avatars/book-new.png',
        'assets/icons/avatars/bottle.png',
        'assets/icons/avatars/camera-new.png',
        'assets/icons/avatars/clock-pfp.png',
        'assets/icons/avatars/controller.png',
        'assets/icons/avatars/dog-new.png',
        'assets/icons/avatars/gummybear.png',
        'assets/icons/avatars/heart.png',
        'assets/icons/avatars/note.png',
        'assets/icons/avatars/penguin-new.png',
        'assets/icons/avatars/rose.png',
        'assets/icons/avatars/star.png',
        'assets/icons/avatars/sunflower.png',
        'assets/icons/avatars/yinyang.png',
        // Legacy BW avatars
        'assets/icons/avatars/bw-book.png',
        'assets/icons/avatars/bw-dog.png',
        'assets/icons/avatars/bw-penguin.png'
    ];
    
    // Clear existing content
    iconGrid.innerHTML = '';
    
    // Create icon options
    availableIcons.forEach(iconPath => {
        const iconOption = document.createElement('div');
        iconOption.className = 'icon-option';
        iconOption.dataset.iconPath = iconPath;
        
        const img = document.createElement('img');
        img.src = iconPath;
        img.alt = 'Icon';
        img.onerror = () => {
            // Hide broken images
            iconOption.style.display = 'none';
        };
        
        iconOption.appendChild(img);
        iconGrid.appendChild(iconOption);
        
        // Add click event listener
        iconOption.addEventListener('click', () => selectIcon(iconOption, iconPath));
    });
}

/**
 * Handle icon selection
 */
function selectIcon(iconOption, iconPath) {
    // Remove selected class from all icon options
    const allIconOptions = document.querySelectorAll('.icon-option');
    allIconOptions.forEach(option => option.classList.remove('selected'));
    
    // Add selected class to clicked option
    iconOption.classList.add('selected');
    
    // Update hidden input with selected icon path
    const selectedIconInput = document.getElementById('selected-icon');
    if (selectedIconInput) {
        selectedIconInput.value = iconPath;
    }
    
    // Play click sound
    Sfx.playClick();
    
    log(LOG_TYPE.INFO, `Icon selected: ${iconPath}`);
}

/**
 * Initialize modal event listeners
 */
function initializeModalEvents() {
    // Modal close buttons
    const modalClose = document.getElementById('modal-close');
    const btnCancel = document.getElementById('btn-cancel');
    const btnCreate = document.getElementById('btn-create');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeCreateUserModal);
    }
    
    if (btnCancel) {
        btnCancel.addEventListener('click', closeCreateUserModal);
    }
    
    if (btnCreate) {
        btnCreate.addEventListener('click', handleUserCreation);
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const modal = document.getElementById('create-user-modal');
            if (modal && modal.classList.contains('show')) {
                closeCreateUserModal();
            }
        }
    });
    
    // Close modal on overlay click
    const modalOverlay = document.getElementById('create-user-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeCreateUserModal();
            }
        });
    }
    
    // Handle form submission
    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', (event) => {
            event.preventDefault();
            handleUserCreation();
        });
    }
}

/**
 * Initialize language modal event listeners
 */
function initializeLanguageModalEvents() {
    // Language modal close buttons
    const languageModalClose = document.getElementById('language-modal-close');
    const languageBtnCancel = document.getElementById('language-btn-cancel');
    const languageBtnSelect = document.getElementById('language-btn-select');
    
    if (languageModalClose) {
        languageModalClose.addEventListener('click', closeLanguageModal);
    }
    
    if (languageBtnCancel) {
        languageBtnCancel.addEventListener('click', closeLanguageModal);
    }
    
    if (languageBtnSelect) {
        languageBtnSelect.addEventListener('click', applyLanguageSelection);
    }
    
    // Close language modal on escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const languageModal = document.getElementById('language-modal');
            if (languageModal && languageModal.classList.contains('show')) {
                closeLanguageModal();
            }
        }
    });
    
    // Language modal navigation
    document.addEventListener('keydown', (event) => {
        const languageModal = document.getElementById('language-modal');
        if (languageModal && languageModal.classList.contains('show')) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                navigateLanguageOptions(event.key === 'ArrowRight' ? 1 : -1);
            } else if (event.key === 'Enter') {
                // Ignore the same Enter that opened the modal
                if (suppressModalEnter) {
                    suppressModalEnter = false;
                    event.preventDefault();
                    return;
                }
                event.preventDefault();
                applyLanguageSelection();
            }
        }
    });
    
    // Close language modal on overlay click
    const languageModalOverlay = document.getElementById('language-modal');
    if (languageModalOverlay) {
        languageModalOverlay.addEventListener('click', (event) => {
            if (event.target === languageModalOverlay) {
                closeLanguageModal();
            }
        });
    }
}

/**
 * Initialize theme modal event listeners
 */
// Theme modal navigation variables
let selectedThemeIndex = 0;
let themeOptions = [];

// Language modal navigation variables
let selectedLanguageIndex = 0;
let languageOptions = [];
// Guard to prevent immediate Enter inside modal right after opening
let suppressModalEnter = false;

function initializeThemeModalEvents() {
    // Theme modal close buttons
    const themeModalClose = document.getElementById('theme-modal-close');
    const themeBtnCancel = document.getElementById('theme-btn-cancel');
    const themeBtnSelect = document.getElementById('theme-btn-select');
    
    if (themeModalClose) {
        themeModalClose.addEventListener('click', closeThemeModal);
    }
    
    if (themeBtnCancel) {
        themeBtnCancel.addEventListener('click', closeThemeModal);
    }
    
    if (themeBtnSelect) {
        themeBtnSelect.addEventListener('click', () => {
            console.log('Theme select button clicked');
            applyThemeSelection();
        });
    }
    
    // Close theme modal on escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const themeModal = document.getElementById('theme-modal');
            if (themeModal && themeModal.classList.contains('show')) {
                closeThemeModal();
            }
        }
    });
    
    // Theme modal navigation
    document.addEventListener('keydown', (event) => {
        const themeModal = document.getElementById('theme-modal');
        if (themeModal && themeModal.classList.contains('show')) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                navigateThemeOptions(event.key === 'ArrowRight' ? 1 : -1);
            } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault();
                const columns = calculateThemeGridColumns();
                const direction = event.key === 'ArrowDown' ? columns : -columns;
                navigateThemeOptions(direction);
            } else if (event.key === 'Enter') {
                // Ignore the same Enter that opened the modal
                if (suppressModalEnter) {
                    suppressModalEnter = false;
                    event.preventDefault();
                    return;
                }
                event.preventDefault();
                applyThemeSelection();
            }
        }
    });
    
    // Close theme modal on overlay click
    const themeModalOverlay = document.getElementById('theme-modal');
    if (themeModalOverlay) {
        themeModalOverlay.addEventListener('click', (event) => {
            if (event.target === themeModalOverlay) {
                closeThemeModal();
            }
        });
    }
}

/**
 * waits for all transitions to complete
 * !IMPORTANT!: If all transitions are not awaited, 
 * this causes some elements not position correctly. 
 * Very crucial function for the transitions.
 * @param {any[]} elements 
 */
function waitForAllTransitions(elements) {
    return new Promise((resolve) => {
        let completedTransitions = 0;
        const totalTransitions = elements.length;

        const onTransitionEnd = (event) => {
            completedTransitions++;
            if (completedTransitions === totalTransitions) {
                elements.forEach((el) => el.removeEventListener('transitionend', onTransitionEnd));
                resolve();
            }
        };

        elements.forEach((element) => {
            element.addEventListener('transitionend', onTransitionEnd);
        });
    });
}

/**
 * Setup active menu item at startup
 */
function setupActiveMenuItem() {
    const activeMenuItem = document.querySelector('.menu-item');
    activeMenuItem.classList.add('active-menu-item');
}

/**
 * Setup active sub menu items at startup
 */
function setupActiveSubMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((menuItem) => {
        const subMenuItemContainer = menuItem.querySelector('.sub-menu-item-container');
        //Check if menu item has sub menu items
        if (!subMenuItemContainer || subMenuItemContainer.children.length === 0) {
            return;
        }
        const firstSubMenuItem = subMenuItemContainer.children[0];
        firstSubMenuItem.classList.add('active-sub-menu-item');
        
        // Apply theme colors to the first active sub-menu item
        const colors = themeManager.getCurrentThemeColors();
        const header = firstSubMenuItem.querySelector('.sub-menu-item-header');
        if (header) {
            header.style.textShadow = `0 0 10px ${colors.glow}`;
        }
    });
}

/**
 * Setup date and time display
 */
function setupDateTimeDisplay() {
    const dateTimeElement = document.querySelector('#date-time-display');
    const retroTimeElement = document.querySelector('#retro-time-display');
    
    function updateDateTime() {
        const now = new Date();
        const options = { 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        };
        const dateTimeString = now.toLocaleDateString('en-US', options);
        if (dateTimeElement) {
            dateTimeElement.textContent = dateTimeString;
        }
        
        // Retro taskbar time format
        if (retroTimeElement) {
            const retroOptions = {
                weekday: 'short',
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            };
            const retroTimeString = now.toLocaleDateString('en-US', retroOptions);
            retroTimeElement.textContent = retroTimeString;
        }
    }
    
    // Update immediately
    updateDateTime();
    
    // Update every minute
    setInterval(updateDateTime, 60000);
}

// Font loading detection
function checkFontLoaded() {
    if ('fonts' in document) {
        document.fonts.load("22px DepartureMono").then(() => {
            const banner = document.querySelector('#loading-banner');
            if (banner) {
                banner.classList.add('departure-mono-loaded');
            }
        }).catch(() => {
            console.log('DepartureMono font failed to load');
        });
    }
}

buildMenuItemsData();
addBodyListener();
setupDateTimeDisplay();
checkFontLoaded();
initializeModalEvents();
initializeLanguageModalEvents();
initializeThemeModalEvents();

// Initialize main content only after banner is hidden
let isMainInitialized = false;
function initializeMainContent() {
    if (!isMainInitialized) {
        setupActiveMenuItem();
        setupActiveSubMenuItems();
        // Load existing users into the menu
        loadUsersIntoMenu();
        // Checklist is already initialized when the page loads
        // Initialize city guessing game
        initializeCityGuessingGame();
        // Initialize corgi hunt
        initializeCorgiHunt();
        // Pre-load music and food containers for About Me section
        preloadAboutMeContainers();
        isMainInitialized = true;
    } else {
        // Ensure users are synced without duplication when re-entering
        loadUsersIntoMenu();
    }
    // Apply current theme colors to all UI elements
    const colors = themeManager.getCurrentThemeColors();
    themeManager.applyThemeColors(colors);
    
    // If platinum achieved earlier, ensure star is shown on last created user
    try {
        if (localStorage.getItem('portfolio-platinum-achieved') === 'true') {
            triggerNewUserStar();
        }
    } catch (e) {}
}

/**
 * Pre-load About Me containers to ensure they're ready immediately
 */
function preloadAboutMeContainers() {
    if (musicVideoManager && !musicVideoManager.videos.length) {
        musicVideoManager.loadVideos();
        log(LOG_TYPE.INFO, 'Pre-loaded music videos');
    }
    if (foodManager && !foodManager.restaurants.length) {
        foodManager.loadRestaurants();
        log(LOG_TYPE.INFO, 'Pre-loaded food restaurants');
    }
}

/**
 * Initialize city guessing game
 */
function initializeCityGuessingGame() {
    const cityInput = document.querySelector('.city-guess-input');
    if (!cityInput) return;
    
    cityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            checkCityGuess(cityInput.value.trim());
        }
    });
    
    // Also check on input change for immediate feedback
    cityInput.addEventListener('input', (event) => {
        const guess = event.target.value.trim().toLowerCase();
        if (guess === 'san francisco' || guess === 'san fran' || guess === 'sf') {
            checkCityGuess(guess);
        }
    });
}

/**
 * Check if the city guess is correct
 */
function checkCityGuess(guess) {
    const correctAnswers = ['san francisco', 'san fran', 'sf'];
    const normalizedGuess = guess.toLowerCase();
    
    if (correctAnswers.includes(normalizedGuess)) {
        // Correct answer!
        checklistManager.completeTask('find-city');
        
        // Show success message
        const cityInput = document.querySelector('.city-guess-input');
        if (cityInput) {
            cityInput.value = 'San Francisco ✓';
            cityInput.style.color = '#00ff00';
            cityInput.style.borderColor = '#00ff00';
            cityInput.disabled = true;
        }
        
        // Play success sound
        Sfx.playClick();
        
        // Show achievement notification
        setTimeout(() => {
            alert('🏆 Achievement Unlocked!\n\nCity Explorer\nYou found my favorite city: San Francisco!');
        }, 500);
        
        log(LOG_TYPE.INFO, 'City guessing game completed successfully');
    } else {
        // Wrong answer - give a hint
        const cityInput = document.querySelector('.city-guess-input');
        if (cityInput) {
            cityInput.style.borderColor = '#ff0000';
            cityInput.style.color = '#ff0000';
            
            // Reset styling after a moment
            setTimeout(() => {
                cityInput.style.borderColor = '#0096ff';
                cityInput.style.color = '#fff';
            }, 1000);
        }
        
        // Give hints based on the guess
        let hint = '';
        if (normalizedGuess.includes('new york') || normalizedGuess.includes('nyc')) {
            hint = 'Not New York! Think West Coast...';
        } else if (normalizedGuess.includes('los angeles') || normalizedGuess.includes('la')) {
            hint = 'Close! But think a bit more north...';
        } else if (normalizedGuess.includes('seattle')) {
            hint = 'Getting warmer! A bit more south...';
        } else {
            hint = 'Try again! Hint: It\'s a famous city in California...';
        }
        
        alert(hint);
        log(LOG_TYPE.INFO, `Incorrect city guess: ${guess}`);
    }
}


/**
 * Check for Konami code sequence
 */
function checkKonamiCode(key) {
    // Add the current key to the sequence
    konamiCode.push(key);
    
    // Keep only the last 10 keys
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    // Debug logging
    console.log('Konami code progress:', konamiCode);
    
    // Check if the sequence matches
    if (konamiCode.length === konamiSequence.length) {
        let isMatch = true;
        for (let i = 0; i < konamiSequence.length; i++) {
            if (konamiCode[i] !== konamiSequence[i]) {
                isMatch = false;
                break;
            }
        }
        
        console.log('Konami sequence match:', isMatch);
        console.log('Expected:', konamiSequence);
        console.log('Received:', konamiCode);
        
        if (isMatch && !checklistManager.isTaskCompleted('konami-master')) {
            checklistManager.completeTask('konami-master');
            log(LOG_TYPE.INFO, 'Konami Master achievement unlocked!');
            
            // Show achievement notification
            setTimeout(() => {
                alert('🎮 Achievement Unlocked!\n\nKonami Master\nYou entered the secret code!');
            }, 500);
            
            // Reset the sequence
            konamiCode = [];
        }
    }
}

/**
 * Initialize corgi hunt game
 */
function initializeCorgiHunt() {
    const hiddenCorgis = document.querySelectorAll('.hidden-corgi');
    hiddenCorgis.forEach(corgi => {
        corgi.addEventListener('click', (event) => {
            event.stopPropagation();
            handleCorgiFound(corgi);
        });
    });
}

/**
 * Handle when a corgi is found
 */
function handleCorgiFound(corgiElement) {
    const location = corgiElement.dataset.corgiLocation;
    
    // Mark this corgi as found
    corgiElement.classList.add('found');
    
    // Play sound
    Sfx.playClick();
    
    // Show found message
    const locationNames = {
        'menu': 'Awards Menu',
        'background': 'Navigation Legend'
    };
    
    alert(`🐕 Corgi Found!\n\nYou found Leaf in the ${locationNames[location] || location} section!`);
    
    // Check if all corgis are found
    checkCorgiHunterAchievement();
    
    log(LOG_TYPE.INFO, `Corgi found in ${location} section`);
}

/**
 * Check if Corgi Hunter achievement should be unlocked
 */
function checkCorgiHunterAchievement() {
    const foundCorgis = document.querySelectorAll('.hidden-corgi.found');
    const totalCorgis = document.querySelectorAll('.hidden-corgi').length;
    
    if (foundCorgis.length === totalCorgis && totalCorgis > 0) {
        checklistManager.completeTask('corgi-hunter');
        log(LOG_TYPE.INFO, 'Corgi Hunter achievement unlocked!');
        
        // Show achievement notification
        setTimeout(() => {
            alert('🏆 Achievement Unlocked!\n\nCorgi Hunter\nYou found all the hidden corgis!');
        }, 1000);
    }
}

/**
 * Open language selection modal
 */
function openLanguageModal() {
    const modal = document.getElementById('language-modal');
    
    if (modal) {
        suppressModalEnter = true;
        modal.classList.add('show');
        
        // Apply current theme colors to the modal
        const colors = themeManager.getCurrentThemeColors();
        themeManager.updateModalColors(colors);
        
        // Populate language grid
        populateLanguageGrid();
        
        // Focus on first language option
        const firstLanguage = modal.querySelector('.language-option');
        if (firstLanguage) {
            setTimeout(() => firstLanguage.focus(), 100);
        }
        Sfx.playClick();
        log(LOG_TYPE.INFO, 'Language selection modal opened');
    }
}

/**
 * Close language selection modal
 */
function closeLanguageModal() {
    const modal = document.getElementById('language-modal');
    if (modal) {
        modal.classList.remove('show');
        
        // Reset selection
        const selectedLanguage = modal.querySelector('.language-option.selected');
        if (selectedLanguage) {
            selectedLanguage.classList.remove('selected');
        }
        
        Sfx.playClick();
        log(LOG_TYPE.INFO, 'Language selection modal closed');
    }
}

/**
 * Populate language selection grid
 */
function populateLanguageGrid() {
    const languageGrid = document.getElementById('language-selection-grid');
    if (!languageGrid) return;
    
    // Clear existing content
    languageGrid.innerHTML = '';
    
    // Create language options
    const langCodes = Object.keys(languages);
    languageOptions = langCodes; // Store for navigation
    selectedLanguageIndex = 0; // Reset selection
    
    langCodes.forEach((langCode, index) => {
        const languageInfo = languages[langCode];
        const isCurrentLanguage = langCode === currentLanguage;
        
        const languageOption = document.createElement('div');
        languageOption.className = `language-option ${isCurrentLanguage ? 'selected' : ''}`;
        languageOption.dataset.languageCode = langCode;
        
        const flag = document.createElement('div');
        flag.className = 'language-flag';
        flag.textContent = languageInfo.flag;
        
        const name = document.createElement('div');
        name.className = 'language-name';
        name.textContent = languageInfo.name;
        
        languageOption.appendChild(flag);
        languageOption.appendChild(name);
        languageGrid.appendChild(languageOption);
        
        // Track current language index
        if (isCurrentLanguage) {
            selectedLanguageIndex = index;
        }
        
        // Add click event listener
        languageOption.addEventListener('click', () => selectLanguage(languageOption, langCode));
    });
    
    // Update visual selection
    updateLanguageSelection();
}

/**
 * Navigate language options with arrow keys
 */
function navigateLanguageOptions(direction) {
    if (languageOptions.length === 0) return;
    
    // Update selected index
    selectedLanguageIndex += direction;
    
    // Wrap around
    if (selectedLanguageIndex < 0) {
        selectedLanguageIndex = languageOptions.length - 1;
    } else if (selectedLanguageIndex >= languageOptions.length) {
        selectedLanguageIndex = 0;
    }
    
    // Update visual selection
    updateLanguageSelection();
    
    // Play navigation sound
    Sfx.playClick();
}

/**
 * Update language selection visual state
 */
function updateLanguageSelection() {
    const allLanguageOptions = document.querySelectorAll('.language-option');
    allLanguageOptions.forEach((option, index) => {
        option.classList.toggle('selected', index === selectedLanguageIndex);
    });
}

/**
 * Handle language selection
 */
function selectLanguage(languageOption, langCode) {
    // Find the index of the selected language
    const langIndex = languageOptions.findIndex(code => code === langCode);
    if (langIndex !== -1) {
        selectedLanguageIndex = langIndex;
    }
    
    // Update visual selection
    updateLanguageSelection();
    
    // Play click sound
    Sfx.playClick();
    
    log(LOG_TYPE.INFO, `Language selected: ${languages[langCode].name}`);
}

/**
 * Apply selected language
 */
function applyLanguageSelection() {
    if (languageOptions.length === 0 || selectedLanguageIndex < 0 || selectedLanguageIndex >= languageOptions.length) {
        return;
    }
    
    const langCode = languageOptions[selectedLanguageIndex];
    const languageInfo = languages[langCode];
    
    if (languageInfo) {
        currentLanguage = langCode;
        
        // Apply translations to the UI
        applyTranslations(langCode);
        
        // Close modal
        closeLanguageModal();
        
        // Show success message
        log(LOG_TYPE.INFO, `Language changed to: ${languageInfo.name}`);
    }
}

/**
 * Apply translations to the UI elements
 */
function applyTranslations(langCode) {
    const translation = translations[langCode];
    if (!translation) {
        return;
    }
    
    // Update banner content
    updateBannerContent(translation);
    
    // Update menu items
    updateMenuItems(translation);
    
    // Update navigation legend
    updateNavigationLegend(translation);
    
    // Update checklist
    updateChecklist(translation);
    
    log(LOG_TYPE.INFO, `Applied translations for language: ${langCode}`);
}

/**
 * Update banner content with translations
 */
function updateBannerContent(translation) {
    // Update elements with data-translate attributes,
    // but skip legend lines to preserve their icons.
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    elementsToTranslate.forEach(element => {
        if (element.classList.contains('legend-line')) {
            return; // handled separately by updateNavigationLegend
        }
        const key = element.getAttribute('data-translate');
        if (translation[key]) {
            element.textContent = translation[key];
        }
    });
    
    // Update placeholder attributes
    const elementsWithPlaceholder = document.querySelectorAll('[data-translate-placeholder]');
    elementsWithPlaceholder.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translation[key]) {
            element.placeholder = translation[key];
        }
    });
}

/**
 * Update menu items with translations
 */
function updateMenuItems(translation) {
    // Update main menu items
    const menuItems = document.querySelectorAll('.menu-item-description');
    const menuItemTexts = ['home', 'about-me', 'experience', 'projects', 'network', 'settings', 'awards'];
    
    menuItems.forEach((item, index) => {
        if (menuItemTexts[index]) {
            item.textContent = translation[menuItemTexts[index]];
        }
    });
    
    // Update sub-menu items
    updateSubMenuItems(translation);
}

/**
 * Update sub-menu items with translations
 */
function updateSubMenuItems(translation) {
    const subMenuItems = document.querySelectorAll('.sub-menu-item-header');
    
    subMenuItems.forEach(item => {
        const text = item.textContent.trim();
        
        // Map current text to translation key
        const textToKey = {
            'Create New User': 'create-user',
            'Fernando Franco Jr.': 'fernando-profile',
            'Change Language': 'change-language',
            'Change Theme': 'change-theme',
            'xVector.us - AI Engineer': 'ai-engineer',
            'xVector.us - Software Engineer': 'software-engineer',
            'Research - AI Human Interaction': 'research',
            'Overleaf Development': 'overleaf',
            'Calorie Calculator': 'calorie-calc',
            'AI Bot': 'ai-bot',
            'Web Scraper': 'web-scraper',
            'LinkedIn': 'linkedin',
            'Github': 'github',
            'Music I Enjoy': 'youtube',
            'Favorite Eats': 'favorite-eats',
            'HISPANIC SCHOLARSHIP FUND SCHOLAR': 'hsf-scholar',
            'CS INCLUDES SCHOLAR': 'cs-scholar',
            'BOEING SCHOLAR': 'boeing-scholar',
            'EDWARD GRISSO SCHOLAR': 'edward-grisso-scholar',
            'LOYLE P & VELMA MILLER SCHOLAR': 'loyle-miller-scholar',
            'SOONER TRADITIONS SCHOLAR': 'sooner-traditions-scholar'
        };
        
        const key = textToKey[text];
        if (key && translation[key]) {
            item.textContent = translation[key];
        }
    });
}

/**
 * Update navigation legend with translations
 */
function updateNavigationLegend(translation) {
    // Update legend lines based on their data-translate key while preserving icons
    const legendLines = document.querySelectorAll('.legend-line');
    legendLines.forEach((legendLineElement) => {
        const translateKey = legendLineElement.getAttribute('data-translate');
        if (!translateKey) return;
        const translatedText = translation[translateKey];
        if (!translatedText) return;
        
        // Find existing span and replace its text, or replace all text content if no span
        const textSpan = legendLineElement.querySelector('span');
        if (textSpan) {
            textSpan.textContent = translatedText;
        } else {
            // If no span exists, replace all text content while preserving other elements
            const allChildren = Array.from(legendLineElement.children);
            const nonSpanChildren = allChildren.filter(child => child.tagName !== 'SPAN');
            
            // Clear existing content
            legendLineElement.innerHTML = '';
            
            // Re-add non-span elements (like images)
            nonSpanChildren.forEach(child => {
                legendLineElement.appendChild(child);
            });
            
            // Add the translated text as a span
            const newTextSpan = document.createElement('span');
            newTextSpan.textContent = translatedText;
            legendLineElement.appendChild(newTextSpan);
        }
    });
}

/**
 * Update checklist with translations
 */
function updateChecklist(translation) {
    // Update checklist title
    const checklistTitle = document.querySelector('.checklist-title');
    if (checklistTitle && translation['checklist-title']) {
        checklistTitle.textContent = translation['checklist-title'];
    }
    
    // Update checklist items
    const checklistItems = document.querySelectorAll('.checklist-text');
    const checklistKeys = ['create-user-task', 'music-discovery-task', 'find-city-task', 'konami-master-task', 'corgi-hunter-task', 'social-butterfly-task'];
    
    checklistItems.forEach((item, index) => {
        if (checklistKeys[index] && translation[checklistKeys[index]]) {
            item.textContent = translation[checklistKeys[index]];
        }
    });
    
    // Update city input placeholder
    const cityInput = document.querySelector('.city-guess-input');
    if (cityInput && translation['city-placeholder']) {
        cityInput.placeholder = translation['city-placeholder'];
    }
}

/**
 * Reset language to English (simple method)
 */
function resetToEnglish() {
    currentLanguage = 'en';
    const languageInfo = languages[currentLanguage];
    
    // Apply English translations
    applyTranslations('en');
    
    // Play click sound
    Sfx.playClick();
    
    // Show reset notification
    log(LOG_TYPE.INFO, 'Language reset to English');
}

/**
 * Open theme selection modal
 */
function openThemeModal() {
    const modal = document.getElementById('theme-modal');
    
    if (modal) {
        suppressModalEnter = true;
        modal.classList.add('show');
        
        // Apply current theme colors to the modal
        const colors = themeManager.getCurrentThemeColors();
        themeManager.updateModalColors(colors);
        
        // Populate theme grid
        populateThemeGrid();
        
        // Focus on first theme option
        const firstTheme = modal.querySelector('.theme-option');
        if (firstTheme) {
            setTimeout(() => firstTheme.focus(), 100);
        }
        Sfx.playClick();
        log(LOG_TYPE.INFO, 'Theme selection modal opened');
    }
}

/**
 * Close theme selection modal
 */
function closeThemeModal() {
    const modal = document.getElementById('theme-modal');
    if (modal) {
        modal.classList.remove('show');
        
        // Reset selection
        const selectedTheme = modal.querySelector('.theme-option.selected');
        if (selectedTheme) {
            selectedTheme.classList.remove('selected');
        }
        
        Sfx.playClick();
        log(LOG_TYPE.INFO, 'Theme selection modal closed');
    }
}

/**
 * Populate theme selection grid
 */
function populateThemeGrid() {
    const themeGrid = document.getElementById('theme-selection-grid');
    if (!themeGrid) return;
    
    // Clear existing content
    themeGrid.innerHTML = '';
    
    // Create theme options
    const themes = themeManager.getAvailableThemes();
    console.log('populateThemeGrid - themes:', themes);
    themeOptions = themes; // Store for navigation
    selectedThemeIndex = 0; // Reset selection
    
    themes.forEach((theme, index) => {
        const isCurrentTheme = theme.name === themeManager.getCurrentTheme();
        
        const themeOption = document.createElement('div');
        themeOption.className = `theme-option ${isCurrentTheme ? 'selected' : ''}`;
        themeOption.dataset.themeName = theme.name;
        
        // Create preview element (video or image)
        let preview;
        if (theme.type === 'image') {
            preview = document.createElement('img');
            preview.className = 'theme-preview';
            preview.src = theme.file;
            preview.alt = theme.displayName;
        } else {
            preview = document.createElement('video');
            preview.className = 'theme-preview';
            preview.src = theme.file;
            preview.muted = true;
            preview.loop = true;
            preview.autoplay = true;
            preview.playsInline = true;
        }
        
        const name = document.createElement('div');
        name.className = 'theme-name';
        name.textContent = theme.displayName;
        
        themeOption.appendChild(preview);
        themeOption.appendChild(name);
        themeGrid.appendChild(themeOption);
        
        // Track current theme index
        if (isCurrentTheme) {
            selectedThemeIndex = index;
            console.log('Current theme found at index:', index, 'theme:', theme.name);
        }
        
        // Add click event listener
        themeOption.addEventListener('click', () => selectTheme(themeOption, theme.name));
    });
    
    console.log('populateThemeGrid - final selectedThemeIndex:', selectedThemeIndex);
    console.log('populateThemeGrid - final themeOptions:', themeOptions);
    
    // Update visual selection
    updateThemeSelection();
}

/**
 * Calculate the number of columns in the theme grid
 */
function calculateThemeGridColumns() {
    const themeGrid = document.getElementById('theme-selection-grid');
    if (!themeGrid) return 1;
    
    // Get the computed grid template columns
    const computedStyle = window.getComputedStyle(themeGrid);
    const gridTemplateColumns = computedStyle.gridTemplateColumns;
    
    // Count the number of columns by counting the space-separated values
    const columns = gridTemplateColumns.split(' ').length;
    
    // Fallback: if we can't determine columns from CSS, calculate based on container width
    if (columns === 1 || isNaN(columns)) {
        const containerWidth = themeGrid.clientWidth;
        const itemWidth = 140; // minmax(140px, 1fr) from CSS
        const gap = 15; // gap from CSS
        const calculatedColumns = Math.floor((containerWidth + gap) / (itemWidth + gap));
        return Math.max(1, calculatedColumns);
    }
    
    return columns;
}

/**
 * Navigate theme options with arrow keys
 */
function navigateThemeOptions(direction) {
    if (themeOptions.length === 0) return;
    
    // Update selected index
    selectedThemeIndex += direction;
    
    // Wrap around
    if (selectedThemeIndex < 0) {
        selectedThemeIndex = themeOptions.length - 1;
    } else if (selectedThemeIndex >= themeOptions.length) {
        selectedThemeIndex = 0;
    }
    
    // Update visual selection
    updateThemeSelection();
    
    // Play navigation sound
    Sfx.playClick();
}

/**
 * Update theme selection visual state
 */
function updateThemeSelection() {
    const allThemeOptions = document.querySelectorAll('.theme-option');
    allThemeOptions.forEach((option, index) => {
        option.classList.toggle('selected', index === selectedThemeIndex);
    });
}

/**
 * Handle theme selection
 */
function selectTheme(themeOption, themeName) {
    console.log('selectTheme called with:', themeName);
    console.log('themeOptions before findIndex:', themeOptions);
    
    // Find the index of the selected theme
    const themeIndex = themeOptions.findIndex(theme => theme.name === themeName);
    console.log('themeIndex found:', themeIndex);
    
    if (themeIndex !== -1) {
        selectedThemeIndex = themeIndex;
        console.log('selectedThemeIndex updated to:', selectedThemeIndex);
    }
    
    // Update visual selection
    updateThemeSelection();
    
    // Play click sound
    Sfx.playClick();
    
    log(LOG_TYPE.INFO, `Theme selected: ${themeName}`);
}

/**
 * Apply selected theme
 */
function applyThemeSelection() {
    if (themeOptions.length === 0 || selectedThemeIndex < 0 || selectedThemeIndex >= themeOptions.length) {
        // Try to get selected theme from DOM instead
        const modal = document.getElementById('theme-modal');
        const selectedTheme = modal.querySelector('.theme-option.selected');
        
        if (selectedTheme) {
            const themeName = selectedTheme.dataset.themeName;
            
            // Apply the theme
            themeManager.applyTheme(themeName);
            
            // Close modal
            closeThemeModal();
            
            // Show success message
            const theme = themeManager.getAvailableThemes().find(t => t.name === themeName);
            log(LOG_TYPE.INFO, `Theme changed to: ${theme.displayName}`);
        }
        return;
    }
    
    const selectedTheme = themeOptions[selectedThemeIndex];
    
    if (selectedTheme) {
        // Apply the theme
        themeManager.applyTheme(selectedTheme.name);
        
        // Close modal
        closeThemeModal();
        
        // Show success message
        log(LOG_TYPE.INFO, `Theme changed to: ${selectedTheme.displayName}`);
    }
}

/**
 * Show trophy notification animation
 */
function showTrophyNotification() {
    const trophyNotification = document.getElementById('trophy-notification');
    if (!trophyNotification) return;
    
    // Reset classes
    trophyNotification.classList.remove('show', 'hide');
    
    // Show notification with animation
    setTimeout(() => {
        trophyNotification.classList.add('show');
        
        // Hide notification after 8 seconds
        setTimeout(() => {
            trophyNotification.classList.add('hide');
            
            // Remove element after animation completes
            setTimeout(() => {
                trophyNotification.classList.remove('show', 'hide');
            }, 600); // Match CSS transition duration
        }, 8000);
    }, 100);
}

/**
 * Show trophy badge on profile photo
 */
function showProfileTrophyBadge() {
    const trophyBadge = document.getElementById('profile-trophy-badge');
    if (!trophyBadge) return;
    
    // Show badge with animation
    setTimeout(() => {
        trophyBadge.classList.add('show');
    }, 200);
}

function hideProfileTrophyBadge() {
    const trophyBadge = document.getElementById('profile-trophy-badge');
    if (!trophyBadge) return;
    trophyBadge.classList.remove('show');
}

/**
 * Trigger the gold star on the last created user's icon
 */
function triggerNewUserStar() {
    let lastId = null;
    try { lastId = localStorage.getItem('portfolio-last-created-user'); } catch (e) {}
    if (!lastId) return;
    
    // Look for the user sub-menu item specifically
    const target = document.querySelector(`.menu-item:first-child .sub-menu-item-container .sub-menu-item[data-user-id="${lastId}"] .new-user-star`);
    if (!target) return;
    
    // Show star and keep it as a sticker
    target.classList.add('show');
}

/**
 * Initialize trophy system - check if trophy should be shown on load
 */
function initializeTrophySystem() {
    // Check if all achievements are completed and trophy hasn't been shown yet
    if (checklistManager) {
        checklistManager.checkForPlatinumTrophy();
        
        // Do not show badge on start screen profile photo
        if (checklistManager.hasShownPlatinumTrophy()) {
            hideProfileTrophyBadge();
        }
    }

    // If platinum already achieved earlier, ensure star is shown on last created user
    try {
        if (localStorage.getItem('portfolio-platinum-achieved') === 'true') {
            triggerNewUserStar();
        }
    } catch (e) {}
}

// Initialize immediately for banner functionality
// Main content initialization will happen after banner is hidden
