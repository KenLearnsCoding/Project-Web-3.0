# Blockchain for Healthcare

import hashlib
import time

class PatientRecord:
    def __init__(self, patient_id, name, medical_data):
        self.patient_id = patient_id
        self.name = name
        self.medical_data = medical_data  # This can be a list of medical events or data points

class Block:
    def __init__(self, index, previous_hash, timestamp, patient_record, hash):
        self.index = index
        self.previous_hash = previous_hash
        self.timestamp = timestamp
        self.patient_record = patient_record
        self.hash = hash

def calculate_hash(index, previous_hash, timestamp, patient_record):
    return hashlib.sha256(f'{index}{previous_hash}{timestamp}{patient_record.patient_id}{patient_record.name}{patient_record.medical_data}'.encode('utf-8')).hexdigest()

def create_genesis_block():
    # A placeholder record for the genesis block
    genesis_record = PatientRecord("0", "Genesis Patient", "No medical data")
    return Block(0, '0', 
                 time.time(), 
                 genesis_record, 
                 calculate_hash(0, 
                                '0', 
                                time.time(), 
                                genesis_record
                ))

def create_new_block(prev_block, patient_record):
    index = prev_block.index + 1
    timestamp = time.time()
    hash = calculate_hash(index, 
                          prev_block.hash, 
                          timestamp, 
                          patient_record
    )
    return Block(index, prev_block.hash, timestamp, patient_record, hash)

# Create the blockchain and add the genesis block
blockchain = [create_genesis_block()]
previous_block = blockchain[0]

# Example: Add a patient record to the blockchain
patient1 = PatientRecord("1", "John Doe", "Medical data for John Doe")
new_block = create_new_block(previous_block, patient1)
blockchain.append(new_block)

if __name__ == "__main__":
    for block in blockchain:
        print(f"Index: {block.index}")
        print(f"Previous Hash: {block.previous_hash}")
        print(f"Timestamp: {block.timestamp}")
        print(f"Patient ID: {block.patient_record.patient_id}")
        print(f"Patient Name: {block.patient_record.name}")
        print(f"Medical Data: {block.patient_record.medical_data}")
        print(f"Hash: {block.hash}\n")
