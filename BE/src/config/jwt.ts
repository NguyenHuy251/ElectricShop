import jwt from 'jsonwebtoken';

export interface JwtUserPayload {
  userId: number;
  tenDangNhap: string;
  vaiTro: string | null;
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'electricshop_dev_secret_change_me';
const JWT_EXPIRES_IN: jwt.SignOptions['expiresIn'] = '1d';

export const generateAccessToken = (payload: JwtUserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyAccessToken = (token: string): JwtUserPayload => {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === 'string') {
    throw new Error('Token không hợp lệ');
  }

  const payload = decoded as Partial<JwtUserPayload>;
  if (
    typeof payload.userId !== 'number' ||
    typeof payload.tenDangNhap !== 'string' ||
    (payload.vaiTro !== null && typeof payload.vaiTro !== 'string')
  ) {
    throw new Error('Token payload không hợp lệ');
  }

  return {
    userId: payload.userId,
    tenDangNhap: payload.tenDangNhap,
    vaiTro: payload.vaiTro,
  };
};
