import Tokens from 'csrf'

const tokens = new Tokens()

export function generateCsrfToken(): string {
  return tokens.create(process.env.CSRF_SECRET || 'your-csrf-secret')
}

export function validateCsrfToken(token: string): boolean {
  return tokens.verify(process.env.CSRF_SECRET || 'your-csrf-secret', token)
}