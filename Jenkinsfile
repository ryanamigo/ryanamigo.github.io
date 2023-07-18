node {
  stage('checkout') {
    checkout scm
    env.WORKSPACE = pwd()
    if (TAG == "origin/master") {
      env.APP_VERSION = "latest"
    } else {
      sh(script: "git checkout ${TAG}")
      env.APP_VERSION = TAG
    }
    env.APP_NAME = sh(returnStdout: true,
        script: "cat package.json | grep name | head -1 | awk -F: '{ print \$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]'")
    env.REGISTRY = "ryanamigo/web"
  }

  // stage('build') {
  //   nodejs("node20") {
  //     sh "npm -v"
  //     sh "corepack enable"
  //     sh "pnpm install"
  //     sh "pnpm run generate"
  //   }
  // }

  stage('docker') {
    sh '''echo P@ssw0rdniubi | docker login --username ryanamigo --password-stdin'''
    sh "docker  build \
                --file ${env.WORKSPACE}/Dockerfile \
                --tag ${env.REGISTRY}/${env.APP_NAME}:${env.APP_VERSION} \
                ${env.WORKSPACE}"
  }
}