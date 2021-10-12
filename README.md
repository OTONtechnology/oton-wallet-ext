# oton-wallet-ext

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Auth via extension
Creating event to send auth/register request to extension
```
const event = new CustomEvent('app:auth', {
  detail: {
    type: 'auth', // auth | register
    ...
  },
});
document.dispatchEvent(event);
```

Listening event
```
document.addEventListener('owe:setAddress', (data: any) => {
  console.log(data.detail);
});
```
