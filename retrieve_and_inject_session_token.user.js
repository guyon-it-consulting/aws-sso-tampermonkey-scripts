// ==UserScript==
// @name         AWS SSO Retrieve & inject session token
// @namespace    https://github.com/guyon-it-consulting/
// @version      0.3
// @description  Allow retrieving and injection SSO session token accross browser sessions
// @author       Jérôme GUYON - jerome.guyon@guyon-it-consulting.fr
// @match        https://*.awsapps.com/start/*
// @grant        none
// @require      https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
// @require      https://code.jquery.com/jquery-3.6.1.slim.min.js
// @run-at       document-idle
// @downloadURL  https://github.com/guyon-it-consulting/aws-sso-tampermonkey-scripts/raw/main/retrieve_and_inject_session_token.user.js
// @updateURL    https://github.com/guyon-it-consulting/aws-sso-tampermonkey-scripts/raw/main/retrieve_and_inject_session_token.user.js
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
  const cookie = input;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(cookie).then(() => {
      console.log('Copied to clipboard successfully.');
    }, (err) => {
      console.log('Failed to copy the text to clipboard.', err);
    });
  } else if (window.clipboardData) {
    window.clipboardData.setData("Text", cookie);
  }
}

// Wait for loading of banner
waitForKeyElements("div.awsui-context-top-navigation", function() {

    const serviceLinkBanner = $('div.awsui-context-top-navigation > header > div > div:nth-child(2) ');
    //const firstChildToMimic = serviceLinkBanner.find(">:first-child");
    const firstChildToMimic = serviceLinkBanner.find(">:nth-child(2)");
    const newNode = firstChildToMimic.clone();
    newNode.find("span > a > span").text('Copy SSO cookie');
    newNode.find("span > a").attr("href", "#")

    serviceLinkBanner.prepend(newNode);

    newNode.click(function(e) {
        //retrieve current value of token
        const tokenValue = getCookie('x-amz-sso_authn');
        //copy token
        copy(tokenValue);
    });

}, false);


//on Load, look for cookies
(function() {
    'use strict';

    const tokenValue = getCookie('x-amz-sso_authn');
    if(!tokenValue)
    {
        /*if (navigator.clipboard) {
            const injectToken = navigator.clipboard.read();

            setCookie('x-amz-sso_authn', injectToken.replace("COOKIE=", ""), 1);
        }

        }else if (window.clipboardData){
            //TODO
        }*/

        //if( confirm("No sso token cookie detected. Do you want to inject one?") )
        {
            const injectToken = prompt("No sso token cookie detected. Do you want to inject one? Please enter the token");
            setCookie('x-amz-sso_authn', injectToken, 1);
        }
    }

})();
