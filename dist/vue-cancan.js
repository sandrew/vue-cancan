'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function checkAction(abilityAction, checkedAction) {
  return abilityAction == 'manage' || abilityAction == checkedAction || abilityAction == 'read' && (checkedAction == 'index' || checkedAction == 'show');
}

function checkSubject(abilitySubject, checkedSubject) {
  return abilitySubject == 'all' || abilitySubject == checkedSubject;
}

exports.default = {
  $can: function $can(action, subject) {
    return this.rules.find(function (ability) {
      return ability.base_behavior && ability.subjects.find(function (abilitySubject) {
        return checkSubject(abilitySubject, subject);
      }) && ability.actions.find(function (abilityAction) {
        return checkAction(abilityAction, action);
      });
    }) && true;
  },
  setRules: function setRules(rules) {
    this.rules = rules;
  },
  install: function install(Vue, options) {
    var _this = this;

    this.rules = options.rules;

    Vue.globalProperties.$can = function (action, subject) {
      return _this.$can(action, subject);
    };

    Vue.globalProperties.setRules = function (rules) {
      return _this.setRules(rules);
    };

    Vue.directive('can', {
      inserted: function inserted(el, binding) {
        if (!_this.$can(Object.keys(binding.modifiers)[0], Object.keys(binding.modifiers)[1])) {
          el.remove();
        }
      }
    });
  },
  navigationGuard: function navigationGuard(defaultPath) {
    var _this2 = this;

    return function (to, from, next) {
      var subject = to.path.replace(/^\//, '').split('/')[0] || 'index';
      var action = to.path.replace(/^\//, '').split('/')[1] || 'index';
      if (_this2.$can(action, subject)) {
        next();
      } else {
        next(defaultPath);
      }
    };
  }
};
