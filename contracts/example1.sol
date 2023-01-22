pragma solidity ^0.5.1;

contract Citizen {
    struct Citizens {
        uint256 age;
        string fName;
        string lName;
    }

    mapping(address => Citizens) citizenMap;

    address[] citizenArray;

    function setCitizen(
        address _address,
        uint256 _age,
        string memory _fName,
        string memory _lName
    ) public {
        //creating the object of the structure in solidity
        Citizens storage citizen = citizenMap[_address];

        citizen.age = _age;
        citizen.fName = _fName;
        citizen.lName = _lName;

        citizenArray.push(_address) - 1;
    }

    function getCitizen(address _address)
        public
        view
        returns (
            uint256,
            string memory,
            string memory
        )
    {
        return (
            citizenMap[_address].age,
            citizenMap[_address].fName,
            citizenMap[_address].lName
        );
    }

    function getCitizenAddress() public view returns (address[] memory) {
        return citizenArray;
    }
}
