provider "google" {
  project = "${var.project}"
  region      = "${var.region}"
}

resource "google_project_services" "project" {
  services   = [
    "serviceusage.googleapis.com",
    "sourcerepo.googleapis.com",
    "compute.googleapis.com",
    "bigquery-json.googleapis.com",
    "cloudapis.googleapis.com",
    "cloudtrace.googleapis.com",
    "compute-component.googleapis.com",
    "container.googleapis.com",
    "dataflow.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "pubsub.googleapis.com",
    "sqladmin.googleapis.com",
    "spanner.googleapis.com"
  ]
}

resource "google_spanner_instance" "main" {
  config       = "regional-${var.region}"
  display_name = "${var.name}"
  name         = "${var.name}"
  num_nodes    = 1
}

data "template_file" "ddl" {
  template = "${file("ddl.sql")}"
}

resource "google_spanner_database" "main" {
  instance     = "${google_spanner_instance.main.name}"
  name         = "${var.name}"
  ddl          = ["${data.template_file.ddl.rendered}"]
}
