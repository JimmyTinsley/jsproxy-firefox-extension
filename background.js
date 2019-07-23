/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
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

/*
Create the context menu items.
*/
browser.menus.create({
  id: "open-with-proxy",
  title: browser.i18n.getMessage("menuItemOpenWithProxy"),
  contexts: ["link"]
}, onCreated);

browser.menus.create({
  id: "search-with-proxy",
  title: browser.i18n.getMessage("menuItemSearchWithProxy"),
  contexts: ["selection"]
}, onCreated);

browser.menus.create({
  id: "open-image-with-proxy",
  title: browser.i18n.getMessage("menuItemOpenImageWithProxy"),
  contexts: ["image"]
}, onCreated);

/*
This function obtains jsproxy sandbox url from preferences for further use.
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
Open the clicked link with jsproxy by attaching a prefix before the link's url.
*/
function openWithProxy(info, jsproxy_prefix) {
  var creating = browser.tabs.create({
    url: jsproxy_prefix + "-----" + info.linkUrl
  });
  creating.then(onCreated, onError);
}

/*
Search the selected keyword with jsproxy-Google by attaching a prefix before selected text.
*/
function searchWithProxy(info, jsproxy_prefix) {
  var creating = browser.tabs.create({
    url: jsproxy_prefix + "-----" + info.selectionText
  });
  creating.then(onCreated, onError);
}

/*
Open the clicked image with jsproxy by attaching a prefix before the image's source url.
*/
function openImageWithJsproxy(info, jsproxy_prefix) {
  var creating = browser.tabs.create({
    url: jsproxy_prefix + "-----" + info.srcUrl
  });
  creating.then(onCreated, onError);
}

/*
The click event listener for menus, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
browser.menus.onClicked.addListener(async function(info) {
  var jsproxy_prefix = await getJsproxyPrefix();
  switch (info.menuItemId) {
    case "open-with-proxy":
      openWithProxy(info, jsproxy_prefix);
      break;
    case "search-with-proxy":
      searchWithProxy(info, jsproxy_prefix);
      break;
    case "open-image-with-proxy":
      openImageWithJsproxy(info, jsproxy_prefix);
  }
  
});

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
Called when the tab page has been updated.
*/
function onUpdated(tab) {
  console.log(`Updated tab: ${tab.id}`);
}

/*
Page action click event listener that switches on/off jsproxy for current tab page.
*/
browser.pageAction.onClicked.addListener(async function(tab) {
  var jsproxy_prefix = await getJsproxyPrefix();
  if (tab.url.slice(0, jsproxy_prefix.length) == jsproxy_prefix) {
    var updating = browser.tabs.update({url: tab.url.substring(jsproxy_prefix.length+5, tab.url.length)});
    updating.then(onUpdated, onError);
  } else {
    var updating = browser.tabs.update({url: jsproxy_prefix + "-----" + tab.url});
    updating.then(onUpdated, onError);
  }
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
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});