// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

const opentelemetry = require('@opentelemetry/sdk-node');
const {getNodeAutoInstrumentations} = require('@opentelemetry/auto-instrumentations-node');
const {OTLPTraceExporter} = require('@opentelemetry/exporter-trace-otlp-grpc');
const {OTLPMetricExporter} = require('@opentelemetry/exporter-metrics-otlp-grpc');
const {PeriodicExportingMetricReader} = require('@opentelemetry/sdk-metrics');
const {alibabaCloudEcsDetector} = require('@opentelemetry/resource-detector-alibaba-cloud');
const {awsEc2Detector, awsEksDetector} = require('@opentelemetry/resource-detector-aws');
const {containerDetector} = require('@opentelemetry/resource-detector-container');
const {gcpDetector} = require('@opentelemetry/resource-detector-gcp');
const {envDetector, hostDetector, osDetector, processDetector} = require('@opentelemetry/resources');

const traceExporter = new OTLPTraceExporter({
  url: 'https://ingress.cx498.coralogix.com:443',
  headers: {
    'Authorization': 'Bearer cxtp_gYMbBViUyNYj0RGQppclpByjVVLSve',
    'CX-Application-Name': 'otel-demo-app',
    'CX-Subsystem-Name': 'otel-collector'
  }
});

const metricExporter = new OTLPMetricExporter({
  url: 'https://ingress.cx498.coralogix.com:443',
  headers: {
    'Authorization': 'Bearer cxtp_gYMbBViUyNYj0RGQppclpByjVVLSve',
    'CX-Application-Name': 'otel-demo-app',
    'CX-Subsystem-Name': 'otel-collector'
  }
});

const sdk = new opentelemetry.NodeSDK({
//  traceExporter: new OTLPTraceExporter(),
traceExporter: traceExporter,  
instrumentations: [
    getNodeAutoInstrumentations({
      // disable fs instrumentation to reduce noise
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    })
  ],
//  metricReader: new PeriodicExportingMetricReader({
    metricReader: new PeriodicExportingMetricReader({
    exporter: new metricExporter(),
  }),
  resourceDetectors: [
    containerDetector,
    envDetector,
    hostDetector,
    osDetector,
    processDetector,
    alibabaCloudEcsDetector,
    awsEksDetector,
    awsEc2Detector,
    gcpDetector,
  ],
});

sdk.start();
