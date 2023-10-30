// message.ts
import mongoose from 'mongoose';

// Definindo o esquema para as mensagens
const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true, // O conteúdo é um campo obrigatório
    },
    // Você pode adicionar mais campos aqui conforme necessário
    timestamp: {
        type: Date,
        default: Date.now, // O padrão é a hora atual
    },
});

// Criando o modelo a partir do esquema
const Message = mongoose.model('Message', messageSchema);

export default Message;
