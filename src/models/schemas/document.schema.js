import mongoose from 'mongoose';
// Subschema reutilizable: NO se registra con mongoose.model() porque no es una colección propia. Se embebe en User (array `documents`) y en Order (campo `proof`) para guardar metadatos de archivos subidos con Multer. Nunca guarda el archivo en sí, solo su referencia (path, nombre, tipo, etc)
const documentSchema = new mongoose.Schema(
    {
        originalName: { type: String, required: true },
        fileName: { type: String, required: true },
        path: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        type: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
    },
    { _id: false }
);
 
export default documentSchema;
 