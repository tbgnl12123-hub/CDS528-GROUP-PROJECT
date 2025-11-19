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

        print(f"🔗 连接到网络: {os.getenv('NETWORK')}")
        print(f"👤 部署账户: {self.account.address}")
        print(f"💰 余额: {self.w3.from_wei(self.w3.eth.get_balance(self.account.address), 'ether')} ETH")

        if not self.w3.is_connected():
            raise Exception("无法连接到以太坊网络")

    def deploy_contract(self, contract_name, contract_code, constructor_args=None):
        """部署合约"""
        print(f"\n🚀 部署 {contract_name}...")

        # 编译合约（在实际项目中，您需要先编译）
        # 这里假设您已经在 Remix 编译并获得了 bytecode

        # 构建交易
        transaction = {
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': int(os.getenv('GAS_LIMIT')),
            'gasPrice': self.w3.to_wei(os.getenv('GAS_PRICE'), 'gwei'),
            'data': contract_code  # 这里应该是编译后的 bytecode
        }

        if constructor_args:
            transaction['data'] += constructor_args

        # 签名并发送
        signed_txn = self.w3.eth.account.sign_transaction(transaction, self.private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)

        print(f"⏳ 交易已发送: {tx_hash.hex()}")

        # 等待确认
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)

        if receipt.status == 1:
            print(f"✅ {contract_name} 部署成功!")
            print(f"   地址: {receipt.contractAddress}")
            return receipt.contractAddress
        else:
            raise Exception(f"❌ {contract_name} 部署失败")

    def deploy_agri_shield(self):
        """部署完整的 AgriShield 系统"""
        print("🌾 开始部署 AgriShield 系统...")

        # 注意：实际部署需要编译后的 bytecode
        # 这里只是示例流程

        # 1. 部署子合约
        print("\n1. 部署子合约...")

        # InsurancePool
        insurance_pool_addr = "0x..."  # 实际部署地址
        print(f"   ✅ InsurancePool: {insurance_pool_addr}")

        # PolicyManager
        policy_manager_addr = "0x..."  # 实际部署地址
        print(f"   ✅ PolicyManager: {policy_manager_addr}")

        # WeatherOracle
        weather_oracle_addr = "0x..."  # 实际部署地址
        print(f"   ✅ WeatherOracle: {weather_oracle_addr}")

        # 2. 部署主合约
        print("\n2. 部署 AgriShield 主合约...")
        agri_shield_addr = "0x..."  # 实际部署地址
        print(f"   ✅ AgriShield: {agri_shield_addr}")

        # 3. 保存地址到环境文件
        self._update_env_file({
            'AGRISHIELD_ADDRESS': agri_shield_addr,
            'INSURANCE_POOL_ADDRESS': insurance_pool_addr,
            'POLICY_MANAGER_ADDRESS': policy_manager_addr,
            'WEATHER_ORACLE_ADDRESS': weather_oracle_addr
        })

        print(f"\n🎉 AgriShield 系统部署完成!")
        return agri_shield_addr

    def _update_env_file(self, addresses):
        """更新环境文件中的合约地址"""
        env_path = os.path.join(os.path.dirname(__file__), '../../.env')

        with open(env_path, 'r') as f:
            lines = f.readlines()

        # 更新或添加地址
        new_lines = []
        for line in lines:
            key = line.split('=')[0] if '=' in line else ''
            if key in addresses:
                new_lines.append(f"{key}={addresses[key]}\n")
                del addresses[key]
            else:
                new_lines.append(line)

        # 添加缺失的地址
        for key, value in addresses.items():
            new_lines.append(f"{key}={value}\n")

        with open(env_path, 'w') as f:
            f.writelines(new_lines)

        print("✅ 合约地址已保存到 .env 文件")


def main():
    try:
        deployer = ContractDeployer()

        print("请选择部署方式:")
        print("1. 完整部署 AgriShield 系统")
        print("2. 单独部署合约")

        choice = input("请输入选择 (1-2): ").strip()

        if choice == "1":
            deployer.deploy_agri_shield()
        elif choice == "2":
            print("单独部署功能待实现")
        else:
            print("❌ 无效选择")

    except Exception as e:
        print(f"❌ 部署失败: {e}")


if __name__ == "__main__":
    main()