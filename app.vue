<template >
  <div class="flex justify-between h-screen flex-col">        
  <div>
    <div class="grid grid-6 items-start gap-5 max-h-[90vh] overflow-auto">

      <div v-for="message in history"
        class="flex w-full max-w-xl leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700"
      >
        <div class="flex items-center space-x-2 mr-5 rtl:space-x-reverse">
          <span class="text-sm font-semibold text-gray-900 dark:text-white"
            >{{message.role }}</span
          >
          <span class="text-sm font-normal  text-gray-500 dark:text-gray-400"
            >11:46</span
          >
        </div>
        <MarkdownRenderer :source="message.parts" />
      </div>
    </div>
      <label for="chat" class="sr-only">Your message</label>

   
  </div>
  <div
        class="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700"
      >
        <textarea
        v-model="askContent"
        @keydown.enter="ask(history, askContent)"
          id="chat"
          rows="1"
          class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Your message..."
        ></textarea>
        <button
          @click="ask(history, askContent)"
          class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
        >
          <svg
            class="w-5 h-5 rotate-90 rtl:-rotate-90"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path
              d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"
            />
          </svg>
          <span class="sr-only">Send message</span>
        </button>
      </div>
    </div>
</template>

<script setup lang="ts">
import { Role, type AskRequest, type Conversation } from './typing/gemini';
import {cloneDeep} from 'lodash-es';
import MarkdownRenderer from './components/markdownRenderer.vue';

const history = ref<Conversation[]>([]);
const askContent = ref<string>('');

const allowAsk = ref<boolean>(true);

async function ask(chatHistory : Conversation[], ask : string){
if(!allowAsk.value) return;

  const askReq : AskRequest = {
    ask: askContent.value,
    history: cloneDeep(chatHistory),
  }

  history.value.push({
    role: Role.User,
    parts: askContent.value,
  });

  allowAsk.value = false;

  askContent.value = '';

  const response : string = await $fetch('http://localhost:3000/api/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: askReq
  });


  history.value.push({
    role: Role.Model,
    parts: response,
  });

  allowAsk.value = true;
}

</script>

