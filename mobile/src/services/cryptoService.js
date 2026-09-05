// ══════════════════════════════════════════════════════════════
// HUGPONG — Cryptographic Security & Password Hashing Service
// Implements Standard FIPS 180-2 SHA-256 with Salt
// ══════════════════════════════════════════════════════════════

const PASSWORD_SALT_PREFIX = 'hugpong_salt_2026:';

/**
 * Computes standard SHA-256 hash for any ASCII / UTF-8 string
 * @param {string} ascii 
 * @returns {string} 64-character lowercase hexadecimal hash
 */
export function sha256(ascii) {
  function rightRotate(value, amount) { 
    return (value >>> amount) | (value << (32 - amount)); 
  }

  var words = [];
  var str = String(ascii || '');
  var asciiBitLength = str.length * 8;
  var hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  var k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  for (var i = 0; i < str.length; i++) {
    words[i >> 2] |= str.charCodeAt(i) << (24 - (i % 4) * 8);
  }
  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (var j = 0; j < words.length; j += 16) {
    var w = words.slice(j, j + 16);
    while (w.length < 16) w.push(0);
    var oldHash = hash.slice(0);
    for (var step = 0; step < 64; step++) {
      var s1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      var ch = (hash[4] & hash[5]) ^ ((~hash[4]) & hash[6]);
      var temp1 = (hash[7] + s1 + ch + k[step] + (w[step] = (step < 16) ? (w[step] || 0) : (
        w[step - 16] +
        (rightRotate(w[step - 15], 7) ^ rightRotate(w[step - 15], 18) ^ (w[step - 15] >>> 3)) +
        w[step - 7] +
        (rightRotate(w[step - 2], 17) ^ rightRotate(w[step - 2], 19) ^ (w[step - 2] >>> 10))
      ) | 0)) | 0;
      var s0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      var maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      var temp2 = (s0 + maj) | 0;
      hash = [(temp1 + temp2) | 0, hash[0], hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
    }
    for (var hIdx = 0; hIdx < 8; hIdx++) hash[hIdx] = (hash[hIdx] + oldHash[hIdx]) | 0;
  }

  var result = '';
  for (var resIdx = 0; resIdx < 8; resIdx++) {
    for (var b = 3; b >= 0; b--) {
      var byteVal = (hash[resIdx] >> (b * 8)) & 255;
      result += (byteVal < 16 ? '0' : '') + byteVal.toString(16);
    }
  }
  return result;
}

/**
 * Returns a salted SHA-256 hash for a plaintext password
 * @param {string} plainPassword 
 * @returns {string} 64-char hex hash
 */
export function hashPassword(plainPassword) {
  if (!plainPassword) return '';
  return sha256(PASSWORD_SALT_PREFIX + String(plainPassword));
}

// Pre-computed hashes for default/demo credentials
export const DEFAULT_SEED_PASSWORD_HASH = hashPassword('password123'); // e6ae0a8605ad39ce73bcfe4eb671f4e7fd4d58ebfcc4a477adefea318db9b972
export const DEFAULT_MASTER_PASSWORD_HASH = hashPassword('hugpong2026'); // e92f049beccbfc47312b7662d4742dc3beeeff8edd4b74c94af0601ab6b5188d

/**
 * Cryptographically verifies a plaintext password against a stored hash (or legacy plaintext)
 * @param {string} inputPassword - User entered password
 * @param {string} storedHash - Stored hash or user object
 * @returns {boolean}
 */
export function verifyPassword(inputPassword, storedHash) {
  if (!inputPassword) return false;
  const inputHash = hashPassword(inputPassword);

  // 1. Direct match with stored hash
  if (storedHash && storedHash.length === 64 && inputHash === storedHash) {
    return true;
  }

  // 2. Migration fallback: match with legacy plaintext stored in previous versions
  if (storedHash && storedHash.length < 64 && inputPassword === storedHash) {
    return true;
  }

  return false;
}
