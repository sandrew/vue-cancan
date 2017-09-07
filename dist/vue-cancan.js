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
    return this.abilities.find(function (ability) {
      return ability.can && ability.subjects.find(function (abilitySubject) {
        return checkSubject(abilitySubject, subject);
      }) && ability.actions.find(function (abilityAction) {
        return checkAction(abilityAction, action);
      });
    }) && true;
  },
  install: function install(Vue, options) {
    var _this = this;

    this.abilities = options.abilities;

    Vue.prototype.$can = function (action, subject) {
      return _this.$can(action, subject);
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
