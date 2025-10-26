const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');

// Configurar multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Validar tipos de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no válido. Solo se permiten: JPG, PNG, GIF, WEBP'));
    }
  }
});

/**
 * Sube una imagen a Firebase Storage
 */
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    const folder = req.body.folder || 'products';
    const file = req.file;
    
    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.originalname);
    const fileName = `${folder}/${timestamp}-${randomString}${extension}`;

    // Obtener referencia al bucket de Firebase Storage
    const bucket = admin.storage().bucket();
    const fileUpload = bucket.file(fileName);

    // Crear stream de escritura
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: randomString
        }
      }
    });

    // Manejar errores del stream
    stream.on('error', (error) => {
      console.error('Error subiendo imagen:', error);
      res.status(500).json({ error: 'Error al subir la imagen' });
    });

    // Cuando termine de subir
    stream.on('finish', async () => {
      try {
        // Hacer el archivo público
        await fileUpload.makePublic();

        // Obtener URL pública
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        res.status(200).json({
          success: true,
          url: publicUrl,
          fileName: fileName
        });
      } catch (error) {
        console.error('Error obteniendo URL pública:', error);
        res.status(500).json({ error: 'Error al obtener URL de la imagen' });
      }
    });

    // Escribir el buffer al stream
    stream.end(file.buffer);

  } catch (error) {
    console.error('Error en uploadSingleImage:', error);
    res.status(500).json({ error: error.message || 'Error al subir la imagen' });
  }
};

/**
 * Sube múltiples imágenes a Firebase Storage
 */
const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron imágenes' });
    }

    const folder = req.body.folder || 'products';
    const uploadPromises = [];

    // Subir cada imagen
    for (const file of req.files) {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = path.extname(file.originalname);
      const fileName = `${folder}/${timestamp}-${randomString}${extension}`;

      const bucket = admin.storage().bucket();
      const fileUpload = bucket.file(fileName);

      const uploadPromise = new Promise((resolve, reject) => {
        const stream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
            metadata: {
              firebaseStorageDownloadTokens: randomString
            }
          }
        });

        stream.on('error', reject);
        stream.on('finish', async () => {
          try {
            await fileUpload.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            resolve(publicUrl);
          } catch (error) {
            reject(error);
          }
        });

        stream.end(file.buffer);
      });

      uploadPromises.push(uploadPromise);
    }

    // Esperar a que todas las imágenes se suban
    const urls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      urls: urls,
      count: urls.length
    });

  } catch (error) {
    console.error('Error en uploadMultipleImages:', error);
    res.status(500).json({ error: error.message || 'Error al subir las imágenes' });
  }
};

/**
 * Elimina una imagen de Firebase Storage
 */
const deleteImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'No se proporcionó URL de imagen' });
    }

    // Extraer el nombre del archivo de la URL
    const bucket = admin.storage().bucket();
    const urlParts = imageUrl.split(`${bucket.name}/`);
    
    if (urlParts.length < 2) {
      return res.status(400).json({ error: 'URL de imagen inválida' });
    }

    const fileName = urlParts[1];

    // Eliminar el archivo
    await bucket.file(fileName).delete();

    res.status(200).json({
      success: true,
      message: 'Imagen eliminada correctamente'
    });

  } catch (error) {
    console.error('Error en deleteImage:', error);
    
    // Si el archivo no existe, considerarlo como éxito
    if (error.code === 404) {
      return res.status(200).json({
        success: true,
        message: 'La imagen ya no existe'
      });
    }

    res.status(500).json({ error: error.message || 'Error al eliminar la imagen' });
  }
};

module.exports = {
  upload,
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage
};
