# General Blockchain
# This is a general blockchain structure for ppl to use as a reference.
# then us this general blockchain as a base to build up another blockchain system for other industries. 

import hashlib
import time

class Block:
    def __init__(self, index, previous_hash, timestamp, data, hash):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.data = data
        self.hash = hash


def calculate_hash(index, previous_hash, timestamp, data):
    return hashlib.sha256(f'{index}{previous_hash}{timestamp}{data}'.encode('utf-8')).hexdigest()


def create_genesis_block():
    return Block(0, '0', time.time(), 'Genesis Block', calculate_hash(0, '0', time.time(), 'Genesis Block'))


def create_new_block(prev_block, data):
    index = prev_block.index + 1
    timestamp = time.time()
    hash = calculate_hash(index, prev_block.hash, timestamp, data)
    return Block(index, prev_block.hash, timestamp, data, hash)


# Create the blockchain and add the genesis block
blockchain = [create_genesis_block()]
previous_block = blockchain[0]

# Add blocks to the blockchain
num_blocks = 10
for i in range(1, num_blocks + 1):
    new_block_data = f"Block # {i} data."
    new_block = create_new_block(previous_block, new_block_data)
    blockchain.append(new_block)
    previous_block = new_block
    print(f"Block #{new_block.index} has been added to the blockchain!")
    print(f"Hash: {new_block.hash}\n")

if __name__ == "__main__":
    for block in blockchain:
        print(f"Index: {block.index}")
        print(f"Previous Hash: {block.previous_hash}")
        print(f"Timestamp: {block.timestamp}")
        print(f"Data: {block.data}")
        print(f"Hash: {block.hash}\n")
