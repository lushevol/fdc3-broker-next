#!groovy

@Library('RatanOneSharedLib@master')

def config = [:]

try {

    runGitReleaseBranchPipeline(config)

} catch (e) {
    e.printStackTrace()
    currentBuild.result = "FAILED"
    EXCEPTION = e
    notifyStash
    throw e
}