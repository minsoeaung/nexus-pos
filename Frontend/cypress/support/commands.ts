// Because all uncaught exceptions are intentional
Cypress.on('uncaught:exception', () => {
  return false
})