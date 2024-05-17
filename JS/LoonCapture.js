/*
Author：Lê Thành
Reference URL：https://github.com/ltd2vn/testflight/blob/main/JS/TestFlightCapture.js
Các Bước Sử Dụng
1: Nhập Plugin
2: Vào MITM Để Bật HTTP/2
3: Bật VPN, Vào TestFligt Để Lấy Dữ Liệu TestFlight
4: Vào Script -> Data Persistence -> Import Data By Key -> Dòng 1: APP_ID , Dòng 2: Điền ID TestFligt . Các ID Ngăn Cách Nhau Bằng Dấu Phẩy ( C1a3MRG4, IGjs9EMj, ZviH3WzG )
*/
const reg1 = /^https:\/\/testflight\.apple\.com\/v3\/accounts\/(.*)\/apps$/;
const reg2 = /^https:\/\/testflight\.apple\.com\/join\/(.*)/;
if (reg1.test($request.url)) {
    $persistentStore.write(null, 'request_id')
    let url = $request.url
    let key = url.replace(/(.*accounts\/)(.*)(\/apps)/, '$2')
    let session_id = $request.headers['X-Session-Id'] || $request.headers['x-session-id']
    let session_digest = $request.headers['X-Session-Digest'] || $request.headers['x-session-digest']
    let request_id = $request.headers['X-Request-Id'] || $request.headers['x-request-id']
    let ua = $request.headers['User-Agent'] || $request.headers['user-agent']
    $persistentStore.write(key, 'key')
    $persistentStore.write(session_id, 'session_id')
    $persistentStore.write(session_digest, 'session_digest')
    $persistentStore.write(request_id, 'request_id')
    $persistentStore.write(ua, 'tf_ua')
    console.log($request.headers)
    if ($persistentStore.read('request_id') !== null) {
      $notification.post('Tiến Hành Lấy Data TestFlight', 'Lấy Data Thành Công, Vui Lòng Đóng Script!','')

    } else {
      $notification.post('Tiến Hành Lấy Data TestFlight', 'Lấy Data Thất Bại, Bật HTTP/2 Tại MITM Và Thử Lại!','')
    }
    $done({})
}
if (reg2.test($request.url)) {
  let appId = $persistentStore.read("APP_ID");
  if (!appId) {
    appId = "";
  }
  let arr = appId.split(",");
  const id = reg2.exec($request.url)[1];
  arr.push(id);
  arr = unique(arr).filter((a) => a);
  if (arr.length > 0) {
    appId = arr.join(",");
  }
  $persistentStore.write(appId, "APP_ID");
  $notification.post("Auto Join TestFlight", `Đã Thêm APP_ID: ${id}`, `ID Hiện Tại: ${appId}`);
  $done({})
}
function unique(arr) {
  return Array.from(new Set(arr));
}
