// Array of resources to load (CSS and JS)
const resources = [
  {
    type: 'css',
    url: 'https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css',
  },
  {
    type: 'js',
    url: 'https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js',
    module: true,
  },
  {
    type: 'js',
    url: 'https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.js',
    nomodule: true,
  },
  // You can add more resources here in the future
];

// Function to load the resources dynamically
resources.forEach(resource => {
  if (resource.type === 'css') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = resource.url;
    document.head.appendChild(link);
  } else if (resource.type === 'js') {
    const script = document.createElement('script');
    script.src = resource.url;
    if (resource.module) script.type = 'module';
    if (resource.nomodule) script.nomodule = true;
    document.head.appendChild(script);
  }
});

// Add Ionic configuration to the global window object
window.Ionic = { config: { mode: 'ios' } };