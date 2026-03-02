# aquarium
IoT system with cloud for controlling air, tempreture and salt of water.

Branch strategy:
Create new bracnhes on develop. templates for branches:
New features: 
  feature/new-feature
Test environment:
  test/tested-feature
Production(fixing bugs in production):
  hotfix/bug-name

Clone to your computer: git clone https://github.com/KrupskyiD/aquarium.git

Stack: 
  Web: JS, React, Node.Js + Express.js
  Database: InfluxDB
  IoT:

Work with branching:
  1) Create new branch:
    ```bash

    git checkout develop
    git pull origin develop
    git checkout -b feature/new-feature
  2) Add new feature:
     ```bash
    git add .
    git commit -m "New feature for..."
  3) Commit changes to repo:
     ```bash
    git push origin feature/new-feature
  4) Pull request and merge into develop
  5) Merge develop into main:
     ```bash
    git pull origin develop
    git checkout main
    git merge develop
    git push origin main
