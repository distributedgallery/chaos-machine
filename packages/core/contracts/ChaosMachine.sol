pragma solidity ^0.4.21;
import "zos-lib/contracts/migrations/Migratable.sol";
import "openzeppelin-solidity/contracts/ECRecovery.sol";
import "openzeppelin-solidity/contracts/ownership/rbac/RBAC.sol";

contract ChaosMachine is Migratable, RBAC {
  using ECRecovery for bytes32;

  struct Slot {
    address uploader;
    string  cid;
    uint256 block;
  }

  string public constant ROLE_ADMIN = "admin";
  string public constant ROLE_MACHINE = "machine";
  string public constant ROLE_BOUNCER = "bouncer";
  string public constant ROLE_USER = "user";

  Slot[] public slots;

  event UpdateAdmin(address formerAddress, address newAddress);

  /* event GrantMachine(string name, address addr, uint256 id);
  event RevokeMachine(string name, address addr); */

  event GrantBouncer(address addr, uint256 machineID);
  event RevokeBouncer(address addr);

  event GrantUser(address addr, uint256 machineID);
  event RevokeUser(address addr);

  event AddSlot(address user, string cid);
  event RemoveSlot(uint256 id);

  modifier onlyAdmin() {
    checkRole(msg.sender, ROLE_ADMIN);
    _;
  }

  modifier onlyMachine() {
    checkRole(msg.sender, ROLE_MACHINE);
    _;
  }

  modifier onlyUser() {
    checkRole(msg.sender, ROLE_USER);
    _;
  }

  function initialize() isInitializer("ChaosMachine", "0") public {
    addRole(msg.sender, ROLE_ADMIN);
  }

  function updateAdmin() onlyAdmin public {

  }

  function grantMachine(address _machine) onlyAdmin public {
    addRole(_machine, ROLE_MACHINE);
  }

  function revokeMachine(address _machine) onlyAdmin public {
    removeRole(_machine, ROLE_MACHINE);
  }

  function grantBouncer(address _bouncer) onlyMachine public {
    addRole(_bouncer, ROLE_BOUNCER);
  }

  function revokeBouncer(address _bouncer) onlyAdmin public {
    removeRole(_bouncer, ROLE_BOUNCER);
  }

  function grantUser(bytes32 _hash, bytes _sig) public {
    address bouncer = _hash.recover(_sig);
    require(!hasRole(msg.sender, ROLE_USER));
    require(hasRole(bouncer, ROLE_BOUNCER));
    removeRole(bouncer, ROLE_BOUNCER);
    addRole(msg.sender, ROLE_USER);
  }

  function addSlot(string _cid) onlyUser public {
    slots.push(Slot(msg.sender, _cid, block.number));
    removeRole(msg.sender, ROLE_USER);
  }

  function removeSlot(uint256 _index) onlyAdmin public {
    require(slots.length > 1);
    Slot storage last = slots[slots.length - 1];
    slots[_index] = last;
    slots.length--;
    emit RemoveSlot(_index);
  }



/*
  function randomGen(uint seed) constant returns (uint randomNumber) {
        return(uint(sha3(block.blockhash(block.number-1), seed ))%100);
    } */

}
