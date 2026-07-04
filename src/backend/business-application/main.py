from datetime import datetime

import uvicorn
from rich import box
from rich.console import Console
from rich.table import Table


def print_banner():
    console = Console()

    # Clean, border-aligned table layout
    table = Table(
        title="[bold #a78bfa]FastAPI Server Instance[/bold #a78bfa]",
        show_header=False,
        box=box.ROUNDED,             # Modern rounded corners
        border_style="#6366f1",      # Indigo border
        padding=(0, 2),              # Generous padding for a modern look
        title_justify="center"
    )

    # Clean typography without emojis to avoid rendering glitches
    table.add_column("Field", style="bold #38bdf8", justify="right", width=12)
    table.add_column("Value", style="#f8fafc")

    table.add_row("URL", "[link=http://localhost:4000]http://localhost:4000[/link]")
    table.add_row("API Docs", "[link=http://localhost:4000/docs]http://localhost:4000/docs[/link] [dim](Swagger UI)[/dim]")
    table.add_row("Developer", "[bold #34d399]Cloudian[/bold #34d399]")
    table.add_row(
        "Started",
        f"[#fbbf24]{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}[/#fbbf24]"
    )
    table.add_row("Mode", "[bold #f87171]Development[/bold #f87171] [dim](Hot Reload Active)[/dim]")

    console.print()
    console.print(table)
    console.print()


if __name__ == "__main__":
    print_banner()

    uvicorn.run(
        "src.app:app",
        host="0.0.0.0",
        port=4000,
        reload=True,
    )