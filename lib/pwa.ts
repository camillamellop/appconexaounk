export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registered successfully:", registration)
      return registration
    } catch (error) {
      console.error("Service Worker registration failed:", error)
    }
  }
}

export const unregisterServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      await registration.unregister()
      console.log("Service Worker unregistered")
    }
  }
}

export const checkForUpdates = async () => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      await registration.update()
    }
  }
}

export const installPrompt = () => {
  let deferredPrompt: any = null

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault()
    deferredPrompt = e
  })

  const showInstallPrompt = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      deferredPrompt = null
    }
  }

  return { showInstallPrompt, canInstall: () => !!deferredPrompt }
}
