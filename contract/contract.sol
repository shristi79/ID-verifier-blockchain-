// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityVerifier {
    struct Identity {
        string name;
        uint256 age;
        string addressInfo;
        bool verified;
    }

    mapping(address => Identity) public identities;

    event IdentitySet(address indexed user, string name, uint256 age, string addressInfo);
    event IdentityVerified(address indexed user);

    function setIdentity(
        string memory _name,
        uint256 _age,
        string memory _addressInfo
    ) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_age > 0, "Age must be greater than zero");
        require(bytes(_addressInfo).length > 0, "Address cannot be empty");

        identities[msg.sender] = Identity(_name, _age, _addressInfo, false);
        emit IdentitySet(msg.sender, _name, _age, _addressInfo);
    }

    function verifyIdentity(
        string memory _name,
        uint256 _age,
        string memory _addressInfo
    ) public returns (bool) {
        Identity storage identity = identities[msg.sender];
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_age > 0, "Age must be greater than zero");
        require(bytes(_addressInfo).length > 0, "Address cannot be empty");

        if (
            keccak256(abi.encodePacked(identity.name)) ==
            keccak256(abi.encodePacked(_name)) &&
            identity.age == _age &&
            keccak256(abi.encodePacked(identity.addressInfo)) ==
            keccak256(abi.encodePacked(_addressInfo))
        ) {
            identity.verified = true;
            emit IdentityVerified(msg.sender);
            return true;
        }
        return false;
    }
}
