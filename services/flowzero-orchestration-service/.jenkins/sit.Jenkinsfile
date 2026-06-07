#!groovy

@Library('RatanOneSharedLib@master') _

def config = [
    releaseType: 'EKS',
    ratanEnv: 'sit',
    skipDockerBuild: false,
    skipDeploy: true,
    skipEksInstall: false,
    skipAppScan: false,
    skipSonarQube: false,
    skipUnitTest: false,
    skipUnitTestReport: false,
    eksNamespace: 'ns-4'
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