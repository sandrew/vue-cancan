'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function checkAction(abilityAction, checkedAction) {
  return abilityAction === 'manage' || abilityAction === checkedAction || abilityAction === 'read' && (checkedAction === 'index' || checkedAction === 'show');
}

function checkSubject(abilitySubject, checkedSubject) {
  return abilitySubject === 'all' || abilitySubject === checkedSubject;
}

function checkConditions(abilityConditions, fullCheckedSubject) {
  if (!Object.keys(abilityConditions).length) return true;
  var matches = [];

  Object.keys(abilityConditions).forEach(function (key) {
    if (abilityConditions[key] === fullCheckedSubject[key]) {
      matches.push(true);
    } else {
      matches.push(false);
    }
  });
  return !matches.includes(false);
}

exports.default = {
  $can: function $can(action, subject, fullSubject) {
    if (fullSubject) {
      return Boolean(this.rules.find(function (ability) {
        return ability.base_behavior && ability.subjects.find(function (abilitySubject) {
          return checkSubject(abilitySubject, subject);
        }) && ability.actions.find(function (abilityAction) {
          return checkAction(abilityAction, action);
        }) && checkConditions(ability.conditions, fullSubject);
      }));
    } else {
      return Boolean(this.rules.find(function (ability) {
        return ability.base_behavior && ability.subjects.find(function (abilitySubject) {
          return checkSubject(abilitySubject, subject) && ability.actions.find(function (abilityAction) {
            return checkAction(abilityAction, action);
          });
        });
      }));
    }
  },
  install: function install(Vue, options) {
    var _this = this;

    this.rules = options.rules;

    Vue.prototype.$can = function (action, subject, fullSubject) {
      return _this.$can(action, subject, fullSubject);
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
