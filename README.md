# aws-sso-tampermonkey-scripts

## AWS SSO Retrieve and inject session token

`retrieve_and_inject_session_token.user.js`


### How to use

#### Main session

Open your AWS IAM Identity Center (former AWS SSO) portal link, i.e. https://xyz.awsapps.com/start#/ as usual

You are requested if you want to inject a token. Click "Cancel" and Log-in as usual.

A new Link appears "Copy SSO Token" on top right.

#### Additional Session 

With SessionBox Chrome extension installed : https://chrome.google.com/webstore/detail/sessionbox-multi-login-to/megbklhjamjbcafknkgmokldgolkdfig?hl=fr

Click on sessionBox extension, on the 'Plus' icon (Temporary session).

Type the sso portal url. 
You are prompted for injection of token, type Yes. And Paste the token from the main session.

You are connected, Enjoy ;)

