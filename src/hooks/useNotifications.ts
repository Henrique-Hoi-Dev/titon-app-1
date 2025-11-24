import { useInfiniteQuery } from '@tanstack/react-query'
import dayjs, { Dayjs } from 'dayjs'
import api from '../services/api'
import { useMutation } from './useMutation'
import { Response } from '../services/types'

export type NotificationType = {
  id: number
  title: string
  content: string
  read: boolean
  createdAt: string
  driverId: number
  created_at?: Dayjs // Para compatibilidade interna
}

export type NotificationsResponse = {
  data: {
    total: number
    totalPages: number
    currentPage: number
    docs: NotificationType[]
  }
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
        ...response.data.data,
        docs: response.data.data.docs.map((notification) => ({
          ...notification,
          created_at: dayjs(notification.createdAt || notification.created_at),
        })),
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
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
    data: notifications.data?.pages.flatMap((page) => page.docs) ?? [],
    isFetching: notifications.isFetching,
    isFetchingNextPage: notifications.isFetchingNextPage,
    hasNextPage: notifications.hasNextPage,
    fetchNextPage: notifications.fetchNextPage,
    refetch: notifications.refetch,
    hasUnread: notifications.data?.pages.some((page) =>
      page.docs.some((notification) => !notification.read),
    ),
    onRead: async (id?: number) => await readMutation.mutateAsync(id),
  }
}
