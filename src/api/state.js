async function getState(deviceId) {
  return await (await fetch(`http://192.168.0.215:9002/state/${deviceId}`)).json()
}

async function getStates() {
  return await (await fetch('http://192.168.0.215:9002/state')).json()
}

async function setState(deviceId, data) {
  return await fetch(`http://192.168.0.215:9002/state/${deviceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data),
  })
}

export { getState, getStates, setState }