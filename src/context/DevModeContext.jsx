import { createContext, useContext } from 'react'
import { useLocalStorage } from '../lib/useLocalStorage'

// Modo desenvolvedor: quando ligado, os packs ganham um botão para
// "simular compra" e desbloquear o download SEM pagamento — só pra testar.
// O estado fica salvo no navegador (culto:devmode).

const DevModeContext = createContext(null)

export function DevModeProvider({ children }) {
  const [devMode, setDevMode] = useLocalStorage('culto:devmode', false)
  return (
    <DevModeContext.Provider value={{ devMode, setDevMode }}>
      {children}
    </DevModeContext.Provider>
  )
}

export function useDevMode() {
  const ctx = useContext(DevModeContext)
  if (!ctx) throw new Error('useDevMode precisa estar dentro de <DevModeProvider>')
  return ctx
}
