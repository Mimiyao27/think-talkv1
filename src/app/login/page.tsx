import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#efebc4] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-[4px] border-black">
        <h1 className="text-3xl font-black text-center mb-2 tracking-tight">ThinkTalk</h1>
        <p className="text-center text-gray-500 mb-8 font-medium">Log in to continue your practice</p>
        
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-gray-700" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
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
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
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
