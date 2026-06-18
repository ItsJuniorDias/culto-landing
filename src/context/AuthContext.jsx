import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { byId, ALL_PACK_IDS, FREE_PACK_IDS } from '../data/catalog'

const AuthContext = createContext(null)

// Seed account so the dashboard can be explored without signing up.
const DEMO = { name: 'Visitante Culto', email: 'demo@culto.com', password: 'culto123' }
export const DEMO_HINT = { email: DEMO.email, password: DEMO.password }

const emptyLib = () => ({ owned: [...FREE_PACK_IDS], downloads: {} })

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('culto:users', [DEMO])
  const [sessionEmail, setSessionEmail] = useLocalStorage('culto:session', null)
  const [library, setLibrary] = useLocalStorage('culto:library', {
    [DEMO.email]: { owned: [...ALL_PACK_IDS], downloads: {} },
  })

  const user = useMemo(() => {
    if (!sessionEmail) return null
    const u = users.find((x) => x.email === sessionEmail)
    return u ? { name: u.name, email: u.email } : null
  }, [sessionEmail, users])

  const lib = (user && library[user.email]) || emptyLib()

  const signUp = useCallback(
    ({ name, email, password }) => {
      name = (name || '').trim()
      email = (email || '').trim().toLowerCase()
      if (!name) throw new Error('Informe seu nome.')
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Digite um e-mail válido.')
      if ((password || '').length < 6) throw new Error('A senha precisa de ao menos 6 caracteres.')
      if (users.some((u) => u.email === email)) throw new Error('Já existe uma conta com esse e-mail.')

      setUsers((prev) => [...prev, { name, email, password }])
      setLibrary((prev) => ({ ...prev, [email]: emptyLib() }))
      setSessionEmail(email)
    },
    [users, setUsers, setLibrary, setSessionEmail],
  )

  const login = useCallback(
    ({ email, password }) => {
      email = (email || '').trim().toLowerCase()
      const u = users.find((x) => x.email === email)
      if (!u || u.password !== password) throw new Error('E-mail ou senha incorretos.')
      setLibrary((prev) => (prev[email] ? prev : { ...prev, [email]: emptyLib() }))
      setSessionEmail(email)
    },
    [users, setLibrary, setSessionEmail],
  )

  const logout = useCallback(() => setSessionEmail(null), [setSessionEmail])

  const ownsPack = useCallback(
    (id) => {
      if (byId(id)?.free) return true
      return !!(user && library[user.email]?.owned.includes(id))
    },
    [user, library],
  )

  // Simulated purchase — no payment, just unlocks the pack and persists it.
  const purchase = useCallback(
    (id) => {
      if (!user) return
      setLibrary((prev) => {
        const cur = prev[user.email] || emptyLib()
        if (cur.owned.includes(id)) return prev
        return { ...prev, [user.email]: { ...cur, owned: [...cur.owned, id] } }
      })
    },
    [user, setLibrary],
  )

  const recordDownload = useCallback(
    (id) => {
      if (!user) return
      setLibrary((prev) => {
        const cur = prev[user.email] || emptyLib()
        const downloads = { ...cur.downloads, [id]: (cur.downloads[id] || 0) + 1 }
        return { ...prev, [user.email]: { ...cur, downloads } }
      })
    },
    [user, setLibrary],
  )

  // ── Apenas para o modo desenvolvedor (testar bloqueio/desbloqueio) ──
  // Revoga um pack pago (volta a ficar bloqueado). Packs grátis não saem.
  const revoke = useCallback(
    (id) => {
      if (!user || byId(id)?.free) return
      setLibrary((prev) => {
        const cur = prev[user.email] || emptyLib()
        return { ...prev, [user.email]: { ...cur, owned: cur.owned.filter((x) => x !== id) } }
      })
    },
    [user, setLibrary],
  )

  // Zera a biblioteca da conta atual (mantém só os packs grátis).
  const resetLibrary = useCallback(() => {
    if (!user) return
    setLibrary((prev) => ({ ...prev, [user.email]: emptyLib() }))
  }, [user, setLibrary])

  const value = {
    user,
    signUp,
    login,
    logout,
    ownsPack,
    purchase,
    revoke,
    resetLibrary,
    recordDownload,
    downloads: lib.downloads,
    owned: lib.owned,
    ownedCount: lib.owned.length,
    totalDownloads: Object.values(lib.downloads).reduce((a, b) => a + b, 0),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
