#!groovy

@Library('RatanOneSharedLib@feature/mfe') _

def config = [
    deployEnv: 'uat'
]

try {

  mfeGuiDeployPipeline(config)

} catch (e) {
  e.printStackTrace()
  currentBuild.result = "FAILED"
  EXCEPTION = e
  throw e
}