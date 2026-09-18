import { login, signup } from './actions'

// Error messages map — friendly text for each error code
const ERROR_MESSAGES: Record<string, { text: string; type: 'error' | 'warning' }> = {
  incorrect_password: {
    text: 'Incorrect email or password. Please try again.',
    type: 'error',
  },
  email_exists: {
    text: 'That email is already registered. Try logging in instead.',
    type: 'warning',
  },
  password_too_short: {
    text: 'Password must be at least 6 characters long.',
    type: 'error',
  },
}

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const errorCode = params?.error ?? null

  // Look up a friendly message; fall back to the raw error string if unknown
  const errorInfo = errorCode
    ? ERROR_MESSAGES[errorCode] ?? { text: decodeURIComponent(errorCode), type: 'error' as const }
    : null

  return (
    <div className="min-h-screen bg-[#efebc4] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-[4px] border-black">
        <h1 className="text-3xl text-red-700 font-black text-center mb-2 tracking-tight">ThinkTalk</h1>
        <p className="text-center text-gray-500 mb-8 font-medium">Log in to continue your practice</p>

        {/* Error / Warning Banner */}
        {errorInfo && (
          <div
            className={`flex items-start gap-3 rounded-xl px-4 py-3 mb-6 border-2 text-sm font-medium ${errorInfo.type === 'warning'
              ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
              : 'bg-red-50 border-red-400 text-red-700'
              }`}
          >
            <span className="text-lg leading-none mt-0.5">
              {errorInfo.type === 'warning' ? '⚠️' : '❌'}
            </span>
            <span>{errorInfo.text}</span>
          </div>
        )}

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-gray-700" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="student@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-gray-700" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-400 mt-1 ml-1">Minimum 6 characters</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              formAction={login}
              className="flex-1 bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm shadow-md"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="flex-1 bg-white text-black font-bold py-3 rounded-xl border-2 border-black hover:bg-gray-100 transition-colors uppercase tracking-wider text-sm shadow-sm"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
