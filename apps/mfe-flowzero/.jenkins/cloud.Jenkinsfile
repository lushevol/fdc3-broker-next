#!groovy

@Library('RatanOneSharedLib@feature/mfe') _

def config = [
    deployEnv: 'cloud'
]

try {

  mfeGuiDeployPipeline(config)

} catch (e) {
  e.printStackTrace()
  currentBuild.result = "FAILED"
  EXCEPTION = e
  throw e
}