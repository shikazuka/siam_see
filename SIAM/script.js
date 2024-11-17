document.querySelector('.play-button').addEventListener('click', function() {
    document.querySelector('.plateau').style.display = 'grid';
    document.querySelector('.grille-sup').style.display = 'grid';
    document.querySelector('.grille-inf').style.display = 'grid';
    document.querySelector('.play-button').style.display = 'none';
    const tourJoueurElement = document.getElementById("tour-joueur");
    tourJoueurElement.style.display = "block"; // Rendre le texte visible
    tourJoueurElement.innerText = "Tour du Joueur 1";
    let joueurActuel = 1; // Commence avec le joueur 1



    document.querySelector('.background-image').style.backgroundImage = "url('./image/plateau-siam.jpg')";
});


// Classe Pion
class Pion {
    constructor(type, direction) {
        this.type = type; 
        this.direction = direction; 
    }

    setDirection(nouvelleDirection) {
        this.direction = nouvelleDirection;
    }
}

// Classe Reserve pour les grilles de départ

class Reserve {
    constructor(elementId) {
        this.elementId = elementId; // ID de la grille HTML (grille-sup ou grille-inf)
        this.pions = []; // Liste des pions dans la réserve
    }

    // Ajoute un pion à la réserve
    ajouterPion(pion) {
        this.pions.push(pion);
        this.afficherReserve();
    }

    // Affiche la réserve dans le DOM
    afficherReserve() {
        const reserveElement = document.getElementById(this.elementId);
        reserveElement.innerHTML = ""; // Nettoyer la réserve

        this.pions.forEach((pion, index) => {
            const img = document.createElement("img");
            img.src = imagePaths[pion.type];
            img.alt = pion.type;
            img.setAttribute("data-index", index); // Identifiant pour le pion
            img.classList.add("pion"); // Classe pour style ou événement
            img.draggable = true; // Rendre l'image draggable

            // Événement de glisser-déposer
            img.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text/plain", index); // Enregistrer l'index du pion
            });

            reserveElement.appendChild(img);
        });
    }

    // Retire un pion spécifique de la réserve
    retirerPion(index) {
        const pion = this.pions.splice(index, 1)[0];
        this.afficherReserve();
        return pion;
    }
}
// Classe Plateau
// Classe Plateau
class Plateau {
    constructor() {
        this.grille = Array(5).fill(null).map(() => Array(5).fill(null));
    }

    placerPion(pion, row, col) {
        if (this.grille[row][col] === null) {
            this.grille[row][col] = pion;
            this.afficherPlateau();
        } else {
            console.log("Case occupée !");
        }
    }

    retirerPion(row, col) {
        this.grille[row][col] = null;
        this.afficherPlateau();
    }

    afficherPlateau() {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const caseId = `case${row * 5 + col + 1}`;
                const caseElement = document.getElementById(caseId);
    
                caseElement.innerHTML = ""; // Nettoie la case avant d'y ajouter un pion
                const pion = this.grille[row][col];
                if (pion) {
                    const img = document.createElement("img");
                    img.src = imagePaths[pion.type];
                    img.alt = pion.type;
                    img.setAttribute("data-row", row);  // Enregistre la ligne du pion
                    img.setAttribute("data-col", col);  // Enregistre la colonne du pion
                    img.classList.add("pion"); // Classe pour style ou événement
    
                    // Permettre de "prendre" le pion (événement dragstart)
                    img.draggable = true;
                    img.addEventListener("dragstart", (event) => {
                        event.dataTransfer.setData("text/plain", JSON.stringify({row, col})); // Enregistre la position du pion
                    });
    
                    caseElement.appendChild(img);
                }
    
                // Permettre de déposer un pion sur une case (événement drop)
                caseElement.addEventListener("dragover", (event) => {
                    event.preventDefault(); // Permet de déposer un élément sur la case
                });
    
                caseElement.addEventListener("drop", (event) => {
                    event.preventDefault();
                    const data = event.dataTransfer.getData("text/plain"); // Récupère la position du pion
                    const { row, col } = JSON.parse(data); // Position d'origine du pion
    
                    // Si la case est vide, déplacer le pion
                    if (this.grille[row][col] !== null) {
                        // Retirer le pion de l'ancienne case
                        this.retirerPion(row, col);
                    }
    
                    // Placer le pion sur la nouvelle case
                    const pion = plateauDeJeu.grille[row][col];
                    if (pion) {
                        this.placerPion(pion, event.target.dataset.row, event.target.dataset.col); // Déplace le pion vers la nouvelle case
                    }
                    this.afficherPlateau(); // Met à jour l'affichage du plateau
                });
            }
        }
    }
    
    retirerPionFromReserve(index) {
        // Retirer le pion de la réserve correspondante (à adapter selon la logique de votre jeu)
        const reserve = currentPlayer === 1 ? reserveSup : reserveInf; // Déterminer la réserve du joueur actuel
        return reserve.retirerPion(index);
    }
}

// Chemin des images des pions
const imagePaths = {
    elephant: "./image/elephant.png",
    rhinoceros: "./image/rhinoceros.png",
    rocher: "./image/rocher.png"
};

// Initialisation des réserves et du plateau
// Initialisation des réserves et du plateau
const reserveSup = new Reserve("grille-sup"); // Grille pour les éléphants
const reserveInf = new Reserve("grille-inf"); // Grille pour les rhinocéros
const plateauDeJeu = new Plateau();

// Ajout de pions aux réserves au chargement
window.onload = function() {
    // Ajouter 5 éléphants dans la réserve supérieure
    for (let i = 0; i < 5; i++) {
        reserveSup.ajouterPion(new Pion("elephant", "haut"));
    }
    
    // Ajouter 5 rhinocéros dans la réserve inférieure
    for (let i = 0; i < 5; i++) {
        reserveInf.ajouterPion(new Pion("rhinoceros", "bas"));
    }

    // Ajouter 3 rochers au milieu du plateau
    plateauDeJeu.placerPion(new Pion("rocher", "immobile"), 2, 3); // Case au-dessus du centre
    plateauDeJeu.placerPion(new Pion("rocher", "immobile"), 2, 1); // Case à gauche du centre
    plateauDeJeu.placerPion(new Pion("rocher", "immobile"), 2, 2); // Centre du plateau
};

// Événement pour afficher le plateau lors du clic sur le bouton "Jouer"

function changerTour() {
    joueurActuel = joueurActuel === 1 ? 2 : 1; // Alterne entre 1 et 2
    document.getElementById("tour-joueur").innerText = "Tour du Joueur " + joueurActuel;
}

// Exemple d'appel de la fonction pour changer de tour
// Vous pouvez appeler cette fonction
