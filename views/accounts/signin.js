import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import Canvas from '/views/canvas/canvas';
import Toast from '/views/components/toasts';

import './signin.html';

Template.signin.helpers({
  submitValue: 'Sign In',
  register: 'Create an Account',
  items: [{
    title: 'Email',
    id: 'signinEmail',
    type: 'email',
    required: 'required',
    placeholder: 'Email',
  }, {
    title: 'Passphrase',
    id: 'signinPassword',
    type: 'password',
    required: 'required',
    placeholder: 'Passphrase',
  }],
});

// Signin Form
Template.signin.events({
  'submit form': (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    // Handle login errors
    const handleError = (message) => {
      const error = form.querySelector('#login-error');

      // Show error element
      error.classList.remove('hide');

      if (error instanceof Element) error.textContent = message;
    };

    // Log in the user
    Meteor.loginWithPassword(email, password, (error) => {
      // Handle errors
      if (error) {
        switch (error.error) {
          case 403:
            handleError('So sorry. Either you\'ve mistyped your email address,'
              + ' or your passphrase is incorrect.');
            break;
          default:
            handleError('An unknown error has occurred.');
        }
        return;
      }

      // Close sidebars and reset form
      form.reset();
      Canvas.closeSidebars();
      Toast({ text: 'Welcome! You are now signed in.' });
    });
  },
});
