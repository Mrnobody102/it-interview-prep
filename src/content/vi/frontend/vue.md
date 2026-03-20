# Frontend - Vue.js

## 1. Tổng quan

**Vue.js** là một **progressive JavaScript framework** — có thể dùng từng phần (CDN) hoặc full SPA.

| Đặc điểm | Mô tả |
|-----------|-------|
| **Framework** | Progressive — tích hợp dần dần |
| **Language** | JavaScript / TypeScript |
| **Rendering** | Client-side (SPA) + SSR (Nuxt) |
| **Size** | ~33KB (gzip) — lightweight |
| **Architecture** | Component-based |
| **State** | Options API hoặc Composition API |

---

## 2. Vue CLI & Project Structure

### 2.1. Common Commands

```bash
# Tạo project
npm create vue@latest my-app -- --typescript --router --pinia
npm init vue@latest my-app

# Vue CLI (legacy)
npm install -g @vue/cli
vue create my-app
vue create my-app --preset "vue3"

# Build & Serve
npm run build          # Production build
npm run dev           # Dev server
npm run preview       # Preview production build

# Testing
npm run test:unit     # Vitest
npm run test:e2e      # Playwright/Cypress
npm run test:coverage

# Linting
npm run lint
```

### 2.2. Project Structure (Vue 3 + Vite)

```
src/
  components/          # Reusable components
    UserCard.vue
    BaseButton.vue
  views/              # Page components (routed views)
    HomeView.vue
    UserView.vue
  composables/        # Vue Composition API logic (hooks)
    useCounter.ts
    useAuth.ts
  stores/             # Pinia stores
    userStore.ts
  router/
    index.ts
  types/              # TypeScript types
    user.ts
  App.vue
  main.ts
```

---

## 3. Options API vs Composition API

### 3.1. Options API (Legacy)

```vue
<!-- UserCard.vue -->
<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UserCard',
  props: {
    title: { type: String, required: true },
    initialCount: { type: Number, default: 0 }
  },
  emits: ['count-changed'],
  data() {
    return {
      count: this.initialCount
    };
  },
  computed: {
    doubled(): number {
      return this.count * 2;
    }
  },
  watch: {
    count(newVal: number) {
      this.$emit('count-changed', newVal);
    }
  },
  methods: {
    increment(): void {
      this.count++;
    }
  },
  mounted(): void {
    console.log('Component mounted');
  }
});
</script>

<style scoped>
.card {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
```

### 3.2. Composition API (Recommended)

```vue
<!-- Counter.vue -->
<template>
  <div class="counter">
    <h3>{{ title }}</h3>
    <p>Doubled: {{ doubled }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

// Props
const props = defineProps<{
  title: string;
  initialCount?: number;
}>();

// Emits
const emit = defineEmits<{
  (e: 'count-changed', value: number): void;
}>();

// Reactive state
const count = ref(props.initialCount ?? 0);

// Computed
const doubled = computed(() => count.value * 2);

// Watch
watch(count, (newVal) => {
  emit('count-changed', newVal);
});

// Methods
function increment(): void {
  count.value++;
}

// Lifecycle
onMounted(() => {
  console.log('Component mounted');
});
</script>

<style scoped>
.counter {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
```

---

## 4. Reactivity

### 4.1. ref vs reactive

```typescript
import { ref, reactive, readonly, toRefs } from 'vue';

// ref — cho primitive values và objects
const count = ref(0);           // count.value = 0
const user = ref({ name: 'Huy', age: 25 });
user.value.name = 'Hieu';        // Must use .value

// reactive — cho objects (proxy)
const state = reactive({
  count: 0,
  user: { name: 'Huy', age: 25 }
});
state.count++;                   // No .value needed
state.user.name = 'Hieu';

// toRefs — convert reactive() to refs
const state = reactive({ count: 0, name: 'Huy' });
const { count, name } = toRefs(state);
// count and name are now refs pointing to state properties

// readonly — prevent mutation
const original = reactive({ count: 0 });
const readOnly = readonly(original);
```

### 4.2. Computed & Watch

```typescript
import { computed, watch, watchEffect } from 'vue';

const firstName = ref('Huy');
const lastName = ref('Nguyen');

// Computed — derived values
const fullName = computed(() => `${firstName.value} ${lastName.value}`);
const greeting = computed(() => `Hello, ${fullName.value}!`);

// Watch — watch specific refs
watch(firstName, (newVal, oldVal) => {
  console.log(`${oldVal} → ${newVal}`);
});

// Watch multiple
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`${oldFirst} ${oldLast} → ${newFirst} ${newLast}`);
});

// Watch reactive object
watch(() => state.user.name, (newName) => {
  console.log('Name changed:', newName);
});

// watchEffect — automatic dependency tracking
watchEffect(() => {
  // Runs immediately and re-runs when reactive dependencies change
  console.log(`${firstName.value} ${lastName.value}`);
});

// Watch options
watch(source, callback, {
  immediate: true,     // Run immediately
  deep: true,          // Deep watch
  flush: 'post',       // 'pre' | 'post' | 'sync'
  once: true           // Only run once
});
```

---

## 5. Composables (Vue Hooks)

Composables là functions dùng Vue Composition API để **reuse stateful logic**.

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const increment = () => count.value++;
  const decrement = () => count.value--;
  const reset = () => count.value = initialValue;
  const doubled = computed(() => count.value * 2);

  return {
    count,
    increment,
    decrement,
    reset,
    doubled
  };
}

// composables/useFetch.ts
import { ref } from 'vue';

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchData() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data.value = await res.json();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  }

  return { data, loading, error, fetchData };
}
```

```vue
<!-- Usage -->
<script setup>
import { useCounter } from './composables/useCounter';

const { count, increment, doubled } = useCounter(5);
</script>
```

---

## 6. Pinia (State Management)

### 6.1. Store Definition

```typescript
// stores/userStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types/user';

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([]);
  const currentUser = ref<User | null>(null);
  const loading = ref(false);

  // Getters (computed)
  const userCount = computed(() => users.value.length);
  const sortedUsers = computed(() =>
    [...users.value].sort((a, b) => a.name.localeCompare(b.name))
  );
  const isLoggedIn = computed(() => currentUser.value !== null);

  // Actions
  async function fetchUsers(): Promise<void> {
    loading.value = true;
    try {
      const res = await fetch('/api/users');
      users.value = await res.json();
    } finally {
      loading.value = false;
    }
  }

  function addUser(user: User): void {
    users.value.push(user);
  }

  function removeUser(id: number): void {
    users.value = users.value.filter(u => u.id !== id);
  }

  function setCurrentUser(user: User | null): void {
    currentUser.value = user;
  }

  return {
    users,
    currentUser,
    loading,
    userCount,
    sortedUsers,
    isLoggedIn,
    fetchUsers,
    addUser,
    removeUser,
    setCurrentUser
  };
});
```

### 6.2. Using Store in Component

```vue
<script setup>
import { useUserStore } from '../stores/userStore';
import { storeToRefs } from 'pinia';

const store = useUserStore();
// Extract reactive refs (không bị mất reactivity)
const { users, loading, userCount } = storeToRefs(store);
const { addUser, removeUser } = store;
</script>
```

---

## 7. Routing

### 7.1. Router Configuration

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    title: 'Home'
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/UsersView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users/:id',
    name: 'user-detail',
    component: () => import('../views/UserDetailView.vue'),
    props: true  // Route params as props
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Navigation guard
router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
});

export default router;
```

### 7.2. Navigation in Components

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

function goToUser(id: number): void {
  router.push({ name: 'user-detail', params: { id } });
}

function goToHome(): void {
  router.push('/');
}

// Read route params
const userId = route.params.id;  // string
const query = route.query;       // { page: '1', sort: 'name' }
</script>

<template>
  <router-link to="/users">Users</router-link>
  <router-link :to="{ name: 'user-detail', params: { id: 1 } }">User 1</router-link>
</template>
```

---

## 8. Directives

### 8.1. Built-in Directives

| Directive | Shorthand | Mô tả |
|-----------|-----------|-------|
| `v-text` | - | Text content |
| `v-html` | - | Inner HTML (XSS risk!) |
| `v-show` | - | Toggle visibility (display: none) |
| `v-if` | - | Conditional rendering (add/remove from DOM) |
| `v-else-if` | - | Else-if branch |
| `v-else` | - | Else branch |
| `v-for` | - | List rendering |
| `v-bind` | `:` | Bind attribute/expression |
| `v-on` | `@` | Event listener |
| `v-model` | - | Two-way binding |
| `v-slot` | `#` | Slot content |
| `v-cloak` | - | Hide until Vue mounts |

### 8.2. Custom Directives

```typescript
// directives/v-focus.ts
export const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
};

// directives/v-highlight.ts
export const vHighlight = {
  mounted(el: HTMLElement, binding: any) {
    el.style.backgroundColor = binding.value || 'yellow';
  },
  updated(el: HTMLElement, binding: any) {
    if (binding.value !== binding.oldValue) {
      el.style.backgroundColor = binding.value || 'yellow';
    }
  }
};
```

```vue
<script setup>
// Register locally
const vFocus = { mounted: (el) => el.focus() };
</script>

<template>
  <input v-focus />
  <div v-highlight="'lightblue'">Highlight me</div>
</template>
```

---

## 9. Vue 3 Script Setup Syntax

```vue
<script setup lang="ts">
// Imports are automatic — no need to return from setup()
import { ref, computed, watch } from 'vue';
import ChildComponent from './ChildComponent.vue';
import { useCounter } from './composables/useCounter';

// Top-level await (Vue 3.2+)
const data = await fetch('/api/data').then(r => r.json());

// defineProps — compile-time macros (no import needed)
const props = defineProps<{
  title: string;
  count?: number;
  items?: string[];
}>();

// defineEmits — compile-time macros
const emit = defineEmits<{
  (e: 'update', value: number): void;
  (e: 'delete'): void;
}>();

// defineExpose — expose public instance properties
defineExpose({
  publicMethod: () => console.log('Hello')
});

// Using composables
const { count, increment } = useCounter();
</script>

<template>
  <ChildComponent :items="props.items" />
  <button @click="emit('update', count)">Update</button>
</template>
```

---

## 10. Common Interview Questions

### Q: Sự khác biệt giữa Vue 2 và Vue 3?

| | Vue 2 | Vue 3 |
|--|-------|-------|
| **Architecture** | Options API | Options API + **Composition API** |
| **Reactivity** | Object.defineProperty | **Proxy** (better, handles adding/removing props) |
| **TypeScript** | Partial support | **First-class** TypeScript support |
| **Bundle size** | Larger | ~30% smaller |
| **API** | Options API only | Options + Composition API |
| **Multi-root** | Fragment (one root only) | **Native multi-root** templates |
| **Lifecycle** | `beforeDestroy` | `beforeUnmount` |
| **Templating** | Template compiler (separate) | Same |

### Q: Sự khác biệt giữa `v-if` và `v-show`?

| | `v-if` | `v-show` |
|--|--------|-----------|
| **DOM** | Thêm/xóa element khỏi DOM | Giữ element, toggle `display: none` |
| **Performance** | Tốt hơn cho infrequent toggling | Tốt hơn cho frequent toggling |
| **v-else** | Hỗ trợ | Không hỗ trợ |
| **Hooks** | Có lifecycle hooks | Không |

### Q: Vuex vs Pinia?

| | Vuex | Pinia |
|--|------|-------|
| **API** | Complex, more boilerplate | Simple, less boilerplate |
| **Devtools** | Native integration | Native integration (with plugin) |
| **TypeScript** | Needs workarounds | **First-class** TS support |
| **Modularity** | Modules required | Stores are natural modules |
| **Mutations** | Has mutations | No mutations (actions only) |
| **State** | Reactive | Reactive |
| **Official** | Yes (core team) | **Official** (recommended) |

### Q: Composition API benefits?

1. **Better TypeScript support** — dễ dàng type inference
2. **Better code organization** — nhóm logic theo feature, không theo options type
3. **Better logic reuse** — Composables là cách clean để share logic
4. **Tree-shakable** — chỉ import những gì dùng
5. **Smaller bundle** — nhỏ hơn Options API

### Q: Vue 3 vs React?

| | Vue 3 | React |
|--|-------|-------|
| **Template vs JSX** | Template (có sẵn HTML-like syntax) | JSX (JavaScript XML) |
| **Styling** | Scoped CSS trong SFC | CSS-in-JS, CSS modules |
| **Data binding** | Two-way (v-model) | One-way data flow |
| **State** | Pinia (recommended) | Redux/Zustand |
| **Ecosystem** | Smaller | Larger |
| **Learning curve** | Gentle (HTML-like) | Steeper (JSX) |
| **Performance** | Compiled templates (potentially faster) | Virtual DOM |
