# 8INF876_TP-2

# 🚀 Déploiement dans minikube

Pour déployer l'API dans minikube, il suffit d'exécuter la commande suivante :

```bash
kubectl apply -f k8s/
```

Pour accéder à l'API, il suffit de récupérer l'adresse IP de minikube et le port du service de l'API :

```bash
minikube service frontend --url
```

Pour supprimer les ressources déployées, il suffit d'exécuter la commande suivante :

```bash
kubectl delete -f k8s/
```

# ⚙️ K8S - Description des ressources

Lors du déploiement les ressources suivantes sont créées :

### API

#### 2 instances de l'API [📄](https://github.com/MatthieuFlaceliere/8INF876_TP-2/blob/main/k8s/03-frontend-deployment.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
```

Ici nous définissons ressource de type `Deployment` qui permet de déployer et de gérer des pods. Nous définissons le nom de la ressource `frontend`.

```yaml
spec:
  replicas: 2
```

Nous définissons le nombre de réplicas de l'API à 2.

```yaml
spec:
  containers:
    - name: frontend
      image: mflaceliere/webapp
      ports:
        - containerPort: 80
      env:
        - name: PORT
          value: "80"
        - name: DB_HOST
          value: "mysql"
        - name: DB_USER
          value: "root"
        - name: DB_PASS
          value: "123456"
        - name: DB_NAME
          value: "mydb"
```

Nous définissons le conteneur de l'API. Nous utilisons l'image Docker `mflaceliere/webapp` qui est l'image de l'API. Nous définissons le port du conteneur à 80. Nous définissons les variables d'environnement pour la connexion à la base de données.

#### 1 service de type NodePort pour accéder à l'API [📄](https://github.com/MatthieuFlaceliere/8INF876_TP-2/blob/main/k8s/04-frontend-service.yaml)

```yaml
apiVersion: apps/v1
kind: Service
metadata:
  name: frontend
```

Ici nous définissons ressource de type `Service` qui permet de définir un service pour accéder aux pods. Nous définissons le nom de la ressource `frontend`.

```yaml
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
  selector:
    app: frontend
```

Nous définissons le type du service à `NodePort`. Nous définissons le port du service à 80 et le port cible à 80 qui correspond au port du conteneur de l'API. Nous définissons le sélecteur pour cibler les pods de l'API.

### MySQL:

#### 1 instance de MySQL [📄](https://github.com/MatthieuFlaceliere/8INF876_TP-2/blob/main/k8s/01-mysql-deployment.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
```

Ici nous définissons ressource de type `Deployment` qui permet de déployer et de gérer des pods. Nous définissons le nom de la ressource `mysql`.

```yaml
spec:
  replicas: 1
```

Nous définissons le nombre de réplicas de MySQL à 1.

```yaml
spec:
  containers:
    - name: mysql
      image: mysql:lts
      env:
        - name: MYSQL_ROOT_PASSWORD
          value: "123456"
        - name: MYSQL_DATABASE
          value: "mydb"
      ports:
        - containerPort: 3306
      volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /var/lib/mysql
  volumes:
    - name: mysql-persistent-storage
      persistentVolumeClaim:
        claimName: mysql-pvc
```

Nous définissons le conteneur de MySQL. Nous utilisons l'image Docker `mysql:lts` qui est l'image de MySQL. Nous définissons les variables d'environnement pour la configuration de MySQL. Nous définissons le port du conteneur à 3306. Nous définissons le volume pour stocker les données de MySQL et nous utilisons le persistent volume claim `mysql-pvc` que nous allons détailler ci-dessous.

#### 1 persistent volume claim pour stocker les données de MySQL [📄](https://github.com/MatthieuFlaceliere/8INF876_TP-2/blob/main/k8s/00-mysql-pvc.yaml)

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
```

Ici nous définissons ressource de type `PersistentVolumeClaim` qui permet de réclamer un volume persistant. Nous définissons le nom de la ressource `mysql-pvc`.

```yaml
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

Nous définissons le mode d'accès du volume à `ReadWriteOnce` pour que le volume soit monté en lecture/écriture par un seul noeud. Nous définissons la taille du volume à 1Gi.

#### 1 service de type ClusterIP pour accéder à MySQL[📄](https://github.com/MatthieuFlaceliere/8INF876_TP-2/blob/main/k8s/02-mysql-service.yaml)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
```

Ici nous définissons ressource de type `Service` qui permet de définir un service pour accéder aux pods. Nous définissons le nom de la ressource `mysql`.

```yaml
spec:
  ports:
    - port: 3306
  selector:
    app: mysql
```

Nous définissons le port du service à 3306 qui correspond au port du conteneur de MySQL. Nous définissons le sélecteur pour cibler les pods de MySQL.

# 📝 API

### 📄 Description

L'API est une API REST qui permet de gérer des messages. Son code source est disponible dans le dossier `app` du projet.

### 🛠️ Technologies utilisées

- Node.js
- Express.js
- MySQL

### 🛣️ Routes

- GET `/` : Récupère tous les messages
- POST `/` : Crée un message
- PUT `/:id` : Met à jour un message par son id
- DELETE `/:id` : Supprime un message par son id

### 📦 Exemple body pour créer un message

```json
{
  "message": "Hello, World!"
}
```

### ⚙️ CI/CD

Lors d'une nouvelle release, une action GitHub se déclenche et effectue les actions suivantes :

- Builder l'image Docker de l'API
- Push l'image Docker sur le Docker Hub 👉[ Image ](https://hub.docker.com/repository/docker/mflaceliere/webapp)👈
