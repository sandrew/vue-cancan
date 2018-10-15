function checkAction(abilityAction, checkedAction) {
  return (abilityAction === 'manage') ||
         (abilityAction === checkedAction) ||
         (abilityAction === 'read' && (checkedAction === 'index' || checkedAction === 'show'));
}

function checkSubject(abilitySubject, checkedSubject) {
  return (abilitySubject === 'all') ||
         (abilitySubject === checkedSubject);
}

function checkConditions(abilityConditions, fullCheckedSubject) {
  if (!Object.keys(abilityConditions).length) return true;
  const matches = [];

  Object.keys(abilityConditions).forEach((key) => {
    if (abilityConditions[key] === fullCheckedSubject[key]) {
      matches.push(true);
    } else {
      matches.push(false);
    }
  });
  return (!matches.includes(false));
}

export default {
  $can(action, subject, fullSubject) {
    if (fullSubject) {
      return Boolean(this.rules.find((ability) => {
        return ability.base_behavior &&
               ability.subjects.find(abilitySubject => checkSubject(abilitySubject, subject)) &&
               ability.actions.find(abilityAction => checkAction(abilityAction, action)) &&
               checkConditions(ability.conditions, fullSubject);
      }));
    } else {
      return Boolean(this.rules.find((ability) => {
        return ability.base_behavior &&
               ability.subjects.find(abilitySubject => checkSubject(abilitySubject, subject) &&
               ability.actions.find(abilityAction => checkAction(abilityAction, action)));
      }));
    }
  },

  install(Vue, options) {
    this.rules = options.rules;

    Vue.prototype.$can = (action, subject, fullSubject) => this.$can(action, subject, fullSubject);

    Vue.directive('can', {
      inserted: (el, binding) => {
        if (!this.$can(Object.keys(binding.modifiers)[0], Object.keys(binding.modifiers)[1])) {
          el.remove();
        }
      },
    });
  },

  navigationGuard(defaultPath) {
    return (to, from, next) => {
      const subject = to.path.replace(/^\//, '').split('/')[0] || 'index';
      const action = to.path.replace(/^\//, '').split('/')[1] || 'index';
      if (this.$can(action, subject)) {
        next();
      } else {
        next(defaultPath);
      }
    };
  },
};
