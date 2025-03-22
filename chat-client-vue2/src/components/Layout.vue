<template>
  <div>
    <!-- Barre de navigation (toujours affichée) -->
    <div class="header">
      <button v-if="!userName" @click="loginWithGoogle" class="login-button">Se connecter avec Google</button>
      <button v-if="!userName" @click="loginWithDiscord" class="login-button">Se connecter avec Discord</button>
      <button v-if="userName" @click="logout" class="login-button">Se déconnecter</button>

      <router-link v-if="!userName" to="/userRegister" class="login-button">S'inscrire</router-link>
      <router-link v-if="!userName" to="/userLogin" class="login-button">Connexion</router-link>

      <p v-if="userName"><strong>Connecté en tant que : {{ userName }}</strong></p>
    </div>

    <!-- Affichage de la page actuelle -->
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState(['userName'])
  },
  methods: {
    ...mapActions(['loginUserDiscord', 'loginUserGoogle', 'logoutUser']),
    loginWithGoogle() {
      this.loginUserGoogle();
    },
    loginWithDiscord() {
      this.loginUserDiscord();
    },
    logout() {
      this.logoutUser();
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #ddd;
}
.login-button {
  padding: 10px;
  background-color: #4285F4;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}
</style>
