export const mockDelay = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 200 + 200)
  })
