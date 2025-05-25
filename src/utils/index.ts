import { User } from '../context/auth'
import { Freight } from '../hooks'

export const getFaturamento = (viagens: Freight[] | Freight) => {
  if (Array.isArray(viagens)) {
    const faturamento = viagens.reduce((acc, cur) => {
      if (cur.status === 'FINISHED') {
        return acc + (cur?.value_tonne ?? 0 / 100) * cur?.preview_tonne || 1
      }
      return acc
    }, 0)

    return faturamento
  }

  return (viagens?.value_tonne ?? 0 / 100) * (viagens?.tons_loaded || 0)
}

export const getComissao = (viagens: Freight[] | Freight, user: User) => {
  return (
    getFaturamento(viagens) * ((user?.percentage || 0) / 100) +
    (user?.value_fix / 100 || 0)
  )
}
