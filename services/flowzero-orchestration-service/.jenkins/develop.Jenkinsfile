#!groovy

@Library('RatanOneSharedLib@master') _

def config = [
    targetHosts: 'dev',
    targetServer: 'uklvadapp1340',
    releaseType: 'SNAPSHOT',
    skipDeploy: false,
    skipUnitTest: false,
    skipSonarQube: false,
    skipAppScan: false,
    skipEksInstall: true
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