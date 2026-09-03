/**
 * Organiser Authentication
 *
 * Two-stage login:
 *   Stage 1: Organiser name + 6-digit PIN (lookup in Firestore)
 *   Stage 2: Password → Firebase Authentication
 *
 * Never hardcode names, PINs, or passwords in this file.
 */

const PIN_SALT = 'ganesh-utsav-himalaya-v2';

/**
 * Hash a PIN with SHA-256 + salt
 * @param {string} pin - 6-digit PIN
 * @returns {Promise<string>} hex hash
 */
export async function hashPin(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + PIN_SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Generate synthetic email for Firebase Auth (unique per organiser)
 * @param {string} displayName
 * @returns {string}
 */
export function makeOrganiserEmail(displayName) {
    const slug = displayName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${slug}@organiser.ganesh-utsav.iitmandi.com`;
}

/**
 * Stage 1: Look up an organiser by name + hashed PIN
 * @param {db} db - Firestore instance
 * @param {collection} collection
 * @param {where} where
 * @param {getDocs} getDocs
 * @param {string} name
 * @param {string} pin
 * @returns {Promise<{id: string, data: object} | null>}
 */
export async function verifyOrganiserIdentity(db, collection, where, getDocs, name, pin) {
    const pinHash = await hashPin(pin);

    try {
        const q = collection(db, 'organisers')
            .where('displayName', '==', name)
            .where('pinHash', '==', pinHash);
        const snapshot = await getDocs(q);

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return { id: doc.id, data: doc.data() };
    } catch (e) {
        console.error('Organiser lookup error:', e);
        return null;
    }
}

/**
 * Stage 2: Sign in with password via Firebase Auth
 * @param {auth} auth - Firebase Auth instance
 * @param {signInWithEmailAndPassword} signInWithEmailAndPassword
 * @param {object} organiser - Result from verifyOrganiserIdentity
 * @param {string} password
 */
export async function signInOrganiser(auth, signInWithEmailAndPassword, organiser, password) {
    const email = makeOrganiserEmail(organiser.data.displayName);
    await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Create a new organiser (used by dashboard to add members)
 * @param {db} db
 * @param {collection} collection
 * @param {addDoc} addDoc
 * @param {object} orgData - { displayName, role, pinHash, email, photoUrl, order }
 */
export async function createOrganiser(db, collection, addDoc, orgData) {
    await addDoc(collection(db, 'organisers'), orgData);
}
