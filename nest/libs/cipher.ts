import config from 'config/config';
const crypto = require('crypto');

const cipherKey = config.cipher.key;

export default {
    encrypt: (text) => {
        const cipherIv = crypto.randomBytes(16);
        const enc = crypto.createCipheriv(config.cipher.twoWayAlgorithm, Buffer.from(cipherKey), cipherIv);
        let encrypted = enc.update(text);

        encrypted = Buffer.concat([encrypted, enc.final()]);

        return cipherIv.toString('hex') + ':' + encrypted.toString('hex');
    },

    decrypt: (text) => {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(config.cipher.twoWayAlgorithm, Buffer.from(cipherKey), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();

    }
}
