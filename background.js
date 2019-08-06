/*
____ ____ _  _ ___ ____ _  _ ___    _  _ ____ _  _ _  _    ____ _  _ _  _ ____ ___ _ ____ _  _ ____
|    |  | |\ |  |  |___  \/   |     |\/| |___ |\ | |  |    |___ |  | |\ | |     |  | |  | |\ | [__
|___ |__| | \|  |  |___ _/\_  |     |  | |___ | \| |__|    |    |__| | \| |___  |  | |__| | \| ___]

*/
/*
Create the context menu items.
*/
browser.menus.create({
  id: "open-with-proxy",
  title: browser.i18n.getMessage("menuItemOpenWithProxy"),
  contexts: ["link"]
}, onContextMenuItemCreated);

browser.menus.create({
  id: "search-with-proxy",
  title: browser.i18n.getMessage("menuItemSearchWithProxy"),
  contexts: ["selection"]
}, onContextMenuItemCreated);

browser.menus.create({
  id: "open-image-with-proxy",
  title: browser.i18n.getMessage("menuItemOpenImageWithProxy"),
  contexts: ["image"]
}, onContextMenuItemCreated);

/*
This function loads jsproxy sandbox url from preferences for further use.
*/
async function getJsproxyPrefix() {
  var gotItem = await browser.storage.sync.get('jsproxy_sandbox_url');
  var jsproxy_sandbox_url = gotItem.jsproxy_sandbox_url;
  if (jsproxy_sandbox_url.slice(-1) !== "/") {
    jsproxy_sandbox_url = jsproxy_sandbox_url + "/";
  }
  return jsproxy_sandbox_url;
}

/*
The click event listener for menus, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
browser.menus.onClicked.addListener(async function(info) {
  var jsproxy_prefix = await getJsproxyPrefix();
  var postfix;
  switch (info.menuItemId) {
    case "open-with-proxy":
      postfix = info.linkUrl;
      break;
    case "search-with-proxy":
      postfix = info.selectionText
      break;
    case "open-image-with-proxy":
      postfix = info.srcUrl
  }
  var creating = browser.tabs.create({
    url: jsproxy_prefix + "-----" + postfix
  });
  creating.then(onTabCreated, onError);
});


/*
___  ____ ____ _ _ _ ____ ____ ____    ____ ____ ___ _ ____ _  _    ____ _  _ _  _ ____ ___ _ ____ _  _ ____
|__] |__/ |  | | | | [__  |___ |__/    |__| |     |  | |  | |\ |    |___ |  | |\ | |     |  | |  | |\ | [__
|__] |  \ |__| |_|_| ___] |___ |  \    |  | |___  |  | |__| | \|    |    |__| | \| |___  |  | |__| | \| ___]

*/
/*
Called when the toolbar button has been clicked.
*/
function handleBrowserActionClick() {
  browser.runtime.openOptionsPage();
}

/*
Click event listener for toolbar button. 
*/
browser.browserAction.onClicked.addListener(handleBrowserActionClick);


/*
___  ____ ____ ____    ____ ____ ___ _ ____ _  _    ____ _  _ _  _ ____ ___ _ ____ _  _ ____
|__] |__| | __ |___    |__| |     |  | |  | |\ |    |___ |  | |\ | |     |  | |  | |\ | [__
|    |  | |__] |___    |  | |___  |  | |__| | \|    |    |__| | \| |___  |  | |__| | \| ___]

*/

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
*/
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

function protocolIsApplicable(url) {
  var anchor =  document.createElement('a');
  anchor.href = url;
  return APPLICABLE_PROTOCOLS.includes(anchor.protocol);
}

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializePageAction(tab) {
  if (protocolIsApplicable(tab.url)) {
    browser.pageAction.setIcon({tabId: tab.id, path: "icons/page-16.png"});
    browser.pageAction.setTitle({tabId: tab.id, title: browser.i18n.getMessage("pageAction")});
    browser.pageAction.show(tab.id);
  }
}

/*
Page action click event listener that switches on/off jsproxy for current tab page.
*/
browser.pageAction.onClicked.addListener(async function(tab) {
  var jsproxy_prefix = await getJsproxyPrefix();
  if (tab.url.slice(0, jsproxy_prefix.length) == jsproxy_prefix) {
    var updating = browser.tabs.update({url: tab.url.substring(jsproxy_prefix.length+5, tab.url.length)});
    updating.then(onTabUpdated, onError);
  } else {
    var updating = browser.tabs.update({url: jsproxy_prefix + "-----" + tab.url});
    updating.then(onTabUpdated, onError);
  }
});


/*
___  ____ ___  _  _ ____ ____ _ _  _ ____    ____ _  _ _  _ ____ ___ _ ____ _  _ ____
|  \ |___ |__] |  | | __ | __ | |\ | | __    |___ |  | |\ | |     |  | |  | |\ | [__
|__/ |___ |__] |__| |__] |__] | | \| |__]    |    |__| | \| |___  |  | |__| | \| ___]

*/
/*
Called when the tab page has been updated.
*/
function onTabUpdated(tab) {
  console.log(`Updated tab: ${tab.id}`);
}

/*
Called when a new tab page has been created.
*/
function onTabCreated(tab) {
  console.log(`Created tab: ${tab.id}`);
}

/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onContextMenuItemCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

/*
Called when there was an error.
We'll just log the error here.
*/
function onError(error) {
  console.log(`Error: ${error}`);
}