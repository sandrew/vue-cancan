# vue-cancan

This is a plugin for seamless integration of Vue.js application with Rails backend authorization framework CanCan[Can].

# Installation

## 1. In Vue.js app

```
yarn add vue-cancan
```

In your app's entry point file:

```javascript
import VueCanCan from 'vue-cancan'

// window.abilities - are exported JSON abilities from CanCan, read further.
Vue.use(VueCanCan, { abilities: window.abilities });
```

In your routes definition:

```javascript:
const router = new VueRouter({
  routes: [
    // ...
  ],
})

// Redirect to root url when user has no rights to see the page
router.beforeEach(VueCanCan.navigationGuard('/'));
```

## 2. In Rails app

TODO...

# Examples




## Things To Do

- Support for abilities conditions and scopes
- Read routes meta to redefine required abilities
- Interface to define abilities client-side
