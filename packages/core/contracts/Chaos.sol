pragma solidity ^0.4.21;
import "zos-lib/contracts/migrations/Migratable.sol";
import "openzeppelin-solidity/contracts/ECRecovery.sol";
import "openzeppelin-solidity/contracts/ownership/rbac/RBAC.sol";


contract Chaos is Migratable, RBAC {
  using ECRecovery for bytes32;

  struct Track {
    address uploader;
    string  cid;
    uint256 block;
  }

  string public constant ROLE_ADMIN = "admin";
  string public constant ROLE_MACHINE = "machine";
  string public constant ROLE_TOKEN = "token";

  Track[] public tracks;

  event AdminUpdated(address oldAddress, address newAddress);

  event MachineGranted(address indexed machine);
  event MachineRevoked(address indexed machine);

  event TokenGranted(address indexed token, address indexed machine);
  event TokenRevoked(address indexed token);

  event TrackAdded(string cid, address indexed uploader);
  event TrackRemoved(string cid);

  modifier onlyAdmin() {
    checkRole(msg.sender, ROLE_ADMIN);
    _;
  }

  modifier onlyMachine() {
    checkRole(msg.sender, ROLE_MACHINE);
    _;
  }

  function initialize() public isInitializer("Chaos", "0") {
    addRole(msg.sender, ROLE_ADMIN);
  }

  function updateAdmin(address _new) public onlyAdmin {
    _updateAdmin(msg.sender, _new);
  }

  function grantMachine(address _machine) public onlyAdmin {
    _grantMachine(_machine);
  }

  function revokeMachine(address _machine) public onlyAdmin {
    _revokeMachine(_machine);
  }

  function grantToken(address _token) public onlyMachine {
    _grantToken(_token, msg.sender);
  }

  function revokeToken(address _token) public onlyAdmin {
    _revokeToken(_token);
  }

  function addTrack(bytes32 _hash, bytes _sig, string _cid) public {
    address token = _hash.recover(_sig);
    checkRole(token, ROLE_TOKEN);
    tracks.push(Track(msg.sender, _cid, block.number));
    _revokeToken(token);
    emit TrackAdded(_cid, msg.sender);
  }

  function removeTrack(uint256 _index) public onlyAdmin {
    require(tracks.length > 1 && _index < tracks.length, "Invalid index");
    string memory cid = tracks[_index].cid;
    Track storage last = tracks[tracks.length - 1];
    tracks[_index] = last;
    tracks.length--;
    emit TrackRemoved(cid);
  }

  function _updateAdmin(address _old, address _new) private {
    addRole(_new, ROLE_ADMIN);
    removeRole(_old, ROLE_ADMIN);
    emit AdminUpdated(_old, _new);
  }

  function _grantMachine(address _machine) private {
    addRole(_machine, ROLE_MACHINE);
    emit MachineGranted(_machine);
  }

  function _revokeMachine(address _machine) private {
    removeRole(_machine, ROLE_MACHINE);
    emit MachineRevoked(_machine);
  }

  function _grantToken(address _token, address _machine) private {
    addRole(_token, ROLE_TOKEN);
    emit TokenGranted(_token, _machine);
  }

  function _revokeToken(address _token) private {
    removeRole(_token, ROLE_TOKEN);
    emit TokenRevoked(_token);
  }

  function shuffle() public view returns (string) {
    uint index = uint(keccak256(block.blockhash(block.number-1))) % tracks.length;
    return tracks[index].cid;
  }

}
