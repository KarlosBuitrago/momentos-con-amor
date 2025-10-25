export const environment = {
  production: true,
  apiUrl: (typeof window !== 'undefined' && (window as any)['env']?.['API_URL']) || 'https://momentos-con-amor.onrender.com/api',
  firebase: {
    apiKey: 'AIzaSyB0QCE8C_WxckurgUwe9bo8Cp5yb7WUinc',
    authDomain: 'react-firebase-dbc76.firebaseapp.com',
    projectId: 'react-firebase-dbc76',
    storageBucket: 'react-firebase-dbc76.firebasestorage.app',
    messagingSenderId: '939984149747',
    appId: '1:939984149747:web:781baec0344099337a2b86',
    measurementId: 'G-L1CV7CHK81'
  }
};
