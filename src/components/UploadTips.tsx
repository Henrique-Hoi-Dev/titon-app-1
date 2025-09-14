import { Text } from 'react-native'
import React from 'react'

export default function UploadTips() {
  return (
    <>
      <Text className="mb-8 text-base font-medium">
        Para prosseguir, precisamos de uma foto clara do seu comprovante. Por
        favor, siga estas etapas:
      </Text>
      <Text className="mb-1">
        1. Encontre um local com{' '}
        <Text className="font-bold text-primary-600">boa iluminação</Text>
      </Text>
      <Text className="mb-1">
        2. Certifique-se que os detalhes importantes no comprovante estejam{' '}
        <Text className="font-bold text-primary-600">visíveis</Text>
      </Text>
      <Text className="mb-1">
        3. Coloque o comprovante em uma{' '}
        <Text className="font-bold text-primary-600">superfice plana</Text> para
        prevernir desfoque
      </Text>
    </>
  )
}
