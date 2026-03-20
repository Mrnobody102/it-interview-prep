# Frontend — Vue.js

## 1. Overview

**Vue.js** is a progressive JavaScript framework for building user interfaces. It can be adopted incrementally — from a simple reactive library to a full-featured SPA framework.

---

## 2. Component

### 2.1. Single File Component (SFC)

Vue components are defined in `.vue` files that combine template, logic, and styles.

```vue
<template>
  <div class="greeting">
    <h1>{{ message }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Reactive state
const count = ref(0);

// Computed property
const doubled = computed(() => count.value * 2);

// Methods
function increment() {
  count.value++;
}
</script>

<style scoped>
.greeting {
  text-align: center;
}
button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
}
</style>
```

### 2.2. Options API vs Composition API

```vue
<!-- Options API (Vue 2 style) -->
<script>
export default {
  data() {
    return { count: 0 };
  },
  computed: {
    doubled() { return this.count * 2; }
  },
  methods: {
    increment() { this.count++; }
  }
}
</script>
```

```vue
<!-- Composition API with <script setup> (Vue 3 recommended) -->
<script setup>
import { ref, computed } from 'vue';
const count = ref(0);
const doubled = computed(() => count.value * 2);
function increment() { count.value++; }
</script>
```

---

## 3. Reactivity System

### 3.1. ref and reactive

```javascript
import { ref, reactive, toRefs } from 'vue';

// ref — for primitives and objects
const count = ref(0);
count.value++;          // Access via .value in script

// reactive — for objects only
const state = reactive({
  name: 'Alice',
  age: 30,
  isActive: true
});
state.age++;            // No .value needed

// Convert reactive object to refs
const { name, age } = toRefs(state);
```

### 3.2. Computed Properties

```javascript
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// Read-only computed
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// Computed with get/set
const reversedName = computed({
  get: () => firstName.value.split('').reverse().join(''),
  set: (value) => { firstName.value = value.split('').reverse().join(''); }
});
```

### 3.3. Watchers

```javascript
import { ref, watch, watchEffect } from 'vue';

const userId = ref(1);

// Watch a specific ref
watch(userId, (newVal, oldVal) => {
  console.log(`Changed from ${oldVal} to ${newVal}`);
  fetchUser(newVal);
});

// Watch multiple sources
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log('Name changed');
});

// Auto-watch dependencies (runs immediately)
watchEffect(() => {
  console.log(`Watching: ${firstName.value} ${lastName.value}`);
  // Automatically tracks firstName and lastName
});
```

---

## 4. Lifecycle Hooks

| Hook | Description |
|------|-------------|
| `setup()` | Before component is created — use Composition API here |
| `onMounted()` | After component is mounted to DOM |
| `onUpdated()` | After component's DOM is updated |
| `onUnmounted()` | After component is removed from DOM |
| `onBeforeMount()` | Before mounting |
| `onBeforeUpdate()` | Before DOM update |
| `onBeforeUnmount()` | Before unmounting |
| `onErrorCaptured()` | When an error is captured from a child component |

```javascript
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  console.log('Component mounted');
  // Fetch initial data
  fetchData();
});

onUnmounted(() => {
  console.log('Component will unmount');
  // Cleanup subscriptions, timers
  clearInterval(timerId);
});
```

---

## 5. Component Communication

### 5.1. Props (Parent to Child)

```javascript
// Child: UserCard.vue
defineProps({
  name: { type: String, required: true },
  age: { type: Number, default: 0 },
  isActive: Boolean
});
```

```html
<!-- Parent -->
<UserCard name="Alice" :age="30" isActive />
```

### 5.2. Events (Child to Parent)

```javascript
// Child: ButtonCounter.vue
const emit = defineEmits(['increment', 'decrement']);

function handleClick() {
  emit('increment', 1);    // emit('eventName', payload)
}
```

```html
<!-- Parent -->
<ButtonCounter @increment="onIncrement" @decrement="onDecrement" />
```

### 5.3. Provide/Inject (Deep Hierarchy)

```javascript
// Ancestor component
import { provide, ref } from 'vue';
const theme = ref('dark');
provide('theme', theme);

// Descendant (any depth)
import { inject } from 'vue';
const theme = inject('theme');
```

---

## 6. Vue Router

### 6.1. Route Configuration

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import UserProfile from './views/UserProfile.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/users/:id', name: 'profile', component: UserProfile, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```

### 6.2. Navigation

```html
<!-- Link to route -->
<router-link to="/">Home</router-link>
<router-link :to="{ name: 'profile', params: { id: user.id } }">Profile</router-link>

<!-- Navigate programmatically -->
<button @click="$router.push('/')">Go Home</button>
<button @click="$router.back()">Back</button>
```

### 6.3. Route Guards

```javascript
// Global guard
router.beforeEach((to, from) => {
  const isAuthenticated = localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' };
  }
});

// Component-level guard
defineProps({
  beforeRouteEnter(to, from, next) {
    // Called before route is confirmed
    next(vm => { /* access component instance */ });
  }
});
```

---

## 7. Vuex / Pinia (State Management)

### 7.1. Pinia (Recommended for Vue 3)

```javascript
// stores/userStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const users = ref([]);
  const loading = ref(false);

  // Getter
  const userCount = computed(() => users.value.length);

  // Action
  async function fetchUsers() {
    loading.value = true;
    users.value = await fetch('/api/users').then(r => r.json());
    loading.value = false;
  }

  return { users, loading, userCount, fetchUsers };
});
```

```javascript
// In component
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';

const store = useUserStore();
const { users, loading } = storeToRefs(store);
// OR destructuring actions directly
const { fetchUsers } = store;
```

### 7.2. Vuex (Vue 2 / Legacy)

| Concept | Description |
|---------|-------------|
| **State** | Single source of truth (like Redux store) |
| **Getters** | Computed properties from state |
| **Mutations** | Synchronous state changes (commit) |
| **Actions** | Async operations, commit mutations |
| **Modules** | Namespaced sub-stores |

---

## 8. Composition API Patterns

### 8.1. Composables (Custom Hooks)

```javascript
// composables/useCounter.js
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  function increment() { count.value++; }
  function decrement() { count.value--; }
  function reset() { count.value = initialValue; }

  const doubled = computed(() => count.value * 2);

  return { count, doubled, increment, decrement, reset };
}
```

```javascript
// In component
import { useCounter } from '@/composables/useCounter';
const { count, doubled, increment, reset } = useCounter(10);
```

### 8.2. Async Data Fetching

```javascript
// composables/useFetch.js
import { ref, onUnmounted } from 'vue';

export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(true);

  let controller = new AbortController();

  async function fetchData() {
    loading.value = true;
    try {
      const res = await fetch(url, { signal: controller.signal });
      data.value = await res.json();
    } catch (err) {
      if (err.name !== 'AbortError') error.value = err;
    } finally {
      loading.value = false;
    }
  }

  onUnmounted(() => controller.abort());

  return { data, error, loading, refetch: fetchData };
}
```

---

## 9. Interview Questions

**Q: What is the difference between `v-if` and `v-show`?**

> `v-if` actually removes/creates elements from the DOM (not just hides). `v-show` uses CSS `display: none`. Use `v-if` for conditions that rarely change (better performance for infrequent toggles). Use `v-show` for frequent toggles (avoids DOM manipulation overhead).

**Q: How does Vue's reactivity system work for arrays?**

> Vue wraps array mutation methods (push, pop, splice, etc.) to trigger updates. However, Vue **cannot detect** direct index assignment like `items[index] = newValue`. Use `splice()` or the reactive methods, or use `vue.set()` / `arr.splice(index, 1, newValue)`.

**Q: What is `nextTick` used for?**

> `nextTick` defers a callback to be executed after the next DOM update cycle. It is used when you need to access the DOM immediately after a reactive state change.

```javascript
import { nextTick } from 'vue';

async function updateAndScroll() {
  item.value = 'New Value';
  await nextTick();
  scrollToElement('#target');
}
```
