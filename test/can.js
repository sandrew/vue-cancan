import Vue from 'vue/dist/vue.common';
import VueCanCan from '../dist/vue-cancan';

const assert = require('assert');

Vue.use(VueCanCan, {
  rules: [
    {
      base_behavior: true,
      actions: ['create', 'read', 'update', 'destroy'],
      subjects: ['Comment'],
      conditions: { user_id: 1 },
    },
    {
      base_behavior: true,
      actions: ['read'],
      subjects: ['Post'],
      conditions: { user_id: 1 },
    },
  ],
});


describe('Vue', () => {
  describe('#$can()', () => {
    context('when Comment', () => {

      it('should return true when can destroy comment', () => {
        assert.equal(Vue.prototype.$can('destroy', 'Comment'), true);
      });

      it('should return true when can update comment', () => {
        assert.equal(Vue.prototype.$can('update', 'Comment'), true);
      });

      it('should return true when can create comment', () => {
        assert.equal(Vue.prototype.$can('create', 'Comment'), true);
      });

      it('should return true when can read comment', () => {
        assert.equal(Vue.prototype.$can('read', 'Comment'), true);
      });
    });

    context('when create Comment', () => {
      it('should return false when cannot destroy comment', () => {
        assert.equal(Vue.prototype.$can('destroy', 'Comment', { user_id: 2 }), false);
      });

      it('should return false when cannot update comment', () => {
        assert.equal(Vue.prototype.$can('update', 'Comment', { user_id: 2 }), false);
      });

      it('should return true when can create comment', () => {
        assert.equal(Vue.prototype.$can('create', 'Comment', { user_id: 1 }), true);
      });

      it('should return false when cannot read comment', () => {
        assert.equal(Vue.prototype.$can('read', 'Comment', { user_id: 2 }), false);
      });
    });

    context('when read Post', () => {
      it('should return false when cannot destroy post', () => {
        assert.equal(Vue.prototype.$can('destroy', 'Post', { user_id: 1 }), false);
      });

      it('should return false when cannot update post', () => {
        assert.equal(Vue.prototype.$can('update', 'Post', { user_id: 1 }), false);
      });

      it('should return false when cannot create post', () => {
        assert.equal(Vue.prototype.$can('create', 'Post', { user_id: 1 }), false);
      });

      it('should return true when can read post', () => {
        assert.equal(Vue.prototype.$can('read', 'Post', { user_id: 1 }), true);
      });

      it('should return false when cannot read post', () => {
        assert.equal(Vue.prototype.$can('read', 'Post', { user_id: 2 }), false);
      });
    });
  });
});
