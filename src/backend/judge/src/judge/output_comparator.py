def normalize_output(output: str) -> str:
    output = output.replace("\r\n", "\n").replace("\r", "\n")
    return output.strip()


def output_matches(actual_output: str, expected_output: str) -> bool:
    return (
        normalize_output(actual_output)
        == normalize_output(expected_output)
    )
