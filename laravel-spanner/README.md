laravel-spanner
---

# Component
* docker
* PHP 7.2
* laravel 5.5
* laravel-spanner 3.2.0

# Usage
## GCP
```
$ cd /path/to/laravel-spanner/deploy/
$ gcloud auth application-default login
$ terraform init
$ terraform apply
```

## Local
```
$ cd /path/to/laravel-spanner/
$ gcloud auth application-default login
$ docker-compose up
```

