import { ethers, upgrades } from "hardhat";
import { Test } from '../typechain-types';

async function main() {
    const contractName = 'Test';

    const [deployerAccount] = await ethers.getSigners();

    const externalLibFactory = await ethers.getContractFactory('ExternalLib');
    const externalLib = await externalLibFactory.deploy();
    await externalLib.waitForDeployment();
    await waitForCode(await externalLib.getAddress());
    const externalLibAddress = await externalLib.getAddress();
    console.log(`ExternalLib deployed at: ${externalLibAddress}`);

    const libraries = {
        ExternalLib: externalLibAddress,
    };

    const constructorArgs = [42n];

    const initializeArgs: Parameters<Test['initialize']> = [123n];

    const factory = (await ethers.getContractFactory(contractName, {libraries})).connect(deployerAccount);
    console.log(`Deploying ${contractName} via transparent proxy with args:`);
    console.log(`\tconstructor args: `, constructorArgs || undefined);
    console.log(`\tinitialize args: `, initializeArgs || undefined);
    const proxy = await upgrades.deployProxy(
        factory,
        initializeArgs,
        {
            constructorArgs: constructorArgs,
            initializer: 'initialize',
            unsafeAllow: ["constructor"],
            // unsafeAllow: ["external-library-linking"],
            unsafeAllowLinkedLibraries: true,
            kind: 'transparent',
        }
    );
    console.log('Deployed proxy at address:', await proxy.getAddress());
}

async function waitForCode(address: string, timeout = 60_000, interval = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const code = await ethers.provider.getCode(address);
        if (code !== "0x") return true;
        await new Promise((res) => setTimeout(res, interval));
    }
    throw new Error("Timeout waiting for contract code to appear on-chain.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
