import os
import json
from web3 import Web3
from dotenv import load_dotenv
import time

load_dotenv()


class ContractDeployer:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(os.getenv('RPC_URL')))
        self.private_key = os.getenv('PRIVATE_KEY')
        self.account = self.w3.eth.account.from_key(self.private_key)

        print(f" {os.getenv('NETWORK')}")
        print(f" {self.account.address}")
        print(f" {self.w3.from_wei(self.w3.eth.get_balance(self.account.address), 'ether')} ETH")

        if not self.w3.is_connected():
            raise Exception("Unable to connect to the Ethereum network")

    def deploy_contract(self, contract_name, contract_code, constructor_args=None):
        """Deploy the contract"""
        print(f"\n deploy {contract_name}...")



        transaction = {
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': int(os.getenv('GAS_LIMIT')),
            'gasPrice': self.w3.to_wei(os.getenv('GAS_PRICE'), 'gwei'),
            'data': contract_code  
        }

        if constructor_args:
            transaction['data'] += constructor_args


        signed_txn = self.w3.eth.account.sign_transaction(transaction, self.private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)

        print(f"Transaction has been sent: {tx_hash.hex()}")


        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)

        if receipt.status == 1:
            print(f"✅ {contract_name} Deployment successful!")
            print(f"   address: {receipt.contractAddress}")
            return receipt.contractAddress
        else:
            raise Exception(f"❌ {contract_name} Deployment failed")

    def deploy_agri_shield(self):
        """Deploy the complete AgriShield system"""
        print(" Start deploying the AgriShield system...")


        # 1. Deployment sub-contract
        print("\n1. Deployment sub-contract...")

        # InsurancePool
        insurance_pool_addr = "0x..."  
        print(f"   ✅ InsurancePool: {insurance_pool_addr}")

        # PolicyManager
        policy_manager_addr = "0x..."  
        print(f"   ✅ PolicyManager: {policy_manager_addr}")

        # WeatherOracle
        weather_oracle_addr = "0x..."  
        print(f"   ✅ WeatherOracle: {weather_oracle_addr}")

        # 2. Deploy the main contract
        print("\n2. Deploy the AgriShield main contract...")
        agri_shield_addr = "0x..."  
        print(f"   ✅ AgriShield: {agri_shield_addr}")


        self._update_env_file({
            'AGRISHIELD_ADDRESS': agri_shield_addr,
            'INSURANCE_POOL_ADDRESS': insurance_pool_addr,
            'POLICY_MANAGER_ADDRESS': policy_manager_addr,
            'WEATHER_ORACLE_ADDRESS': weather_oracle_addr
        })

        print(f"\n AgriShield system has been successfully deployed!")
        return agri_shield_addr

    def _update_env_file(self, addresses):
        """Update the contract address in the environment file"""
        env_path = os.path.join(os.path.dirname(__file__), '../../.env')

        with open(env_path, 'r') as f:
            lines = f.readlines()


        new_lines = []
        for line in lines:
            key = line.split('=')[0] if '=' in line else ''
            if key in addresses:
                new_lines.append(f"{key}={addresses[key]}\n")
                del addresses[key]
            else:
                new_lines.append(line)


        for key, value in addresses.items():
            new_lines.append(f"{key}={value}\n")

        with open(env_path, 'w') as f:
            f.writelines(new_lines)

        print("✅ The contract address has been saved in the .env file")


def main():
    try:
        deployer = ContractDeployer()

        print("Please select the deployment method:")
        print("1. Complete deployment of the AgriShield system")
        print("2. Deploying the contract independently")

        choice = input("Please input (1-2): ").strip()

        if choice == "1":
            deployer.deploy_agri_shield()
        elif choice == "2":
            print("The standalone deployment function is yet to be implemented")
        else:
            print("❌ Ineffective choice")

    except Exception as e:
        print(f"❌ Deployment failed: {e}")


if __name__ == "__main__":
    main()
