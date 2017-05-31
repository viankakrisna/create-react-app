// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.
import React from 'react';
import ReactDOM from 'react-dom';
import Toast from './Toast';

const useToast = true;
const domId = 'create-react-app-toast';
let dom = document.getElementById(domId);

if (!dom) {
  dom = document.createElement('div');
  dom.id = domId;
  document.body.appendChild(dom);
}

function showMessage(message) {
  if (useToast) {
    ReactDOM.render(
      <Toast>
        {message}
      </Toast>,
      dom
    );
  } else {
    console.log(message);
  }
}

export default function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // At this point, the old content will have been purged and
                  // the fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in your web app.
                  showMessage('New content is available. Please refresh.');
                } else {
                  // At this point, everything has been precached.
                  // It's the perfect time to display a
                  // "Content is cached for offline use." message.
                  showMessage('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch(error => {
          console.error('Error during service worker registration:', error);
        });
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    showMessage(
      <span>
        Development mode started.{' '}
        <a
          href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md"
        >
          Read Me
        </a>
      </span>
    );
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
