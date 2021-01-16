import crypto from 'crypto';

export function encryptItem(item: string) {
    const cryptoKey = process.env.CRYPTO_KEY;
    const cryptoIv = process.env.CRYPTO_IV;
    if ( !cryptoKey || !cryptoIv ) return { error: true, message: 'Some key not found' };

    const formatedKey = crypto.scryptSync(cryptoKey, 'salt', 32);

    const cipher = crypto.createCipheriv('aes-256-gcm', formatedKey, cryptoIv);

    const encryptedItem = cipher.update(item);

    return {error: false, item: encryptedItem.toString('hex')};
}