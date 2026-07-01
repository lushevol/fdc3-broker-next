#!groovy

@Library('RatanOneSharedLib@feature/mfe') _

def config = [:]

try {

  mfeGuiReleasePipeline(config)

} catch (e) {
  e.printStackTrace()
  currentBuild.result = "FAILED"
  EXCEPTION = e
  throw e
}