module.exports = [{
    script: 'src/workers/video.worker.js',
    name: 'app',
    exec_mode: 'cluster',
    instances: 'max'
  }]