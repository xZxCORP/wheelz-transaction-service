export type HealthStatus = 'healthy' | 'unhealthy'
export interface ServiceHealthStatus {
  name: string
  status: HealthStatus
  message?: string
}

export interface OverallHealthStatus {
  status: HealthStatus
  services: ServiceHealthStatus[]
}
