import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import type { Session } from '@supabase/supabase-js'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

// Importe as páginas
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Verifica a sessão inicial quando o componente é montado
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Escuta por mudanças no estado de autenticação (login, logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Limpa a inscrição ao desmontar o componente para evitar vazamentos de memória
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // Redireciona usuários logados das páginas públicas para o dashboard
    const publicPaths = ['/', '/login', '/signup'];
    if (session && publicPaths.includes(location.pathname)) {
      navigate('/dashboard');
    }
  }, [session, location, navigate]);


  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Rota Protegida */}
      <Route 
        path="/dashboard" 
        element={session ? <Dashboard session={session} /> : <Login />} 
      />
    </Routes>
  )
}

export default App
