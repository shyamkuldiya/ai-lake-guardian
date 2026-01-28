// Lake hooks
export { useLakes, useLake, lakeKeys } from './use-lakes'

// Health score hooks
export { useLatestScore, useScoreHistory, scoreKeys } from './use-health-scores'

// Prediction hooks
export {
  usePredictions,
  usePrediction,
  predictionKeys,
} from './use-predictions'

// Alert hooks
export {
  useAlerts,
  useAcknowledgeAlert,
  useResolveAlert,
  alertKeys,
} from './use-alerts'

// Sensor hooks
export { useLatestSensors, sensorKeys } from './use-sensors'

// Report hooks
export {
  useReports,
  useSubmitReport,
  useUploadImage,
  reportKeys,
} from './use-reports'
