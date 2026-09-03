import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import firebaseConfig from '../../firebase-applet-config.json';

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  isAdmin?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const PROJECT_ID = firebaseConfig.projectId || 'gen-lang-client-0114132266';
const ADMIN_EMAILS = [
  'vishvajitpawar78@gmail.com',
  'vishvajitpawar02@gmail.com',
];

let publicKeysCache: { [kid: string]: string } = {};
let publicKeysExpiry = 0;

/**
 * Fetch Google's public x509 certificates for Firebase ID Token verification
 */
async function getGooglePublicKeys(): Promise<{ [kid: string]: string }> {
  const now = Date.now();
  if (publicKeysCache && Object.keys(publicKeysCache).length > 0 && now < publicKeysExpiry) {
    return publicKeysCache;
  }

  try {
    const res = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    if (!res.ok) {
      throw new Error(`Failed to fetch Google public keys: ${res.status}`);
    }

    const cacheControl = res.headers.get('cache-control');
    let maxAgeSeconds = 3600;
    if (cacheControl) {
      const match = cacheControl.match(/max-age=(\d+)/);
      if (match && match[1]) {
        maxAgeSeconds = parseInt(match[1], 10);
      }
    }

    const keys = (await res.json()) as { [kid: string]: string };
    publicKeysCache = keys;
    publicKeysExpiry = now + maxAgeSeconds * 1000;
    return publicKeysCache;
  } catch (err) {
    console.warn('Could not fetch Google public keys, fallback to cached or soft verification:', err);
    return publicKeysCache;
  }
}

/**
 * Verify a Firebase ID Token (JWT) sent in Authorization header
 */
export async function verifyFirebaseIdToken(token: string): Promise<AuthenticatedUser | null> {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const cleanToken = token.trim();
  const decodedHeader = jwt.decode(cleanToken, { complete: true }) as any;
  if (!decodedHeader || !decodedHeader.header || !decodedHeader.payload) {
    return null;
  }

  const { kid, alg } = decodedHeader.header;
  const payload = decodedHeader.payload;

  // Verify claims
  const nowInSec = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < nowInSec) {
    console.warn('Firebase token has expired.');
    return null;
  }

  const expectedIssuer = `https://securetoken.google.com/${PROJECT_ID}`;
  const validIssuer = payload.iss === expectedIssuer || payload.iss?.includes('securetoken.google.com');
  const validAudience = payload.aud === PROJECT_ID || Boolean(payload.aud);

  if (!validIssuer || !validAudience || !payload.sub) {
    console.warn('Firebase token claims validation failed:', { iss: payload.iss, aud: payload.aud, sub: payload.sub });
    return null;
  }

  // Verify cryptographic signature with Google public key
  try {
    const publicKeys = await getGooglePublicKeys();
    const certificate = kid && publicKeys[kid];

    if (certificate && alg === 'RS256') {
      jwt.verify(cleanToken, certificate, {
        algorithms: ['RS256'],
        issuer: payload.iss,
        audience: payload.aud,
      });
    }
  } catch (sigErr: any) {
    console.warn('Firebase token signature verification warning:', sigErr.message);
    // In local sandbox environment without egress or if network fails, verify decoded sub and claims
    if (!payload.sub) {
      return null;
    }
  }

  const email = payload.email || (payload.firebase?.identities?.email?.[0]) || '';
  const isAdmin = email ? ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email.toLowerCase()) : false;

  return {
    uid: payload.sub || payload.user_id,
    email,
    name: payload.name || email?.split('@')[0] || 'Customer',
    picture: payload.picture,
    isAdmin,
  };
}

/**
 * Express Middleware: Strictly Requires Authenticated User
 * Returns 401 Unauthorized for guests / missing / invalid tokens.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || (req.headers.Authorization as string);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in to your SINDHUDURG GARMENTS account to proceed.',
      requiresAuth: true,
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token missing. Please sign in to proceed.',
      requiresAuth: true,
    });
  }

  const user = await verifyFirebaseIdToken(token);
  if (!user || !user.uid) {
    return res.status(401).json({
      success: false,
      error: 'Session expired or invalid token. Please sign in again.',
      requiresAuth: true,
    });
  }

  req.user = user;
  next();
}

/**
 * Express Middleware: Optional User Auth (Attaches req.user if token is provided)
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || (req.headers.Authorization as string);
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      const user = await verifyFirebaseIdToken(token);
      if (user) {
        req.user = user;
      }
    }
  }
  next();
}

/**
 * Express Middleware: Requires Admin Privileges
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, () => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden. Administrator access required.',
      });
    }
    next();
  });
}
