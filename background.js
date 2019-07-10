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
Called when the item has been removed.
We'll just log success here.
*/
function onRemoved() {
  console.log("Item removed successfully");
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
  }
  
});

/*
Called when the toolbar button has been clicked.
*/
function handleClick() {
  browser.runtime.openOptionsPage();
}

/*
Click event listener for toolbar button. 
*/
browser.browserAction.onClicked.addListener(handleClick);

