import { Platform } from 'react-native'

// Declaração de tipo para window com CanvasKit
declare global {
  interface Window {
    CanvasKit?: unknown
  }
}

// Configuração específica para Skia no web
if (Platform.OS === 'web') {
  // Importa o CanvasKit WASM para web de forma assíncrona
  const initSkia = async () => {
    try {
      const CanvasKit = await import('canvaskit-wasm')

      // Configura o CanvasKit globalmente para o Skia
      if (typeof window !== 'undefined') {
        window.CanvasKit = CanvasKit.default || CanvasKit
        console.log('Skia CanvasKit carregado com sucesso para web')
      }
    } catch (error) {
      console.warn('Erro ao carregar CanvasKit para Skia:', error)
    }
  }

  // Inicializa o Skia
  initSkia()
}
