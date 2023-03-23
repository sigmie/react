<template>
  <slot v-bind="state"></slot>
</template>

<script setup>
import { reactive, defineProps, watch, onBeforeMount } from "vue";

let props = defineProps({
  url: {
    type: String,
    default: null,
  },
  search: {
    type: String,
    default: "",
  },
  applicationId: {
    type: String,
    default: "",
  },
  apiKey: {
    type: String,
    default: "",
  },
  query: {
    type: String,
    default: "",
  },
  filters: {
    type: String,
    default: "",
  },
  facets: {
    type: String,
    default: "",
  },
  perPage: {
    type: Number,
    default: 10,
  },
  debounceMs: {
    type: Number,
    default: 150,
  },
});

let state = reactive({ hits: {}, total: 0, loading: false, facets: {} });

onBeforeMount(() => search());

let search = function () {
  state.loading = true;

  const body = {
    query: props.query,
    per_page: props.perPage,
    filters: props.filters,
    facets: props.facets,
  };

  const url = props.url
    ? props.url
    : `https://${props.applicationId}.sigmie.app/v1/search/${props.search}`;

  fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      "X-Sigmie-API-Key": props.apiKey,
      "X-Sigmie-Application": props.applicationId,
    },
    redirect: "follow",
    body: JSON.stringify(body),
  })
    .then((respone) => {
      return respone.json();
    })
    .then((response) => {
      if (response.error) {
        throw new Error(response.message, { cause: response });
      }

      state.hits = response.hits;
      state.total = response.total;
      state.facets = response.facets;
      state.loading = false;
    });
};

watch(props, search);
</script>
