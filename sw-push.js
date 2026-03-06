// El Toro Push Notification Service Worker
// This file must be at the ROOT of your site (same folder as index.html)

self.addEventListener('push', function(event) {
  var data = { title: 'El Toro 🐂', body: 'You have an update!', icon: '', url: '/' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch(e) {
      data.body = event.data.text();
    }
  }

  var options = {
    body: data.body || '',
    icon: data.icon || '',
    badge: data.badge || '',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'El Toro 🐂', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if (clientList[i].url.indexOf(url) !== -1 && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
