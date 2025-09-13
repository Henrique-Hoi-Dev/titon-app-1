import { createContext, Fragment, useContext, useState } from 'react'
import { BackHandler, Modal, Pressable, Text, View } from 'react-native'
import Feedback from '../components/Layout/Feedback'
import Button from '../components/Button'

type ShowFeedbackProps = {
  title: string
  feedback: string
  type?: 'error' | 'success'
  primaryButtonText?: string
  onPrimaryButtonPress?: () => void
  secondaryButtonText?: string
  onSecondaryButtonPress?: () => void
  onBackButtonPress?: () => void
}

export type FeedbackContextType =
  | {
      show: (props: ShowFeedbackProps) => void
    }
  | undefined

export type FeedbackProviderProps = {
  children?: React.ReactNode[] | React.ReactNode
}

export const FeedbackContext = createContext<FeedbackContextType>(undefined)

export function FeedbackProvider(props: FeedbackProviderProps) {
  const [feedbackIsVisible, setFeedbackIsVisible] = useState(false)
  const [onBackButtonPress, setOnBackButtonPress] = useState<() => void>()
  const [type, setType] = useState<'error' | 'success'>('success')
  const [title, setTitle] = useState<string>()
  const [feedback, setFeedback] = useState<string>()
  const [onPrimaryButtonPress, setOnPrimaryButtonPress] = useState<() => void>()
  const [primaryButtonText, setPrimaryButtonText] = useState<string>()
  const [onSecondaryButtonPress, setOnSecondaryButtonPress] =
    useState<() => void>()
  const [secondaryButtonText, setSecondaryButtonText] = useState<string>()

  const showFeedback = (props: ShowFeedbackProps) => {
    setFeedbackIsVisible(true)
    setTitle(props.title)
    setFeedback(props.feedback)
    setType(props.type ?? 'success')
    setPrimaryButtonText(props.primaryButtonText ?? 'Ok')
    setOnPrimaryButtonPress(() => {
      setFeedbackIsVisible(false)
      props.onPrimaryButtonPress?.()
    })
    setSecondaryButtonText(props.secondaryButtonText ?? 'Voltar')
    setOnSecondaryButtonPress(() => {
      setFeedbackIsVisible(false)
      props.onSecondaryButtonPress?.()
    })
    setOnBackButtonPress(() => {
      setFeedbackIsVisible(false)
      props.onBackButtonPress?.()
    })
  }

  BackHandler.addEventListener('hardwareBackPress', () => {
    if (feedbackIsVisible) {
      setFeedbackIsVisible(false)
      onPrimaryButtonPress?.()
      return true
    }
    return false
  })

  return (
    <FeedbackContext.Provider
      value={{
        show: showFeedback,
      }}
    >
      {Array.isArray(props.children) ? (
        props.children.map((child, index) => (
          <Fragment key={index}>{child}</Fragment>
        ))
      ) : (
        <Fragment>{props.children}</Fragment>
      )}
      <Modal visible={feedbackIsVisible}>
        <Feedback.Root type={type} onBackButtonPress={onBackButtonPress}>
          <Feedback.Heading className="px-6 py-6">{title}</Feedback.Heading>
          <View className="items-center justify-between flex-1 pt-2 text-center">
            <Text>{feedback}</Text>
            <View className="w-full">
              <Button onPress={onPrimaryButtonPress}>
                {primaryButtonText}
              </Button>

              <Pressable
                onPress={onSecondaryButtonPress}
                className="items-center justify-center p-4"
              >
                <Text className="font-semibold text-primary">
                  {secondaryButtonText}
                </Text>
              </Pressable>
            </View>
          </View>
        </Feedback.Root>
      </Modal>
    </FeedbackContext.Provider>
  )
}

export function useFeedback() {
  const context = useContext(FeedbackContext)

  if (!context) {
    throw new Error('useFeedback must be used within an FeedbackProvider')
  }

  return context
}
