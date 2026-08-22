import hashlib
# Ham dung de thuc hien co che hashing ben trong du an 

def hash_string(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def match_hash(target_hash: str, target_string: str) -> bool:
    return hash_string(target_string) == target_hash