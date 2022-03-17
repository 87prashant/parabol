import Atmosphere from '../Atmosphere'
import {MenuMutationProps} from '../hooks/useMutationProps'
import makeHref from './makeHref'
import getOAuthPopupFeatures from './getOAuthPopupFeatures'
//import AddADOAuthMutation from '../mutations/AddADOAuthMutation'
import AzureDevOpsManager from './AzureDevOpsManager'

class AzureDevOpsClientManager extends AzureDevOpsManager {
  fetch = window.fetch.bind(window)

  static generateVerifier(): string {
    const array = new Uint32Array(28)
    window.crypto.getRandomValues(array)
    return Array.from(array, (item) => `0${item.toString(16)}`.substr(-2)).join('')
  }

  static async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const digest = await window.crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(codeVerifier)
    )

    return window
      .btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }

  static async getToken(verifier: string, code: string): Promise<string> {
    const tenant = process.env.AZUREDEVOPS_TENANT
    const host = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`
    const clientId = process.env.AZUREDEVOPS_CLIENT_ID
    const redirectUri = makeHref('/auth/ado')
    const grantType = 'authorization_code'

    const params = `client_id=${clientId}&
      grant_type=${grantType}&
      code_verifier=${verifier}&
      redirect_uri=${redirectUri}&
      code=${code}`

    // Make a POST request
    try {
      const response = await fetch(host, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      })
      const data = await response.json()
      return data
    } catch (e) {
      return ''
    }
  }

  static async openOAuth(
    atmosphere: Atmosphere,
    teamId: string,
    mutationProps: MenuMutationProps,
    scopes: string[] = ['499b84ac-1321-427f-aa17-267ca6975798/.default']
  ) {
    const {submitting} = mutationProps
    const providerState = Math.random().toString(36).substring(5)
    const plainVerifier = AzureDevOpsClientManager.generateVerifier()
    const code = await AzureDevOpsClientManager.generateCodeChallenge(plainVerifier)
    const tenant = process.env.AZUREDEVOPS_TENANT
    const clientId = process.env.AZUREDEVOPS_CLIENT_ID
    const redirect = makeHref('/auth/ado')
    const uri = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirect}&response_mode=query&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&state=${providerState}&code_challenge=${code}&code_challenge_method=S256`
    const popup = window.open(
      uri,
      'OAuth',
      getOAuthPopupFeatures({width: 500, height: 810, top: 56})
    )
    const handler = (event) => {
      if (typeof event.data !== 'object' || event.origin !== window.location.origin || submitting) {
        return
      }
      const params = new URLSearchParams(popup?.location.search)
      const authCode = params.get('code')
      const state = params.get('state')
      if (authCode) {
        const token = AzureDevOpsClientManager.getToken(plainVerifier, authCode)
      }
      popup && popup.close()
      window.removeEventListener('message', handler)
    }
    window.addEventListener('message', handler)
  }
}
