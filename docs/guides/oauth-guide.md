## HƯỚNG DẪN LẤY ACCESS_TOKEN ĐƠN GIẢN ĐẾN CẬU VÀNG CŨNG LÀM ĐƯỢC. 

- **Bước 1**: Truy cập vào đường link API: authorize để có thể kiểm tra hiện tại người dùng đã đăng nhập chưa? 

`http://localhost:4001/api/auth/authorize?redirect_uri=https://youtube.com`

Nếu người dùng đã đăng nhập rồi thì hệ thống sẽ thông báo lỗi. Ngược lại, nếu người dùng chưa đăng nhập, hệ thống sẽ tự động redirect người dùng qua trang đăng nhập của hệ thống Authentication Provider. 

Sau này, chúng ta sẽ gửi kèm theo Cookie ở Header của gói tin về `auth-provider` service. Vì vạy, tạm thời chúng ta chỉ cần giả lập chưa gửi được Cookie (Cookie bị rỗng) vẫn được. Hệ thống có thể tự nhận biết Cookie có bị rỗng hay không. 

**Bước 2**: Đăng nhập tại hệ thống Authentication Provider 

Vì người dùng chưa đăng nhập nên hệ thống tự động redirect: `http://localhost:4001/api/auth/login?redirect_uri=https://youtube.com`

Ở giao diện trang đăng nhập bạn hãy tiến hành nhập email và password của mình 

Nếu như đăng nhập thành công thì hệ thống sẽ tiến hành redirect người dùng về redirect_uri (Sau này chính là đường link FE)

**Bước 3**: Đổi mã code để lấy access_token và jwt_token 
- Sau khi hệ thống đăng nhập thành công, sẽ trả về cho người dùng một `authorization_code`. Bạn có thể xem được `authorization_code` này ở  trong Terminal của Backend hoặc là truy cập vào redis của team -> CLI -> gõ lệnh `KEYS *` 

Sử dụng mã code đó để tiến hành đổi lấy `access_token` và `refresh_token` theo cú pháp sau: 
`http://localhost:4001/api/auth/code?code=<your_authorization_code>` 

```json 
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJjbG91ZGlhbkBnbWFpbC5jb20iLCJleHAiOjE3ODUyMjQ2NDR9.Swsbtm3PjBh1_CsP9rpRpx3P9syIZ7s0onfDX8zX-gDmgrU-3mJHFLhzDrjDBp5yKOBPq3-uk8Ym89jNa18oFsVIHamc3q954m0CJNHA7ROi5412bHA7RJwHtH1Pi1B2L3NpWJU3JrLumMh8_4RQYqiTU9gqbXplPoa4LC_XVZCRTLAjM92e9Cw1Ylh8TCQ-WDuxeFs-oH4YG0VtD9uJkYrMucWdA5L5uMYd1WGqc3OZ2PczobnYtyvSs1R163SxoQ6rGLkXfIfyUAeMm3mQhQ6KvFoUqDyz_DoHLYdRCz54XC2YycKn9ar1O8fc0UBKO9v8WiaKkrrvj53u7HqD3A",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJjbG91ZGlhbkBnbWFpbC5jb20iLCJleHAiOjE3ODU4MjIyNDR9.xUgDskg21nRb8Tt73c015aXlNuY3XS3bbqGxxstUETo"
}
```