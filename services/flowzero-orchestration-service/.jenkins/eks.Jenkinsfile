#!groovy

@Library('RatanOneSharedLib@master') _

def config = [
    releaseType: 'EKS',
    skipDeploy: true,
    skipUnitTest: true,
    skipSonarQube: false,
    skipAppScan: false,
    ratanEnv: 'eks',
    skipEksInstall: false,
    sendOutEmailWhenBuildFail:true,
    skipDockerBuild: false
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