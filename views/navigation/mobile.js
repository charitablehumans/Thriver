import { Template } from 'meteor/templating';
import mainNavigationHelpers from './navigation';
import utilityNavigationHelpers from './utility';
import Util from '/views/canvas/ui/util';

import './mobile.html';

Template.navigationMobile.helpers(mainNavigationHelpers);
Template.navigationMobile.helpers(utilityNavigationHelpers);

Template.navigationMobile.events({
  'click [data-type="main-navigation-item"]': () => {
    const toggleMobile = document
      .querySelectorAll('[aria-controls][data-toggle=mobile-navigation]');
    const mobileNavigation = document.getElementById('mobile-navigation');

    for (let i = 0; i < toggleMobile.length; i += 1) {
      Util.makeActive(toggleMobile[i], false);
    }

    Util.hide(mobileNavigation, true);
    document.body.classList.remove('noScroll');
  },

  'click #mobile-navigation figure a[href="#service-providers"]': () => {
    const toggleMobile = document
      .querySelectorAll('[aria-controls][data-toggle=mobile-navigation]');
    const mobileNavigation = document.getElementById('mobile-navigation');

    for (let i = 0; i < toggleMobile.length; i += 1) {
      Util.makeActive(toggleMobile[i], false);
    }

    Util.hide(mobileNavigation, true);
    document.body.classList.remove('noScroll');
  },
});
