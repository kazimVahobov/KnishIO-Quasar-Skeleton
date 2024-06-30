<template>
  <q-page class="q-pa-md flex flex-column">
    Welcome, {{ dltStore.profile.publicName }}
    <div v-if="!dltStore.isConversationStarted">
      <q-form class="row flex-column" @submit.prevent="handleStartConversation">
        <div class="col">
          <q-input v-model="userId"
                   type="text"
                   label="Enter user id to start"
                   :rules="[val => !!val || '']"
                   hide-bottom-space
                   lazy-rules/>
        </div>
        <div class="flex justify-end q-mt-md">
          <q-btn type="submit"
                 color="primary"
                 :label="loading ? null : 'Start'"
                 :disabled="userId === '' || loading">
            <q-spinner v-if="loading"
                       color="white"
                       size="xs"/>
          </q-btn>
        </div>
        <div>
          <p v-if="ownBundleIdError">You can not start conversation with yourself! Try another bundle id</p>
        </div>
      </q-form>
    </div>

    <div v-if="dltStore.isConversationStarted">
      <p>You started conversation with {{ dltStore.peerId }}</p>

      <div class="q-pa-md row justify-center">
        <div style="width: 100%; max-width: 400px">
          <q-chat-message v-for="(item, index) in dltStore.messages"
                          :key="index"
                          :text="[item.message]" :sent="item.isMine"/>
        </div>
      </div>

      <q-form class="row flex-column" @submit.prevent="handlePostMessage">
        <div class="col">
          <q-input v-model="message"
                   type="text"
                   label="Enter your message"
                   :rules="[val => !!val || '']"
                   hide-bottom-space
                   lazy-rules/>
        </div>
        <div class="justify-end q-mt-md">
          <q-btn type="submit"
                 color="primary"
                 :label="postingLoading ? null : 'Post'"
                 :disabled="message === '' || postingLoading">
            <q-spinner v-if="postingLoading"
                       color="white"
                       size="xs"/>
          </q-btn>
        </div>
      </q-form>

      <div class="flex justify-between q-mt-md">
        <q-btn type="button"
               color="deep-orange"
               @click="handleFinishConversation"
               :label="loading ? null : 'Finish conversation'">
          <q-spinner v-if="loading"
                     color="white"
                     size="xs"/>
        </q-btn>
        <q-btn type="button"
               color="primary"
               @click="handleUpdatingList"
               :label="updatingLoading ? null : 'Update list'">
          <q-spinner v-if="updatingLoading"
                     color="white"
                     size="xs"/>
        </q-btn>
      </div>
      <div class="flex justify-end q-mt-md">
        <p v-if="!updatingLoading">Auto updating after: {{10 - counter}} sec.</p>
        <p v-if="updatingLoading"><i>Auto updating...</i></p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import hasDltStore from 'src/mixins/hasDltStore'
import { ref } from 'vue'

const { dltStore } = hasDltStore()

const userId = ref('')
const message = ref('')
const ownBundleIdError = ref(false)
const loading = ref(false)
const postingLoading = ref(false)
const updatingLoading = ref(false)

const counter = ref(0)
let timeoutId = null
let timerStarted = false

const handleStartConversation = async () => {
  if (userId.value === dltStore.bundle) {
    ownBundleIdError.value = true
    return
  }
  loading.value = true
  try {
    ownBundleIdError.value = false
    await dltStore.startConversation(userId.value)
    loading.value = false
    startTimer()
  } catch (e) {
    console.log(`Error on starting conversation: ${e}`)
  }
}

const handleFinishConversation = async () => {
  loading.value = true
  try {
    await dltStore.finishConversation()
    loading.value = false
    await countingReached()
  } catch (e) {
    console.log(`Error on finishing conversation: ${e}`)
  }
}

const handlePostMessage = async () => {
  postingLoading.value = true
  try {
    await dltStore.postMessage(message.value)
    message.value = null
    postingLoading.value = false
  } catch (e) {
    console.log(`Error on posting message: ${e}`)
  }
}

const handleUpdatingList = async () => {
  updatingLoading.value = true
  try {
    const messages = await dltStore.searchMessages()
    dltStore.storeMessages(messages)
    updatingLoading.value = false
  } catch (e) {
    console.log(`Error on updating list: ${e}`)
  }
}

const startTimer = () => {
  if (timerStarted) return
  timeoutId = setInterval(() => {
    counter.value++
    if (counter.value === 10) {
      countingReached()
    }
  }, 1000)
}

const countingReached = async () => {
  clearInterval(timeoutId)
  timerStarted = false
  counter.value = 0
  await handleUpdatingList()
  startTimer()
}

</script>

<style scoped>
.flex-column {
  flex-direction: column;
}
</style>

<!--kokandpenza@gmail.com-->
<!--b542a9fbb2188d99cc8638b768ea03fb922c31506286b8c2454bab16617057b8-->

<!--penzakokand@gmail.com-->
<!--3fa03fc916caa6dbc5c8e6f414cf660fd3d56c409d26f84080d3abce5886001c-->

<!--idealleducation@gmail.com-->
<!--295ae6c4630824b20722908ccfddba4c93a0f83eb4f74d9c6558fbb6fef6bcee-->

<!--testdoubleb@gmail.com-->
<!--bcddd71475443e962ab37c2bc1de4c73132dbd5629da60a4a1d45928ac7b38d1-->
