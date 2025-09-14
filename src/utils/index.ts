import { CamelCaseString, CamelCase } from '../@types/utils'
import { User } from '../context/auth'
import { Freight } from '../hooks'

export const getFaturamento = (viagens: Freight[] | Freight) => {
  if (Array.isArray(viagens)) {
    const faturamento = viagens.reduce((acc, cur) => {
      if (cur.status === 'FINISHED') {
        return acc + (cur?.ton_value ?? 0 / 100) * cur?.tons_loaded || 1
      }
      return acc
    }, 0)

    return faturamento
  }

  return (viagens?.ton_value ?? 0 / 100) * (viagens?.tons_loaded || 0)
}

export const getComissao = (viagens: Freight[] | Freight, user: User) => {
  return (
    getFaturamento(viagens) * ((user?.percentage || 0) / 100) +
    (user?.value_fix / 100 || 0)
  )
}

export function toCamelCase<T extends Record<string, any>, K extends keyof T = never>(
  obj: T,
  keysToSkip: K[] = []
): CamelCase<T, K> {
  const result: any = {}

  for (const key in obj) {
    if ((keysToSkip as readonly (keyof T)[]).includes(key)) {
      result[key] = obj[key]
    } else {
      const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      result[camelCaseKey as keyof CamelCase<T, K>] = obj[key]
    }
  }

  return result as CamelCase<T, K>
}
