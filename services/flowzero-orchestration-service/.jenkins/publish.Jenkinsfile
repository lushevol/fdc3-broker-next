#!groovy

@Library('RatanOneSharedLib@master') _

def config = [:]

try {

    releaseJavaApplication(config)

} catch (e) {
    e.printStackTrace()
    currentBuild.result = "FAILED"
    EXCEPTION = e
    notifyStash
    throw e
}