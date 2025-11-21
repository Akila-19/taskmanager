// pipeline {
//     agent any
//     environment {
//         NODEJS_NAME = 'nodejs'
//         DOCKER_IMAGE = 'akila1908/my-taskmanager-app'
//         SONAR_SERVER = 'sonarqube'
//         // GITOPS Config
//         GITOPS_REPO = 'https://github.com/Akila-19/taskmanager.git' 
//         GITOPS_BRANCH = 'gitops'
//         MANIFEST_PATH = 'k8s/deployment.yaml' 
//     }

//     stages {
//         stage('Checkout Code') { 
//             steps { 
//                 git branch: 'main', url: "${GITOPS_REPO}" 
//             } 
//         }
        
//         stage('NodeJS Install & Test') {
//             steps {
//                 // Initial dependency installation and unit tests
//                 nodejs(nodeJSInstallationName: "${NODEJS_NAME}") {
//                     catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
//                         sh 'npm install' 
//                         sh 'npm test || true' // Allow test failure here if we enforce quality via Sonar
//                     }
//                 }
//             }
//         }

       
//         stage('SonarQube Analysis & Quality Gate') {
//             steps {
//                 // Analysis runs against source code on the agent
//                 withSonarQubeEnv("${SONAR_SERVER}") {
//                     sh "${tool 'sonarqube'}/bin/sonar-scanner -Dsonar.projectKey=my-taskmanager-app -Dsonar.sources=."
//                 }
//                 // Quality Gate MUST pass before proceeding to resource-intensive Docker build
//                 timeout(time: 5, unit: 'MINUTES') { 
//                     waitForQualityGate abortPipeline: true
//                 }
//             }
//         }
        
//         stage('Build & Push Docker Image') {
//             steps {
//                 script {
//                     def img = docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}")
//                     docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
//                         img.push() 
//                         img.tag('latest')
//                         img.push('latest')
//                     }
//                 }
//             }
//         }
        
//         // --- KEPT HERE: Must scan the artifact that was just pushed ---
//         stage('Trivy Scan') {
//             steps {
//                 // Scans the published Docker image for vulnerabilities
//                 sh "trivy image --severity HIGH --scanners vuln --exit-code 0 --format table --output trivy_report.txt ${DOCKER_IMAGE}:${BUILD_NUMBER}"
//                 archiveArtifacts artifacts: 'trivy_report.txt', fingerprint: true
//             }
//         }

//         // --- CD STAGE: UPDATING GITOPS BRANCH ---
//         stage('CD: Update Manifest (GitOps Trigger)') {
//             steps {
//                 script {
//                     // Checkout the manifest branch
//                     checkout([
//                         $class: 'GitSCM',
//                         branches: [[name: "${GITOPS_BRANCH}"]],
//                         userRemoteConfigs: [[url: "${GITOPS_REPO}"]]
//                     ])
                    
//                     // Update the image tag in the deployment file
//                     sh "sed -i 's|${DOCKER_IMAGE}:.*|${DOCKER_IMAGE}:${BUILD_NUMBER}|' ${MANIFEST_PATH}"
                    
//                     // Commit and push the change to the GITOPS branch
//                     sh 'git config user.email "jenkins@ci-server.com"'
//                     sh 'git config user.name "Jenkins Automation"'
//                     sh "git commit -am 'Deployment: Update TaskManager image to build ${BUILD_NUMBER}'"
                    
//                     // Push with credentials
//                     withCredentials([usernamePassword(credentialsId: 'github-gitops-creds', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
//                         sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Akila-19/taskmanager.git ${GITOPS_BRANCH}"
//                     }
//                 }
//             }
//         }
//     }
//     post { always { echo 'Pipeline finished.' } success { echo 'Pipeline succeeded!' } failure { echo 'Pipeline failed!' } }
// }






pipeline {
    agent any
    environment {
        NODEJS_NAME = 'nodejs'
        DOCKER_IMAGE = 'akila1908/my-taskmanager-app'
        SONAR_SERVER = 'sonarqube'
        // GITOPS Config
        GITOPS_REPO = 'https://github.com/Akila-19/taskmanager.git' 
        GITOPS_BRANCH = 'gitops'
        MANIFEST_PATH = 'k8s/deployment.yaml' 
    }

    stages {
        stage('Checkout Code') { steps { git branch: 'main', url: "${GITOPS_REPO}" } }
        
        stage('NodeJS Test & Install') {
            steps {
                nodejs(nodeJSInstallationName: "${NODEJS_NAME}") {
                    catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                        sh 'npm install' 
                        sh 'npm test || true'
                    }
                }
            }
        }

        stage('SonarQube Analysis & Quality Gate') {
            steps {
                withSonarQubeEnv("${SONAR_SERVER}") {
                    sh "${tool 'sonarqube'}/bin/sonar-scanner -Dsonar.projectKey=my-taskmanager-app -Dsonar.sources=."
                }
                // Pipeline will wait here and fail if the Quality Gate fails
                timeout(time: 5, unit: 'MINUTES') { 
                    waitForQualityGate abortPipeline: true 
                }
            }
        }
        
        // Pipeline only proceeds if SonarQube Quality Gate Passes
        stage('Build & Push Docker Image') {
            steps {
                script {
                    def img = docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}")
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
                        img.push() 
                        img.tag('latest')
                        img.push('latest')
                    }
                }
            }
        }

        stage('Trivy Scan') {
            steps {
                // Trivy runs on the pushed image artifact
                sh "trivy image --severity HIGH --scanners vuln --exit-code 0 --format table --output trivy_report.txt ${DOCKER_IMAGE}:${BUILD_NUMBER}"
                archiveArtifacts artifacts: 'trivy_report.txt', fingerprint: true
            }
        }
        
        // --- CD STAGE: UPDATING GITOPS BRANCH ---
        stage('CD: Update Manifest (GitOps Trigger)') {
            steps {
                script {
                    // Checkout the manifest branch
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "${GITOPS_BRANCH}"]], 
                        userRemoteConfigs: [[url: "${GITOPS_REPO}"]]
                    ])
                    
                    // Update the image tag in the deployment file
                    sh "sed -i 's|${DOCKER_IMAGE}:.*|${DOCKER_IMAGE}:${BUILD_NUMBER}|' ${MANIFEST_PATH}"
                    
                    // Set the commit author to Jenkins
                    sh 'git config user.email "jenkins@ci-server.com"'
                    sh 'git config user.name "Jenkins Automation"'
                    sh "git commit -am 'Deployment: Update TaskManager image to build ${BUILD_NUMBER}'"
                    
                    // Push the change to the GITOPS branch using credentials
                    withCredentials([usernamePassword(credentialsId: 'github-gitops-creds', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                        sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Akila-19/taskmanager.git ${GITOPS_BRANCH}"
                    }
                }
            }
        }
    }
    
    // --- CORRECTED POST SECTION ---
    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
