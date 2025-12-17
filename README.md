# CI/CD Pipeline with Jenkins, Kubernetes & GitOps

A complete automated CI/CD pipeline that deploys a Node.js application from code commit to Kubernetes with security scanning and monitoring.

## Overview

This project implements a production-ready DevOps pipeline that automates the entire software delivery process. Code pushed to GitHub automatically builds, tests, scans for vulnerabilities, and deploys to Kubernetes.

<img width="1161" height="615" alt="taskmanager_architecture drawio (1)" src="https://github.com/user-attachments/assets/4b47cb1e-97c0-49c5-9b73-f1ad9bc24563" />


## What It Does

- Automatically builds and tests code on every commit
- Scans Docker images for security vulnerabilities before deployment
- Uses GitOps principles for declarative deployments
- Monitors application health with Prometheus and Grafana
- Provides complete audit trail through Git commits

## Technologies Used

**CI/CD**: Jenkins, Docker, GitHub  
**Security**: Trivy, SonarQube  
**Deployment**: Kubernetes, ArgoCD  
**Monitoring**: Prometheus, Grafana  
**Infrastructure**: AWS EC2  

## Architecture

The pipeline has three layers:

1. **CI Layer** - Jenkins builds, tests, and scans Docker images
2. **CD Layer** - ArgoCD deploys to Kubernetes using GitOps
3. **Observability** - Prometheus and Grafana provide monitoring

## Key Features

✅ Fully automated deployment workflow  
✅ Security scanning before image publication  
✅ GitOps-based Kubernetes deployment  
✅ Real-time monitoring and metrics  
✅ Zero downtime rolling updates  
✅ Complete deployment audit trail  

## Pipeline Flow

1. Developer pushes code to GitHub
2. Jenkins automatically triggers pipeline
3. Code is tested and analyzed (SonarQube)
4. Docker image is built
5. Image is scanned for vulnerabilities (Trivy)
6. Validated image pushed to Docker Hub
7. Deployment manifest updated in Git
8. ArgoCD syncs changes to Kubernetes
9. Application deployed with zero downtime


## Repository Structure

- **main branch** - Application source code
- **gitops branch** - Kubernetes deployment manifests

This separation enables GitOps workflow where infrastructure changes are version-controlled.


## What I Learned

- Positioning security scans before Docker push prevents vulnerable images from reaching production
- GitOps provides complete audit trails and easy rollbacks through Git
- Proper RBAC configuration is essential for cross-namespace communication in Kubernetes
- Implementing monitoring from the start makes troubleshooting significantly easier

## Future Enhancements

- Implement canary deployments with Argo Rollouts
- Add HashiCorp Vault for secrets management
- Create multi-environment pipeline (dev/staging/prod)
- Set up automated alerts with Prometheus AlertManager

## Documentation

For detailed setup instructions and implementation guide, check out my [Medium article](https://medium.com/@akila98sri/building-a-complete-ci-cd-pipeline-step-by-step-guide-f79f597ae137).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**LinkedIn**: [Akilandeshwari Srinivasan](www.linkedin.com/in/akilandeshwari-srinivasan)  
**GitHub**: [@Akila-19](https://github.com/Akila-19)  

---

⭐ If you found this project helpful, please give it a star!

**Built with Jenkins, Docker, Kubernetes, ArgoCD, and lots of debugging**
