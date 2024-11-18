# CoList - Application de Brainstorming Collaboratif

CoList est une application de brainstorming permettant de créer des listes collaboratives. Elle est conçue pour trois types d'utilisateurs : **User**, **Admin**, et **Owner**, avec des permissions spécifiques pour chaque rôle.

## Rôles et Permissions

-   **Utilisateur (User)** : Peut ajouter des tâches, ainsi que modifier ou supprimer ses propres tâches.
-   **Administrateur (Admin)** : A la possibilité de modifier toutes les tâches, ainsi que d'approuver celles soumises par les utilisateurs avant leur publication.
-   **Propriétaire (Owner)** : Dispose des mêmes droits qu'un Administrateur, avec en plus la possibilité de désigner et gérer les utilisateurs ayant le rôle d'Administrateur.

## Fonctionnalités

-   Création de listes collaboratives accessibles par URL.
-   Chaque tâche peut être approuvée, modifiée ou supprimée selon le rôle de l'utilisateur.
-   Gestion de permissions détaillée pour Admins et Owners.

## Structure du Projet

Ce projet est divisé en deux parties :

-   **Frontend** : React app qui tourne sur le port 3000.
-   **Backend** : Serveur Express avec Socket.io qui tourne sur le port 3001.

## Prérequis

Avant de démarrer le projet, assurez-vous d'avoir installé **Node.js** et **npm**.

## Installation

### Prérequis

1. Clonez le repository :

    ```bash
    git clone https://github.com/leashmt/CoList
    ```

2. Accédez au répertoire du projet cloné :

    ```bash
    cd CoList
    ```

### Frontend

1. Accédez au répertoire `front` et installez les dépendances :

    ```bash
    cd front
    npm install
    ```

2. Lancez le serveur de développement :

    ```bash
    npm start
    ```

Cela démarrera l'application frontend sur [localhost:3000](http://localhost:3000).

### Backend

1. Accédez au répertoire `back` et installez les dépendances :

    ```bash
    cd back
    npm install
    ```

2. Créez un fichier `.env` à la racine du dossier `back` pour configurer vos variables d'environnement.

3. Lancez le serveur backend :

    ```bash
    npm start
    ```

Cela démarrera le serveur backend sur [localhost:3001](http://localhost:3001).

## Dépendances principales

### Frontend

-   **React** : Bibliothèque JavaScript pour la construction de l'interface utilisateur.
-   **Socket.io-client** : Permet de gérer la communication en temps réel entre le client et le serveur.
-   **React Router** : Gestion de la navigation entre les pages.

### Backend

-   **Express** : Framework pour construire l'API backend.
-   **Socket.io** : Bibliothèque pour la gestion de la communication en temps réel.

## Contribution

Si vous souhaitez contribuer au projet, vous pouvez forker le repository et soumettre vos modifications sous forme de pull requests.

## Licence

Ce projet est sous licence MIT.
