# Medical Blockchain

# To be installed: pip3 install Flask
# Download Postman to test the API
# install requests: pip3 install requests

# Importing the libraries
import datetime # to get the current time
import hashlib # to hash the blocks
import json # to encode the blocks before hashing
from flask import Flask, jsonify, request  # to create the web app
import requests # to make the requests to the other nodes in the network
from uuid import uuid4 # to create a random address for the node
from urllib.parse import urlparse # to parse the address of the nodes

# Part 1 - Building a Blockchain.  
class Blockchain: 
    # this init like a constructor
    # Self is the object that we are going to create
    def __init__(self):
        # create a chain
        self.chain = []
        
        # create a list of transactions
        self.transactions = [] 
        
        # create the block
        self.create_block(
            proof = 1, 
            previous_hash='0'
        )
        
        # create a set of nodes
        self.nodes = set()
    
    # create a function to create a block
    def create_block(self, proof, previous_hash):
        #create the block with its properties
        block= {
            'index': len(self.chain) + 1, 
            'timestamp': str(datetime.datetime.now()),# get the timestamp
            'proof': proof, # pass proof of work here  from postman
            'previous_hash': previous_hash, # pass the previous hash from postman
            'transactions': self.transactions # pass the transactions
        }
        self.transactions = [] # reset the transactions list, because we want to add the transactions to the next block
        # append the block to the chain
        self.chain.append(block)
        
        # return the block to where the create_block function is called
        return block

    # get the previous block in the chain to get the previous hash
    def get_previous_block(self):
        # get the last block in the chain
        return self.chain[-1]
    
    # create proof of work function to mine a block
    def proof_of_work(self, previous_proof):
        new_proof = 1 # start with 1
        check_proof = False # check if the proof is valid
        while check_proof is False: 
            # create a hash operation
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()
            
            # check if the first 4 characters of the hash are 0000
            if hash_operation[:4] == '0000':
                check_proof = True
            else: 
                new_proof += 1
        
        return new_proof
    
    # create a hash function to hash the block
    def hash(self, block):
        # encode the block before hashing  into the right format
        encoded_block = json.dumps(block, sort_keys = True).encode()
        
        # return the hash of the block
        return hashlib.sha256(encoded_block).hexdigest()
    
    # check the chain is valid or not to make sure that no one has been tampering with the blocks
    def is_chain_valid(self, chain):
        # start checking the first block in the chain
        previous_block = chain[0]
        
        # each block has a number of block
        block_index = 1
        
        # loop through the chain
        while block_index < len(chain):  #check the first block in the chain till the last block
            
            #get the current block
            block = chain[block_index]
            
            # check if the previous hash of the current block is equal to the hash of the previous block
            if block['previous_hash'] != self.hash(previous_block):
                return False
            
            # check if the proof of the previous block is valid
            previous_proof = previous_block['proof']
            
            # get the proof of the current block
            proof = block['proof']
            
            # create a hash operation to check if the proof is valid with the previous proof or not
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            
            # check the first 4 characters of the hash are 0000 or not
            if hash_operation[:4] != '0000':
                return False
            
            # save the current block as the previous block for the next loop
            previous_block = block
            
            # update the block index
            block_index += 1
            
        return True
    
    # creating an add_transaction function to add a transaction to the list of transactions
    def add_transaction(self, patient, doctor, permission):
        self.transactions.append({
            'patient': patient,
            'doctor': doctor,
            'permission': permission
        })
        
        # return the index of the block that the transaction will be added to
        previous_block = self.get_previous_block()
        return previous_block['index'] + 1
    
    # creating a function to add a node to the network
    def add_node(self, address):
        # assign the parsed url to the parsed_url variable to get the address of the node later
        parsed_url = urlparse(address)
        
        # this is the netloc of the url to get the address of the node
        self.nodes.add(parsed_url.netloc)
    
    # creating a function to replace the chain with the longest chain in the network
    def replace_chain(self):
        network = self.nodes # get the nodes in the network
        
        longest_chain = None # this longest_chain variable is to get the longest chain in the network
        
        max_length = len(self.chain) # this max_length variable is to get the length of the longest chain in the network
        
        # loop through the nodes in the network
        for node in network:
            # make a request to the nodes in the network
            response = requests.get(f'http://{node}/get_chain') # get the chain from the node
            
            # this is the length of the chain that we get from the node and we check it 
            if response.status_code == 200:
                # get the length of the chain from the node
                length = response.json()['length']
                
                # get the chain from the node
                chain = response.json()['chain']
                
                # check if the length of the chain is longer than the max_length and the chain is valid
                # to replace the chain
                if length > max_length and self.is_chain_valid(chain):
                    max_length = length # update the max_length
                    longest_chain = chain # update the longest_chain

        # replace the chain if the longest_chain is not None    
        if longest_chain:
            # update the chain
            self.chain = longest_chain
            
            # return True to indicate that the chain is replaced
            return True
        
        return False # return False to indicate that the chain is not replaced
        
# Part 2 - Mining our Blockchain
# creating a web app
app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

# creating an address for the node on Port 5001 to make the requests
node_address = str(uuid4()).replace('-', '')

# Creating a Blockchain
blockchain = Blockchain()

# Mining a new block
@app.route('/mine_block', methods = ['GET']) # define the route

# creating the mine_block function to mine a block
def mine_block():
    # assign the previous block to the previous_block variable
    previous_block = blockchain.get_previous_block()
    
    # assign the previous proof to the previous_proof variable
    previous_proof = previous_block['proof']
    
    # assign the proof of the current block to the proof variable
    proof = blockchain.proof_of_work(previous_proof)
    
    # assign the previous hash to the previous_hash variable
    previous_hash = blockchain.hash(previous_block)
    
    # add a transaction to the list of transactions
    blockchain.add_transaction(
        patient = node_address, 
        doctor = 'Second Doctor',
        permission = 1
    )
    
    # assign the current block to the block variable
    block = blockchain.create_block(proof, previous_hash)
    
    # create a response to return to the user
    response = {
        'message': 'Congratulation! you just mined a block!',
        'index': block['index'], 
        'timestamp': block['timestamp'],
        'proof': block['proof'],
        'previous_hash': block['previous_hash'], 
        'transactions': block['transactions']
    }
    
    return jsonify(response), 200 # return the response to the user

# Getting the full Blockchain
@app.route('/get_chain', methods = ['GET'])

# creating the get_chain function to get the full chain
def get_chain():
    # create a response to return to the user
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain)
    }
    
    return jsonify(response), 200

# Getting the full Blockchain
@app.route('/is_valid', methods = ['GET'])

# creating the is_valid function to check if the chain is valid or not
def is_valid():
    # get the chain and assign it to the chain variable
    is_valid = blockchain.is_chain_valid(blockchain.chain)
    
    # check if the chain is valid or not and return the response to the user
    if is_valid: 
        response = {
            'message': 'All good. The Blockchain is valid.'
        }
    else: 
        response = {
            'message': 'Houston, we have a problem. The Blockchain is not valid.'
        }
    
    return jsonify(response), 200

# adding a new transaction to the blockchain
@app.route('/add_transaction', methods = ['POST']) #use post to add a transaction

# creating the add_transaction function to add a transaction to the blockchain
def add_transaction():
    # get the json file from the request
    json = request.get_json()
    
    # check if the json file is not empty
    transaction_keys = ['patient', 'doctor', 'permission']
    
    # check if the json file has all the keys
    if not all(key in json for key in transaction_keys):
        return 'Some elements of the transaction are missing', 400 # 400 is a bad request and the user has to send the request again
    
    # get the index of the block that the transaction will be added to
    index = blockchain.add_transaction(json['patient'], json['doctor'], json['permission'])

    # create a response to return to the user to indicate that the transaction will be added to the block
    response = {
        'message': f'This transaction will be added to block {index}'
    } 
    return jsonify(response), 201 # 201 is a created status code

# Part 3 - Decentralizing our Blockchain

# Connecting new nodes
@app.route('/connect_node', methods = ['POST'])

# creating the connect_node function to connect a new node to the network
def connect_node():
    # use the get_json method to get the json file from the request
    json = request.get_json()
    
    # get the nodes from the json file
    nodes = json.get('nodes')
    
    # check if the nodes is not empty
    if nodes is None: 
        return "No node", 400

    # loop through the nodes to add them to the network
    for node in nodes: 
        # add the node to the network
        blockchain.add_node(node)
    
    response = {
        'message': 'All the nodes are now connected. The Medical Blockchain now contains the following nodes:', 
        'total_nodes' : list(blockchain.nodes)
    }
    
    return jsonify(response), 201

# Replacing the chain by the longest chain if needed
@app.route('/replace_chain', methods = ['GET'])
def replace_chain():
    # get the chain and assign it to the chain variables
    is_chain_replaced = blockchain.replace_chain()
    
    # check if the chain is valid or not and return the response to the user
    if is_chain_replaced: 
        response = {
            'message': 'The nodes had different chains so the chain was replaced by the longest one.',
            'new_chain': blockchain.chain
        }
    else: 
        response = {
            'message': 'All good. The chain is the largest one.',
            'actual_chain': blockchain.chain
        }
    
    return jsonify(response), 200
        
# Running the app
app.run(host = '0.0.0.0', port = 5004)


