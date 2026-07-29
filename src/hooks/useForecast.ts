import { useEffect, useState } from 'react'
import { fetchForecast, type DayForecast } from '@/lib/weather'

type State = {
  days: DayForecast[]
  loading: boolean
  error: string | null
}

export function useForecast(days = 14): State {
  const [state, setState] = useState<State>({ days: [], loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()

    fetchForecast(days, controller.signal)
      .then((d) => setState({ days: d, loading: false, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setState({ days: [], loading: false, error: (err as Error).message })
      })

    return () => controller.abort()
  }, [days])

  return state
}
