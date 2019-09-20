# jsproxy-firefox-extension
Firefox extension for [jsproxy](https://github.com/EtherDream/jsproxy).

Chrome version can be found [here](https://github.com/JimmyTinsley/jsproxy-chrome-extension).

## Before use the extension
- Make sure you are clear about how to use jsproxy.
- Click the button on toolbar and set your own jsproxy sandbox url, which was set to `https://js.jimmytinsley.workers.dev/` by default.
- Open jsproxy page sandbox at least once to initialize service worker.

## Use
- Right click on a link, then click on context menu option `Open with jsproxy` to open the link with jsproxy in a new broswer tab.
- Right click on a section of selected text, then click on context menu option `Search with Google` to search selected text with Google. If the selected text is a url, it will open this url with jsproxy.
- Right click on an image, then click on context menu option `Open image with jsproxy` to open the image with jsproxy in a new broswer tab.
- If the current page is not opened by jsproxy (the one set in extension settings), clicking on the button at address bar will reopen this page with jsproxy, otherwise, reopen this page without jsproxy. 

## TODO
- Add more preference settings. 
- Implement more features.
- ...

## LICENSE
Apache License 2.0
