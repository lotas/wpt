'use strict';

let iframe = document.createElement('iframe');

promise_test(async () => {
  await new Promise(resolve => {
    iframe.src = '../resources/open-in-iframe.html';
    iframe.sandbox.add('allow-scripts');
    iframe.allow = 'serial';
    document.body.appendChild(iframe);
    iframe.addEventListener('load', resolve);
  });

  await new Promise(resolve => {
    iframe.contentWindow.postMessage({type: 'RequestPort'}, '*');

    window.addEventListener('message', (messageEvent) => {
      assert_true(
          /FAIL: NotFoundError: Failed to execute 'requestPort' on 'Serial': No port selected by the user./
              .test(messageEvent.data));
      resolve();
    });
  });
}, 'Calls to Serial APIs from a sandboxed iframe are valid.');