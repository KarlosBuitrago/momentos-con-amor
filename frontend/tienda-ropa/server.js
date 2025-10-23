const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// Todas las rutas devuelven index.html para SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
