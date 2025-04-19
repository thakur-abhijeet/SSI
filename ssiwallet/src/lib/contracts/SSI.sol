// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SSI {
    struct Credential {
        address issuer;
        address holder;
        string data;
        bool isValid;
        uint256 issuedAt;
    }

    mapping(string => Credential) private credentials;
    mapping(address => bool) private issuers;

    event CredentialIssued(address indexed issuer, address indexed holder, string credentialId);
    event CredentialRevoked(address indexed issuer, string credentialId);
    event CredentialVerified(address indexed verifier, string credentialId, bool isValid);

    constructor() {
        issuers[msg.sender] = true;
    }

    modifier onlyIssuer() {
        require(issuers[msg.sender], "SSI: caller is not an issuer");
        _;
    }

    function addIssuer(address issuer) external onlyIssuer {
        issuers[issuer] = true;
    }

    function removeIssuer(address issuer) external onlyIssuer {
        require(msg.sender != issuer, "SSI: cannot remove self as issuer");
        issuers[issuer] = false;
    }

    function issueCredential(address holder, string memory credentialData) external onlyIssuer returns (string memory) {
        require(holder != address(0), "SSI: invalid holder address");
        require(bytes(credentialData).length > 0, "SSI: empty credential data");

        string memory credentialId = generateCredentialId(holder, credentialData);
        require(credentials[credentialId].holder == address(0), "SSI: credential already exists");

        credentials[credentialId] = Credential({
            issuer: msg.sender,
            holder: holder,
            data: credentialData,
            isValid: true,
            issuedAt: block.timestamp
        });

        emit CredentialIssued(msg.sender, holder, credentialId);
        return credentialId;
    }

    function revokeCredential(string memory credentialId) external onlyIssuer {
        require(bytes(credentialId).length > 0, "SSI: invalid credential ID");
        require(credentials[credentialId].issuer == msg.sender, "SSI: not credential issuer");
        require(credentials[credentialId].isValid, "SSI: credential already revoked");

        credentials[credentialId].isValid = false;
        emit CredentialRevoked(msg.sender, credentialId);
    }

    function verifyCredential(string memory credentialId) external view returns (bool) {
        require(bytes(credentialId).length > 0, "SSI: invalid credential ID");
        
        bool isValid = credentials[credentialId].isValid &&
            credentials[credentialId].holder != address(0);

        emit CredentialVerified(msg.sender, credentialId, isValid);
        return isValid;
    }

    function getCredential(string memory credentialId) external view returns (Credential memory) {
        require(bytes(credentialId).length > 0, "SSI: invalid credential ID");
        require(
            msg.sender == credentials[credentialId].holder ||
            msg.sender == credentials[credentialId].issuer ||
            issuers[msg.sender],
            "SSI: unauthorized access"
        );

        return credentials[credentialId];
    }

    function generateCredentialId(address holder, string memory data) internal view returns (string memory) {
        return string(
            abi.encodePacked(
                block.timestamp,
                holder,
                msg.sender,
                data
            )
        );
    }
} 