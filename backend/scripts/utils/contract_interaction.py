import os
import json
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()


class AgriShieldClient:
    def __init__(self, contract_address=None, private_key=None):
        self.w3 = Web3(Web3.HTTPProvider(os.getenv('RPC_URL')))

        if not self.w3.is_connected():
            raise Exception("无法连接到以太坊网络")

        self.private_key = private_key or os.getenv('PRIVATE_KEY')
        if self.private_key:
            self.account = self.w3.eth.account.from_key(self.private_key)
        else:
            self.account = None

        # 加载合约 ABI
        self.contract_address = contract_address or os.getenv('AGRISHIELD_ADDRESS')
        if self.contract_address:
            self.contract = self._load_contract()
        else:
            self.contract = None

    def _load_contract(self):
        """加载合约"""
        try:
            abi_path = os.path.join(os.path.dirname(__file__), '../abi/AgriShield.json')
            with open(abi_path, 'r') as f:
                abi = json.load(f)

            return self.w3.eth.contract(
                address=self.contract_address,
                abi=abi
            )
        except Exception as e:
            print(f"❌ 加载合约失败: {e}")
            return None

    def send_transaction(self, function_call, value=0):
        """发送交易"""
        if not self.account:
            raise Exception("未配置私钥，无法发送交易")

        transaction = function_call.build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': int(os.getenv('GAS_LIMIT')),
            'gasPrice': self.w3.to_wei(os.getenv('GAS_PRICE'), 'gwei'),
            'value': value
        })

        signed_txn = self.w3.eth.account.sign_transaction(transaction, self.private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)

        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt

    # 合约功能方法
    def create_policy(self, crop_type, coverage_amount, location=None):
        """创建保单"""
        coverage_wei = self.w3.to_wei(coverage_amount, 'ether')
        premium_wei = (coverage_wei * 5) // 100  # 5% 保费

        if location:
            function_call = self.contract.functions.createPolicyWithLocation(
                crop_type, coverage_wei, location
            )
        else:
            function_call = self.contract.functions.createPolicy(
                crop_type, coverage_wei
            )

        receipt = self.send_transaction(function_call, premium_wei)

        if receipt.status == 1:
            return {
                'success': True,
                'message': '保单创建成功',
                'transaction_hash': receipt.transactionHash.hex(),
                'block_number': receipt.blockNumber
            }
        else:
            return {
                'success': False,
                'message': '交易失败'
            }

    def invest_in_pool(self, amount):
        """投资资金池"""
        amount_wei = self.w3.to_wei(amount, 'ether')

        receipt = self.send_transaction(
            self.contract.functions.investInPool(),
            amount_wei
        )

        if receipt.status == 1:
            return {
                'success': True,
                'message': '投资成功',
                'transaction_hash': receipt.transactionHash.hex()
            }
        else:
            return {
                'success': False,
                'message': '投资失败'
            }

    def get_contract_stats(self):
        """获取合约统计"""
        if not self.contract:
            return None

        try:
            stats = self.contract.functions.getContractStats().call()
            return {
                'total_capital': self.w3.from_wei(stats[0], 'ether'),
                'active_policies': stats[1],
                'total_investors': stats[2],
                'total_payouts': self.w3.from_wei(stats[3], 'ether')
            }
        except Exception as e:
            print(f"获取统计失败: {e}")
            return None

    def get_network_info(self):
        """获取网络信息"""
        return {
            'connected': self.w3.is_connected(),
            'block_number': self.w3.eth.block_number,
            'chain_id': self.w3.eth.chain_id,
            'gas_price': self.w3.from_wei(self.w3.eth.gas_price, 'gwei')
        }


# 使用示例
if __name__ == "__main__":
    client = AgriShieldClient()

    if client.contract:
        print("✅ 合约连接成功")

        # 获取统计信息
        stats = client.get_contract_stats()
        if stats:
            print(f"统计信息: {stats}")
    else:
        print("❌ 合约连接失败")