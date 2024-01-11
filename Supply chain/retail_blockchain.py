# Blockchain for Retail

import hashlib
import time

class Product:
    def __init__(self, product_id, name, origin, certifications):
        self.product_id = product_id
        self.name = name
        self.origin = origin
        self.certifications = certifications  # List of certifications like 'organic', 'fair-trade', etc.

class Block:
    def __init__(self, index, previous_hash, timestamp, product, hash):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.product = product
        self.hash = hash

def calculate_hash(index, previous_hash, timestamp, product):
    return hashlib.sha256(f'{index}{previous_hash}{timestamp}{product.product_id}{product.name}{product.origin}{product.certifications}'.encode('utf-8')).hexdigest()

def create_genesis_block():
    # Placeholder product for the genesis block
    genesis_product = Product("0", "Genesis Product", "N/A", ["N/A"])
    return Block(0, '0', time.time(), genesis_product, calculate_hash(0, '0', time.time(), genesis_product))

def create_new_block(prev_block, product):
    index = prev_block.index + 1
    timestamp = time.time()
    hash = calculate_hash(index, prev_block.hash, timestamp, product)
    return Block(index, prev_block.hash, timestamp, product, hash)

# Initialize the blockchain with the genesis block
blockchain = [create_genesis_block()]
previous_block = blockchain[0]

# Example: Add a product to the blockchain
product1 = Product("1", "Organic T-Shirt", "USA", ["organic", "fair-trade"])
new_block = create_new_block(previous_block, product1)
blockchain.append(new_block)

if __name__ == "__main__":
    for block in blockchain:
        print(f"Index: {block.index}")
        print(f"Previous Hash: {block.previous_hash}")
        print(f"Timestamp: {block.timestamp}")
        print(f"Product ID: {block.product.product_id}")
        print(f"Product Name: {block.product.name}")
        print(f"Origin: {block.product.origin}")
        print(f"Certifications: {', '.join(block.product.certifications)}")
        print(f"Hash: {block.hash}\n")
