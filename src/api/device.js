const url = 'http://192.168.0.215:9002'

async function getDevice(deviceId) {
  return await (await fetch(`${url}/state/${deviceId}`)).json()
}

async function getDevices() {
  return await (await fetch(`${url}/state`)).json()
}

async function setDevice(deviceId, data) {
  return await fetch(`${url}/state/${deviceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data),
  })
}

export { getDevice, getDevices, setDevice }