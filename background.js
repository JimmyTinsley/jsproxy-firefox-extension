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
  contexts: ["link", "selection"]
}, onCreated);

/*
Attach prefix obtained from preference before the url got from link or selectionText,
and then open the combined url in a new browser tab.
If selected text is not a url, jsproxy will automatically google it. :D
*/
async function openWithProxy(info) {
  var gotItem = await browser.storage.sync.get('jsproxy_sandbox_url');
  var jsproxy_prefix = gotItem.jsproxy_sandbox_url; 
  console.log(jsproxy_prefix);
  var current_url;
  if (info.linkUrl !== undefined) {
    current_url = info.linkUrl;
  } else {
    current_url = info.selectionText;
  }
  var creating = browser.tabs.create({
    url: jsproxy_prefix + "-----" + current_url
  });
  creating.then(onCreated, onError);
}

/*
The click event listener for menus, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
browser.menus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "open-with-proxy":
      openWithProxy(info);
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

