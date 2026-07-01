#!groovy

@Library('RatanOneSharedLib@master')

def config = [:]

try {

    runGitBranchPipeline(config)

} catch (e) {
    e.printStackTrace()
    currentBuild.result = "FAILED"
    EXCEPTION = e
    notifyStash
    throw e
}