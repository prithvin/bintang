export const generatePostRequestHeaders = (headers: Record<string, string>): {
  method: 'POST',
  mode: 'cors',
  credentials: 'include',
  referrerPolicy: 'strict-origin-when-cross-origin',
  headers: Record<string, string>,
} => ({
  headers: {
    ...headers,
    'accept-language': 'en-US,en;q=0.9',
    pragma: 'no-cache',
    'content-type': 'application/json; charset=utf-8',
  },
  method: 'POST',
  mode: 'cors',
  credentials: 'include',
  referrerPolicy: 'strict-origin-when-cross-origin',
})
