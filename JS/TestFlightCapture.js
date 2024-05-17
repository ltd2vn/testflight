$persistentStore.write(null, 'request_id')
let url = $request.url
let key = url.replace(/(.*accounts\/)(.*)(\/apps)/, '$2')
let session_id = $request.headers['x-session-id'] || $request.headers['X-Session-Id']
let session_digest = $request.headers['x-session-digest'] || $request.headers['X-Session-Digest']
let request_id = $request.headers['x-request-id'] || $request.headers['X-Request-Id']
$persistentStore.write(key, 'key')
$persistentStore.write(session_id, 'session_id')
$persistentStore.write(session_digest, 'session_digest')
$persistentStore.write(request_id, 'request_id')
if ($persistentStore.read('request_id') !== null) {
  $notification.post('Please Turn Off Script', 'Get TestFlight Data Successfully','')
} else {
  $notification.post('Can't Get TestFlight Data','Please Turn On MITM Then Add testflight.apple.com','')
}
$done({})
