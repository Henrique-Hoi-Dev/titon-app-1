import _ from 'lodash'
import type { Data } from '../components/Form/Inputs/Select'
import type { Data as ApiData } from '../services/types'
import { createNumberMask } from 'react-native-mask-input'

export const establishmentTypes = [
  'Restaurante',
  'Lanchonete',
  'Bar',
  'Padaria',
  'Cafeteria',
  'Supermercado',
  'Loja de Conveniência',
  'Borracharia',
  'Posto de Combustível',
  'Oficina Mecânica',
  'Auto Elétrica',
  'Outros',
]

export const transactionTypes = ['Débito', 'Crédito', 'Dinheiro', 'PIX']

export const depositsTypes: Record<string, string>[] = [
  { DIRECT_DEPOSIT: 'Depósito Direto' },
  { BANK_TRANSFER: 'Transferência Bancária' },
  { CHECK_DEPOSIT: 'Depósito em Cheque' },
  { CASH_DEPOSIT: 'Depósito em Dinheiro' },
]

export const banks: Record<string, string>[] = [
  { BANCO_DO_BRASIL: 'Banco do Brasil' },
  { CAIXA_ECONOMICA: 'Caixa Econômica' },
  { ITAU_UNIBANCO: 'Itaú Unibanco' },
  { BRADESCO: 'Bradesco' },
  { SANTANDER_BRASIL: 'Santander Brasil' },
  { BANCO_SAFRA: 'Banco Safra' },
  { BANCO_BTG_PACTUAL: 'Banco BTG Pactual' },
  { BANCO_SICOOB: 'Banco Sicoob' },
  { BANCO_SICREDI: 'Banco Sicredi' },
  { BANRISUL: 'Banrisul' },
  { BANCO_VOTORANTIM: 'Banco Votorantim' },
  { BANCO_INTER: 'Banco Inter' },
  { BANCO_ORIGINAL: 'Banco Original' },
  { BANCO_BMG: 'Banco BMG' },
  { BANCO_MERCANTIL_DO_BRASIL: 'Banco Mercantil do Brasil' },
  { BANCO_MODAL: 'Banco Modal' },
  { BANCO_C6: 'Banco C6' },
  { NEON_PAGAMENTOS: 'Neon Pagamentos' },
  { NUBANK: 'Nubank' },
  { XP_INVESTIMENTOS: 'XP Investimentos' },
]

export const toSelectData = <T extends string = string>(
  data: string[] | Record<string | number, T>[] | Record<string | number, T>
): Data<T>[] => {
  if (Array.isArray(data)) {
    const ret = data.map((item) => {
      if (typeof item === 'string') {
        return {
          label: item,
          value: item,
        }
      } else {
        return Object.entries(item).map(([key, value]) => ({
          label: value,
          value: key,
        }))[0]
      }
    }) as unknown as Data<T>[]

    return ret
  } else {
    return Object.entries(data).map(([key, value]) => ({
      label: value,
      value: key,
    })) as unknown as Data<T>[]
  }
}

export const toJsonBody = (data: ApiData) => {
  const ret: ApiData = {}

  Object.keys(data).forEach((key) => {
    let value = data[key]

    if (value instanceof Date) {
      value = value.toISOString()
    }

    const index = _.snakeCase(key)
    ret[index] = value
  })

  return ret
}

export const getError = <T, K>(
  errors: T,
  key: keyof T,
  touched?: K,
  validateOnlyWhenTouched = false
) => {
  if (touched && touched[key as unknown as keyof K] && errors[key]) {
    return errors[key]
  }

  if (errors[key] && !validateOnlyWhenTouched) {
    return errors[key]
  }

  return ''
}

export const numberMask = createNumberMask({
  prefix: [],
  delimiter: '.',
  separator: ',',
  precision: 0,
})
