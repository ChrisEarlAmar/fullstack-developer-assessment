import * as React from "react"

export const MOBILE_BREAKPOINT = 768
export const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function getMediaQueryList() {
  return window.matchMedia(MOBILE_MEDIA_QUERY)
}

function subscribe(onStoreChange: () => void) {
  const mediaQueryList = getMediaQueryList()
  mediaQueryList.addEventListener("change", onStoreChange)

  return () => mediaQueryList.removeEventListener("change", onStoreChange)
}

function getSnapshot() {
  return getMediaQueryList().matches
}

function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
