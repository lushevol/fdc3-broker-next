
{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "ratan-spring-boot.chart" -}}
{{- printf "%s-helm" .Chart.Name | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Expand the name of the chart.
*/}}
{{- define "ratan-spring-boot.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}
