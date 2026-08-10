# CLASS01 Workspace

- **Tên màn hình:** CLASS01 Workspace
- **Đường dẫn:** `/class/workspace`
- **Asset:** [class/CLASS01Workspace.svg](../../screen/class/CLASS01Workspace.svg)
- **Trạng thái verify:** Wireframe suy luận từ tên file và nhóm chức năng; cần đối chiếu screenshot Figma khi MCP có quota.

## Wireframe

~~~text
[Class header: title, members, status]
[Left: workspace/editor or lesson content] | [Right: members/chat/activity]
[toolbar actions, save/run/share]
[bottom activity or submission panel]
~~~

## Components and behavior

- Header/navigation và action chính dùng token trong [theme.md](../theme.md).
- Các panel, card, input và table giữ đúng thứ tự từ trái sang phải, trên xuống dưới như sơ đồ; trên mobile chuyển thành một cột khi có nhiều cột.
- Trạng thái tải rỗng, lỗi hoặc pending hiển thị trong đúng vùng nội dung, không thay đổi shell của màn hình.

