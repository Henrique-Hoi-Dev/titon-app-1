import { useInfiniteQuery } from '@tanstack/react-query'
import dayjs, { Dayjs } from 'dayjs'
import api from '../services/api'
import { useMutation } from './useMutation'
import { Response } from '../services/types'

export type NotificationType = {
  id: number
  content: string
  read: boolean
  created_at: Dayjs
}

export type NotificationsResponse = {
  total: number
  totalPages: number
  currentPage: number
  data: NotificationType[]
}

export default function useNotifications() {
  const notifications = useInfiniteQuery({
    queryKey: ['notifications'],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<NotificationsResponse>(
        '/v1/driver/notifications',
        {
          page: pageParam as number,
        },
      )

      return {
        ...response.data,
        data: response.data.data.map((notification) => ({
          ...notification,
          created_at: dayjs(notification.created_at),
        })),
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage !== lastPage.totalPages) {
        return lastPage.currentPage + 1
      }

      return undefined
    },
    getPreviousPageParam: (lastPage) => {
      if (lastPage?.currentPage !== 1) {
        return lastPage.currentPage - 1
      }

      return undefined
    },
  })

  const readMutation = useMutation({
    mutationFn: async (id?: number) => {
      let response: Response<unknown>

      if (!id) {
        response = await api.post('/v1/driver/notifications/allread')
      } else {
        response = await api.put(`/v1/driver/notifications/${id}`)
      }

      if (response.status !== 200) {
        throw new Error('Erro ao marcar a notificação como lida')
      }
    },
    onSuccess: () => {
      notifications.refetch()
    },
  })

  return {
    data: notifications.data?.pages.flatMap((page) => page.data) ?? [],
    isFetching: notifications.isFetching,
    refetch: notifications.refetch,
    hasUnread: notifications.data?.pages.some((page) =>
      page.data.some((notification) => !notification.read),
    ),
    onRead: async (id?: number) => await readMutation.mutateAsync(id),
  }
}
