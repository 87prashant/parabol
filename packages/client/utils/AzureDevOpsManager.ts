import AbortController from 'abort-controller'
//import AzureDevOpsIssueId from '../shared/gqlIds/AzureDevOpsIssueId'
//import {SprintPokerDefaults} from '../types/constEnums'

export interface WorkItemQueryResult {
  asOf: string
  columns: WorkItemFieldReference[]
  queryResultType: QueryResultType;
  queryType: QueryType
  sortColumns: WorkItemQuerySortColumn[]
  workItemRelations: WorkItemLink[]
  workItems: WorkItemReference[]
}

export interface WorkItemFieldReference {
  name: string
  referenceName: string
  url: string
}

export enum QueryResultType {
  WORKITEM = 'workItem',
  WORKITEMLINK = 'workItemLink'
}

export enum QueryType {
  FLAT = 'flat',
  ONEHOP = 'oneHop',
  TREE = 'tree'
}

export interface WorkItemQuerySortColumn {
  descending: boolean
  field: WorkItemFieldReference
}

export interface WorkItemLink {
  rel: string
  source: WorkItemReference
  target: WorkItemReference
}

export interface WorkItemReference {
  id: number
  url: string
}

/*interface AvatarURLs {
  '48x48': string
  '24x24': string
  '16x16': string
  '32x32': string
}*/

export interface AzureDevOpsError {
  code: number
  message: string
}

const MAX_REQUEST_TIME = 5000

export default abstract class AzureDevOpsManager {
  abstract fetch: typeof fetch
  accessToken: string
  private headers = {
    Authorization: '',
    Accept: 'application/json' as const,
    'Content-Type': 'application/json' as const
  }
  constructor(accessToken: string) {
    this.accessToken = accessToken
    this.headers.Authorization = `Bearer ${accessToken}`
  }
  private readonly fetchWithTimeout = async (url: string, options: RequestInit) => {
    const controller = new AbortController()
    const {signal} = controller
    const timeout = setTimeout(() => {
      controller.abort()
    }, MAX_REQUEST_TIME)
    try {
      const res = await this.fetch(url, {...options, signal})
      clearTimeout(timeout)
      return res
    } catch (e) {
      clearTimeout(timeout)
      return new Error('Azure DevOps is down')
    }
  }
  private readonly post = async <T>(url: string, payload: any) => {
    const res = await this.fetchWithTimeout(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload)
    })
    if (res instanceof Error) {
      return res
    }
    const json = (await res.json()) as AzureDevOpsError | T
    if ('message' in json) {
      return new Error(json.message)
    }
    return json
  }

  async getUserStories(instanceId: string, projectId: string) {
    const queryString =
      "Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.WorkItemType] = 'User Story' AND [State] <> 'Closed' AND [State] <> 'Removed' order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc"
    const payload = {
      query: queryString
    }
    const queryResult = await this.post<WorkItemQueryResult>(
      `https://dev.azure.com/${instanceId}/${projectId}/_apis/wit/wiql?api-version=6.0`,
      payload
    )
    return queryResult
  }
}
