// ==UserScript==
// @name         AWS SSO Retrieve & inject session token
// @namespace    https://github.com/guyon-it-consulting/
// @version      0.1
// @description  Allow retrieving and injection SSO session token accross browser sessions
// @author       Jérôme GUYON - jerome.guyon@guyon-it-consulting.fr
// @match        https://*.awsapps.com/start/*
// @grant        none
// @require      https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
// @require      https://code.jquery.com/jquery-3.6.1.slim.min.js
// @run-at       document-start
// ==/UserScript==

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function copy(input) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(input).then(() => {
      console.log('Copied to clipboard successfully.');
    }, (err) => {
      console.log('Failed to copy the text to clipboard.', err);
    });
  } else if (window.clipboardData) {
    window.clipboardData.setData("Text", input);
  }
}

// Wait for loading of banner
waitForKeyElements("div.service-links", function() {

    const serviceLinkBanner = $('div.service-links');

    serviceLinkBanner.prepend($('<div class="divider"><div>'));

    const nodeCopyCookie = $('<a>Copy SSO cookie</a>');
    nodeCopyCookie.click(function(e) {
        //retrieve current value of token
        const tokenValue = getCookie('x-amz-sso_authn');
        //copy token
        copy(tokenValue);
    });

    serviceLinkBanner.prepend(nodeCopyCookie);

}, false);


//on Load, look for cookies
(function() {
    'use strict';

    const tokenValue = getCookie('x-amz-sso_authn');
    if(!tokenValue)
    {
        if( confirm("No sso token cookie detected. Do you want to inject one?") )
        {
            const injectToken = prompt("Please enter the token");
            setCookie('x-amz-sso_authn', injectToken, 1);
        }
    }

})();
