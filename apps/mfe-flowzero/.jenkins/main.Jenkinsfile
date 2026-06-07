#!groovy

@Library('RatanOneSharedLib@feature/mfe') _

def config = [:]

try {

  mfeGuiBuildPipeline(config)

} catch (e) {
  e.printStackTrace()
  currentBuild.result = "FAILED"
  EXCEPTION = e
  notifyStash
  throw e
}