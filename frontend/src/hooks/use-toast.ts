import * as React from "react"

type ToastVariant = "default" | "destructive"

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
}


const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000

type ToastState = {
  toasts: Toast[]
}

type ToastAction =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "REMOVE_TOAST"; toastId: string }

let memoryState: ToastState = { toasts: [] }
const listeners: Array<(state: ToastState) => void> = []

function dispatch(action: ToastAction) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

function reducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "REMOVE_TOAST":
      return {
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      }

    default:
      return state
  }
}

export function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    toasts: state.toasts,
    toast: (toast: Omit<Toast, "id">) => {
      const id = crypto.randomUUID()

      dispatch({
        type: "ADD_TOAST",
        toast: { id, ...toast },
      })

      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", toastId: id })
      }, TOAST_REMOVE_DELAY)
    },
  }
}

