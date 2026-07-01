#!groovy

@Library('RatanOneSharedLib@master') _

def config = [
    targetHosts: 'preprod',
    targetServer: 'preprod',
    releaseType: 'RELEASE',
    skipDeploy: true,
    skipTag: false
]

try {

    runJavaPipeline(config)

} catch (e) {
    e.printStackTrace()
    currentBuild.result = "FAILED"
    EXCEPTION = e
    notifyStash
    throw e
}