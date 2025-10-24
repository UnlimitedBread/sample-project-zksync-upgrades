import * as dotenv from "dotenv";
import { HardhatUserConfig } from 'hardhat/config';
// import '@openzeppelin/hardhat-upgrades'; // Should not be used with ZKsync (see: https://docs.zksync.io/zksync-network/tooling/hardhat/guides/migrating-to-zksync#project-setup)
import '@typechain/hardhat';
import '@matterlabs/hardhat-zksync';

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: '0.8.28',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ]
    },

    zksolc: {
        version: '1.5.7',
    },

    networks: {
        hardhat: {
            chainId: 1,
            // allowUnlimitedContractSize: true,
        },

        zk: {
            url: 'http://127.0.0.1:8011',
            ethNetwork: 'localhost',
            zksync: true,
        },
    },
};

export default config;
