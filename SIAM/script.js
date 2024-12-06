class Pion {
    constructor(type, position, imagePath, joueur = null, direction = "haut") {
        this.type = type; // 'elephant', 'rhinoceros', 'rocher'
        this.position = position; // Position initiale (ex: 'caseA1')
        this.imagePath = imagePath; // Chemin de l'image
        this.joueur = joueur; // 1 pour éléphant, 2 pour rhinocéros, null pour rocher
        this.direction = direction; // 'haut', 'bas', 'gauche', 'droite'
    }

    tourner(nouvelleDirection) {
        this.direction = nouvelleDirection; // Met à jour la direction
    }
}


const imagePaths = {
    elephant: "./images/elephant.png",
    rhinoceros: "./images/rhinoceros.png",
    rocher: "./images/rocher.png"
};

const elephants = [
    new Pion("elephant", "caseA1", imagePaths.elephant, 1),
    new Pion("elephant", "caseA2", imagePaths.elephant, 1),
    new Pion("elephant", "caseA3", imagePaths.elephant, 1),
    new Pion("elephant", "caseA4", imagePaths.elephant, 1),
    new Pion("elephant", "caseA5", imagePaths.elephant, 1)
];

const rhinoceros = [
    new Pion("rhinoceros", "caseB1", imagePaths.rhinoceros, 2),
    new Pion("rhinoceros", "caseB2", imagePaths.rhinoceros, 2),
    new Pion("rhinoceros", "caseB3", imagePaths.rhinoceros, 2),
    new Pion("rhinoceros", "caseB4", imagePaths.rhinoceros, 2),
    new Pion("rhinoceros", "caseB5", imagePaths.rhinoceros, 2)
];

const rochers = [
    new Pion("rocher", "case12", imagePaths.rocher),
    new Pion("rocher", "case13", imagePaths.rocher),
    new Pion("rocher", "case14", imagePaths.rocher)
];

const tousLesPions = [...elephants, ...rhinoceros, ...rochers];

let joueurActuel = 1; 
let pionSelectionne = null; 

function afficherPion(pion) {
    const caseElement = document.getElementById(pion.position);

    if (caseElement) {
        const imgElement = document.createElement("img");
        imgElement.src = pion.imagePath;
        imgElement.alt = pion.type;
        imgElement.dataset.id = pion.position; // Identifier le pion via son dataset

        // Appliquer la rotation en fonction de la direction
        switch (pion.direction) {
            case "haut":
                imgElement.style.transform = "rotate(0deg)";
                break;
            case "droite":
                imgElement.style.transform = "rotate(90deg)";
                break;
            case "bas":
                imgElement.style.transform = "rotate(180deg)";
                break;
            case "gauche":
                imgElement.style.transform = "rotate(270deg)";
                break;
        }

        imgElement.addEventListener("click", selectionnerPion); // Ajouter l'événement de clic
        caseElement.appendChild(imgElement);
    }
}


function selectionnerPion(event) {
    const caseId = event.target.dataset.id;
    const pion = tousLesPions.find((p) => p.position === caseId);

    if (!pion) {
        console.warn("Aucun pion n'est présent sur cette case !");
        return;
    }

    if (pion.joueur !== joueurActuel) {
        console.warn("Ce pion appartient à l'autre joueur !");
        return;
    }

    pionSelectionne = pion;
    console.log(`Pion sélectionné : ${pion.type} à ${pion.position}`);

    // Afficher les cases valides pour ce pion
    afficherCasesDeplacement(pion);

    // Afficher dynamiquement les boutons de rotation
    afficherBoutonsRotation(event.target);
}



// Affiche les cases où le pion peut se déplacer en rouge
function afficherCasesDeplacement(pion) {
    // Réinitialiser les couleurs des cases
    document.querySelectorAll(".case").forEach((caseElement) => {
        caseElement.style.backgroundColor = "";
        
    });

    // Logique de déplacement en fonction du type de pion
    const casesDisponibles = obtenirCasesValides(pion);
    casesDisponibles.forEach((caseId) => {
        const caseElement = document.getElementById(caseId);
        if (caseElement) {
            caseElement.style.backgroundColor = "rgba(171, 48, 48, 0.8)"; // Marquer la case en rouge
        }
    });
}

function obtenirCasesValides(pion) {
    const casesValides = [];

    if (pion.position.startsWith("caseA") || pion.position.startsWith("caseB")) {
        // Si le pion est dans les réserves (grille sup ou inf)
        const casesValidesGrille = [
            "case1", "case2", "case4", "case5", "case6", "case10", 
            "case11", "case15", "case16", "case20", "case21", "case22", 
            "case24", "case25"
        ];
        casesValides.push(...casesValidesGrille);
    } else {
        // Si le pion est dans le plateau (c'est-à-dire qu'il n'est pas dans les réserves)
        const directions = [
            `case${parseInt(pion.position.slice(4)) - 1}`, // case à gauche
            `case${parseInt(pion.position.slice(4)) + 1}`, // case à droite
            `case${parseInt(pion.position.slice(4)) - 5}`, // case en haut (plateau 5x5)
            `case${parseInt(pion.position.slice(4)) + 5}`, // case en bas
        ];
        directions.forEach(caseId => {
            if (document.getElementById(caseId)) { // Vérifie si la case existe
                casesValides.push(caseId);
            }
        });
    }

    return casesValides;
}
function initialiserBoutonsRotation() {
    const container = document.createElement("div");
    container.id = "boutons-rotation";
    container.style.position = "absolute";
    container.style.display = "none"; // Caché par défaut
    container.style.flexDirection = "row";
    container.style.gap = "10px";
    container.style.pointerEvents = "auto"; // Permettre les clics sur les boutons
    container.style.zIndex = "10"; // Placer les boutons au-dessus des cases
    container.style.left = "calc(50% - 80px)";
    // Bouton pour tourner à gauche
    const boutonGauche = document.createElement("button");
    boutonGauche.style.backgroundColor = "transparent"; // Transparent
    container.style.display = "flex"; // Utiliser flex pour aligner les boutons côte à côte

    boutonGauche.style.border = "none"; // Pas de bordure
    boutonGauche.style.cursor = "pointer"; // Curseur interactif
    boutonGauche.style.padding = "0"; // Pas de padding
    boutonGauche.style.width = "60px"; // Largeur de l'image
    boutonGauche.style.height = "60px"; // Hauteur de l'image
    boutonGauche.style.backgroundImage = "url('./images/gauche.png')"; // Image de la flèche gauche
    boutonGauche.style.backgroundSize = "contain"; // Ajuste l'image à la taille du bouton
    boutonGauche.style.backgroundRepeat = "no-repeat"; // Évite la répétition
    boutonGauche.style.backgroundPosition = "center"; // Centre l'image
    boutonGauche.addEventListener("click", () => tournerPion("gauche"));
    // Bouton pour tourner à droite
    const boutonDroite = document.createElement("button");
    boutonDroite.style.backgroundColor = "transparent"; // Transparent
    boutonDroite.style.border = "none"; // Pas de bordure
    boutonDroite.style.cursor = "pointer"; // Curseur interactif
    boutonDroite.style.padding = "0"; // Pas de padding
    boutonDroite.style.width = "60px"; // Largeur de l'image
    boutonDroite.style.height = "60px"; // Hauteur de l'image
    boutonDroite.style.backgroundImage = "url('./images/droite.png')"; // Image de la flèche droite
    boutonDroite.style.backgroundSize = "contain"; // Ajuste l'image à la taille du bouton
    boutonDroite.style.backgroundRepeat = "no-repeat"; // Évite la répétition
    boutonDroite.style.backgroundPosition = "center"; // Centre l'image
    boutonDroite.addEventListener("click", () => tournerPion("droite"));

    // Ajouter les boutons au conteneur
    container.appendChild(boutonGauche);
    container.appendChild(boutonDroite);

    // Ajouter le conteneur au body
    document.body.appendChild(container);
}


function deplacerPion(event) {
    const caseCible = event.currentTarget;

    if (!pionSelectionne) {
        console.warn("Aucun pion sélectionné !");
        return;
    }

    if (caseCible.querySelector("img")) {
        const img = caseCible.querySelector("img");
        if (img.src.includes("rocher.png")) {
            // Vérifie si le pion est face au rocher
            if (estFaceAuRocher(pionSelectionne, caseCible.id)) {
                // Tente de déplacer le rocher
                if (deplacerRocher(pionSelectionne, caseCible.id)) {
                    console.log("Le rocher a été déplacé.");
                    // Le pion prend la place initiale du rocher
                    prendrePlaceDuRocher(pionSelectionne, caseCible.id);
                    return;
                } else {
                    console.warn("Le rocher ne peut pas être déplacé !");
                    return;
                }
            }
            console.warn("Le pion n'est pas face au rocher !");
            return;
        } else {
            console.warn("La case est déjà occupée !");
            return;
        }
    }

    // Déplacement normal du pion
    const ancienneCase = document.getElementById(pionSelectionne.position);
    if (ancienneCase) ancienneCase.innerHTML = ""; // Supprimer le pion de l'ancienne case

    pionSelectionne.position = caseCible.id; // Met à jour la position
    afficherPion(pionSelectionne); // Réaffiche le pion dans sa nouvelle position
    pionSelectionne = null; // Réinitialiser la sélection
    changerTour(); // Passer au joueur suivant

    // Réinitialiser les couleurs des cases
    document.querySelectorAll(".case").forEach((caseElement) => {
        caseElement.style.backgroundColor = "";
    });
}

// Fonction pour vérifier si le pion est face au rocher
function estFaceAuRocher(pion, caseRocherId) {
    const directions = {
        haut: -5, // Case au-dessus
        bas: 5,   // Case en dessous
        gauche: -1, // Case à gauche
        droite: 1  // Case à droite
    };

    const direction = pion.direction; // La direction dans laquelle le pion regarde
    const pionCaseNum = parseInt(pion.position.slice(4)); // Numéro de la case actuelle du pion
    const rocherCaseNum = parseInt(caseRocherId.slice(4)); // Numéro de la case du rocher

    // Vérifie si le rocher est dans la bonne direction
    switch (direction) {
        case "haut":
            return rocherCaseNum === pionCaseNum - 5;
        case "bas":
            return rocherCaseNum === pionCaseNum + 5;
        case "gauche":
            return rocherCaseNum === pionCaseNum - 1;
        case "droite":
            return rocherCaseNum === pionCaseNum + 1;
        default:
            return false;
    }
}

// Fonction pour déplacer le rocher d'une case dans la direction du pion
function deplacerRocher(pion, caseRocherId) {
    const directions = {
        haut: -5,
        bas: 5,
        gauche: -1,
        droite: 1
    };

    const direction = pion.direction;
    const rocherCaseNum = parseInt(caseRocherId.slice(4)); // Numéro de la case actuelle du rocher
    let nouvellePositionNum;

    switch (direction) {
        case "haut":
            nouvellePositionNum = rocherCaseNum - 5;
            break;
        case "bas":
            nouvellePositionNum = rocherCaseNum + 5;
            break;
        case "gauche":
            nouvellePositionNum = rocherCaseNum - 1;
            break;
        case "droite":
            nouvellePositionNum = rocherCaseNum + 1;
            break;
        default:
            return false;
    }

    const nouvellePositionId = "case" + nouvellePositionNum;
    const nouvelleCase = document.getElementById(nouvellePositionId);

    // Vérifie si la nouvelle case existe et est libre
    if (!nouvelleCase || nouvelleCase.querySelector("img")) {
        console.warn("La case cible pour le rocher est occupée ou hors du plateau !");
        return false;
    }

    // Déplacer le rocher
    const ancienneCase = document.getElementById(caseRocherId);
    if (ancienneCase) ancienneCase.innerHTML = ""; // Supprimer l'image du rocher de l'ancienne case

    const rocherImage = document.createElement("img");
    rocherImage.src = "./images/rocher.png";
    rocherImage.alt = "rocher";
    nouvelleCase.appendChild(rocherImage);

    return true;
}

// Fonction pour faire prendre au pion la place du rocher
function prendrePlaceDuRocher(pion, caseRocherId) {
    const caseRocher = document.getElementById(caseRocherId);
    const ancienneCase = document.getElementById(pion.position);

    if (caseRocher) {
        // Supprimer le pion de sa case actuelle
        if (ancienneCase) {
            ancienneCase.innerHTML = ""; // Supprime l'image du pion de la case précédente
        }

        // Supprimer le rocher de la case
        caseRocher.innerHTML = ""; // Supprime l'image du rocher de la case

        // Mettre à jour la position du pion
        pion.position = caseRocherId; // Met à jour la position du pion
        afficherPion(pion); // Affiche le pion sur la nouvelle case

        pionSelectionne = null; // Réinitialiser la sélection
        changerTour(); // Passer au joueur suivant

        // Réinitialiser les couleurs des cases
        document.querySelectorAll(".case").forEach((caseElement) => {
            caseElement.style.backgroundColor = "";
        });
    }
}




function afficherBoutonsRotation(caseElement) {
    const container = document.getElementById("boutons-rotation");

    if (!container) {
        console.error("Le conteneur des boutons de rotation n'existe pas !");
        return;
    }

    // Calculer la position des boutons en fonction de la case sélectionnée
    const rect = caseElement.getBoundingClientRect();
    container.style.top = `${rect.top + window.scrollY + 50}px`; // Ajuste selon la position de la case
    container.style.left = `${rect.left + window.scrollX}px`;

    // Rendre les boutons visibles
    container.style.display = "flex";
}


function cacherBoutonsRotation() {
    const container = document.getElementById("boutons-rotation");
    if (container) {
        container.style.display = "none"; // Cache le conteneur
    }
}




function tournerPion(direction) {
    if (!pionSelectionne) {
        console.warn("Aucun pion sélectionné !");
        return;
    }

    const nouvelleDirection = direction === "gauche" 
        ? { haut: "gauche", gauche: "bas", bas: "droite", droite: "haut" }[pionSelectionne.direction]
        : { haut: "droite", droite: "bas", bas: "gauche", gauche: "haut" }[pionSelectionne.direction];

    pionSelectionne.tourner(nouvelleDirection);

    // Réafficher le pion pour appliquer la rotation
    const caseElement = document.getElementById(pionSelectionne.position);
    if (caseElement) caseElement.innerHTML = ""; // Efface l'ancien affichage
    afficherPion(pionSelectionne);
}



function changerTour() {
    joueurActuel = joueurActuel === 1 ? 2 : 1;
    document.getElementById("tour-joueur").innerText = `Tour du Joueur ${joueurActuel}`;
}

function genererCases(conteneurId, nombreCases, prefix) {
    const conteneur = document.getElementById(conteneurId);

    for (let i = 1; i <= nombreCases; i++) {
        const caseElement = document.createElement("div");
        caseElement.classList.add("case");
        caseElement.id = `${prefix}${i}`; // Ex : "caseA1", "case1", "caseB1"
        conteneur.appendChild(caseElement);
    }
}

function initialiserGrilles() {
    // Générer les 5 cases de la grille supérieure
    genererCases("grille-sup", 5, "caseA");

    // Générer les 25 cases du plateau
    genererCases("plateau", 25, "case");

    // Générer les 5 cases de la grille inférieure
    genererCases("grille-inf", 5, "caseB");
}

document.querySelector(".play-button").addEventListener("click", () => {
    // Initialiser le plateau
    document.querySelector(".plateau").style.display = "grid";
    document.querySelector(".grille-sup").style.display = "grid";
    document.querySelector(".grille-inf").style.display = "grid";
    document.querySelector(".play-button").style.display = "none";

    document.querySelector(".background-image").style.backgroundImage =
        "url('./images/plateau-siam.jpg')";

    document.getElementById("tour-joueur").style.display = "block";

    // Créer dynamiquement les cases des grilles
    initialiserGrilles();
    tousLesPions.forEach(afficherPion);

    // Initialiser le conteneur des boutons de rotation
    initialiserBoutonsRotation();

    // Ajouter les événements pour déplacer les pions
    document.querySelectorAll(".case").forEach((caseElement) =>
        caseElement.addEventListener("click", deplacerPion)
    );
});
