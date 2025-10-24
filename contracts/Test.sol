// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

library ExternalLib {
    function name() external pure returns (string memory) {
        return "ExternalLib";
    }
}

contract Test {
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    uint256 public immutable immutableValue;

    uint256 public storageValue;

    constructor(uint256 _immutableValue) {
        immutableValue = _immutableValue;
    }

    function initialize(uint256 _storageValue) external {
        storageValue = _storageValue;
    }

    function getExternalLibName() external pure returns (string memory) {
        return ExternalLib.name();
    }
}