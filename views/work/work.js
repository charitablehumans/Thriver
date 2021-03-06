import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';
import { SHA256 } from 'meteor/sha';
import Sections from '/logic/sections/sections';
import History from '/views/history/history';

import './work.html';
import './sticky';
import './admin';

const truncate = new ReactiveVar(true);

/**
 * Sections collection getter
 * @function
 *   @param {string} field - The name of the field whose value to return
 *   @param {string} id    - The Mongo DB ID of the document to return.
 *      Optional.  Uses `this` otherwise.
 *   @returns {string}
 */
const getValue = field => (id) => {
  const thisId = id || Template.instance().data.id || Template.instance().data._id;

  if (!thisId) return '';

  const result = Sections.get(thisId, [field]);

  if (result) return result[field];

  return '';
};

/**
 * Helper for changing tabs when a user clicks a link
 * @method
 *   @param {$.Event} event - jQuery Event instance
 */
const changeTabs = (event) => {
  event.stopPropagation();
  event.preventDefault();

  let parent = document.querySelector('section.mainSection.work');
  const active = parent.querySelectorAll('.active');
  const target = event.currentTarget.parentElement;
  const article = parent.querySelector(`article[data-id="${target.dataset.id}"]`);

  // don't do anything if there's no article
  if (!article) return;

  // Remove active class from all elements under parent
  for (let i = 0; i < active.length; i += 1) active[i].classList.remove('active');

  // Make article with same ID as tab active
  article.classList.add('active');

  // Make tab active, too
  target.classList.add('active');

  // Establish current path
  const parentName = parent.id;
  let path = `${parentName}/`;

  // Is this is a submenu item?
  parent = target.parentElement.parentElement;
  if (parent.nodeName.toLowerCase() === 'li') {
    // Make active
    parent.classList.add('active');

    // Add mobile article open
    document.body.classList.add('mobile-article-open');

    // Add to path
    path += `${Sections.generateId(getValue('name')(parent.dataset.id))}/`;
  }

  // Add current link to history as well
  path += Sections.generateId(getValue('name')(target.dataset.id));

  // Update history registry
  History.update(parentName, path);

  // If not already active, add fade class, then active class to body
  if (!document.body.classList.contains('workActive')) {
    // Start Fade effect
    document.body.classList.add('workFadeIn');

    // End Fade effect
    setTimeout(() => {
      document.body.classList.remove('workFadeIn');
      document.body.classList.add('workActive');

      $('.sticky').stick_in_parent({
        parent: $('.work .main'),
        offset_top: 100,
      });
      // Calculate height of article content to determine
      // whether Read More button should display
      if (article.offsetHeight >= 650) {
        article.querySelector('footer.truncate').classList.remove('hide');
      }
    }, 250);
  }

  // Scroll to top of work on change tabs
  const offset = $('.work .main.container').offset().top - 125;
  $('body').animate({ scrollTop: offset }, 750);

  // Calculate height of article content to determine
  // whether Read More button should display
  if (article.querySelector('.markdown').offsetHeight >= 650) {
    article.querySelector('footer.truncate').classList.remove('hide');
  }
};

// Work helpers
Template.work.helpers({
  /**
   * Whether or not to show read more/less buttons
   */
  truncate: () => (truncate.get() ? '' : 'workReading'),
});

// Tabs
Template.workNav.helpers({
  name: getValue('name'),
  icon: getValue('icon'),
  hasChildren: () => {
    const id = Template.instance().data.id || Template.instance().data._id;
    const result = Sections.get(id, ['children']);

    if (result && result.children && result.children.length) return true;

    return false;
  },
  tabs: getValue('children'),
  childCount: () => {
    const id = Template.instance().data.id || Template.instance().data._id;
    const result = Sections.get(id, ['children']);
    const count = result.children.length;
    if (count % 4 === 0 || count % 4 >= 2) return 'grid-4';
    return 'grid-3';
  },

});

// Navigation
Template.workListItem.helpers({
  icon: getValue('icon'),
  name: getValue('name'),
  tabs: getValue('children'),
  tabName: getValue('name'),
  // TODO(micchickenburger): Create true anchor refs
  anchor: () => '#',
});

// Content Container
Template.workContentContainer.helpers({
  tabs: getValue('children'),
  template: getValue('template'),
  subtabs: getValue('children'),
});

// Content
Template.workContent.helpers({
  data: getValue('data'),
  icon: getValue('icon'),
  name: getValue('name'),
  hash: () => {
    const id = Template.instance().id || Template.instance()._id;
    const { content } = getValue('data')(id);

    // Return a SHA256 hash of the content for use in editing
    if (content) return SHA256(content);

    return '';
  },
});

// About SA
Template.aboutSA.helpers({
  data: getValue('data'),
  hash: () => {
    const id = Template.instance().id || Template.instance()._id;
    const content = getValue('data')(id).aboutSA;

    // Return a SHA256 hash of the content for use in editing
    if (content) return SHA256(content);

    return '';
  },
});

// Helper for changing tabs
Template.workNav.events({
  'click h2': changeTabs,
  'click li > ul > li > a': changeTabs,
  'click button.backToTopWork': () => {
    const offset = $('.work .main.container').offset().top - 125;

    if ('scrollBehavior' in document.documentElement.style) {
      window.scroll({ top: offset, behavior: 'smooth' });
    } else {
      $('body,html').stop(true, true).animate({ scrollTop: offset }, 750);
    }
  },

  /**
   * @summary Navigate back to Index
   * @method
   *   @param {$.Event} event
   */
  'click li.backToIndexWork': (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Fade out and make not active
    document.body.classList.add('workFadeOut');
    setTimeout(() => document.body.classList
      .remove('workActive', 'workReading', 'workFadeOut'), 200);

    // Scroll to top of work on change tabs
    const section = event.delegateTarget.parentElement.parentElement;
    History.navigate(`/${section.id}/`);
  },
});

Template.workContent.events({
  /**
   * @summary Handle Read More/Less
   * @method
   *   @param {$.Event} event
   */
  'click footer.truncate button': (event) => {
    event.preventDefault();

    // Don't truncate
    if (truncate.get()) truncate.set(false);
    else {
      // Do truncate
      truncate.set(true);

      // Scroll back to top
      const offset = $('.work .main.container').offset().top - 125;

      if ('scrollBehavior' in document.documentElement.style) {
        window.scroll({ top: offset, behavior: 'smooth' });
      } else {
        $('body,html').stop(true, true).animate({ scrollTop: offset }, 750);
      }
    }

    // Recalculate sticky library
    $('.sticky').trigger('sticky_kit:recalc');
  },

  /**
   * @summary Mobile Support - Back to Previous
   * @method
   */
  'click .backToPrevious': () => document.body.classList.remove('mobile-article-open'),
});

const smoothScroll = (event) => {
  // Prevent link from activating
  event.preventDefault();

  // Get position of element
  const { target } = event;
  let element = document.querySelector(target.hash);
  let offsetTop = 0;

  // If anchor exists (and why shouldn't it?)
  if (element instanceof Element) {
    // Active Read More
    truncate.set(false);

    // Aggregate offset top
    while (element.offsetParent) {
      offsetTop += element.offsetTop;
      element = element.offsetParent;
    }

    const offset = offsetTop - 130;

    if ('scrollBehavior' in document.documentElement.style) {
      window.scroll({ top: offset, behavior: 'smooth' });
    } else {
      $('body,html').stop(true, true).animate({ scrollTop: offset }, 750);
    }
  }
};

/**
 * Dynamically Generate Tertiary menu
 * @method
 */
Template.workContent.onRendered(() => {
  const instance = Template.instance();

  Tracker.autorun((c) => {
    const tertiary = instance.firstNode.querySelector('.workTertiary');
    const content = tertiary.parentElement.querySelectorAll('h3');
    const ul = document.createElement('ul');

    // Wait until ready
    if (!content.length) return;

    // Quit if there already is a menu (this method executes a dozen times
    // for some reason...)
    if (tertiary.children[0] instanceof Element) return;

    // We're ready now
    c.stop();

    // Show Tertiary Navigation
    tertiary.classList.remove('hide');
    tertiary.parentElement.querySelector('.glossary').classList.remove('hide');

    for (let i = 0; i < content.length; i += 1) {
      // Create list and anchor elements
      const li = document.createElement('li');
      const a = document.createElement('a');

      // Create link details
      a.href = `#${content[i].id}`;
      a.textContent = content[i].textContent;
      a.addEventListener('click', smoothScroll);

      // Add elements
      ul.appendChild(li).appendChild(a);
    }

    tertiary.appendChild(ul);
  });
});

/**
 * @summary Register Deep-linking
 * @method
 */
Template.work.onRendered(() => {
  // Get db ID from current instance
  const instance = Template.instance();
  const { data } = instance;
  const instanceName = data.name;

  // Register
  if (data && instanceName) {
    History.registry.insert({
      element: Sections.generateId(instanceName),

      /** Handle deep-linking */
      callback: (path) => {
        // Get Sections recursively
        const getChildren = (id) => {
          const sections = {};
          const { children } = Sections.get(id, ['children']);

          // Get name and ID for each tab
          for (let i = 0; i < children.length; i += 1) {
            // Get section name
            const section = Sections.get(children[i], ['name']);

            // Do nothing if the section doesn't exist
            if (section) {
              let { name } = section;

              // Then sanitize section name
              name = Sections.generateId(name);

              // Add to link list and Recurse
              sections[name] = getChildren(children[i]);

              // Add ID to list as well
              sections[name]._id = section._id;
            }
          }

          return sections;
        };

        // If there's no path, there's nothing to do
        if (!path.length) return;

        // Get link list of all browseable sections
        let sections = getChildren(data._id);

        // Get link for deep-linked section
        for (let i = 0; i < path.length; i += 1) {
          if (sections[path[i]]) sections = sections[path[i]];
          else break;
        }

        // Find anchor element
        const link = document.querySelector(`li[data-id="${sections._id}"] > a`);

        // Click anchor to activate page
        if (link instanceof Element) link.click();
      },
    });
  }
});

export default getValue;
