# Blockchain for Supply Chain

import hashlib
import time

class SupplyChainItem:
    def __init__(self, item_id, name, origin, transit_points, current_location, handler):
        self.item_id = item_id
        self.name = name
        self.origin = origin
        self.transit_points = transit_points  # List of points the item has passed through
        self.current_location = current_location
        self.handler = handler  # Current party responsible for the item

class Block:
    def __init__(self, index, previous_hash, timestamp, supply_chain_item, hash):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.supply_chain_item = supply_chain_item
        self.hash = hash

def calculate_hash(index, previous_hash, timestamp, supply_chain_item):
    return hashlib.sha256(f'{index}{previous_hash}{timestamp}{supply_chain_item.item_id}{supply_chain_item.name}{supply_chain_item.origin}{supply_chain_item.transit_points}{supply_chain_item.current_location}{supply_chain_item.handler}'.encode('utf-8')).hexdigest()

def create_genesis_block():
    # Placeholder item for the genesis block
    genesis_item = SupplyChainItem("0", "Genesis Item", "N/A", [], "N/A", "N/A")
    return Block(0, '0', time.time(), genesis_item, calculate_hash(0, '0', time.time(), genesis_item))

def create_new_block(prev_block, supply_chain_item):
    index = prev_block.index + 1
    timestamp = time.time()
    hash = calculate_hash(index, prev_block.hash, timestamp, supply_chain_item)
    return Block(index, prev_block.hash, timestamp, supply_chain_item, hash)

# Initialize the blockchain with the genesis block
blockchain = [create_genesis_block()]
previous_block = blockchain[0]

# Example: Add a supply chain item to the blockchain
item1 = SupplyChainItem("1", "Electronics Component", "China", ["China -> Sea Transit", "Sea Transit -> US Port"], "US Port", "Customs Agency")
new_block = create_new_block(previous_block, item1)
blockchain.append(new_block)

if __name__ == "__main__":
    for block in blockchain:
        print(f"Index: {block.index}")
        print(f"Previous Hash: {block.previous_hash}")
        print(f"Timestamp: {block.timestamp}")
        print(f"Item ID: {block.supply_chain_item.item_id}")
        print(f"Item Name: {block.supply_chain_item.name}")
        print(f"Origin: {block.supply_chain_item.origin}")
        print(f"Transit Points: {' -> '.join(block.supply_chain_item.transit_points)}")
        print(f"Current Location: {block.supply_chain_item.current_location}")
        print(f"Handler: {block.supply_chain_item.handler}")
        print(f"Hash: {block.hash}\n")
