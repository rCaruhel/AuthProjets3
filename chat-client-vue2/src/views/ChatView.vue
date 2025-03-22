<template>
  <div class="chat-container">
    <div v-if="this.userName">
      <div class="messages">
        <div v-for="(msg, index) in messages" :key="index" class="message">
          <strong>{{ msg.sender }} :</strong> {{ msg.text }}
        </div>
      </div>

      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Écris ton message..." />
      <button @click="sendMessage">Envoyer</button>


    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import {mapActions, mapState} from "vuex";

export default {
  data() {
    return {
      socket : null,
      messages: [],
      users: [],
      newMessage: '',
    };
  },
  async created() {
    await this.setProfile();

    this.socket = io('http://localhost:3000');

    this.socket.on('message', (message) => {
      this.messages.push(message);
    });

    this.socket.on('userList', (userList) => {
      this.users = userList;
    });
    await this.setProfile();
  },
  methods: {
    ...mapActions(['loginUserDiscord','loginUserGoogle', 'logoutUser', 'setProfile']),
    sendMessage() {
      if (this.newMessage.trim() !== '' && this.userName) {
        this.socket.emit('message', { pseudo: this.userName, text: this.newMessage });
        this.newMessage = '';
      }
    }
  },
  computed:{
    ...mapState(['userName'])
  },
};
</script>

<style scoped>
.chat-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
}

.messages {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
}
.message {
  background: #f1f1f1;
  padding: 5px;
  margin: 5px 0;
  border-radius: 5px;
}
input {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 10px;
}
button {
  padding: 10px 20px;
  cursor: pointer;
}
</style>