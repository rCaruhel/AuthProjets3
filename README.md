Mini projet 3, authentification avec google, discord 
Possibilité de s'enregistrer avec un username/Mdp

Le frontend stocke l'id utilisateur, ainsi que le nom d'utilisateur
Le backend Utilise mongodb pour stocker les Utilisateurs et les messages
les utilisateurs connectés avec google ou discord ont leur id, nom enregistrés dans la bdd
ceux crées an local ont leur nom et leur mot de passe encrypté stockés dans la bdd

Pour lancer le frontend : 
 cd chat-client-vue2
 npm run serve

 Pour lancer le backend :
   cd chat-server
   npm start
