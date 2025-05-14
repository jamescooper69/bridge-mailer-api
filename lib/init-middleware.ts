import { NextApiRequest, NextApiResponse } from 'next';

// Wrap middleware for async/await usage
export default function initMiddleware(
  middleware: (req: NextApiRequest, res: NextApiResponse, next: (result?: unknown) => void) => void
): (req: NextApiRequest, res: NextApiResponse) => Promise<unknown> {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) return reject(result);
        return resolve(result);
      });
    });
}