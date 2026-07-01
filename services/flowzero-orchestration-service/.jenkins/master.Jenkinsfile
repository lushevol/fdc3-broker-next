#!groovy

@Library('RatanOneSharedLib@master') _

def config = [
    targetHosts: 'dev',
    targetServer: 'uklvadapp1340',
    releaseType: 'SNAPSHOT',
    skipAppScan: false,
    skipSonarQube: false,
    skipDeploy: true
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