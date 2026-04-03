// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LandRegistry {

    struct Land {
        uint id;
        string location;
        address owner;
    }

    mapping(uint => Land) public lands;

    function registerLand(uint _id, string memory _location) public {
        lands[_id] = Land(_id, _location, msg.sender);
    }

    function transferLand(uint _id, address newOwner) public {
        require(lands[_id].owner == msg.sender, "Not owner");
        lands[_id].owner = newOwner;
    }

    function getOwner(uint _id) public view returns(address) {
        return lands[_id].owner;
    }
}