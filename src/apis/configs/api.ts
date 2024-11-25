import dotenv from 'dotenv'

dotenv.config()

const API_BASE_URL = process.env.VITE_API_URL

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | undefined>
}

export async function api<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined')
  }

  const url = new URL(`${API_BASE_URL}${endpoint}`)

  if (options.params) {
    url.search = new URLSearchParams(
      Object.entries(options.params)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, value!.toString()]),
    ).toString()
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  const response = await fetch(url.toString(), fetchOptions)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return await response.json()
}
