declare namespace Express {
  interface Request {
    user?: {
      username: string;
      role: string;
      [key: string]: any;
    };
  }
}
