# 8INF876_TP-2

# 📝 API CRUD

### 📄 Description

L'API CRUD est une API REST qui permet de gérer des messages. Son code source est disponible dans le dossier `app` du projet.

### 🛠️ Technologies utilisées

-   Node.js
-   Express.js
-   MySQL

### 🛣️ Routes

-   GET `/` : Récupère tous les messages
-   POST `/` : Crée un message
-   PUT `/:id` : Met à jour un message par son id
-   DELETE `/:id` : Supprime un message par son id

### 📦 Exemple de message

```json
{
    "message": "Hello, World!"
}
```

### ⚙️ CI/CD

Lors d'une nouvelle release, une action GitHub se déclenche et effectue les actions suivantes :

-   Builder l'image Docker de l'API
-   Push l'image Docker sur le Docker Hub 👉[ Image ](https://hub.docker.com/repository/docker/mflaceliere/webapp)👈

# 🚀 Déploiement

Pour déployer l'API dans minikube, il suffit d'exécuter la commande suivante :

```bash
kubectl apply -f k8s/
```

Cette commande va créer les ressources suivantes :

-   API:
    -   2 instances de l'API [📄](https://github.com/MatthieuFlaceliere/8INF876_TP-2/blob/main/k8s/03-frontend-deployment.yaml)
    -   1 service de type NodePort pour accéder à l'API [📄](https://github.com/MatthieuFlaceliere/8INF876_TP-2/blob/main/k8s/04-frontend-service.yaml)
-   MySQL:
    -   1 instance de MySQL [📄](https://github.com/MatthieuFlaceliere/8INF876_TP-2/blob/main/k8s/01-mysql-deployment.yaml)
    -   1 service de type ClusterIP pour accéder à MySQL[📄](https://github.com/MatthieuFlaceliere/8INF876_TP-2/blob/main/k8s/032mysql-service.yaml)
    -   1 persistent volume claim pour stocker les données de MySQL [📄](https://github.com/MatthieuFlaceliere/8INF876_TP-2/blob/main/k8s/00-mysql-pvc.yaml)

Pour accéder à l'API, il suffit de récupérer l'adresse IP de minikube et le port du service de l'API :

```bash
minikube service frontend --url
```

Pour supprimer les ressources déployées, il suffit d'exécuter la commande suivante :

```bash
kubectl delete -f k8s/
```
