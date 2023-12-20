<template>
    <div v-html="markdown.render(source)" />
  </template>
  
  <script setup lang="ts">
  import MarkdownIt from "markdown-it";
  
  import MarkdownItHighlightjs from "markdown-it-highlightjs";

  
  const markdown = new MarkdownIt()
    .use(MarkdownItHighlightjs)
  
  defineProps({
    source: {
      type: String,
      default: ""
    }
  });
  </script>