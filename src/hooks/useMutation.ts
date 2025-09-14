import {
  DefaultError,
  QueryClient,
  UseMutationOptions,
  UseMutationResult,
  useMutation as useMutationTRQ,
} from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

export function useMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> & {
    onErrorMessage?: string
    onSuccessMessage?: string
  },
  queryClient?: QueryClient,
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutationTRQ(
    {
      ...options,
      onError: (error, variables, context) => {
        if (options.onErrorMessage) {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: options.onErrorMessage,
          })
        }
        options.onError?.(error, variables, context)
      },
      onSuccess: (data, variables, context) => {
        if (options.onSuccessMessage) {
          Toast.show({
            type: 'success',
            text1: 'Sucesso',
            text2: options.onSuccessMessage,
          })
        }
        options.onSuccess?.(data, variables, context)
      },
    },
    queryClient,
  )
}
