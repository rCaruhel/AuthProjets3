<template>
  <div class="register-container">
    <h2>Se Connecter</h2>
    <form @submit.prevent="login">
      <div>
        <label for="login">Login :</label>
        <input type="text" v-model="user.displayName" required />
      </div>
      <div>
        <label for="password">Mot de passe :</label>
        <input type="password" v-model="user.password" required />
      </div>
      <button type="submit">Se connecter</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>

import {loginUser} from "@/services/user.service";
import {mapActions} from "vuex";

export default {
  name : 'UserLogin',
  data() {
    return {
      user: {
        displayName: '',
        password: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    ...mapActions(['setProfile']),
    async login() {
        let User = {
          displayName: this.user.displayName,
          password: this.user.password
        }
        const response = await loginUser(User);
        if(response.error){
          this.errorMessage = response.data
        }
        else{
          alert(response.message);
          await this.setProfile();
          await this.$router.push('/');
        }
    }
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}
label {
  display: block;
  margin: 10px 0 5px;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
button:hover {
  background-color: #218838;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
