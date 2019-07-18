function saveOptions(e) {
  browser.storage.sync.set({
    jsproxy_sandbox_url: document.querySelector("#jsproxy_sandbox_url").value
  });
  var label = document.createElement("label");
  label.innerHTML = "You have set your jsproxy sandbox url!";
  document.body.appendChild(label);
  e.preventDefault();
}

function restoreOptions() {
  var gettingItem = browser.storage.sync.get('jsproxy_sandbox_url');
  gettingItem.then((res) => {
    if (res.jsproxy_sandbox_url !== "") {
      document.querySelector("#jsproxy_sandbox_url").value = res.jsproxy_sandbox_url;
    } else {
      document.querySelector("#jsproxy_sandbox_url").value = "https://jsproxy.cf";
      browser.storage.sync.set({
        jsproxy_sandbox_url: document.querySelector("#jsproxy_sandbox_url").value
      });
    }
    // document.querySelector("#jsproxy_sandbox_url").value = res.jsproxy_sandbox_url || 'https://jsproxy.gq';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);