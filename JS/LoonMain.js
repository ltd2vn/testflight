/*
Author : Lê Thành
Reference URL：https://raw.githubusercontent.com/DecoAri/JavaScript/main/Surge/Auto_join_TF.js
*/
!(async () => {
  ids = $persistentStore.read('APP_ID')
  if (ids == null) {
    $notification.post('APP_ID Chưa Được Thêm', 'Vui Lòng Thêm Thủ Công Hoặc Sử Dụng Liên Kết TestFlight Để Thêm Tự Động', '')
  } else if (ids == '') {
    $notification.post('Tất Cả Được Thêm', 'Vui Lòng Tắt Thủ Công', '')
  } else {
    ids = ids.split(',')
    for await (const ID of ids) {
      await autoPost(ID)
    }
  }
  $done()
})()

function autoPost(ID) {
  let Key = $persistentStore.read('key')
  let testurl = 'https://testflight.apple.com/v3/accounts/' + Key + '/ru/'
  let header = {
    'X-Session-Id': `${$persistentStore.read('session_id')}`,
    'X-Session-Digest': `${$persistentStore.read('session_digest')}`,
    'X-Request-Id': `${$persistentStore.read('request_id')}`,
    'User-Agent': `${$persistentStore.read('tf_ua')}`,
  }
  return new Promise(function (resolve) {
    $httpClient.get({ url: testurl + ID, headers: header }, function (error, resp, data) {
      if (error == null) {
        if (resp.status == 404) {
          ids = $persistentStore.read('APP_ID').split(',')
          ids = ids.filter(ids => ids !== ID)
          $persistentStore.write(ids.toString(), 'APP_ID')
          console.log(ID + ' ' + 'TestFlight Của Ứng Dụng Này Không Tồn Tại, APP_ID Đã Tự Động Xóa')
          $notification.post(ID, 'TestFlight Của Ứng Dụng Này Không Tồn Tại', 'APP_ID Đã Tự Động Xóa')
          resolve()
        } else {
          let jsonData = JSON.parse(data)
          if (jsonData.data == null) {
            console.log(ID + ' ' + jsonData.messages[0].message)
            resolve()
          } else if (jsonData.data.status == 'FULL') {
            console.log(jsonData.data.app.name + ' ' + ID + ' ' + jsonData.data.message)
            resolve()
          } else {
            $httpClient.post({ url: testurl + ID + '/accept', headers: header }, function (error, resp, body) {
              let jsonBody = JSON.parse(body)
              $notification.post(jsonBody.data.name, 'TestFlight Đã Tham Gia Thành Công', '')
              console.log(jsonBody.data.name + ' TestFlight Đã Tham Gia Thành Công')
              ids = $persistentStore.read('APP_ID').split(',')
              ids = ids.filter(ids => ids !== ID)
              $persistentStore.write(ids.toString(), 'APP_ID')
              resolve()
            })
          }
        }
      } else {
        if (error == 'The request timed out.') {
          resolve()
        } else {
          $notification.post('Tự Động Tham Gia TestFlight', error, '')
          console.log(ID + ' ' + error)
          resolve()
        }
      }
    })
  })
}
