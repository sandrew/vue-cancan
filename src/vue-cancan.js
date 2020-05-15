function checkAction(abilityAction, checkedAction) {
  return (abilityAction == 'manage') ||
    		 (abilityAction == checkedAction) ||
    		 (abilityAction == 'read' && (checkedAction == 'index' || checkedAction == 'show'));
}

function checkSubject(abilitySubject, checkedSubject) {
  return (abilitySubject == 'all') ||
    		 (abilitySubject == checkedSubject);
}

export default {
  $can(action, subject) {
    return this.rules.find((ability) => {
      return ability.base_behavior &&
        ability.subjects.find((abilitySubject) => checkSubject(abilitySubject, subject)) &&
        ability.actions.find((abilityAction) => checkAction(abilityAction, action));
    }) && true;
  },

  setRules(rules) {
    this.rules = rules;
  },

  install(Vue, options) {
    this.rules = options.rules;

    Vue.prototype.$can = (action, subject) => this.$can(action, subject);

    Vue.prototype.setRules = (rules) => this.setRules(rules);

    Vue.directive('can', {
      inserted: (el, binding) => {
        if(!this.$can(Object.keys(binding.modifiers)[0], Object.keys(binding.modifiers)[1])) {
          el.remove();
        }
      }
    });
  },

  navigationGuard(defaultPath) {
    return (to, from, next) => {
      const subject = to.path.replace(/^\//, '').split('/')[0] || 'index';
      const action = to.path.replace(/^\//, '').split('/')[1] || 'index';
      if(this.$can(action, subject)) {
        next()
      } else {
        next(defaultPath);
      }
    }
  }
}
