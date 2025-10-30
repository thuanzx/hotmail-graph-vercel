# Đọc Hotmail bằng Microsoft Graph (Vercel deploy)

Mô tả ngắn: project Next.js + API route `/api/read` để lấy email từ Microsoft Graph bằng `refresh_token` (nhập nhiều dòng dạng `email|password|refresh_token|client_id`).

## Files
- `pages/index.js` - giao diện chính (textarea + bảng hiển thị)
- `pages/api/read.js` - serverless API gọi token endpoint + Graph

## Env vars (trên Vercel)
- `AZURE_TENANT_ID` (hoặc `common`)
- `DEFAULT_CLIENT_ID` (fallback client id)
- `CLIENT_SECRET` (nếu client sử dụng confidential client, optional)

## Deploy
1. Push repo lên GitHub.
2. Import repo trên Vercel.
3. Thêm Environment Variables vào Vercel Project Settings.
4. Deploy → Mở site → dán list accounts → "Đọc hộp thư".

**Chú ý quan trọng:** chỉ dùng cho tài khoản bạn sở hữu. `refresh_token` phải hợp lệ và app trên Azure có quyền `Mail.Read`.

