# vue-cancan

This is a plugin for seamless integration of Vue.js application with Rails backend authorization framework CanCan[Can].

# Installation

## 1. In Vue.js app

```
yarn add vue-cancan
```

In your app's entry point file:

```javascript
import Vue from 'vue'
import VueCanCan from 'vue-cancan'

// window.abilities - are exported JSON abilities from CanCan, read further.
Vue.use(VueCanCan, { rules: window.abilities.rules });
```

In your routes definition:

```javascript:
import VueRouter from 'vue-router'
import VueCanCan from 'vue-cancan'

const router = new VueRouter({
  routes: [
    // ...
  ],
})

// Redirect to root url when user has no rights to see the page
router.beforeEach(VueCanCan.navigationGuard('/'));
```

## 2. In Rails app

From the Rails side everything you need is to pass current_ability's JSON exported rules to the application. You can do it with gem `gon` or just with a template:

```html
<script>
window.abilities = <%= current_ability.to_json.html_safe %>
</script>
```

CanCanCan gem in fresh version provides `ability.as_json` method. If for some reason you use older versions, you can add this method to your `Ability` class:

```ruby
def as_json(foo)
  rules.map do |rule|
    {
      base_behavior: rule.base_behavior,
      actions:       rule.actions.as_json,
      subjects:      rule.subjects.map(&:to_s),
      conditions:    rule.conditions.as_json
    }
  end
end
```
# Usage

## In templates

vue-cancan defines a directive `v-can` for templates to check if the user can see the element. It requires two modificators: action and resource name:

```html
<div id='navbar-item' v-can.index.users>
  <a href='/admin/users'>Users Administration</a>
</div>
```

This is equal to Rails erb template:

```
<% if can? :index, User %>
  <div id='navbar-item'>
    <a href='/admin/users'>Users Administration</a>
  </div>
<% end %>
```

For more complicated checks you can use `v-if` directive with Vue method `$can`:

```html
<td v-if="$can('edit', 'users') || $can('destroy', 'users')">User operations</td>
```
Usage with conditions (send the needed object as the third argument):
```html
<td v-if="$can('edit', 'User', user) || $can('destroy', 'User', user })">User operations</td>
```

## In routes

```javascript
router.beforeEach(VueCanCan.navigationGuard('/'));
```

This construction adds navigation guard for Router to check if user has access to the URL. It works by parsing requested path and interprets it in this way:

`/users/new` will be challenged against `$can('new', 'users')`, `/users` will be challenged against `$can('index', 'users')`.

## Abilities definition

The convention is the same as for Rails' `cancan` gem. `manage` action covers any possible actions, `all` subject covers any possible subjects. Ability to `manage` `all` - is a superuser ability.

Another alias is `read` - it covers `index` and `show` actions.

Other usual actions in the convention are `update`, `destroy`, `create`. And of course, you can define any other actions.

# ToDo

- Support for abilities conditions and scopes
- Read routes meta to redefine required abilities
- Interface to define abilities client-side
