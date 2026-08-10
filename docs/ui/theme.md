# SkillBoost LMS UI Theme

> Tài liệu verify tạm thời được tổng hợp từ 49 asset trong `docs/screen` và các class/token trong frontend wireframe hiện có. Design context từ Figma chưa đọc được vì MCP Starter Plan đã chạm rate limit; các giá trị cần xác nhận lại được đánh dấu `VERIFY-FIGMA`.

## Visual direction

- Giao diện web sáng, ưu tiên nền trắng và các bề mặt xám rất nhạt.
- Ngôn ngữ thị giác kết hợp indigo/tím cho điều hướng và hành động chính với coral/pink cho điểm nhấn, progress và trạng thái nổi bật.
- Bố cục desktop rộng, nhiều màn hình dùng container khoảng 1,200-1,600px; màn dashboard/course dùng grid card và sidebar.
- Bo góc lớn là đặc trưng: input/card khoảng `16-24px`, panel lớn có thể tới `28-32px`.
- Viền mảnh, bóng nhẹ; tránh shadow đậm làm mất cảm giác phẳng và sạch.

## Color tokens

| Token | Hex | Usage |
| --- | --- | --- |
| `--color-brand-indigo` | `#392C7D` | CTA chính, link, nav active, coding/quiz accent |
| `--color-brand-indigo-dark` | `#2E3490` | CTA/payment emphasis, dark indigo surface |
| `--color-brand-violet` | `#5625E8` | accent phụ, focus/interactive highlight |
| `--color-brand-coral` | `#FF4667` | điểm nhấn, progress, instructor accent |
| `--color-brand-orange` | `#FE893E` | cảnh báo nhẹ, badge/action phụ |
| `--color-text-primary` | `#191919` | heading và nội dung chính |
| `--color-text-strong` | `#151E37` | heading trên admin/auth hoặc nền có tương phản cao |
| `--color-text-secondary` | `#6D6D6D` | mô tả, metadata, label phụ |
| `--color-text-muted` | `#90A1B9` | placeholder, disabled, code metadata |
| `--color-surface` | `#FFFFFF` | card, form, shell chính |
| `--color-surface-subtle` | `#F4F6F9` | page background, workspace background |
| `--color-surface-soft` | `#F8FAFC` | code panel, secondary panel |
| `--color-border` | `#E7E7E7` | divider, input/card border |
| `--color-border-blue` | `#E1E5EB` | divider trong workspace và bảng |
| `--color-success` | `#0FA05C` | passed, completed, positive result |
| `--color-success-bright` | `#03C95A` | success indicator nổi bật |
| `--color-warning` | `#FFC107` | pending, warning, review |
| `--color-error` | `#FB3748` | validation error, destructive action |

### Color usage rules

- Chỉ dùng `#FF4667` cho điểm nhấn hoặc hành động cần chú ý, không dùng làm nền lớn.
- CTA chính dùng indigo; CTA nguy hiểm dùng error đỏ, không dùng coral thay cho error.
- Text trên nền màu phải đạt tương phản; text secondary không dùng trên nền indigo đậm.
- Opacity thường dùng cho focus/soft surface: `rgba(93, 75, 255, 0.06-0.08)` và border focus `rgba(93, 75, 255, 0.45)`.

## Typography

- Font UI hiện diện trong frontend source: `Inter`, sans-serif. `VERIFY-FIGMA`: xác nhận font family chính thức và font weight trong file Figma.
- Font stack đề xuất: `Inter, ui-sans-serif, system-ui, sans-serif`.
- Body: `14-16px`, line-height khoảng `1.5-1.6`; metadata: `12-13px`.
- H1 màn landing/auth: `40-56px`, weight `700-800`.
- H1 dashboard/detail: `28-40px`, weight `700`.
- H2 section: `20-28px`, weight `700`.
- Label/button: `14-16px`, weight `600-700`.
- Code editor/problem statement: font monospace riêng, line-height `1.5`; không dùng font UI cho code.

## Layout and spacing

- Dùng thang spacing 4px: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.
- Form auth dùng shell hai cột trên desktop, card form bên phải; mobile chuyển thành một cột.
- Dashboard/course dùng header hoặc sidebar cố định theo nhóm màn hình; content luôn có gutter tối thiểu `24px`.
- Grid card: desktop 3-4 cột tùy module, tablet 2 cột, mobile 1 cột.
- Input/button cao khoảng `44-48px`; vùng click icon tối thiểu `40x40px`.

## Components

- Button: primary indigo, secondary white + border, destructive error; radius lớn `12-16px`.
- Input/select/textarea: white surface, border `#E7E7E7`, focus ring tím nhạt, radius `12-16px`.
- Card: white, border subtle hoặc shadow rất nhẹ, radius `20-28px`.
- Badge/status: pill, nền tint theo status, text đậm; pending dùng yellow, success dùng green, error dùng red.
- Tabs: active dùng indigo/coral indicator; inactive dùng secondary text.
- Table: header muted surface, row divider `#E1E5EB`, action đặt ở cột cuối.
- Code workspace: toolbar dark indigo, editor dark/soft panel, output/status panel tách rõ với editor.

## Responsive and accessibility

- Breakpoints đề xuất: mobile `<640px`, tablet `640-1023px`, desktop `>=1024px`.
- Không chỉ biểu đạt trạng thái bằng màu; luôn kèm text/icon.
- Focus state phải nhìn thấy rõ trên input, button, tab và row action.
- Nội dung dài trong course/problem/report phải scroll theo vùng, không làm vỡ chiều rộng desktop.

## Open items

- `VERIFY-FIGMA`: font family/weights và tên biến chính thức chưa lấy được từ Figma MCP.
- `VERIFY-FIGMA`: spacing, breakpoint và component variant cần đối chiếu lại với design tokens trong Figma.
- Các wireframe có route suy luận từ tên asset được ghi chú ngay trong từng file review.
