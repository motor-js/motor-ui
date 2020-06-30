const exportData = (engine, config, id, filename) => {
  const {
    host, secure, port, prefix,
  } = config

  const _secure = secure ? 'https://' : 'http://'
  const _port = port ? `:${port}` : ''
  const server = _secure + host + _port + prefix
  engine.getObject(id).then(model => {
    model.exportData('CSV_C', '/qHyperCubeDef', filename, 'P').then(url => {
      window.open(server + url.qUrl, '_blank')
    })
  })
}

export default exportData
