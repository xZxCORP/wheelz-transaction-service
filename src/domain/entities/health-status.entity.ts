export type HealthStatus = 'healthy' | 'unhealthy'
export interface ServiceHealthStatus {
  name: string
  status: HealthStatus
  message?: string
}

// domain/entities/overall-health-status.entity.ts
export interface OverallHealthStatus {
  status: HealthStatus
  services: ServiceHealthStatus[]
}
