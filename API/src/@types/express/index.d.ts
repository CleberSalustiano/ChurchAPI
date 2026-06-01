declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      mustChangePassword?: boolean;
    };
  }
}

export {};
