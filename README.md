# 📱 Titon App

Aplicativo móvel desenvolvido com **React Native** e **Expo** para gestão de viagens, despesas, depósitos e notificações de motoristas.

## 🚀 Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **Expo Router** - Navegação baseada em arquivos
- **TypeScript**
- **React Query** - Estado do servidor
- **NativeWind / TailwindCSS** - Estilização
- **AsyncStorage** - Armazenamento local
- **Reactotron** - Debugging e monitoramento

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (recomendado: 22.14.0)
- [Yarn](https://yarnpkg.com/) (1.22.x)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (>= 10.2.1)
- [Android Studio](https://developer.android.com/studio) (Android)
- [Xcode](https://developer.apple.com/xcode/) (iOS, apenas macOS)

## 🛠️ Instalação

1. **Clone o repositório**

   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd titon-app-1
   ```

2. **Instale as dependências**

   ```bash
   yarn install
   # ou
   npm install
   ```

3. **Configuração de ambientes**
   Crie um arquivo `.env` na raiz do projeto (ou use o script `yarn setup`).
   Um exemplo está disponível em `.env.example`.

## 🚀 Como Executar

### Desenvolvimento

1. **Inicie o servidor de desenvolvimento**

   ```bash
   yarn start
   # ou
   npm start
   ```

2. **Execute no dispositivo/emulador**

   ```bash
   # Para Android
   yarn android

   # Para iOS
   yarn ios

   # Para web
   yarn web
   ```

### Build

Recomendado via EAS:

```bash
# Android/iOS (dev/staging/prod)
eas build --profile development --platform android
eas build --profile production --platform ios
```

## 📱 Funcionalidades

### 🔐 Autenticação

- **Login** - Acesso ao sistema com email e senha
- **Cadastro** - Criação de nova conta de usuário
- **Persistência** - Manutenção do estado de autenticação

### 🏠 Dashboard

- **Boas-vindas** - Saudação personalizada ao usuário
- **Visão geral** - Resumo das informações principais
- **Navegação rápida** - Acesso às funcionalidades principais

### 📅 Agendamento

- **Seleção de Prestador** - Escolha do profissional de serviço
- **Seleção de Data/Hora** - Escolha do horário disponível
- **Confirmação** - Revisão e confirmação do agendamento

### 👤 Perfil do Usuário

- **Informações pessoais** - Visualização e edição de dados
- **Configurações** - Preferências da conta
- **Histórico** - Registro de atividades

## 🏗️ Estrutura do Projeto

```
app/                     # Rotas (Expo Router)
src/
├── components/          # Componentes reutilizáveis
├── context/             # Context API (auth, app, theme, feedback)
├── hooks/               # Hooks customizados (React Query)
├── services/            # API, client, upload
├── types/               # Tipos (contratos)
├── utils/               # Utilidades
└── theme/               # Tema
```

## 🔧 Configuração de Ambientes

Variáveis esperadas (ver `.env.example`):

```env
EXPO_PUBLIC_APP_NAME=
EXPO_PUBLIC_APP_TITLE=
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_APP_API_ENV=development
EXPO_PUBLIC_APP_URL=
EXPO_PUBLIC_ONESIGNAL_ANDROID_APP_ID=
EXPO_PUBLIC_ONESIGNAL_IOS_APP_ID=
```

Observação: o Expo carrega apenas variáveis com prefixo `EXPO_PUBLIC_` no app.

## 📱 Compatibilidade

- **iOS**: 12.0+
- **Android**: 5.0+ (API 21+)
- **Web**: Navegadores modernos

## 🧪 Qualidade

```bash
# Lint
yarn lint

# Prettier
yarn style:check
```

## 📦 Scripts Disponíveis

- `yarn setup` - Configura ambiente local (.env, pods em macOS)
- `yarn start` - Inicia o servidor de desenvolvimento
- `yarn android` - Executa no Android
- `yarn ios` - Executa no iOS
- `yarn web` - Executa na web
- `yarn test` - Executa os testes
- `yarn lint` - Verifica o código
- `yarn style:check` - Verifica formatação

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

## 👨‍💻 Desenvolvedores

- **Equipe Titon** - Desenvolvimento e manutenção

## 📞 Suporte

Para suporte e dúvidas:

- 📧 Email: suporte@titon.com
- 📱 App: Abra o aplicativo e vá em Configurações > Suporte
- 🌐 Website: [www.titon.com](https://www.titon.com)

## 🔄 Atualizações

Para manter o projeto atualizado:

```bash
# Atualizar Expo CLI
npm install -g @expo/cli@latest

# Atualizar dependências
yarn upgrade

# Verificar atualizações do Expo
expo doctor
```

---

**⭐ Se este projeto te ajudou, considere dar uma estrela!**
