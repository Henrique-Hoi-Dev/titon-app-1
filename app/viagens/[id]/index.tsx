import { useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { Header, Layout } from '~/src/components/Layout'
import { Freight, useFreight } from '~/src/hooks/useFreight'
import Abastecimentos from '~/src/components/Screens/Viagens/Abastecimentos'
import Depositos from '~/src/components/Screens/Viagens/Depositos'
import Despesas from '~/src/components/Screens/Viagens/Despesas'
import Informacoes from '~/src/components/Screens/Viagens/Informacoes'
import React, { useMemo, useState } from 'react'
import { Skeleton } from 'moti/skeleton'

type Tab = {
  id: 'informacoes' | 'depositos' | 'despesas' | 'abastecimentos'
  title: string
  buttonLabel?: string
  disabled: boolean
}

type RouteParams = {
  id: string
  tab?: Tab['id']
}

export default function App() {
  const tabs = useMemo<Tab[]>(
    () => [
      {
        id: 'informacoes',
        title: 'Informações',
        disabled: false,
      },
      {
        id: 'depositos',
        title: 'Depósitos',
        buttonLabel: 'Novo Depósito',
        disabled: false,
      },
      {
        id: 'despesas',
        title: 'Despesas',
        buttonLabel: 'Nova Despesa',
        disabled: false,
      },
      {
        id: 'abastecimentos',
        title: 'Abastecidas',
        buttonLabel: 'Novo Abastecimento',
        disabled: false,
      },
    ],
    []
  )
  const { id, tab } = useLocalSearchParams<RouteParams>()
  const [activeTab, setActiveTab] = useState<Tab['id']>(tab ?? 'informacoes')
  const { data: item, loading } = useFreight(Number(id))

  const shouldShow = !item && loading

  return (
    <Layout className="w-full bg-zinc-100 h-full">
      <Header>
        <Skeleton show={shouldShow} colorMode="light">
          <Text className="text-2xl text-white -top-1.5">
            {item?.end_freight_city || ''} / {item?.start_freight_city}
          </Text>
        </Skeleton>
      </Header>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{
          maxHeight: 50,
        }}
        className="w-full bg-zinc-100 z-[100] px-4 h-12"
      >
        {tabs.map((tab, index) => (
          <Pressable
            key={tab.id}
            disabled={tab.disabled}
            onPress={() => !shouldShow && setActiveTab(tab.id)}
            className={`items-center justify-center px-6 ${
              index === 0
                ? 'mr-4'
                : index === tabs.length - 1
                  ? 'ml-4 mr-8'
                  : 'mx-4'
            } ${activeTab === tab.id ? 'border-b-2 border-primary-700' : ''}`}
          >
            <Text
              className={`${
                activeTab === tab.id ? '-mb-0.5 font-semibold' : ''
              } ${tab.disabled ? 'text-zinc-300 ' : 'text-primary-600 '}`}
            >
              {tab.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View className="flex-1">
        {activeTab === 'informacoes' && (
          <Informacoes loading={!shouldShow} item={item as Freight} />
        )}
        {item && (
          <>
            {activeTab === 'depositos' && <Depositos id={item.id} />}
            {activeTab === 'despesas' && <Despesas id={item.id} />}
            {activeTab === 'abastecimentos' && <Abastecimentos id={item.id} />}
          </>
        )}
      </View>
    </Layout>
  )
}
